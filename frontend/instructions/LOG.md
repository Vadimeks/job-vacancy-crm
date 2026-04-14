# Project Activity Log

# 📋 PROJECT SUMMARY — Job Vacancy CRM (HR Dispatcher Bot)

> Актуальны стан на: Красавік 2026
> Мова зносін з AI-агентам: **Беларуская** 🇧🇾
> Repo: `github.com/Vadimeks/job-vacancy-crm`

---

## 🧱 СТЭК

| Слой     | Тэхналогія                                   | Дэплой                  |
| -------- | -------------------------------------------- | ----------------------- |
| Backend  | Node.js + Express + MongoDB Atlas (Mongoose) | Railway                 |
| Frontend | React + Vite + Tailwind CSS                  | Vercel                  |
| AI       | Groq SDK (`llama-3.3-70b-versatile`)         | —                       |
| Bot      | Telegraf                                     | Telegram канал          |
| Userbot  | GramJS                                       | чытае чаты агенцый 24/7 |

**URLs:**

- Frontend: `https://job-vacancy-crm.vercel.app`
- Backend: `https://job-vacancy-crm-production.up.railway.app`

---

## 🗂 СТРУКТУРА ПРАЕКТА (файлы, з якімі працавалі)

```
backend/
  routes/
    vacancies.js          — REST API маршруты, галоўная логіка апрацоўкі
  services/
    ai.service.js         — увесь AI: парсінг, фарматаванне, шаблоны, мердж
    telegram.service.js   — адпраўка ў TG, апавяшчэнні рэкрутэру
    matching.service.js   — матчынг кандыдатаў (НЕ закраналі)
  models/
    Vacancy.js            — Mongoose-схема v2.0
    Template.js           — мадэль шаблона (патрэбна абнаўленне пад v2.0)
  seeds/
    seedTemplates.js      — засеўка шаблонаў у базу (патрэбна абнаўленне)
    manpower.js           — 46 шаблонаў ✅
    ralen.js              — 15 шаблонаў ✅
    solano.js             — 3 шаблоны ✅

frontend/src/
  pages/
    Vacancies.jsx         — спіс вакансій + рэжым "З шаблона"
    Templates.jsx         — спіс шаблонаў + пошук
    Candidates.jsx        — НЕ закраналі
  components/
    VacancyViewModal.jsx  — прагляд вакансіі (перапісаны пад v2.0)
    EditVacancyModal.jsx  — рэдагаванне вакансіі (перапісаны пад v2.0)
    TemplateViewModal.jsx — прагляд шаблона (перапісаны пад v2.0)
    EditTemplateModal.jsx — рэдагаванне шаблона (перапісаны пад v2.0)
    VacancyFilters.jsx    — фільтры (абноўлены пад v2.0)
    AddTemplateModal.jsx  — НЕ праглядалі, магчыма старая структура ⚠️
  api.js                  — дадаў createVacancyFromTemplate
```

---

## 🔄 АРХІТЭКТУРА — ФЛОЎ АПРАЦОЎКІ ВАКАНСІІ

```
Тэкст з Telegram (GramJS userbot)
    ↓
POST /api/vacancies/auto
    ↓
isInformative() / isSimpleMessage()
    ├── Просты тэкст (<80 сімв. або няма ключавых палёў)
    │       → notifyRecruiterAboutShortMessage()
    │       → TG паведамленне рэкрутэру
    │         (без кнопак на localhost, з кнопкамі на продакшне)
    │       → вакансія НЕ ствараецца
    └── Інфарматыўны тэкст
            ↓
        parseVacancyWithAI() → структура v2.0
            ↓
        constructVacancyDisplayName()
        → назва для адмінкі: "АГЕНЦЫЯ — Суць працы — Горад"
            ↓
        formatTelegramPost() → Markdown
        (БЕЗ agencyName і templateName у посце!)
            ↓
        Захаванне ў MongoDB + адпраўка ў TG канал
            ↓
        Фонавы пошук: identifyTemplate()
            ├── Брэнд у тэксце → адразу ў AI (~3к токенаў, раней ~14к)
            ├── Знойдзены → запісаць ТОЛЬКІ templateId
            │   ⚠️ НЕ мяняць палі вакансіі!
            └── Не знойдзены → createTemplateFromVacancy() → новы шаблон
```

> ⚠️ **Крытычна важна:** Фонавы блок НЕ мяняе палі вакансіі — толькі запісвае `templateId`.
> Была праблема: VAC-0082 і VAC-0084 атрымлівалі дадзеныя з шаблона замест рэальнага тэксту — выпраўлена.

---

## 📐 СТРУКТУРА ДАДЗЕНЫХ v2.0 (Vacancy)

