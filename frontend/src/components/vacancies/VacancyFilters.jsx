// frontend/src/components/vacancies/VacancyFilters.jsx
import React, { useState, useEffect } from "react";
import { EMPTY_FILTERS } from "../../constants/filters";
import * as MD from "../../constants/masterData";
import MultiSelect from "../shared/MultiSelect";
import { 
  Search, 
  Sun, 
  MoreVertical, 
  ChevronUp, 
  ChevronDown, 
  ArrowUpToLine, 
  ArrowDownToLine 
} from "lucide-react";

function AccordionSection({ 
  label, 
  isOpen, 
  onToggle, 
  hasActiveFilters, 
  icon, 
  children,
  onMove, // Функцыя для перамяшчэння: (direction) => void
  isFirst,
  isLast 
}) {
  const [showMenu, setShowMenu] = useState(false);

  const handleMove = (e, direction) => {
    e.stopPropagation();
    onMove(direction);
    setShowMenu(false);
  };

  return (
    <div className="mb-2 border-b border-slate-100 pb-2 relative">
      <div className="flex items-center group">
        <button
          type="button"
          onClick={onToggle}
          className="flex-1 flex items-center justify-between py-2 px-1 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            {icon && <span className={hasActiveFilters ? 'text-emerald-600' : 'text-slate-400'}>{icon}</span>}
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

        {/* Кнопка меню "Тры кропкі" */}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
          >
            <MoreVertical size={14} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1 animate-in fade-in zoom-in-95 duration-100">
                {!isFirst && (
                  <>
                    <button onClick={(e) => handleMove(e, 'top')} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-slate-600 hover:bg-slate-50">
                      <ArrowUpToLine size={12} /> В саму гору
                    </button>
                    <button onClick={(e) => handleMove(e, 'up')} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-slate-600 hover:bg-slate-50">
                      <ChevronUp size={12} /> На 1 вгору
                    </button>
                  </>
                )}
                {!isLast && (
                  <>
                    <button onClick={(e) => handleMove(e, 'down')} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-slate-600 hover:bg-slate-50">
                      <ChevronDown size={12} /> На 1 вниз
                    </button>
                    <button onClick={(e) => handleMove(e, 'bottom')} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-slate-600 hover:bg-slate-50">
                      <ArrowDownToLine size={12} /> В самий низ
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {(isOpen || hasActiveFilters) && (
        <div className="mt-2 px-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
const DEFAULT_ORDER = [
  { id: "search", label: "Пошук", icon: <Search size={14} /> },
  { id: "status", label: "Статус" },
  { id: "dates", label: "Період оновлення" },
  { id: "category", label: "Категорія" },
  { id: "voivodeship", label: "Регіон (Воєводство)" },
  { id: "location", label: "Місто" },
  { id: "salary", label: "Зарплата" },
  { id: "contract", label: "Тип договору" },
  { id: "hours", label: "Години на місяць" },
  { id: "accommodation", label: "Житло" },
  { id: "transport", label: "Довіз да роботи" },
  { id: "gender", label: "Хто їде" },
  { id: "age", label: "Вік" },
  { id: "language", label: "Рівень польської" },
  { id: "nationality", label: "Національність" },
  { id: "docs", label: "Документи" },
  { id: "nuances", label: "Особливості (Чек-лист)" },
  { id: "agencyName", label: "Агенція" },
  { id: "brand", label: "Бренд" },
  { id: "sourceType", label: "Джерело вакансії" },
];
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
  // 1. Ініцыялізацыя: чытаем толькі ID, потым збіраем аб'екты з DEFAULT_ORDER
  const [sectionsOrder, setSectionsOrder] = useState(() => {
    const savedIds = localStorage.getItem("vacancy_filters_order_ids");
    if (savedIds) {
      try {
        const ids = JSON.parse(savedIds);
        // Збіраем масіў аб'ектаў у патрэбным парадку
        const ordered = ids
          .map(id => DEFAULT_ORDER.find(s => s.id === id))
          .filter(Boolean); // Прыбіраем null, калі ID больш не існуе

        // Дадаем новыя секцыі, якіх яшчэ няма ў захаваным спісе
        const existingIds = new Set(ids);
        const newSections = DEFAULT_ORDER.filter(s => !existingIds.has(s.id));
        
        return [...ordered, ...newSections];
      } catch (e) { 
        console.error("Error parsing filter order:", e);
        return DEFAULT_ORDER; 
      }
    }
    return DEFAULT_ORDER;
  });

  // 2. Захоўваем ТОЛЬКІ масіў ID (радкоў), гэта бяспечна для JSON
  useEffect(() => {
    const idsToSave = sectionsOrder.map(s => s.id);
    localStorage.setItem("vacancy_filters_order_ids", JSON.stringify(idsToSave));
  }, [sectionsOrder]);

  const moveSection = (id, direction) => {
    const index = sectionsOrder.findIndex(s => s.id === id);
    if (index === -1) return;

    let newOrder = [...sectionsOrder];
    const item = newOrder.splice(index, 1)[0];

    if (direction === 'top') newOrder.unshift(item);
    else if (direction === 'bottom') newOrder.push(item);
    else if (direction === 'up') newOrder.splice(Math.max(0, index - 1), 0, item);
    else if (direction === 'down') newOrder.splice(Math.min(newOrder.length, index + 1), 0, item);

    setSectionsOrder(newOrder);
  };
const [openSections, setOpenSections] = useState({
   search: false,
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
  const renderSectionContent = (id) => {
    switch (id) {
      case "search":
        return (
          <input
            type="text"
            value={draft.search || ""}
            onChange={(e) => setFilters({ ...draft, search: e.target.value })}
            placeholder="Назва, опис, код..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
          />
        );
      case "status":
        return (
          <MultiSelect
            options={getSmartOptions(MD.STATUSES, "status", true)}
            selected={draft.status}
            onChange={(v) => updateField("status", v)}
            placeholder="Будь-який status"
          />
        );
      case "dates":
        return (
          <div className="flex gap-2">
            <input
              type="date"
              value={draft.startDate || ""}
              onChange={(e) => updateField("startDate", e.target.value)}
              className="w-1/2 bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="date"
              value={draft.endDate || ""}
              onChange={(e) => updateField("endDate", e.target.value)}
              className="w-1/2 bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>
        );
      case "category":
        return (
          <MultiSelect
            options={getSmartOptions(MD.CATEGORIES, "category", true)}
            selected={draft.category}
            onChange={(v) => updateField("category", v)}
            placeholder="Усі категорії"
          />
        );
      case "voivodeship":
        return (
          <MultiSelect
            options={getSmartOptions(voivodeships, "voivodeship", true)} 
            selected={draft.voivodeship}
            onChange={(v) => updateField("voivodeship", v)}
            placeholder="Усі регіони"
          />
        );
      case "location":
        return (
          <MultiSelect
            options={getSmartOptions(locations, "location")}
            selected={draft.location}
            onChange={(v) => updateField("location", v)}
            placeholder="Усі міста"
          />
        );
      case "salary":
        return (
          <div className="flex gap-2">
            <input
              type="number"
              value={draft.minSalary || ""}
              onChange={(e) => updateField("minSalary", e.target.value)}
              placeholder="Від"
              className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="number"
              value={draft.maxSalary || ""}
              onChange={(e) => updateField("maxSalary", e.target.value)}
              placeholder="До"
              className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>
        );
      case "contract":
        return (
          <MultiSelect
            options={getSmartOptions(MD.CONTRACT_TYPES, "contractType", true)}
            selected={draft.contractType}
            onChange={(v) => updateField("contractType", v)}
            placeholder="Будь-який договір"
          />
        );
      case "hours":
        return (
          <MultiSelect
            options={getSmartOptions(MD.HOURS_RANGE_OPTIONS, "hoursRange", true)}
            selected={draft.hoursRange}
            onChange={(v) => updateField("hoursRange", v)}
            placeholder="Будь-яка кількість"
          />
        );
      case "accommodation":
        return (
          <MultiSelect
            options={getSmartOptions(MD.ACCOMMODATION_OPTIONS, "accommodation", true)}
            selected={draft.accommodation}
            onChange={(v) => updateField("accommodation", v)}
            placeholder="Будь-які умови"
          />
        );
      case "transport":
        return (
          <MultiSelect
            options={getSmartOptions(MD.TRANSPORT_OPTIONS, "transport", true)}
            selected={draft.transport}
            onChange={(v) => updateField("transport", v)}
            placeholder="Не важливо"
          />
        );
      case "gender":
        return (
          <MultiSelect
            options={getSmartOptions(MD.GENDERS, "gender", true)}
            selected={draft.gender}
            onChange={(v) => updateField("gender", v)}
            placeholder="Будь-хто"
          />
        );
      case "age":
        return (
          <div className="flex gap-2">
            <input
              type="number"
              value={draft.minAge || ""}
              onChange={(e) => updateField("minAge", e.target.value)}
              placeholder="Від"
              className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="number"
              value={draft.maxAge || ""}
              onChange={(e) => updateField("maxAge", e.target.value)}
              placeholder="До"
              className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>
        );
      case "language":
        return (
          <MultiSelect
            options={getSmartOptions(MD.LANGUAGES, "language", true)}
            selected={draft.language}
            onChange={(v) => updateField("language", v)}
            placeholder="Будь-який рівень"
          />
        );
      case "nationality":
        return (
          <MultiSelect
            options={getSmartOptions(MD.NATIONALITIES, "nationality", true)}
            selected={draft.nationality}
            onChange={(v) => updateField("nationality", v)}
            placeholder="Усі нації"
          />
        );
      case "docs":
        return (
          <MultiSelect
            options={getSmartOptions(MD.DOCS, "docs", true)}
            selected={draft.docs}
            onChange={(v) => updateField("docs", v)}
            placeholder="Будь-які документи"
          />
        );
      case "nuances":
        return (
          <MultiSelect
            options={getSmartOptions(mappedNuances, "nuances", true)}
            selected={draft.nuances}
            onChange={(v) => updateField("nuances", v)}
            placeholder="Вибрати нюанси..."
          />
        );
      case "agencyName":
        return (
          <MultiSelect
            options={getSmartOptions(MD.AGENCIES, "agencyName", false)}
            selected={draft.agencyName}
            onChange={(v) => updateField("agencyName", v)}
            placeholder="Усі агенції"
          />
        );
      case "brand":
        return (
          <MultiSelect
            options={getSmartOptions(brands, "brand")}
            selected={draft.brand}
            onChange={(v) => updateField("brand", v)}
            placeholder="Усі бренди"
          />
        );
      case "sourceType":
        return (
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
                  className={`py-2 px-2 flex items-center justify-between rounded-xl text-[10px] font-bold transition-all border ${
                    isSelected
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span>{src.label}</span>
                  <span className={`px-1 py-0.5 rounded ${isSelected ? "bg-white/20" : "bg-slate-200"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        );
      default:
        return null;
    }
  };
 return (
    <div className="flex flex-col h-full bg-white">
      {/* СТАТЫЧНАЯ ШАПКА ФІЛЬТРАЎ */}
      <div className="p-4 border-b border-slate-100 bg-white z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-emerald-600 tracking-tight uppercase">
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
      </div>

      {/* СКРОЛАЕМЫ СПІС АКАРДЭОНАЎ */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {sectionsOrder.map((section, index) => (
          <AccordionSection
            key={section.id}
            label={section.label}
            icon={section.icon}
            isOpen={openSections[section.id]}
            onToggle={() => toggleSection(section.id)}
            hasActiveFilters={
              section.id === "search" ? !!draft.search :
              section.id === "dates" ? !!(draft.startDate || draft.endDate) :
              section.id === "salary" ? !!(draft.minSalary || draft.maxSalary) :
              section.id === "age" ? !!(draft.minAge || draft.maxAge) :
              draft[section.id]?.length > 0
            }
            isFirst={index === 0}
            isLast={index === sectionsOrder.length - 1}
            onMove={(direction) => moveSection(section.id, direction)}
          >
            {renderSectionContent(section.id)}
          </AccordionSection>
        ))}
      </div>
    </div>
  );
}
