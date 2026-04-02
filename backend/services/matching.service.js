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

      // ================================================================
      // --- HARD FILTERS — кандыдат адсяваецца калі не адпавядае ---
      // ================================================================

      // FIX: requirements.gender цяпер масіў ["Чоловіки", "Жінки", "Пари"]
      if (vacancy.requirements?.gender?.length > 0 && candidate.gender) {
        const genderArr = vacancy.requirements.gender.map((g) =>
          g.toLowerCase(),
        );
        const acceptsMale = genderArr.some(
          (g) => g.includes("чолов") || g.includes("male"),
        );
        const acceptsFemale = genderArr.some(
          (g) => g.includes("жінк") || g.includes("female"),
        );
        const acceptsPairs = genderArr.some((g) => g.includes("пар"));
        const acceptsAll = !acceptsMale && !acceptsFemale; // масіў пусты або невядомы — прымаем усіх

        if (!acceptsAll) {
          if (candidate.gender === "male" && !acceptsMale && !acceptsPairs)
            continue;
          if (candidate.gender === "female" && !acceptsFemale && !acceptsPairs)
            continue;
        }
      }

      // Узрост — не змяніўся, але цяпер ageMax заўсёды ёсць (дэфолт 60)
      if (vacancy.requirements?.ageMax && candidate.age) {
        if (candidate.age > vacancy.requirements.ageMax) continue;
      }
      if (vacancy.requirements?.ageMin && candidate.age) {
        if (candidate.age < vacancy.requirements.ageMin) continue;
      }

      // Нацыянальнасці — поле nationalities, без змен
      if (
        vacancy.requirements?.nationalities?.length > 0 &&
        candidate.nationality
      ) {
        const allowed = vacancy.requirements.nationalities.map((n) =>
          n.toLowerCase(),
        );
        if (!allowed.includes(candidate.nationality.toLowerCase())) continue;
      }

      // FIX: accommodation.type замест accommodation.available
      // "Безкоштовне" / "Платне" — лічым як ёсць жыллё; "Власне" — няма
      if (prefs?.needsAccommodation) {
        const hasAccommodation =
          vacancy.accommodation?.type === "Безкоштовне" ||
          vacancy.accommodation?.type === "Платне";
        if (!hasAccommodation) continue;
      }

      // FIX: requirements.standardDocs + needsAdditionalDocs + additionalDocsDetails
      // замест старога requirements.docs
      if (vacancy.requirements?.needsAdditionalDocs) {
        const details = (
          vacancy.requirements.additionalDocsDetails || ""
        ).toLowerCase();
        if (details.includes("санеп") || details.includes("sanep")) {
          if (!candidate.documents?.hasSanepid) continue;
        }
        if (details.includes("udt")) {
          if (!candidate.documents?.hasUDT) continue;
        }
      }

      // FIX: пары — forCouples замест перабору accommodation.details
      if (
        prefs?.travelGroup === "couple" &&
        !vacancy.accommodation?.forCouples
      ) {
        continue;
      }

      // FIX: businessTrip — калі кандыдат не хоча адрыхтоўкі, а вакансія патрабуе
      if (vacancy.businessTrip?.isBusinessTrip && prefs?.noBusinessTrip) {
        continue;
      }

      // ================================================================
      // --- SOFT FILTERS — балы за адпаведнасць ---
      // ================================================================
      let score = 0;

      // Лакацыя (25 балаў)
      if (prefs?.locationFlexible) {
        score += 25;
      } else if (prefs?.locationRadius) {
        score += 15;
      } else if (prefs?.location && vacancy.location) {
        const candLoc = prefs.location.toLowerCase();
        const vacLoc = vacancy.location.toLowerCase();
        if (vacLoc.includes(candLoc) || candLoc.includes(vacLoc)) score += 25;
      }

      // Сфера / катэгорыя (20 балаў)
      // FIX: vacancy.sphere → vacancy.category
      if (vacancy.category && prefs?.spheres?.length > 0) {
        if (prefs.spheres.some((s) => vacancy.category.includes(s)))
          score += 20;
      } else {
        score += 10;
      }

      // Тып дагавора (15 балаў)
      if (vacancy.contractType && prefs?.contractType) {
        if (
          prefs.contractType === "any" ||
          prefs.contractType === vacancy.contractType
        )
          score += 15;
      } else {
        score += 10;
      }

      // Графік — колькасць змен (15 балаў)
      // FIX: vacancy.schedule.shifts → vacancy.schedule.shiftsCount (number)
      if (prefs?.schedule?.length > 0 && vacancy.schedule?.shiftsCount) {
        const shifts = String(vacancy.schedule.shiftsCount);
        const hasMatch =
          (shifts === "1" && prefs.schedule.includes("1_shift")) ||
          (shifts === "2" && prefs.schedule.includes("2_shifts")) ||
          (shifts === "3" && prefs.schedule.includes("3_shifts"));
        if (hasMatch) score += 15;
        else score += 5;
      } else {
        score += 10;
      }

      // Звышурочныя (10 балаў)
      // FIX: vacancy.overtimeAvailable → schedule.hoursRange ці salaryNotes (касвенны сігнал)
      const hasOvertimeSignal =
        vacancy.salary?.salaryNotes?.toLowerCase().includes("надгодин") ||
        vacancy.salary?.salaryNotes?.toLowerCase().includes("overtime");
      if (hasOvertimeSignal && prefs?.wantsOvertime) score += 10;
      else if (!hasOvertimeSignal && !prefs?.wantsOvertime) score += 10;
      else score += 5;

      // Пары (10 балаў)
      // FIX: vacancy.accommodation.forCouples замест перабору details
      if (prefs?.travelGroup) {
        if (prefs.travelGroup === "couple" && vacancy.accommodation?.forCouples)
          score += 10;
        else if (prefs.travelGroup === "alone") score += 10;
        else score += 5;
      } else {
        score += 7;
      }

      // Мова (5 балаў)
      // FIX: requirements.polishLanguageLevel замест requirements.languageLevel
      if (vacancy.requirements?.polishLanguageLevel) {
        const level = vacancy.requirements.polishLanguageLevel.toLowerCase();
        if (level.includes("не вимаг")) {
          score += 5; // мова не патрабуецца — плюс усім
        } else if (candidate.languages?.length > 0) {
          const hasPolish = candidate.languages
            .map((l) => l.toLowerCase())
            .some((l) => l.includes("пол") || l.includes("pol"));
          if (hasPolish) score += 5;
        }
      } else {
        score += 5;
      }

      // Спецыфічныя ўмовы — штраф за цяжкія ўмовы (да -10 балаў)
      if (
        vacancy.conditions?.hasSpecificConditions &&
        prefs?.avoidHardConditions
      ) {
        score -= 10;
      }

      // Парог — мінімум 60 балаў
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
