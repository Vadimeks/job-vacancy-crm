// frontend/src/components/vacancies/VacancyFilters.jsx
import { EMPTY_FILTERS } from "../../constants/filters";
import * as MD from "../../constants/masterData";
import MultiSelect from "../shared/MultiSelect";

function Section({ label, children }) {
  return <div className="mb-5">{children}</div>;
}

export default function VacancyFilters({
  filters = EMPTY_FILTERS,
  setFilters,
  agencies = [],
  brands = [],
  locations = [],
  voivodeships = [],
  nuances = [],
  vacancies = [], // 👈 Прымаем прамы масіў vacancies з бацькоўскага кампанента
}) {
  const draft = filters || EMPTY_FILTERS;
  // 🔍 Дэбаг: паглядзім у кансолі, ці прыходзяць вакансіі для падліку
  console.log("Доўжыня масіва вакансій у фільтрах:", vacancies?.length);
  const updateField = (key, val) => {
    setFilters({ ...draft, [key]: val });
  };

  // Підрахунок активних фільтрів (v4.2 - З улікам дат і крыніц)
  const activeCount = Object.entries(draft).reduce((acc, [key, val]) => {
    if (key === "search") return acc;
    if (key === "startDate" || key === "endDate") {
      return val ? acc + 1 : acc;
    }
    if (Array.isArray(val) && val.length > 0) return acc + 1;
    if (typeof val === "boolean" && val === true) return acc + 1; // Для Favorites
    return acc;
  }, 0);
  // Мапінг тэхнічных ключоў нюансаў у прыгожыя лэйблы з masterData
  const mappedNuances = nuances.map((key) => {
    const found = MD.CHECKLIST_ITEMS.find((item) => item.value === key);
    return found ? found : { value: key, label: key };
  });
  // SMART-ПАДЛІК (v4.2): Функція для дадання лічільнікаў да опцій
  const getSmartOptions = (rawItems, fieldName, isMasterData = false) => {
    // 🔍 ТЭСТ: выведзем усе ключы першай вакансіі ў тэкставым выглядзе
    if (vacancies && vacancies.length > 0 && fieldName === "accommodation") {
      console.log("👉 КЛЮЧЫ ВАКАНСІІ:", Object.keys(vacancies[0]));
      console.log(
        "👉 CONDITIONS:",
        vacancies[0].conditions ? Object.keys(vacancies[0].conditions) : "няма",
      );
      console.log(
        "👉 REQUIREMENTS:",
        vacancies[0].requirements
          ? Object.keys(vacancies[0].requirements)
          : "няма",
      );
    }

    if (!rawItems) return [];
    return rawItems.map((item) => {
      const value = isMasterData ? item.value : item;
      const baseLabel = isMasterData ? item.label : item;

      const count = vacancies.filter((v) => {
        // 1. Калі правяраем жытло або давоз (яны ляжаць у conditions)
        if (fieldName === "accommodation")
          return v.conditions?.accommodation?.type === value;
        if (fieldName === "transport") return v.conditions?.transport === value;

        // 2. Калі правяраем патрабаванні (пол, мова, нацыя, дакументы ў requirements)
        if (fieldName === "gender") return v.requirements?.gender === value;
        if (fieldName === "language") return v.requirements?.language === value;
        if (fieldName === "nationality")
          return v.requirements?.nationality === value;
        if (fieldName === "docs") return v.requirements?.docs?.includes(value);

        // 3. Калі правяраем крыніцу (sourceType)
        if (fieldName === "sourceType")
          return (v.sourceType || "spreadsheet") === value;

        // Базавая праверка для астатніх палёў на верхнім узроўні (статус, горад, агенцыя і г.д.)
        if (Array.isArray(v[fieldName])) return v[fieldName].includes(value);
        return v[fieldName] === value;
      }).length;

      return {
        value: value,
        label: count === 0 ? `${baseLabel} (0)` : `${baseLabel} (${count})`,
      };
    });
  };
  return (
    <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 h-full overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-emerald-400 tracking-tight italic">
          ФІЛЬТРИ
        </h3>
        {activeCount > 0 && (
          <button
            onClick={() => setFilters(EMPTY_FILTERS)}
            className="text-[10px] font-bold text-slate-500 hover:text-red-400 transition-colors uppercase"
          >
            Скинути ({activeCount})
          </button>
        )}
      </div>

      {/* ПОШУК */}
      <Section>
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
          Пошук
        </label>
        <input
          type="text"
          value={draft.search || ""}
          onChange={(e) => setFilters({ ...draft, search: e.target.value })}
          placeholder="Назва, опис..."
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all"
        />
      </Section>
      {/* АБРАНАЕ */}
      <Section>
        <button
          onClick={() => updateField("isFavorite", !draft.isFavorite)}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl border transition-all font-bold text-xs ${
            draft.isFavorite
              ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
              : "bg-slate-800/30 border-slate-700 text-slate-400 hover:border-slate-600"
          }`}
        >
          {draft.isFavorite ? "★ ТІЛЬКИ ОБРАНІ" : "☆ ПОКАЗАТИ ВСІ"}
        </button>
      </Section>
      <Section>
        {/* КРЫНІЦЫ */}
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            🌐 Джерело вакансії
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "spreadsheet", label: "📊 Таблиця" },
              { id: "viber", label: "📱 Viber" },
              { id: "telegram", label: "✈️ Telegram" },
            ].map((src) => {
              const isSelected = draft.sourceType?.includes(src.id);
              return (
                <button
                  key={src.id}
                  type="button"
                  onClick={() => {
                    const current = draft.sourceType || [];
                    const next = isSelected
                      ? current.filter((x) => x !== src.id)
                      : [...current, src.id];
                    updateField("sourceType", next);
                  }}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-lg shadow-emerald-500/5"
                      : "bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  {src.label}
                </button>
              );
            })}
          </div>
        </div>
      </Section>
      <Section>
        {/* ДЫЯПАЗОН ДАТ */}
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            📆 Період оновлення (З / ПО)
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={draft.startDate || ""}
              onChange={(e) => updateField("startDate", e.target.value)}
              className="w-1/2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 color-scheme-dark"
              style={{ colorScheme: "dark" }}
            />
            <input
              type="date"
              value={draft.endDate || ""}
              onChange={(e) => updateField("endDate", e.target.value)}
              className="w-1/2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 color-scheme-dark"
              style={{ colorScheme: "dark" }}
            />
          </div>
        </div>
      </Section>
      {/* СТАТУС */}
      <Section>
        <MultiSelect
          label="Статус"
          options={getSmartOptions(MD.STATUSES, "status", true)} // 👈 Заменена
          selected={draft.status}
          onChange={(v) => updateField("status", v)}
          placeholder="Будь-який status"
        />
      </Section>

      {/* КАТЕГОРІЯ */}
      <Section>
        <MultiSelect
          label="Категорія"
          options={getSmartOptions(MD.CATEGORIES, "category", true)} // 👈 Заменена
          selected={draft.category}
          onChange={(v) => updateField("category", v)}
          placeholder="Усі категорії"
        />
      </Section>

      {/* РЕГІОН (Воєводство) */}
      <Section>
        <MultiSelect
          label="Регіон (Воєводство)"
          options={getSmartOptions(voivodeships, "voivodeship")} // 👈 Заменена
          selected={draft.voivodeship}
          onChange={(v) => updateField("voivodeship", v)}
          placeholder="Усі регіони"
        />
      </Section>

      {/* МІСТО */}
      <Section>
        <MultiSelect
          label="Місто"
          options={getSmartOptions(locations, "location")} // 👈 Заменена
          selected={draft.location}
          onChange={(v) => updateField("location", v)}
          placeholder="Усі міста"
        />
      </Section>

      {/* ЖИТЛО */}
      <Section>
        <MultiSelect
          label="Житло"
          options={getSmartOptions(
            MD.ACCOMMODATION_OPTIONS,
            "accommodation",
            true,
          )} // 👈 Оновлено
          selected={draft.accommodation}
          onChange={(v) => updateField("accommodation", v)}
          placeholder="Будь-які умови"
        />
      </Section>

      {/* ДОВІЗ */}
      <Section>
        <MultiSelect
          label="Довіз до роботи"
          options={getSmartOptions(MD.TRANSPORT_OPTIONS, "transport", true)} // 👈 Оновлено
          selected={draft.transport}
          onChange={(v) => updateField("transport", v)}
          placeholder="Не важливо"
        />
      </Section>

      {/* ХТО ЇДЕ (Замість travelGroup выкарыстоўваем gender) */}
      <Section>
        <MultiSelect
          label="Хто їде"
          options={getSmartOptions(MD.GENDERS, "gender", true)} // 👈 Оновлено
          selected={draft.gender}
          onChange={(v) => updateField("gender", v)}
          placeholder="Будь-хто"
        />
      </Section>
      {/* ВІК */}
      <Section>
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
          Вік (до)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={draft.minAge || ""}
            onChange={(e) => updateField("minAge", e.target.value)}
            placeholder="Від"
            className="w-1/2 bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50"
          />
          <input
            type="number"
            value={draft.maxAge || ""}
            onChange={(e) => updateField("maxAge", e.target.value)}
            placeholder="До"
            className="w-1/2 bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </Section>
      {/* МОВА */}
      <Section>
        <MultiSelect
          label="Рівень польської"
          options={getSmartOptions(MD.LANGUAGES, "language", true)} // 👈 Оновлено
          selected={draft.language}
          onChange={(v) => updateField("language", v)}
          placeholder="Будь-який рівень"
        />
      </Section>

      {/* НАЦІОНАЛЬНІСТЬ */}
      <Section>
        <MultiSelect
          label="Національність"
          options={getSmartOptions(MD.NATIONALITIES, "nationality", true)} // 👈 Оновлено
          selected={draft.nationality}
          onChange={(v) => updateField("nationality", v)}
          placeholder="Усі нації"
        />
      </Section>
      {/* ЗАРПЛАТА */}
      <Section>
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
          Зарплата (Netto)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={draft.minSalary || ""}
            onChange={(e) => updateField("minSalary", e.target.value)}
            placeholder="Від"
            className="w-1/2 bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50"
          />
          <input
            type="number"
            value={draft.maxSalary || ""}
            onChange={(e) => updateField("maxSalary", e.target.value)}
            placeholder="До"
            className="w-1/2 bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </Section>
      {/* ДОКУМЕНТИ */}
      <Section>
        <MultiSelect
          label="Документи"
          options={getSmartOptions(MD.DOCS, "docs", true)} // 👈 Оновлено (масив рядків/об'єктів у базі перевіряється як елемент)
          selected={draft.docs}
          onChange={(v) => updateField("docs", v)}
          placeholder="Будь-які документи"
        />
      </Section>

      {/* ОСОБЛИВОСТІ (ЧЕК-ЛИСТ) */}
      <Section>
        <MultiSelect
          label="Особливості (Чек-лист)"
          options={getSmartOptions(mappedNuances, "nuances", true)} // 👈 Заменена
          selected={draft.nuances}
          onChange={(v) => updateField("nuances", v)}
          placeholder="Вибрати нюанси..."
        />
      </Section>

      {/* АГЕНЦІЯ */}
      <Section>
        <MultiSelect
          label="Агенція"
          options={getSmartOptions(agencies, "agencyName")} // 👈 Заменена
          selected={draft.agencyName}
          onChange={(v) => updateField("agencyName", v)}
          placeholder="Усі агенції"
        />
      </Section>

      {/* БРЕНД */}
      <Section>
        <MultiSelect
          label="Бренд"
          options={getSmartOptions(brands, "brand")} // 👈 Заменена
          selected={draft.brand}
          onChange={(v) => updateField("brand", v)}
          placeholder="Усі бренди"
        />
      </Section>
    </div>
  );
}
