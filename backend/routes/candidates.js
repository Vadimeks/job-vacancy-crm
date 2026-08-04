// backend/routes/candidates.js
const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const Counter = require("../models/Counter"); // 👈 ДАДАДЗЕНА (v8.21)
const { matchVacanciesForCandidate } = require("../services/matching.service");

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

// GET /api/candidates/:id/match-vacancies
router.get("/:id/match-vacancies", async (req, res) => {
  global.isManualActionInProgress = true; // 👈 Блакуем аўтаматыку
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: "Кандыдат не знойдзены" });

    const matched = await matchVacanciesForCandidate(candidate);
    res.json(matched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    global.isManualActionInProgress = false; // 👈 Вызваляем
  }
});
// Функцыя генерацыі (дадай перад module.exports)
async function generateCandidateCode() {
  // 👈 ВЫПРАЎЛЕНА: Атамарная генерацыя кода праз $inc (v8.21)
  const counter = await Counter.findOneAndUpdate(
    { name: "candidate" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return `CAN-${String(counter.seq).padStart(4, "0")}`;
}

router.post("/:id/history", async (req, res) => {
  console.log(`📥 Спроба дадаць нататку для ID: ${req.params.id}, Тэкст: ${req.body.text}`);
  try {
    const { type, text, role } = req.body;
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate) {
      console.error("❌ Кандыдат не знойдзены ў базе");
      return res.status(404).json({ message: "Не знойдзена" });
    }

    candidate.history.push({ 
      type: type || "note", 
      text: text, 
      role: role || "recruiter",
      date: new Date() 
    });
    
    const saved = await candidate.save();
    console.log("✅ Нататка паспяхова захавана");
    res.json(saved);
  } catch (err) {
    console.error("❌ Памылка захавання гісторыі:", err); // Гэты лог пакажа рэальную прычыну ў Render
    res.status(400).json({ message: "Памылка базы: " + err.message });
  }
});
module.exports = { router, generateCandidateCode };
