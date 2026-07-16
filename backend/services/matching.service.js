// backend/services/matching.service.js
const Candidate = require("../models/Candidate");

// 👈 ДАДАДЗЕНА: Мапінг слэгаў з фронтэнда ў катэгорыі AI-парсера
const NUANCE_SLUG_TO_CATEGORY = {
  temperature: "Температурний режим",
  physical_load: "Фізично-важка праця",
  sanitary_limits: "Санітарні обмеження",
  smells_allergens: "Запахи та алергени",
  noise: "Шум",
  work_character: "Характер праці",
  skills: "Специфічні навички",
  norms: "Норми",
  entry_tests: "Тести при вступі",
  other: "Інше",
};

// 👈 ДАДАДЗЕНА: Вызначэнне катэгорыі гадзін (bucket) для вакансіі
const getHoursBucket = (hoursStr) => {
  if (!hoursStr) return "unknown";
  const match = hoursStr.replace("–", "-").match(/(\d+)/);
  if (!match) return "unknown";
  const h = parseInt(match[1], 10);
  if (h < 170) return "low";
  if (h <= 220) return "mid";
  return "high";
};
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
      // 1. Гендэр і Жыллё (v7.7.0 - палепшана для пар)
      if (vacancy.requirements?.gender?.length > 0 && candidate.gender) {
        const vGenders = vacancy.requirements.gender;
        
        if (candidate.gender === "Пари") {
          // Пара падыходзіць, калі ёсць тэг "Пари" АБО (ёсць і Мужчыны, і Жанчыны)
          const allowsBoth = vGenders.includes("Чоловіки") && vGenders.includes("Жінки");
          const allowsCouples = vGenders.includes("Пари");
          if (!allowsCouples && !allowsBoth) continue;
        } else {
          if (!vGenders.includes(candidate.gender)) continue;
        }
        
        // Жыллё для пар/дзяцей — пакідаем жорстка
        if (candidate.gender === "Пари" && !vacancy.accommodation?.forCouples) continue;
        if (candidate.gender === "Сім'ї" && !vacancy.accommodation?.withChildren) continue;
      }

      // 2. Нацыянальнасці
      if (vacancy.requirements?.nationalities?.length > 0 && candidate.nationality) {
        const allowed = vacancy.requirements.nationalities.map((n) => n.toLowerCase());
        if (!allowed.includes(candidate.nationality.toLowerCase())) continue;
      }

      // 3. Жыллё (агульная патрэба) — 👈 ВЫПРАЎЛЕНА: дакладнае супадзенне
      if (prefs?.accommodation?.needed) {
        const type = vacancy.accommodation?.type || "";
        const hasAccommodation = type === "Надається" || type === "Надається (для пар)";
        if (!hasAccommodation) continue;
        
        // Калі шукаюць толькі бясплатнае
        if (prefs.accommodation.freeOnly && !vacancy.accommodation?.isFree) continue;
      }

      // 4. Транспарт — 👈 ДАДАДЗЕНА: Hard Filter
      if (prefs?.transport?.needed && !vacancy.transport?.provided) {
        continue;
      }

      // ================================================================
      // --- SOFT FILTERS — балы за адпаведнасць ---
      // ================================================================
      let score = 0;

      // 1. Узрост (Soft Score з буферам +1-3 гады)
      if (candidate.age && vacancy.requirements?.age?.max) {
        const maxAge = vacancy.requirements.age.max;
        if (candidate.age <= maxAge) {
          score += 15;
        } else if (candidate.age <= maxAge + 3) {
          score += 7; // Кандыдат крыху старэйшы — зніжаем бал, але не адсяваем
        }
      } else {
        score += 10;
      }

      // 2. Лакацыя (25 балаў) — параўноўваем масіў voivodeship з радкамі вакансіі
      if (prefs?.locationFlexible) {
        score += 25;
      } else if (prefs?.voivodeship?.length > 0 && vacancy.voivodeship) {
        const vacVoivs = vacancy.voivodeship.toLowerCase();
        const hasMatch = prefs.voivodeship.some(v => vacVoivs.includes(v.toLowerCase()));
        if (hasMatch) score += 25;
      } else if (!prefs?.voivodeship?.length) {
        score += 15;
      }

      // 3. Сфера / катэгорыя (20 балаў)
      if (vacancy.category && prefs?.spheres?.length > 0) {
        if (prefs.spheres.includes(vacancy.category)) score += 20;
      } else {
        score += 10;
      }

      // 4. Графік (15 балаў) — 👈 ВЫПРАЎЛЕНА: Bucket Matching
      if (prefs?.hoursRange?.length > 0 && vacancy.salary?.hoursRange) {
        const vacBucket = getHoursBucket(vacancy.salary.hoursRange);
        if (prefs.hoursRange.includes(vacBucket)) score += 15;
        else score += 5;
      } else {
        score += 10;
      }

      // 5. Мова (10 балаў)
      if (vacancy.requirements?.polishLanguageLevel && prefs?.polishLanguageLevel) {
        if (vacancy.requirements.polishLanguageLevel === prefs.polishLanguageLevel) score += 10;
        else score += 5;
      }

      // 6. Нюансы (10 балаў) — 👈 ВЫПРАЎЛЕНА: Мапінг слэгаў
      if (prefs?.nuances?.length > 0 && vacancy.conditions?.specificNuances?.length > 0) {
        const vacCategories = vacancy.conditions.specificNuances.map(n => n.category);
        const hasMatch = prefs.nuances.some(slug => vacCategories.includes(NUANCE_SLUG_TO_CATEGORY[slug]));
        if (hasMatch) score += 10;
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

const matchVacanciesForCandidate = async (candidate) => {
  try {
    console.log(`🔍 Матчынг вакансій для кандыдата ${candidate._id}...`);

    const Vacancy = require("../models/Vacancy");
    const vacancies = await Vacancy.find({ status: "active" });

    if (vacancies.length === 0) {
      console.log("ℹ️ Няма актыўных вакансій");
      return [];
    }

    const prefs = candidate.jobPreferences;
    const matched = [];

    for (const vacancy of vacancies) {

      // ================================================================
      // --- HARD FILTERS — вакансія адсяваецца калі не адпавядае ---
      // ================================================================
// 1. Гендэр і Жыллё
      if (vacancy.requirements?.gender?.length > 0 && candidate.gender) {
        if (!vacancy.requirements.gender.includes(candidate.gender)) continue;
        if (candidate.gender === "Пари" && !vacancy.accommodation?.forCouples) continue;
        if (candidate.gender === "Сім'ї" && !vacancy.accommodation?.withChildren) continue;
      }

      // 2. Нацыянальнасць
      if (vacancy.requirements?.nationalities?.length > 0 && candidate.nationality) {
        const allowed = vacancy.requirements.nationalities.map(n => n.toLowerCase());
        if (!allowed.includes(candidate.nationality.toLowerCase())) continue;
      }

      // 3. Жыллё — 👈 ВЫПРАЎЛЕНА: дакладнае супастаўленне (уніфікацыя)
      if (prefs?.accommodation?.needed) {
        const type = vacancy.accommodation?.type || "";
        const hasAccommodation = type === "Надається" || type === "Надається (для пар)";
        if (!hasAccommodation) continue;
        if (prefs.accommodation.freeOnly && !vacancy.accommodation?.isFree) continue;
      }

      // 4. Транспарт — 👈 ДАДАДЗЕНА: Hard Filter
      if (prefs?.transport?.needed && !vacancy.transport?.provided) {
        continue;
      }
// ================================================================
      // --- AI TAGS FILTERS (Інтэлектуальны матчынг) ---
      // ================================================================
      const aiTags = candidate.additionalNotesTags || [];

      if (aiTags.length > 0) {
        // 1. Графік: калі толькі дзень
        if (aiTags.includes("ONLY_DAY") && vacancy.schedule?.onlyDayShifts === false) {
          continue;
        }

        // 2. Дзеці: калі патрэбна жыллё з дзецьмі
        if (aiTags.includes("WITH_CHILDREN") && vacancy.accommodation?.withChildren === false) {
          continue;
        }

        // 3. Жывёлы: калі патрэбна жыллё з жывёламі
        if (aiTags.includes("WITH_PETS") && vacancy.accommodation?.withPets === false) {
          continue;
        }

        // 4. Фізічная нагрузка: калі ёсць абмежаванні па здароўі
        if (aiTags.includes("HEAVY_LIFT_LIMIT") && vacancy.requirements?.physicalLoad === true) {
          continue;
        }
        
        // 5. Спецыяльныя дакументы (калі згадаў у тэксце, але не націснуў кнопку)
        if (aiTags.includes("HAS_UDT") && !vacancy.requirements?.standardDocs?.includes("UDT")) {
           // Тут мы не адсяваем, а наадварот — можам дадаць балаў у будучыні, 
           // але пакуль пакінем Hard Filters для крытычных рэчаў (1-4)
        }
      }
      // ================================================================
      // --- SOFT FILTERS — балы за адпаведнасць ---
      // ================================================================
      let score = 0;

      // 1. Узрост (Soft Score з буферам +3 гады)
      if (candidate.age && vacancy.requirements?.age?.max) {
        const maxAge = vacancy.requirements.age.max;
        if (candidate.age <= maxAge) {
          score += 15;
        } else if (candidate.age <= maxAge + 3) {
          score += 7;
        }
      } else {
        score += 10;
      }

      // 2. Лакацыя (25 балаў)
      if (prefs?.locationFlexible) {
        score += 25;
      } else if (prefs?.voivodeship?.length > 0 && vacancy.voivodeship) {
        const vacVoivs = vacancy.voivodeship.toLowerCase();
        const hasMatch = prefs.voivodeship.some(v => vacVoivs.includes(v.toLowerCase()));
        if (hasMatch) score += 25;
      } else if (!prefs?.voivodeship?.length) {
        score += 15;
      }

      // 3. Сфера / катэгорыя (20 балаў)
      if (vacancy.category && prefs?.spheres?.length > 0) {
        if (prefs.spheres.includes(vacancy.category)) score += 20;
      } else {
        score += 10;
      }

     // 4. Графік (15 балаў) — 👈 ВЫПРАЎЛЕНА: Bucket Matching
      if (prefs?.hoursRange?.length > 0 && vacancy.salary?.hoursRange) {
        const vacBucket = getHoursBucket(vacancy.salary.hoursRange);
        if (prefs.hoursRange.includes(vacBucket)) score += 15;
        else score += 5;
      } else {
        score += 10;
      }

      // 5. Мова (10 балаў)
      if (vacancy.requirements?.polishLanguageLevel && prefs?.polishLanguageLevel) {
        if (vacancy.requirements.polishLanguageLevel === prefs.polishLanguageLevel) score += 10;
        else score += 5;
      }

      // 6. Нюансы (10 балаў) — 👈 ВЫПРАЎЛЕНА: Мапінг слэгаў
      if (prefs?.nuances?.length > 0 && vacancy.conditions?.specificNuances?.length > 0) {
        const vacCategories = vacancy.conditions.specificNuances.map(n => n.category);
        const hasMatch = prefs.nuances.some(slug => vacCategories.includes(NUANCE_SLUG_TO_CATEGORY[slug]));
        if (hasMatch) score += 10;
      }

      // Парог — мінімум 70 балаў (для аўта-адпраўкі з бота)
      if (score >= 70) {
        matched.push({ ...vacancy.toObject(), matchScore: score });
      }
    }

    matched.sort((a, b) => b.matchScore - a.matchScore);
    console.log(`✅ Знойдзена ${matched.length} вакансій для кандыдата`);
    return matched;
  } catch (err) {
    console.error("❌ Памылка matchVacanciesForCandidate:", err.message);
    return [];
  }
};

module.exports = { matchCandidatesForVacancy, matchVacanciesForCandidate };
