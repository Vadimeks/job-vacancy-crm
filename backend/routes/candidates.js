// backend/routes/candidates.js
const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
// matching.service.js выкарыстоўваецца толькі з боку вакансій (GET /vacancies/:id/match-candidates)

// GET /api/candidates
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.gender) filter.gender = req.query.gender;
    const candidates = await Candidate.find(filter).sort({ createdAt: -1 });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/candidates/:id
router.get("/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
      .populate("appliedVacancies.vacancyId")
      .populate("currentVacancy");
    if (!candidate) return res.status(404).json({ message: "Не знойдзена" });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/candidates
router.post("/", async (req, res) => {
  try {
    const newCandidate = new Candidate(req.body);
    const saved = await newCandidate.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/candidates/:id
router.put("/:id", async (req, res) => {
  try {
    const updated = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/candidates/:id
router.delete("/:id", async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Кандыдат выдалены" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/candidates/:id/history
router.post("/:id/history", async (req, res) => {
  try {
    const { type, text } = req.body;
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: "Не знойдзена" });
    candidate.history.push({ type, text, date: new Date() });
    await candidate.save();
    res.json(candidate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/candidates/:id/match-vacancies
// Матч вакансій для кандыдата (кандыдат шукае вакансіі) — арыгінальная логіка, выпраўленая пад v2.0
router.get("/:id/match-vacancies", async (req, res) => {
  try {
    const Vacancy = require("../models/Vacancy");
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: "Не знойдзена" });

    const vacancies = await Vacancy.find({ status: "active" });
    const prefs = candidate.jobPreferences;
    const matched = [];

    for (const vacancy of vacancies) {
      // --- HARD FILTERS ---

      // Гендар: requirements.gender цяпер масіў ["Чоловіки", "Жінки"]
      if (vacancy.requirements?.gender?.length > 0 && candidate.gender) {
        const gArr = vacancy.requirements.gender.map((g) => g.toLowerCase());
        const acceptsMale = gArr.some(
          (g) => g.includes("чолов") || g.includes("male"),
        );
        const acceptsFemale = gArr.some(
          (g) => g.includes("жінк") || g.includes("female"),
        );
        const acceptsAll = !acceptsMale && !acceptsFemale;
        if (!acceptsAll) {
          if (candidate.gender === "male" && !acceptsMale) continue;
          if (candidate.gender === "female" && !acceptsFemale) continue;
        }
      }

      // Узрост
      if (vacancy.requirements?.ageMax && candidate.age) {
        if (candidate.age > vacancy.requirements.ageMax) continue;
      }

      // Нацыянальнасць: requirements.nationalities (масіў)
      if (
        vacancy.requirements?.nationalities?.length > 0 &&
        candidate.nationality
      ) {
        const allowed = vacancy.requirements.nationalities.map((n) =>
          n.toLowerCase(),
        );
        if (!allowed.includes(candidate.nationality.toLowerCase())) continue;
      }

      // Жытло: accommodation.type замест accommodation.available
      if (prefs?.needsAccommodation) {
        const t = (vacancy.accommodation?.type || "").toLowerCase();
        const hasAccommodation =
          t && !t.includes("власн") && !t.includes("не надає");
        if (!hasAccommodation) continue;
      }

      // Дакументы: requirements.standardDocs + additionalDocsDetails
      if (vacancy.requirements?.needsAdditionalDocs) {
        const details = (
          vacancy.requirements.additionalDocsDetails || ""
        ).toLowerCase();
        if (
          (details.includes("санеп") || details.includes("sanep")) &&
          !candidate.documents?.hasSanepid
        )
          continue;
        if (details.includes("udt") && !candidate.documents?.hasUDT) continue;
      }

      // Пары: accommodation.forCouples
      if (prefs?.travelGroup === "couple" && !vacancy.accommodation?.forCouples)
        continue;

      // --- SOFT SCORE ---
      let score = 0;

      // Лакацыя (25)
      if (prefs?.locationFlexible) score += 25;
      else if (prefs?.locationRadius) score += 15;
      else if (prefs?.location && vacancy.location) {
        const cl = prefs.location.toLowerCase();
        const vl = vacancy.location.toLowerCase();
        if (vl.includes(cl) || cl.includes(vl)) score += 25;
      }

      // Катэгорыя: vacancy.category замест vacancy.sphere (20)
      if (vacancy.category && prefs?.spheres?.length > 0) {
        if (prefs.spheres.some((s) => vacancy.category.includes(s)))
          score += 20;
      } else score += 10;

      // Тып дагавора (15)
      if (vacancy.contractType && prefs?.contractType) {
        if (
          prefs.contractType === "any" ||
          prefs.contractType === vacancy.contractType
        )
          score += 15;
      } else score += 10;

      // Графік: schedule.shiftsCount замест schedule.shifts (15)
      if (prefs?.schedule?.length > 0 && vacancy.schedule?.shiftsCount) {
        const shifts = String(vacancy.schedule.shiftsCount);
        const hasMatch =
          (shifts === "1" && prefs.schedule.includes("1_shift")) ||
          (shifts === "2" && prefs.schedule.includes("2_shifts")) ||
          (shifts === "3" && prefs.schedule.includes("3_shifts"));
        if (hasMatch) score += 15;
        else score += 5;
      } else score += 10;

      // Звышурочныя (10)
      const hasOvertimeSignal =
        vacancy.salary?.salaryNotes?.toLowerCase().includes("надгодин") ||
        vacancy.salary?.salaryNotes?.toLowerCase().includes("overtime");
      if (hasOvertimeSignal && prefs?.wantsOvertime) score += 10;
      else if (!hasOvertimeSignal && !prefs?.wantsOvertime) score += 10;
      else score += 5;

      // Пары (10)
      if (prefs?.travelGroup) {
        if (prefs.travelGroup === "couple" && vacancy.accommodation?.forCouples)
          score += 10;
        else if (prefs.travelGroup === "alone") score += 10;
        else score += 5;
      } else score += 7;

      // Мова: polishLanguageLevel замест languageLevel (5)
      if (vacancy.requirements?.polishLanguageLevel) {
        const lvl = vacancy.requirements.polishLanguageLevel.toLowerCase();
        if (lvl.includes("не вимаг")) score += 5;
        else if (candidate.languages?.length > 0) {
          const hasPolish = candidate.languages
            .map((l) => l.name?.toLowerCase() || l.toLowerCase())
            .some((l) => l.includes("пол") || l.includes("pol"));
          if (hasPolish) score += 5;
        }
      } else score += 5;

      if (score >= 60)
        matched.push({ ...vacancy.toObject(), matchScore: score });
    }

    matched.sort((a, b) => b.matchScore - a.matchScore);
    res.json(matched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