```js
{
  // Ідэнтыфікацыя
  agencyName,           // назва агенцыі
  templateName,         // назва шаблона/прадпрыемства
  vacancydescription,   // публічны загаловак (для кандыдатаў)
  vacancyCode,          // "VAC-0082"
  category,             // сфера работы
  keywords: [],
  contractType,
  status,               // active / archived / draft

  // Лакацыя
  location,             // горад (НЕ поўны адрас!) ← вядомая праблема
  locationDescription,
  checkInCity,
  voivodeship,

  // Зарплата
  salary: {
    baseNetto, studentNetto, hoursRange,
    payoutDates, bonusDetails, salaryNotes
  },

  // Графік
  schedule: {
    description, shiftsCount, hoursPerShift,
    workDaysWeek, breakDuration
  },

  // Жыллё
  accommodation: { type, forCouples, costRaw, details },

  // Транспарт
  transport: { provided, costRaw, details },

  // Патрабаванні
  requirements: {
    gender: [],         // масіў: ["М", "Ж"]
    ageMax,
    nationalities: [],
    standardDocs: [],
    polishLanguageLevel,
    physicalLoad
  },

  // Умовы
  conditions: {
    workwearFree,       // boolean
    foodType, foodDetails,
    specificNuances: [],
    specificConditionsDetails
  },

  // Выдаткі (блок у TG посце ТОЛЬКІ калі hasStartExpenses=true)
  startExpenses: { hasStartExpenses, details },

  // Адказнасць (блок у TG посце ТОЛЬКІ калі hasLiability=true)
  earlyTerminationLiability: { hasLiability, details },

  employerCompensations: { hasCompensations, details },

  // Для рэкрутэра (НЕ паказваецца кандыдатам)
  forRecruiter: {
    internalNotes,
    hideAgencyNameForCandidate,
    hideEnterpriseNameForCandidate
  },

  // Агульнае
  description, additionalNotes,
  arrivalDate, count,
  rawText, telegramPost
}
```

---

## ✅ ШТО БЫЛО ЗРОБЛЕНА (па ўсіх чатах)

### Backend

| Файл                  | Змены                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------ |
| `telegram.service.js` | `parse_mode`: HTML → Markdown                                                              |
| `telegram.service.js` | `notifyRecruiterAboutShortMessage`: `isLocalhost` праверка → розныя кнопкі                 |
| `ai.service.js`       | `FORMAT_PROMPT`: блок "Витрати" толькі пры `hasStartExpenses=true` або `hasLiability=true` |
| `ai.service.js`       | `identifyTemplate`: лакальны пошук выдалены, адразу ў AI. Токены: ~14к → ~3к               |
| `vacancies.js`        | Новы эндпоінт `POST /api/vacancies/from-template/:templateId`                              |
| `vacancies.js`        | `isSimpleMessage()` — фільтр нефарматыўных тэкстаў                                         |
| `vacancies.js`        | Выдалены аўта-мердж палёў з шаблонам у `processVacancyMessage`                             |
| `.env`                | Дадана `FRONTEND_URL=http://localhost:5173`                                                |

### Frontend

| Файл                    | Змены                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| `VacancyViewModal.jsx`  | Поўны перапіс пад v2.0; кнопкі кандыдата закаменціраваны                                                     |
| `EditVacancyModal.jsx`  | Поўны перапіс пад v2.0; чэкбоксы для boolean палёў                                                           |
| `TemplateViewModal.jsx` | Поўны перапіс пад v2.0 + новы кампанент прагляду                                                             |
| `EditTemplateModal.jsx` | Поўны перапіс пад v2.0                                                                                       |
| `Vacancies.jsx`         | Картка: `v.title` → `v.templateName \|\| v.vacancydescription`; `applyFilters()` пад v2.0; рэжым "З шаблона" |
| `VacancyFilters.jsx`    | Мовы: нідэрл. → ням./англ.; давоз: "Ёсць/Няма"; нацыянальнасці: +Грузія, Казахстан, Азербайджан, Іншыя       |
| `Templates.jsx`         | Пошук па назве/фірме/горадзе/ключавых словах + кнопка 👁                                                     |
| `api.js`                | Дадаў `createVacancyFromTemplate`                                                                            |

### Шаблоны агенцый (seed-файлы)

| Файл          | Шаблонаў | Заўвага                |
| ------------- | -------- | ---------------------- |
| `manpower.js` | 46       | з 109, дублі аб'яднаны |
| `ralen.js`    | 15       | з 17                   |
| `solano.js`   | 3        | з 4                    |

**Агенцыі ў базе зараз:** PERSONNEL SERVICE (~50), EWL (~35), MANPOWER (46), BISAR, APOLO (~12), OTTO (~23), RALEN (15), SOLANO (3) = **~184–200+ шаблонаў**

---

## 🔴 БЯГУЧЫЯ ПРАБЛЕМЫ

### 1. Вакансіі перасталі апрацоўвацца ← ТЭРМІНОВА

**Сімптом:** У Telegram і базу нічога не прыходзіць.
**Дзе глядзець:** Лог Railway + `GROQ_API_KEY` у env.

### 2. `location` запісвае поўны адрас замест горада

**Сімптом:** `"Przemysłowa 12, 76-200 Głobino"` замест `"Słupsk"`
**Дзе выправіць:** `SYSTEM_INSTRUCTION` парсера ў `ai.service.js`

