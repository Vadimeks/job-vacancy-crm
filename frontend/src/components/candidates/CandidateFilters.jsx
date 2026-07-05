// frontend/src/components/candidates/CandidateFilters.jsx
import { useState } from "react";
import { EMPTY_CANDIDATE_FILTERS } from "../../constants/filters";
import * as MD from "../../constants/masterData";
import MultiSelect from "../shared/MultiSelect";
import { 
  Search, User, MapPin, Home, Bus, Clock, 
  Languages, FileText, Share2, ChevronDown, 
  Calendar, ClipboardList, Sparkles 
} from "lucide-react";

function AccordionSection({ label, isOpen, onToggle, hasActiveFilters, icon, children }) {
  return (
    <div className="mb-2 border-b border-slate-100 pb-2">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 px-1 hover:bg-slate-50 rounded-lg transition-colors group"
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
        <ChevronDown 
          size={16} 
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="mt-2 px-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
const DEFAULT_ORDER = [
  { id: "search", label: "Пошук", icon: <Search size={14} /> },
  { id: "status", label: "Статус", icon: <User size={14} /> },
  { id: "age", label: "Вік", icon: <Calendar size={14} /> },
  { id: "sphere", label: "Сфера", icon: <Sparkles size={14} /> },
  { id: "voivodeship", label: "Регіон", icon: <MapPin size={14} /> },
  { id: "locationNotes", label: "Уточнення локації", icon: <MapPin size={14} /> },
  { id: "accommodation", label: "Житло", icon: <Home size={14} /> },
  { id: "transport", label: "Транспорт", icon: <Bus size={14} /> },
  { id: "hoursRange", label: "Графік та години", icon: <Clock size={14} /> },
  { id: "language", label: "Рівень польської", icon: <Languages size={14} /> },
  { id: "nuances", label: "Нюанси", icon: <ClipboardList size={14} /> },
  { id: "docs", label: "Документи", icon: <FileText size={14} /> },
  { id: "source", label: "Джерело", icon: <Share2 size={14} /> },
];


export default function CandidateFilters({ draft, onChange }) {
  const [openSections, setOpenSections] = useState({
    search: true, // Па змаўчанні адкрыта толькі поле пошуку
  });

  const toggleSection = (id) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggle = (key, value) => {
    const cur = draft[key] || [];
    const next = cur.includes(value)
      ? cur.filter((v) => v !== value)
      : [...cur, value];
    onChange({ ...draft, [key]: next });
  };

  const updateField = (key, val) => {
    onChange({ ...draft, [key]: val });
  };

  // Падлік актыўных фільтраў (абноўленая логіка)
  const activeCount = Object.entries(draft).reduce((acc, [key, val]) => {
    if (key === "search") return acc;
    if (key === "locationNotes" || key === "minAge" || key === "maxAge") {
      return val ? acc + 1 : acc;
    }
    if (Array.isArray(val) && val.length > 0) return acc + 1;
    if (typeof val === "boolean" && val === true) return acc + 1;
    return acc;
  }, 0);

const renderSectionContent = (id) => {
    switch (id) {
      case "search":
        return (
          <input
            type="text"
            value={draft.search || ""}
            onChange={(e) => updateField("search", e.target.value)}
            placeholder="Ім'я, телефон, місто..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
          />
        );
      case "status":
        return (
          <MultiSelect
            options={MD.STATUSES}
            selected={draft.status}
            onChange={(v) => updateField("status", v)}
            placeholder="Будь-який статус"
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
      case "sphere":
        return (
          <MultiSelect
            options={MD.CATEGORIES}
            selected={draft.sphere}
            onChange={(v) => updateField("sphere", v)}
            placeholder="Усі сфери"
          />
        );
      case "voivodeship":
        return (
          <MultiSelect
            options={MD.VOIVODESHIPS}
            selected={draft.voivodeship}
            onChange={(v) => updateField("voivodeship", v)}
            placeholder="Усі регіони"
          />
        );
      case "locationNotes":
        return (
          <input
            type="text"
            value={draft.locationNotes || ""}
            onChange={(e) => updateField("locationNotes", e.target.value)}
            placeholder="Наприклад: Wrocław..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        );
      case "accommodation":
        return (
          <div className="space-y-2">
            <button
              onClick={() => updateField("freeHousing", !draft.freeHousing)}
              className={`w-full px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                draft.freeHousing ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              <span>🆓</span> Тільки безкоштовне
            </button>
            <MultiSelect
              options={[
                { value: "needed", label: "🏠 Потрібне житло" },
                { value: "forCouples", label: "👫 Для пар" },
                { value: "withChildren", label: "👨‍👩‍👧 З дітьми" },
              ]}
              selected={draft.accommodation}
              onChange={(v) => updateField("accommodation", v)}
              placeholder="Будь-які умови"
            />
          </div>
        );
      case "transport":
        return (
          <MultiSelect
            options={MD.TRANSPORT_OPTIONS}
            selected={draft.transport}
            onChange={(v) => updateField("transport", v)}
            placeholder="Не важливо"
          />
        );
      case "hoursRange":
        return (
          <div className="space-y-2">
            <button
              onClick={() => updateField("onlyDayShifts", !draft.onlyDayShifts)}
              className={`w-full px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                draft.onlyDayShifts ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              <span>☀️</span> Тільки день
            </button>
            <MultiSelect
              options={MD.HOURS_RANGE_OPTIONS}
              selected={draft.hoursRange}
              onChange={(v) => updateField("hoursRange", v)}
              placeholder="Будь-яка кількість"
            />
          </div>
        );
      case "language":
        return (
          <MultiSelect
            options={MD.LANGUAGES}
            selected={draft.language}
            onChange={(v) => updateField("language", v)}
            placeholder="Будь-який рівень"
          />
        );
      case "nuances":
        return (
          <MultiSelect
            options={MD.CHECKLIST_ITEMS}
            selected={draft.nuances}
            onChange={(v) => updateField("nuances", v)}
            placeholder="Вибрати нюанси..."
          />
        );
      case "docs":
        return (
          <MultiSelect
            options={MD.DOCS}
            selected={draft.docs}
            onChange={(v) => updateField("docs", v)}
            placeholder="Будь-які документи"
          />
        );
      case "source":
        return (
          <MultiSelect
            options={[
              { value: "site", label: "🌐 Тікток" },
              { value: "telegram_bot", label: "✈️ Telegram" },
              { value: "manual", label: "✋ Ручний" },
              { value: "referral", label: "🤝 Рекомендація" },
              { value: "trello", label: "📋 Trello" },
            ]}
            selected={draft.source}
            onChange={(v) => updateField("source", v)}
            placeholder="Усі джерела"
          />
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
              onClick={() => onChange(EMPTY_CANDIDATE_FILTERS)}
              className="text-[10px] font-bold text-slate-500 hover:text-red-400 transition-colors uppercase"
            >
              Скинути ({activeCount})
            </button>
          )}
        </div>
      </div>

      {/* СКРОЛАЕМЫ СПІС АКАРДЭОНАЎ */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {DEFAULT_ORDER.map((section) => (
          <AccordionSection
            key={section.id}
            label={section.label}
            icon={section.icon}
            isOpen={openSections[section.id]}
            onToggle={() => toggleSection(section.id)}
            hasActiveFilters={
              section.id === "search" ? !!draft.search :
              section.id === "locationNotes" ? !!draft.locationNotes :
              section.id === "age" ? !!(draft.minAge || draft.maxAge) :
              section.id === "accommodation" ? (draft.accommodation?.length > 0 || draft.freeHousing) :
              section.id === "hoursRange" ? (draft.hoursRange?.length > 0 || draft.onlyDayShifts) :
              Array.isArray(draft[section.id]) && draft[section.id].length > 0
            }
          >
            {renderSectionContent(section.id)}
          </AccordionSection>
        ))}
      </div>
    </div>
  );
}
