// backend/routes/candidates.js
const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const Vacancy = require("../models/Vacancy");

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
router.get("/:id/match-vacancies", async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: "Не знойдзена" });

    const vacancies = await Vacancy.find({ status: "active" });
    const prefs = candidate.jobPreferences;
    const matched = [];

    for (const vacancy of vacancies) {
      if (vacancy.requirements?.gender && candidate.gender) {
        const vacGender = vacancy.requirements.gender.toLowerCase();
        const isFemale =
          vacGender.includes("жінк") || vacGender.includes("female");
        const isMale =
          vacGender.includes("чолов") || vacGender.includes("male");
        const isBoth = !isFemale && !isMale;
        if (!isBoth) {
          if (isFemale && candidate.gender !== "female") continue;
          if (isMale && candidate.gender !== "male") continue;
        }
      }

      if (vacancy.requirements?.ageMax && candidate.age) {
        if (candidate.age > vacancy.requirements.ageMax) continue;
      }

      if (
        vacancy.requirements?.nationalities?.length > 0 &&
        candidate.nationality
      ) {
        const allowed = vacancy.requirements.nationalities.map((n) =>
          n.toLowerCase(),
        );
        if (!allowed.includes(candidate.nationality.toLowerCase())) continue;
      }

      if (prefs?.needsAccommodation && !vacancy.accommodation?.available)
        continue;

      if (vacancy.requirements?.docs?.length > 0) {
        const requiredDocs = vacancy.requirements.docs.map((d) =>
          d.toLowerCase(),
        );
        if (
          requiredDocs.some((d) => d.includes("санеп") || d.includes("sanep"))
        ) {
          if (!candidate.documents?.hasSanepid) continue;
        }
        if (requiredDocs.some((d) => d.includes("udt"))) {
          if (!candidate.documents?.hasUDT) continue;
        }
      }

      let score = 0;

      if (prefs?.locationFlexible) score += 25;
      else if (prefs?.locationRadius) score += 15;
      else if (prefs?.location && vacancy.location) {
        const candLoc = prefs.location.toLowerCase();
        const vacLoc = vacancy.location.toLowerCase();
        if (vacLoc.includes(candLoc) || candLoc.includes(vacLoc)) score += 25;
      }

      if (vacancy.sphere && prefs?.spheres?.length > 0) {
        if (prefs.spheres.includes(vacancy.sphere)) score += 20;
      } else score += 10;

      if (vacancy.contractType && prefs?.contractType) {
        if (
          prefs.contractType === "any" ||
          prefs.contractType === vacancy.contractType
        )
          score += 15;
      } else score += 10;

      if (prefs?.schedule?.length > 0 && vacancy.schedule?.shifts) {
        const shifts = vacancy.schedule.shifts;
        const hasMatch =
          (shifts.includes("1") && prefs.schedule.includes("1_shift")) ||
          (shifts.includes("2") && prefs.schedule.includes("2_shifts")) ||
          (shifts.includes("3") && prefs.schedule.includes("3_shifts"));
        if (hasMatch) score += 15;
        else score += 5;
      } else score += 10;

      if (vacancy.overtimeAvailable && prefs?.wantsOvertime) score += 10;
      else if (!vacancy.overtimeAvailable && !prefs?.wantsOvertime) score += 10;
      else score += 5;

      if (prefs?.travelGroup) {
        if (vacancy.accommodation?.details) {
          const details = vacancy.accommodation.details.toLowerCase();
          if (prefs.travelGroup === "couple" && details.includes("пар"))
            score += 10;
          else if (prefs.travelGroup === "alone") score += 10;
          else score += 5;
        } else score += 7;
      } else score += 7;

      if (vacancy.requirements?.languages?.length > 0) {
        if (vacancy.requirements.languageLevel === "не патрабуецца") score += 5;
        else if (candidate.languages?.length > 0) {
          const hasLang = vacancy.requirements.languages.some((l) =>
            candidate.languages
              .map((cl) => cl.toLowerCase())
              .includes(l.toLowerCase()),
          );
          if (hasLang) score += 5;
        }
      } else score += 5;

      if (score >= 60) {
        matched.push({ ...vacancy.toObject(), matchScore: score });
      }
    }

    matched.sort((a, b) => b.matchScore - a.matchScore);
    res.json(matched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