### 3. Паламаная вакансія `*[templateName]*` у TG канале

**Статус:** Крыніца не высветлена.

---

## 🟡 ТЭХДОЎГ (адкладзена)

### Backend

- [ ] `Template.js` — абнавіць мадэль пад v2.0
- [ ] `seedTemplates.js` — абнавіць пад v2.0
- [ ] AI промпты (`mergeWithTemplate`, `formatTelegramPost`, `parseVacancyWithAI`) — праверыць і абнавіць
- [ ] Мердж `from-template` — браць толькі ЗМЕНЕНЫЯ палі з новага тэксту (шаблон у базе не кранаць)
- [ ] `vacancydescription` фолбэк — `templateName + першы сказ description` (зараз можа вяртаць "Нова вакансія")

### Frontend

- [ ] `AddTemplateModal.jsx` — не праглядаўся, верагодна старая структура ⚠️
- [ ] Фільтр агенцый — цягнуць з базы дынамічна
- [ ] Фільтр "Еду" (Адзін/Пара/Сям'я) — логіка не вызначана
- [ ] Фільтр "Сфера" — уніфікаваць як AI запісвае `category`
- [ ] Выбар агенцыі пры рэдагаванні — dropdown замест free text
- [ ] `/templates?text=` і `/vacancies?updateText=` — апрацоўка query-параметраў з TG кнопак

### Кандыдаты (пазней)

- [ ] Кнопкі "Хачу працаваць" / "Дазнацца дэталі" — закаменціраваны ў `VacancyViewModal`
- [ ] Фронтэнд для кандыдатаў — без палёў `forRecruiter`
- [ ] `Candidates.jsx` і `matching.service.js` — не закраналіся

### Астатнія агенцыі (seed-файлы)

- [ ] PERSONNEL SERVICE, EWL, BISAR, APOLO, OTTO — генерацыя / рэфактарынг пад v2.0

---

## 🎯 ПРЫЯРЫТЭТЫ (з чаго пачынаць)

| #   | Задача                                      | Прыярытэт    |
| --- | ------------------------------------------- | ------------ |
| 1   | Дыягностыка: чаму вакансіі не апрацоўваюцца | 🔴 Тэрмінова |
| 2   | Выправіць `location` — горад замест адрасу  | 🔴           |
| 3   | Абнавіць `Template.js` пад v2.0             | 🟡           |
| 4   | Абнавіць `seedTemplates.js`                 | 🟡           |
| 5   | Абнавіць AI промпты                         | 🟡           |
| 6   | Праверыць `AddTemplateModal.jsx`            | 🟡           |
| 7   | Выправіць мердж `from-template`             | 🟡           |
| 8   | Фільтры: агенцыі з базы, сфера, еду         | 🟢           |
| 9   | Дадаць астатнія агенцыі ў seed-файлы        | 🟢           |
| 10  | Фронтэнд для кандыдатаў                     | 🟢 Пазней    |

---

## 🤝 ПРАВІЛЫ СУПРАЦЫ (для AI-агента — чытаць абавязкова)

1. **Мова:** Адказваць **толькі па-беларуску**
2. **Адзін крок за раз** — зрабілі → уладальнік пацвердзіў ("GO" або апісаў выніку) → наступны крок
3. **Заўсёды пытаць актуальны файл** перад зменамі — уладальнік мяняе код паміж сесіямі
4. **Не вынаходзіць кантэкст** — калі бачыш паляпшэнне, паведамі і чакай рашэння
5. **Не аптымізаваць самому** — мяняць строга тое, пра што дамовіліся
6. **Спачатку апісанне задачы + план** — потым код
7. **Папярэджваць** калі ідэя можа зламаць сістэму — прапанаваць альтэрнатыву
8. **Тлумачыць** кожны крок як для пачаткоўца
9. **Цэлы файл або лагічны блок** — не фрагменты; файлы да 300 радкоў цалкам
10. **Камітавацца** перад кожнай новай задачай

# Job Vacancy CRM - Guide

## Commands

- Dev: `npm run dev`
- Build: `npm run build`
- Python Tests: `D:/Projects/skills/venv/Scripts/python.exe ...`

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express, MongoDB

## Testing Rules

- Use Playwright from the Skills repository.
- Always wait for `networkidle`.

## [14.04.2026] — Сесія: Пераход на архітэктуру v2.0

- **Зроблена:**
  - Распрацавана новая інструкцыя парсера (`vacancy_parser_v2.md`) з пашыранай схемай JS-аб'екта.
  - Сфармулявана новая логіка матчынгу: шаблон як даведнік, а не крыніца праўды.
  - Вызначаны прыярытэты па рамонце бэкенда.
  - Прынята рашэнне адмовіцца ад фільтрацыі "кароткіх паведамленняў" — парсім усё.

- **Бягучы стан:**
  - Вакансіі часова не даходзяць да базы/Telegram (патрэбна дыягностыка Railway).
  - Праблема з `location` (піша адрас замест горада).

- **Наступны крок:** Тэхнічны аўдыт сувязі GramJS -> Backend -> Groq.
