// frontend/src/components/vacancies/VacancyFilters.jsx
import React, { useState } from "react";
import { EMPTY_FILTERS } from "../../constants/filters";
import * as MD from "../../constants/masterData";
import MultiSelect from "../shared/MultiSelect";

function AccordionSection({ label, isOpen, onToggle, hasActiveFilters, children }) {
  return (
    <div className="mb-2 border-b border-slate-100 pb-2">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 px-1 hover:bg-slate-50 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${hasActiveFilters ? 'text-emerald-600' : 'text-slate-700'}`}>
            {label}
          </span>
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-sm shadow-emerald-200" />
          )}
        </div>
        <span className={`text-[10px] text-slate-400 transition-transform duration-200 ${isOpen || hasActiveFilters ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {(isOpen || hasActiveFilters) && (
        <div className="mt-2 px-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
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
const [openSections, setOpenSections] = useState({
    status: false,
    category: false,
    voivodeship: false,
    location: false,
    agencyName: false,
    brand: false,
    nuances: false,
    sourceType: false,
    contract: false,
    hours: false,
    dates: false,
    salary: false,
    age: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
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
  // SMART-ПАДЛІК (v4.3): Функцыя для дадання лічільнікаў, якая цалкам паўтарае логіку applyFilters
  const getSmartOptions = (rawItems, fieldName, isMasterData = false) => {
    if (!rawItems) return [];
    return rawItems.map((item) => {
      const value = isMasterData ? item.value : item;
      const baseLabel = isMasterData ? item.label : item;

      const count = vacancies.filter((v) => {
        // --- 1. Статус, Катэгорыя, Агенцыя, Брэнд (Простыя палі) ---
        if (["status", "category", "agencyName", "brand"].includes(fieldName)) {
          if (fieldName === "brand" && value === "NO BRAND") {
            return !v.brand || v.brand === "БРЕНДОВИЙ ОДЯГ";
          }
          return v[fieldName] === value;
        }

        // --- 2. Рэгіён і Горад (Улік Польшчы/Еўропы і масіваў) ---
        if (fieldName === "voivodeship") {
          if (value === "Польща") return v.country === "Polska";
          if (value === "Інші країни Європи")
            return v.country && v.country !== "Polska";
          return (v.voivodeship || "")
            .toLowerCase()
            .includes(value.toLowerCase());
        }

        if (fieldName === "location") {
          const vLocs = (v.location || "").split(",").map((loc) => {
            let clean = loc.trim();
            if (v.country && v.country !== "Polska" && !clean.includes("(")) {
              return `${clean} (${v.country})`.toLowerCase();
            }
            return clean.toLowerCase();
          });
          return vLocs.includes(value.toLowerCase());
        }

        // --- 3. Жытло (Складаная логіка з applyFilters) ---
        if (fieldName === "accommodation") {
          const accType = (v.accommodation?.type || "").toLowerCase();
          const isCouples = !!v.accommodation?.forCouples;
          if (value === "provided")
            return (
              accType &&
              !accType.includes("власн") &&
              !accType.includes("не надаєт")
            );
          if (value === "couples") return isCouples;
          if (value === "none")
            return accType.includes("власн") || accType.includes("не надаєт");
        }

        // --- 4. Транспарт ---
        if (fieldName === "transport") {
          const hasTransport = !!v.transport?.provided;
          return value === "provided" ? hasTransport : !hasTransport;
        }

        // --- 5. Патрабаванні (Gender, Language, Nationality, Docs) ---
        if (fieldName === "gender") {
          const vGenders = v.requirements?.gender || [];
          return vGenders.includes(value);
        }

        if (fieldName === "language") {
          const vLang = v.requirements?.polishLanguageLevel || "Не вимагається";
          return vLang === value;
        }

        if (fieldName === "nationality") {
          const vNats =
            Array.isArray(v.requirements?.nationalities) &&
            v.requirements.nationalities.length > 0
              ? v.requirements.nationalities
              : ["Україна"];
          return vNats.includes(value);
        }

        if (fieldName === "docs") {
          const vDocs = v.requirements?.standardDocs || [];
          return vDocs.includes(value);
        }

        // --- 6. Нюансы (Чэк-ліст) ---
        if (fieldName === "nuances") {
          const vNuances = v.conditions?.specificNuances || [];
          return vNuances.some((vn) => {
            const vnCat =
              typeof vn === "object" && vn !== null ? vn.category : vn;
            return vnCat === value;
          });
        }

        // --- 7. Крыніца (v4.4 - Сінхранізацыя manual/spreadsheet) ---
        if (fieldName === "sourceType") {
          const s = v.sourceType || "manual";
          return s === value;
        }

        // --- 8. Тып дагавору (case-insensitive) --- // 👈 ДАДАДЗЕНА
        if (fieldName === "contractType") {
          const ct = (v.contractType || "").toLowerCase();
          if (value === "zlecenie") return ct.includes("zlecenie");
          if (value === "oprace") return ct.includes("o prac");
          if (value === "null") return !v.contractType;
          return false;
        }

        // --- 9. Гадзіны ў месяц (bucket-фільтр) --- // 👈 ДАДАДЗЕНА
        if (fieldName === "hoursRange") {
          const raw = v.salary?.hoursRange || "";
          const parsed = raw.replace("–", "-").match(/(\d+)/);
          const minH = parsed ? parseInt(parsed[1]) : null;
          if (value === "low") return minH !== null && minH < 170;
          if (value === "mid")
            return minH !== null && minH >= 170 && minH <= 220;
          if (value === "high") return minH !== null && minH > 220;
          if (value === "unknown") return minH === null;
          return false;
        }

        return false;
      }).length;

      return {
        value: value,
        label: `${baseLabel} (${count})`,
      };
    });
  };
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 h-full overflow-y-auto custom-scrollbar shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black text-emerald-600 tracking-tight uppercase">
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
      {/* АБРАНАЕ */}
      <div className="mb-5">
        <button
          type="button"
          onClick={() => updateField("isFavorite", !draft.isFavorite)}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-bold text-sm ${
            draft.isFavorite
              ? "bg-amber-50 border-amber-200 text-amber-600 shadow-sm"
              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
          }`}
        >
          {draft.isFavorite ? "★ ТІЛЬКИ ОБРАНІ" : "☆ ПОКАЗАТИ ВСІ"}
        </button>
      </div>
      {/* ПОШУК */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
          Пошук
        </label>
        <input
          type="text"
          value={draft.search || ""}
          onChange={(e) => setFilters({ ...draft, search: e.target.value })}
          placeholder="Назва, опис..."
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-base text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
        />
      </div>
      {/* СТАТУС */}
      <AccordionSection 
        label="Статус" 
        isOpen={openSections.status} 
        onToggle={() => toggleSection("status")}
        hasActiveFilters={draft.status?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(MD.STATUSES, "status", true)}
          selected={draft.status}
          onChange={(v) => updateField("status", v)}
          placeholder="Будь-який status"
        />
      </AccordionSection>
      {/* ДЫЯПАЗОН ДАТ */}
      <AccordionSection 
        label="Період оновлення" 
        isOpen={openSections.dates} 
        onToggle={() => toggleSection("dates")}
        hasActiveFilters={!!(draft.startDate || draft.endDate)}
      >
        <div className="flex gap-2">
          <input
            type="date"
            value={draft.startDate || ""}
            onChange={(e) => updateField("startDate", e.target.value)}
            className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:border-emerald-500 transition-all"
            style={{ colorScheme: "light" }}
          />
          <input
            type="date"
            value={draft.endDate || ""}
            onChange={(e) => updateField("endDate", e.target.value)}
            className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:border-emerald-500 transition-all"
            style={{ colorScheme: "light" }}
          />
        </div>
      </AccordionSection>
      {/* КАТЕГОРІЯ */}
      <AccordionSection 
        label="Категорія" 
        isOpen={openSections.category} 
        onToggle={() => toggleSection("category")}
        hasActiveFilters={draft.category?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(MD.CATEGORIES, "category", true)}
          selected={draft.category}
          onChange={(v) => updateField("category", v)}
          placeholder="Усі категорії"
        />
      </AccordionSection>

      {/* РЕГІОН (Воєводство) */}
      <AccordionSection 
        label="Регіон (Воєводство)" 
        isOpen={openSections.voivodeship} 
        onToggle={() => toggleSection("voivodeship")}
        hasActiveFilters={draft.voivodeship?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(voivodeships, "voivodeship")}
          selected={draft.voivodeship}
          onChange={(v) => updateField("voivodeship", v)}
          placeholder="Усі регіони"
        />
      </AccordionSection>
      
      {/* МІСТО */}
      <AccordionSection 
        label="Місто" 
        isOpen={openSections.location} 
        onToggle={() => toggleSection("location")}
        hasActiveFilters={draft.location?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(locations, "location")}
          selected={draft.location}
          onChange={(v) => updateField("location", v)}
          placeholder="Усі міста"
        />
      </AccordionSection>
      
      {/* ЗАРПЛАТА */}
      <AccordionSection 
        label="Зарплата (Netto)" 
        isOpen={openSections.salary} 
        onToggle={() => toggleSection("salary")}
        hasActiveFilters={!!(draft.minSalary || draft.maxSalary)}
      >
        <div className="flex gap-2">
          <input
            type="number"
            value={draft.minSalary || ""}
            onChange={(e) => updateField("minSalary", e.target.value)}
            placeholder="Від"
            className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-base text-slate-900 shadow-sm focus:outline-none focus:border-emerald-500 transition-all"
          />
          <input
            type="number"
            value={draft.maxSalary || ""}
            onChange={(e) => updateField("maxSalary", e.target.value)}
            placeholder="До"
            className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-base text-slate-900 shadow-sm focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>
      </AccordionSection>

      {/* ТИП ДОГОВОРУ */} 
      <AccordionSection 
        label="Тип договору" 
        isOpen={openSections.contract} 
        onToggle={() => toggleSection("contract")}
        hasActiveFilters={draft.contractType?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(MD.CONTRACT_TYPES, "contractType", true)}
          selected={draft.contractType}
          onChange={(v) => updateField("contractType", v)}
          placeholder="Будь-який договір"
        />
      </AccordionSection>
      {/* ТОЛЬКІ ДЗЁННЫЯ ЗМЕНЫ (Застаецца без акардэона) */}
            <div className="mb-5">
        <button
          onClick={() => updateField("onlyDayShifts", !draft.onlyDayShifts)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all font-bold text-sm ${
            draft.onlyDayShifts
              ? "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm"
              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>☀️</span>
            <span>ТІЛЬКИ ДЕННІ ЗМІНИ</span>
          </div>
          <div className={`w-8 h-4 rounded-full relative transition-colors ${draft.onlyDayShifts ? 'bg-emerald-500' : 'bg-slate-300'}`}>
            <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${draft.onlyDayShifts ? 'right-1' : 'left-1'}`} />
          </div>
        </button>
      </div>

      {/* ГОДИНИ НА МІСЯЦЬ */} 
      <AccordionSection 
        label="Години на місяць" 
        isOpen={openSections.hours} 
        onToggle={() => toggleSection("hours")}
        hasActiveFilters={draft.hoursRange?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(MD.HOURS_RANGE_OPTIONS, "hoursRange", true)}
          selected={draft.hoursRange}
          onChange={(v) => updateField("hoursRange", v)}
          placeholder="Будь-яка кількість"
        />
      </AccordionSection>

      {/* ЖИТЛО */}
      <AccordionSection 
        label="Житло" 
        isOpen={openSections.accommodation} 
        onToggle={() => toggleSection("accommodation")}
        hasActiveFilters={draft.accommodation?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(MD.ACCOMMODATION_OPTIONS, "accommodation", true)}
          selected={draft.accommodation}
          onChange={(v) => updateField("accommodation", v)}
          placeholder="Будь-які умови"
        />
      </AccordionSection>
      {/* ДОВІЗ */}
      <AccordionSection 
        label="Довіз до роботи" 
        isOpen={openSections.transport} 
        onToggle={() => toggleSection("transport")}
        hasActiveFilters={draft.transport?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(MD.TRANSPORT_OPTIONS, "transport", true)}
          selected={draft.transport}
          onChange={(v) => updateField("transport", v)}
          placeholder="Не важливо"
        />
      </AccordionSection>

      {/* ХТО ЇДЕ */}
      <AccordionSection 
        label="Хто їде" 
        isOpen={openSections.gender} 
        onToggle={() => toggleSection("gender")}
        hasActiveFilters={draft.gender?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(MD.GENDERS, "gender", true)}
          selected={draft.gender}
          onChange={(v) => updateField("gender", v)}
          placeholder="Будь-хто"
        />
      </AccordionSection>

      {/* ВІК */}
      <AccordionSection 
        label="Вік" 
        isOpen={openSections.age} 
        onToggle={() => toggleSection("age")}
        hasActiveFilters={!!(draft.minAge || draft.maxAge)}
      >
        <div className="flex gap-2">
          <input
            type="number"
            value={draft.minAge || ""}
            onChange={(e) => updateField("minAge", e.target.value)}
            placeholder="Від"
            className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-base text-slate-900 shadow-sm focus:outline-none focus:border-emerald-500 transition-all"
          />
          <input
            type="number"
            value={draft.maxAge || ""}
            onChange={(e) => updateField("maxAge", e.target.value)}
            placeholder="До"
            className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-base text-slate-900 shadow-sm focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>
      </AccordionSection>
      {/* МОВА */}
      <AccordionSection 
        label="Рівень польської" 
        isOpen={openSections.language} 
        onToggle={() => toggleSection("language")}
        hasActiveFilters={draft.language?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(MD.LANGUAGES, "language", true)}
          selected={draft.language}
          onChange={(v) => updateField("language", v)}
          placeholder="Будь-який рівень"
        />
      </AccordionSection>

      {/* НАЦІОНАЛЬНІСТЬ */}
      <AccordionSection 
        label="Національність" 
        isOpen={openSections.nationality} 
        onToggle={() => toggleSection("nationality")}
        hasActiveFilters={draft.nationality?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(MD.NATIONALITIES, "nationality", true)}
          selected={draft.nationality}
          onChange={(v) => updateField("nationality", v)}
          placeholder="Усі нації"
        />
      </AccordionSection>

      {/* ДОКУМЕНТИ */}
      <AccordionSection 
        label="Документи" 
        isOpen={openSections.docs} 
        onToggle={() => toggleSection("docs")}
        hasActiveFilters={draft.docs?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(MD.DOCS, "docs", true)}
          selected={draft.docs}
          onChange={(v) => updateField("docs", v)}
          placeholder="Будь-які документи"
        />
      </AccordionSection>
      {/* ОСОБЛИВОСТІ (ЧЕК-ЛИСТ) */}
      <AccordionSection 
        label="Особливості (Чек-лист)" 
        isOpen={openSections.nuances} 
        onToggle={() => toggleSection("nuances")}
        hasActiveFilters={draft.nuances?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(mappedNuances, "nuances", true)}
          selected={draft.nuances}
          onChange={(v) => updateField("nuances", v)}
          placeholder="Вибрати нюанси..."
        />
      </AccordionSection>

      {/* АГЕНЦІЯ */}
      <AccordionSection 
        label="Агенція" 
        isOpen={openSections.agencyName} 
        onToggle={() => toggleSection("agencyName")}
        hasActiveFilters={draft.agencyName?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(agencies, "agencyName")}
          selected={draft.agencyName}
          onChange={(v) => updateField("agencyName", v)}
          placeholder="Усі агенції"
        />
      </AccordionSection>

      {/* БРЕНД */}
      <AccordionSection 
        label="Бренд" 
        isOpen={openSections.brand} 
        onToggle={() => toggleSection("brand")}
        hasActiveFilters={draft.brand?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(brands, "brand")}
          selected={draft.brand}
          onChange={(v) => updateField("brand", v)}
          placeholder="Усі бренди"
        />
      </AccordionSection>
      {/* КРЫНІЦЫ */}
      <AccordionSection 
        label="Джерело вакансії" 
        isOpen={openSections.sourceType} 
        onToggle={() => toggleSection("sourceType")}
        hasActiveFilters={draft.sourceType?.length > 0}
      >
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "viber", label: "📱 Viber" },
            { id: "telegram", label: "✈️ Telegram" },
            { id: "spreadsheet", label: "📊 Таблиця" },
            { id: "trello", label: "🔵 Trello" },
            { id: "airtable", label: "🗄️ Airtable" },
            { id: "manual", label: "📝 Ручне" },
          ].map((src) => {
            const isSelected = draft.sourceType?.includes(src.id);
            const count = vacancies.filter(
              (v) => (v.sourceType || "manual") === src.id
            ).length;

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
                className={`py-2.5 px-3 flex items-center justify-between rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                <span>{src.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </AccordionSection>
      
    </div>
  );
}
