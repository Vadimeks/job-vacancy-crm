// backend/services/matching.service.js
const Candidate = require("../models/Candidate");

const matchCandidatesForVacancy = async (vacancy) => {
  try {
    console.log(`🔍 Матчынг кандыдатаў для вакансіі ${vacancy.vacancyCode}...`);

    const candidates = await Candidate.find({
      status: { $in: ["new", "active", "waiting"] },
    });

    if (candidates.length === 0) {
      console.log("ℹ️ Няма кандыдатаў");
      return [];
    }

    const matched = [];

    for (const candidate of candidates) {
      const prefs = candidate.jobPreferences;

      // --- HARD FILTERS ---
      if (vacancy.requirements?.gender && candidate.gender) {
        const vacGender = vacancy.requirements.gender.toLowerCase();
        const isFemale =
          vacGender.includes("жінк") ||
          vacGender.includes("женщ") ||
          vacGender.includes("female");
        const isMale =
          vacGender.includes("чолов") ||
          vacGender.includes("мужч") ||
          vacGender.includes("male");
        const isBoth =
          vacGender.includes("будь") ||
          vacGender.includes("any") ||
          (!isFemale && !isMale);
        if (!isBoth) {
          if (isFemale && candidate.gender !== "female") continue;
          if (isMale && candidate.gender !== "male") continue;
        }
      }

      if (vacancy.requirements?.ageMax && candidate.age) {
        if (candidate.age > vacancy.requirements.ageMax) continue;
      }
      if (vacancy.requirements?.ageMin && candidate.age) {
        if (candidate.age < vacancy.requirements.ageMin) continue;
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

      // --- SOFT FILTERS ---
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
        matched.push({ ...candidate.toObject(), matchScore: score });
      }
    }

    matched.sort((a, b) => b.matchScore - a.matchScore);
    console.log(`✅ Знойдзена ${matched.length} падыходзячых кандыдатаў`);
    return matched;
  } catch (err) {
    console.error("❌ Памылка матчынгу:", err.message);
    return [];
  }
};

module.exports = { matchCandidatesForVacancy };
