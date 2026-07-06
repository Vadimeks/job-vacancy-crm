// frontend/src/components/candidates/CandidateFilters.jsx
import { useState, useEffect } from "react"; // 👈 ДАДАДЗЕНА: useEffect для захавання парадку секцый
import { EMPTY_CANDIDATE_FILTERS } from "../../constants/filters";
import * as MD from "../../constants/masterData";
import MultiSelect from "../shared/MultiSelect";
import { 
  Search, User, MapPin, Home, Bus, Clock, 
  Languages, FileText, Share2, ChevronDown, 
  Calendar, ClipboardList, Sparkles,
  MoreVertical, ChevronUp, ArrowUpToLine, ArrowDownToLine // 👈 ДАДАДЗЕНА: для меню перамяшчэння секцый (перанесена з VacancyFilters.jsx)
} from "lucide-react";

// 👈 ЗМЕНЕНА: AccordionSection пашырана меню перамяшчэння (тры кропкі), перанесена з VacancyFilters.jsx для ідэнтычнасці
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
  { id: "gender", label: "Хто їде", icon: <User size={14} /> },
{ id: "nationality", label: "Національність", icon: <User size={14} /> },
{ id: "contractType", label: "Тип договору", icon: <FileText size={14} /> },
];


export default function CandidateFilters({ draft, onChange }) {
  // 👈 НОВАЕ: захаванне парадку секцый, перанесена з VacancyFilters.jsx
  const [sectionsOrder, setSectionsOrder] = useState(() => {
    const savedIds = localStorage.getItem("candidate_filters_order_ids");
    if (savedIds) {
      try {
        const ids = JSON.parse(savedIds);
        const ordered = ids
          .map(id => DEFAULT_ORDER.find(s => s.id === id))
          .filter(Boolean);
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

  useEffect(() => {
    const idsToSave = sectionsOrder.map(s => s.id);
    localStorage.setItem("candidate_filters_order_ids", JSON.stringify(idsToSave));
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
      options={[{ value: "any", label: "✈️ Без різниці (готовий скрізь)" }, ...MD.VOIVODESHIPS]}
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
        case "gender":
  return (
    <MultiSelect
      options={MD.GENDERS}
      selected={draft.gender}
      onChange={(v) => updateField("gender", v)}
      placeholder="Будь-хто"
    />
  );
case "nationality":
  return (
    <MultiSelect
      options={MD.NATIONALITIES}
      selected={draft.nationality}
      onChange={(v) => updateField("nationality", v)}
      placeholder="Усі нації"
    />
  );
case "contractType":
  return (
    <MultiSelect
      options={MD.CONTRACT_TYPES}
      selected={draft.contractType}
      onChange={(v) => updateField("contractType", v)}
      placeholder="Будь-який договір"
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
         {sectionsOrder.map((section, index) => ( 
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
------------------
// frontend/src/pages/Candidates.jsx
import { useEffect, useState, useMemo } from "react";
import { getCandidates, deleteCandidate } from "../services/api";
import ProfileModal from "../components/candidates/ProfileModal";
import AddCandidateModal from "../components/candidates/AddCandidateModal";
import CandidateFilters from "../components/candidates/CandidateFilters";
import { EMPTY_CANDIDATE_FILTERS } from "../constants/filters";
import { LayoutGrid, List as ListIcon, Trash2, User, Globe, MessageSquare } from "lucide-react";

const STATUS_COLORS = {
  new: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  waiting: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  employed: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  left: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
  blacklist: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const STATUS_LABELS = {
  new: "Новий",
  active: "Активний",
  waiting: "Очікує",
  employed: "Працює",
  left: "Звільнився",
  blacklist: "Чорний список",
};

function applyFilters(candidates, filters) {
  return candidates.filter((c) => {
    // Пошук (імя, тэлефон, тг, горад) — без змен
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (
        !c.name?.toLowerCase().includes(s) &&
        !c.phone?.toLowerCase().includes(s) &&
        !c.telegram?.toLowerCase().includes(s) &&
        !c.currentLocation?.toLowerCase().includes(s)
      ) return false;
    }

    // 👈 ЗМЕНЕНА: было citySearch (шукаў у jobPreferences.location) — цяпер locationNotes (тэкставае поле для AI-матчынгу)
    if (filters.locationNotes) {
      const ln = filters.locationNotes.toLowerCase();
      const candNotes = c.jobPreferences?.locationNotes || "";
      if (!candNotes.toLowerCase().includes(ln)) return false;
    }

    // Статус — без змен
    if (filters.status?.length > 0 && !filters.status.includes(c.status)) return false;

    // Гендар — без змен
    if (filters.gender?.length > 0 && !filters.gender.includes(c.gender)) return false;

    // Нацыянальнасць — без змен
    if (filters.nationality?.length > 0) {
      if (!filters.nationality.some((n) => c.nationality?.toLowerCase() === n.toLowerCase())) return false;
    }

    // Сфера — без змен
    if (filters.sphere?.length > 0) {
      const prefs = c.jobPreferences?.spheres || [];
      if (!filters.sphere.some((s) => prefs.includes(s))) return false;
    }

    // 👈 ЗМЕНЕНА: было filters.location / c.jobPreferences.location — цяпер filters.voivodeship / c.jobPreferences.voivodeship
    if (filters.voivodeship?.length > 0) {
      const candLocs = Array.isArray(c.jobPreferences?.voivodeship) ? c.jobPreferences.voivodeship : [];
      const isFlexible = c.jobPreferences?.locationFlexible;
      const match = filters.voivodeship.some((l) => (l === "any" ? isFlexible : candLocs.includes(l)));
      if (!match) return false;
    }

    // 👈 ЗМЕНЕНА: было values "true"/"false" супраць needsAccommodation (Boolean) — цяпер values needed/forCouples/withChildren супраць структуры accommodation{}
    if (filters.accommodation?.length > 0) {
      const acc = c.jobPreferences?.accommodation || {};
      const match = filters.accommodation.some((a) => !!acc[a]);
      if (!match) return false;
    }

    // 👈 НОВАЕ: фільтр "толькі бясплатнае жытло" (сіметрычна freeHousing у вакансіях)
    if (filters.freeHousing && !c.jobPreferences?.accommodation?.freeOnly) return false;

    // 👈 ЗМЕНЕНА: было filters.schedule / c.jobPreferences.schedule — цяпер filters.hoursRange / c.jobPreferences.hoursRange
    if (filters.hoursRange?.length > 0) {
      const prefs = c.jobPreferences?.hoursRange || [];
      if (!filters.hoursRange.some((s) => prefs.includes(s))) return false;
    }

    // Тільки денні зміни — без змен
    if (filters.onlyDayShifts && !c.jobPreferences?.onlyDayShifts) return false;

    // 👈 НОВАЕ: фільтр Транспорт, скапіявана з логікі applyFilters у Vacancies.jsx
    if (filters.transport?.length > 0) {
      const hasTransport = !!c.jobPreferences?.transport?.needed;
      const match = filters.transport.some((ft) => (ft === "provided" ? hasTransport : !hasTransport));
      if (!match) return false;
    }

    // 👈 НОВАЕ: фільтр Мова (значэнні з MD.LANGUAGES, ідэнтычна вакансіям)
    if (filters.language?.length > 0) {
      const lvl = c.jobPreferences?.polishLanguageLevel || "Не вимагається";
      if (!filters.language.includes(lvl)) return false;
    }

    // 👈 НОВАЕ: фільтр Нюансы (масіў, ідэнтычна вакансіям)
    if (filters.nuances?.length > 0) {
      const prefs = c.jobPreferences?.nuances || [];
      if (!filters.nuances.some((n) => prefs.includes(n))) return false;
    }

    // Дакументы (праз activeDocs) — без змен
    if (filters.docs?.length > 0) {
      const match = filters.docs.some((d) => c.documents?.activeDocs?.includes(d));
      if (!match) return false;
    }

    // Тып кантракта — без змен
    if (filters.contractType?.length > 0 && !filters.contractType.includes(c.jobPreferences?.contractType)) return false;

    // Узрост (min/max) — без змен
    if (filters.minAge && c.age && c.age < Number(filters.minAge)) return false;
    if (filters.maxAge && c.age && c.age > Number(filters.maxAge)) return false;

    // Джерело — без змен
    if (filters.source?.length > 0 && !filters.source.includes(c.source)) return false;

    return true;
  });
}
function CandidateKanbanCard({ candidate, onOpen }) {
  const aiTags = candidate.additionalNotesTags || [];
  
  return (
    <div 
      onClick={onOpen}
      className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-slate-400 font-medium">
          {new Date(candidate.createdAt).toLocaleDateString('uk-UA')}
        </span>
        <span className="text-[10px] text-slate-500">
          {candidate.source === "telegram_bot" ? "✈️ TG" : "📝 Руч."}
        </span>
      </div>
      
      <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-1 truncate">
        {candidate.name}
      </h4>
      
      <div className="flex flex-wrap gap-1 mb-2">
        {candidate.age && (
          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
            {candidate.age} р.
          </span>
        )}
        {candidate.gender && (
          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
            {candidate.gender === "Жінки" ? "👩" : "👨"}
          </span>
        )}
      </div>

      {/* AI Тэгі */}
      {aiTags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-slate-50">
          {aiTags.map((tag, i) => (
            <span key={i} className="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [draft, setDraft] = useState(EMPTY_CANDIDATE_FILTERS);
  const [applied, setApplied] = useState(EMPTY_CANDIDATE_FILTERS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // 'list' або 'kanban'

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getCandidates();
        setCandidates(res.data);
      } catch {
        console.error("Помилка завантаження кандидатів");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const previewCount = useMemo(
    () => applyFilters(candidates, draft).length,
    [candidates, draft],
  );

  const filtered = useMemo(
    () => applyFilters(candidates, applied),
    [candidates, applied],
  );

  const isDirty = JSON.stringify(draft) !== JSON.stringify(applied);

  const handleApplyFilters = () => {
    setApplied(draft);
    setSidebarOpen(false);
  };

  const handleResetFilters = () => {
    setDraft(EMPTY_CANDIDATE_FILTERS);
    setApplied(EMPTY_CANDIDATE_FILTERS);
  };

  const handleDelete = async (id) => {
    if (!confirm("Видалити кандидата?")) return;
    try {
      await deleteCandidate(id);
      setCandidates((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert("Памылка выдалення");
    }
  };

  const handleUpdate = (updated) => {
    setCandidates((prev) =>
      prev.map((c) => (c._id === updated._id ? updated : c)),
    );
  };

  const handleAdd = (newCandidate) => {
    setCandidates((prev) => [newCandidate, ...prev]);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* САЙДБАР — дэсктоп */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-slate-200 bg-white sticky top-16 h-[calc(100vh-4rem)] self-start">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <span className="text-sm font-medium text-slate-300">Фільтри</span>
          {isDirty && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Скинути
            </button>
          )}
        </div>
        <CandidateFilters draft={draft} onChange={setDraft} />
      </aside>

      {/* САЙДБАР — мабільны */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <span className="text-sm font-medium text-slate-300">
                Фільтры
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-slate-500 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <CandidateFilters draft={draft} onChange={setDraft} />
            </div>
            <div className="p-4 border-t border-slate-800">
              <button
                onClick={handleApplyFilters}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold text-sm rounded-lg transition-colors"
              >
                Показати {previewCount} кандидатів
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ГАЛОЎНАЯ ВОБЛАСЦЬ */}
      <div className="flex-1 min-w-0 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
            >
              ⚙️ Фільтри
              {isDirty && (
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              )}
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                Кандидати
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {filtered.length} з {candidates.length} кандидатів
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Пераключальнік рэжымаў */}
            <div className="hidden sm:flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "list" ? "bg-emerald-500 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <ListIcon size={14} /> Спіс
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "kanban" ? "bg-emerald-500 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <LayoutGrid size={14} /> Канбан
              </button>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-medium text-sm rounded-lg transition-colors"
            >
              <span>＋</span> Додати кандидата
            </button>
          </div>
        </div>

        {/* Спіс */}
        {loading ? (
          <div className="text-slate-500 text-sm">Завантаження...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-600">
            <div className="text-4xl mb-3">👥</div>
            <div className="text-sm">Кандидатів за цими фільтрами не знайдено</div>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded-lg transition-colors"
            >
              Скинути фільтри
            </button>
          </div>
        ) : viewMode === "list" ? (
          /* СПІСАВЫ РЭЖЫМ */
          <div className="space-y-3">
            {filtered.map((c) => (
              <div
                key={c._id}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => setProfileId(c._id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status]}`}>
                        {STATUS_LABELS[c.status]}
                      </span>
                      <span className="text-xs text-slate-600">
                        {c.source === "site" ? "🌐 Тікток" : 
 c.source === "telegram_bot" ? "✈️ Telegram" : 
 c.source === "referral" ? "🤝 Рекомендація" : "✋ Ручний"}
                      </span>
                      <span className="text-xs text-slate-700">
                        {new Date(c.createdAt).toLocaleDateString("uk-UA")}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{c.name}</h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                      {c.contactType === "telegram" && c.telegram && <span>✈️ {c.telegram}</span>}
                      {(c.contactType === "viber" || c.contactType === "phone") && c.phone && <span>📞 {c.phone}</span>}
                      {c.nationality && <span>🌍 {c.nationality}</span>}
                      {c.currentLocation && <span>📍 {c.currentLocation}</span>}
                      {c.age && <span>🎂 {c.age} г.</span>}
                      {c.gender && <span>{c.gender === "Жінки" ? "👩" : "👨"}</span>}
                    </div>
                    {c.jobPreferences?.locationFlexible && (
                      <div className="mt-2 text-xs text-slate-600">🔍 Гатовы да пераезду</div>
                    )}
                    {!c.jobPreferences?.locationFlexible && c.jobPreferences?.location?.length > 0 && (
                      <div className="mt-2 text-xs text-slate-600">
                        🔍 Шукае: {Array.isArray(c.jobPreferences.location) ? c.jobPreferences.location.join(", ") : c.jobPreferences.location}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setProfileId(c._id)} className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors text-xs">👤 Профіль</button>
                    <button onClick={() => handleDelete(c._id)} className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-xs">🗑</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* КАНБАН РЭЖЫМ */
          <div className="flex gap-4 overflow-x-auto pb-6 min-h-[calc(100vh-250px)] custom-scrollbar">
            {Object.entries(STATUS_LABELS).map(([statusKey, label]) => {
              const columnCandidates = filtered.filter(c => c.status === statusKey);
              return (
                <div key={statusKey} className="w-72 shrink-0 flex flex-col gap-3">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[statusKey].split(' ')[0]}`} />
                      {label}
                      <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md text-[9px]">
                        {columnCandidates.length}
                      </span>
                    </h3>
                  </div>
                  <div className="flex flex-col gap-3 p-2 bg-slate-100/50 rounded-2xl flex-1 border border-dashed border-slate-200">
                    {columnCandidates.map(c => (
                      <CandidateKanbanCard 
                        key={c._id} 
                        candidate={c} 
                        onOpen={() => setProfileId(c._id)} 
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ПЛАВАЮЧАЯ КНОПКА */}
      {isDirty && (
        <div className="hidden lg:block fixed bottom-6 right-6 z-30">
          <button
            onClick={handleApplyFilters}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
          >
            Показати {previewCount} кандидатів ✓
          </button>
        </div>
      )}

      {profileId && (
        <ProfileModal
          candidateId={profileId}
          onClose={() => setProfileId(null)}
          onUpdate={handleUpdate}
        />
      )}
      {showAddForm && (
        <AddCandidateModal
          onClose={() => setShowAddForm(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}
-----------------
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
------------
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
-----------
import { useState } from "react";
import { submitApplication } from "../../services/api";
import Field from "../shared/Field";
import Divider from "../shared/Divider";
import * as MD from "../../constants/masterData";

export default function ApplyModal({ vacancy, applyType, onClose }) {
  const [form, setForm] = useState({
    name: "",
    contactType: "telegram",
    telegram: "",
    phone: "",
    nationality: "",
    currentLocation: "",
    age: "",
    gender: "",
    jobPreferences: {
      voivodeship: [],
      locationFlexible: false,
      locationNotes: "",
      spheres: [],
      accommodation: {
        needed: false,
        forCouples: false,
        withChildren: false,
        freeOnly: false,
      },
      transport: { needed: false },
      polishLanguageLevel: "Не вимагається",
      onlyDayShifts: false,
      hoursRange: [],
      contractType: "any",
      nuances: [],
      nuancesNotes: "",
      readyDate: "",
      readyDateNotes: "",
    },
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const setField = (path, value) => {
    const parts = path.split(".");
    setForm((prev) => {
      const next = { ...prev };
      if (parts.length === 1) {
        next[parts[0]] = value;
      } else if (parts.length === 2) {
        next[parts[0]] = { ...next[parts[0]], [parts[1]]: value };
      } else if (parts.length === 3) {
        next[parts[0]] = {
          ...next[parts[0]],
          [parts[1]]: { ...next[parts[0]]?.[parts[1]], [parts[2]]: value },
        };
      }
      return next;
    });
  };

  const toggleArrayPref = (field, val) => {
    setForm((prev) => {
      const cur = prev.jobPreferences[field] || [];
      const next = cur.includes(val)
        ? cur.filter((s) => s !== val)
        : [...cur, val];
      return {
        ...prev,
        jobPreferences: { ...prev.jobPreferences, [field]: next },
      };
    });
  };

  const handleSubmit = async () => {
    // Лакалізацыя паведамленняў валідацыі
    if (!form.name.trim()) return alert("Введіть ім'я та прізвище");
    if (form.contactType === "telegram" && !form.telegram.trim())
      return alert("Введіть Telegram username");
    if (
      (form.contactType === "viber" || form.contactType === "phone") &&
      !form.phone.trim()
    )
      return alert("Введіть номер телефону");

    setSending(true);
    try {
      await submitApplication({
        vacancyId: vacancy._id,
        applyType,
        ...form,
        age: form.age ? Number(form.age) : undefined,
      });
      setSent(true);
    } catch {
      alert("Помилка відправки заявки");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 shadow-2xl">
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {applyType === "want_work"
                ? "🟢 Хочу тут працювати"
                : "💬 Дізнатися деталі"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{vacancy.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            ✕
          </button>
        </div>

        {sent ? (
          <div className="px-6 py-16 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="font-semibold text-slate-500 mb-2">
              Заявка відправлена!
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Рекрутер зв'яжеться з вами найближчим часом.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-medium text-sm rounded-lg transition-colors"
            >
              Закрити
            </button>
          </div>
        ) : (
          <>
            <div className="px-6 py-5 space-y-4">
              <Field
                label="Ім'я та прізвище *"
                value={form.name}
                onChange={(v) => setField("name", v)}
                placeholder="Іван Іванов"
              />

              <Divider label="📞 Спосіб зв'язку" />
              <div>
                <label className="block text-xs text-slate-500 mb-2">
                  Як з вами зв'язатися? *
                </label>
                <div className="flex gap-2 mb-3">
                  {["telegram", "viber", "phone"].map((ct) => (
                    <button
                      key={ct}
                      onClick={() => setField("contactType", ct)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                        form.contactType === ct
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {ct === "telegram"
                        ? "✈️ Telegram"
                        : ct === "viber"
                          ? "📱 Viber"
                          : "📞 Телефон"}
                    </button>
                  ))}
                </div>
                {form.contactType === "telegram" ? (
                  <Field
                    label="Telegram username *"
                    value={form.telegram}
                    onChange={(v) => setField("telegram", v)}
                    placeholder="@username"
                  />
                ) : (
                  <Field
                    label="Номер телефону *"
                    value={form.phone}
                    onChange={(v) => setField("phone", v)}
                    placeholder="+380XXXXXXXXX"
                  />
                )}
              </div>

              <Divider label="👤 Особисті дані" />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Національність"
                  value={form.nationality}
                  onChange={(v) => setField("nationality", v)}
                  placeholder="Україна"
                />
                <Field
                  label="Де зараз перебуваєте"
                  value={form.currentLocation}
                  onChange={(v) => setField("currentLocation", v)}
                  placeholder="Київ"
                />
                <Field
                  label="Вік *"
                  value={form.age}
                  type="number"
                  onChange={(v) => setField("age", v)}
                  placeholder="25"
                />
                <div>
                  <label className="block text-xs text-slate-500 mb-2">
                    Стать
                  </label>
                  {/* 👈 ВЫПРАЎЛЕНА: было values "male"/"female" — не супадалі з enum мадэлі Candidate.gender ["Чоловіки","Жінки","Пари","Сім'ї"], захаванне ў базе адхілялася б */}
                  <div className="flex gap-2 flex-wrap">
                    {MD.GENDERS.map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => setField("gender", g.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                          form.gender === g.value
                            ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Divider label="🔍 Побажання до роботи" />
              <div>
                <label className="block text-xs text-slate-500 mb-2">
                  Регіон пошуку роботи (Воєводство)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setField("jobPreferences.locationFlexible", !form.jobPreferences.locationFlexible)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                      form.jobPreferences.locationFlexible
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    ✈️ Будь-який регіон
                  </button>
                  {MD.VOIVODESHIPS.map((vov) => (
                    <button
                      key={vov.value}
                      type="button"
                      onClick={() => toggleArrayPref("voivodeship", vov.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                        form.jobPreferences.voivodeship.includes(vov.value)
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {vov.label}
                    </button>
                  ))}
                </div>
                <Field
                  label="Уточнення локації (напр. конкретне місто)"
                  value={form.jobPreferences.locationNotes}
                  onChange={(v) => setField("jobPreferences.locationNotes", v)}
                  placeholder="Наприклад: Wrocław..."
                />
              </div>
 {/* 👈 НОВАЕ: секцыя Сфера, ідэнтычна AddCandidateModal.jsx/EditCandidateModal.jsx (MD.CATEGORIES) */}
              <div>
                <label className="block text-xs text-slate-500 mb-2">Сфера</label>
                <div className="flex flex-wrap gap-2">
                  {MD.CATEGORIES.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => toggleArrayPref("spheres", s.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                        form.jobPreferences.spheres.includes(s.value)
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Коли готові приступити"
                  value={form.jobPreferences.readyDate}
                  type="date"
                  onChange={(v) => setField("jobPreferences.readyDate", v)}
                />
                <Field
                  label="Нюанси щодо дати"
                  value={form.jobPreferences.readyDateNotes}
                  onChange={(v) => setField("jobPreferences.readyDateNotes", v)}
                  placeholder="Напр. 'можна раніше'"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-2">Житло</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ["needed", "🏠 Потрібне житло"],
                      ["forCouples", "👫 Для пар"],
                      ["withChildren", "👨‍👩‍👧 З дітьми"],
                      ["freeOnly", "🆓 Тільки безкоштовне"],
                    ].map(([key, lbl]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setField(`jobPreferences.accommodation.${key}`, !form.jobPreferences.accommodation[key])}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                          form.jobPreferences.accommodation[key]
                            ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-2">Транспорт</label>
                  <div className="flex gap-2">
                    {[
                      ["true", "🚌 Потрібен довіз"],
                      ["false", "❌ Не потрібен"],
                    ].map(([val, lbl]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setField("jobPreferences.transport.needed", val === "true")}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                          String(form.jobPreferences.transport.needed) === val
                            ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-2">Графік та години</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setField("jobPreferences.onlyDayShifts", !form.jobPreferences.onlyDayShifts)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                      form.jobPreferences.onlyDayShifts
                        ? "bg-blue-600 border-blue-600 text-white shadow-md"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    ☀️ Тільки день
                  </button>
                  {MD.HOURS_RANGE_OPTIONS.map((h) => (
                    <button
                      key={h.value}
                      type="button"
                      onClick={() => toggleArrayPref("hoursRange", h.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                        form.jobPreferences.hoursRange.includes(h.value)
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-2">Рівень польської</label>
                <div className="flex flex-wrap gap-2">
                  {MD.LANGUAGES.map((l) => (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => setField("jobPreferences.polishLanguageLevel", l.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        form.jobPreferences.polishLanguageLevel === l.value
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-50 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-2">
                  Тип договору
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    ["zlecenie", "Umowa zlecenie"],
                    ["o_prace", "Umowa o pracę"],
                    ["any", "Будь-який"],
                  ].map(([val, lbl]) => (
                    <button
                      key={val}
                      onClick={() =>
                        setField("jobPreferences.contractType", val)
                      }
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                        form.jobPreferences.contractType === val
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
              <Divider label="🌡 Нюанси (Чек-лист)" />
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {MD.CHECKLIST_ITEMS.map((n) => (
                    <button
                      key={n.value}
                      type="button"
                      onClick={() => toggleArrayPref("nuances", n.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                        form.jobPreferences.nuances.includes(n.value)
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {n.label}
                    </button>
                  ))}
                </div>
                <Field
                  label="Додаткові нюанси (вільний текст)"
                  value={form.jobPreferences.nuancesNotes}
                  onChange={(v) => setField("jobPreferences.nuancesNotes", v)}
                  placeholder="Якщо є нюанси, яких немає у списку..."
                />
              </div>
            </div>

            <div className="flex gap-4 px-8 py-5 border-t border-slate-100 sticky bottom-0 bg-white/95 backdrop-blur-md z-10">
              <button
                onClick={handleSubmit}
                disabled={sending}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-medium text-sm rounded-lg transition-colors"
              >
                {sending ? "Відправка..." : "Відправити заявку"}
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-700 text-slate-500 text-sm rounded-lg transition-colors"
              >
                Скасувати
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
--------------
// frontend/src/components/candidates/ProfileModal.jsx
import { useEffect, useState } from "react";
import {
  getCandidate,
  updateCandidate,
  addCandidateHistory,
  matchVacanciesForCandidate,
} from "../../services/api";
import Divider from "../shared/Divider";
import EditCandidateModal from "./EditCandidateModal";
import * as MD from "../../constants/masterData"; 

const STATUS_COLORS = {
  new: "bg-blue-50 text-blue-600 border-blue-200",
  active: "bg-emerald-50 text-emerald-600 border-emerald-200",
  waiting: "bg-yellow-50 text-yellow-700 border-yellow-200",
  employed: "bg-purple-50 text-purple-600 border-purple-200",
  left: "bg-slate-50 text-slate-500 border-slate-200",
  blacklist: "bg-red-50 text-red-600 border-red-200",
};

const STATUS_LABELS = {
  new: "Новий",
  active: "Активний",
  waiting: "Очікує",
  employed: "Працюе",
  left: "Звільнився",
  blacklist: "Чорний список",
};

export default function ProfileModal({ candidateId, onClose, onUpdate }) {
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [matchedVacancies, setMatchedVacancies] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);

  const handleMatch = async () => {
    setMatchLoading(true);
    try {
      const res = await matchVacanciesForCandidate(candidate._id);
      setMatchedVacancies(res.data);
    } catch {
      alert("Помилка матчингу");
    } finally {
      setMatchLoading(false);
    }
  };
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getCandidate(candidateId);
        setCandidate(res.data);
      } catch {
        console.error("Помилка завантаження профілю");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [candidateId]);

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await updateCandidate(candidate._id, { status: newStatus });
      setCandidate(res.data);
      onUpdate(res.data);
      setEditStatus(false);
    } catch {
      alert("Помилка зміни статусу");
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setAddingNote(true);
    try {
      const res = await addCandidateHistory(candidate._id, {
        type: "note",
        text: newNote,
      });
      setCandidate(res.data);
      setNewNote("");
    } catch {
      alert("Помилка додавання нотатки");
    } finally {
      setAddingNote(false);
    }
  };

  const handleSaveEdit = (updated) => {
    setCandidate(updated);
    onUpdate(updated);
    setShowEdit(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 shadow-2xl">
          {/* Загаловак */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
            <h2 className="font-bold text-slate-900">Профіль кандидата</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors"
              >
                ✏️ Редагувати
              </button>
              <button
                onClick={handleMatch}
                disabled={matchLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
              >
                🎯 {matchLoading ? "Пошук..." : "Вакансії"}
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">Завантаження...</div>
          ) : !candidate ? (
            <div className="p-8 text-center text-slate-500">Не знайдено</div>
          ) : (
            <div className="px-6 py-5 space-y-5">
              {/* Асноўная інфа */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {candidate.name}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-500">
                    {candidate.contactType === "telegram" &&
                      candidate.telegram && (
                        <span>✈️ {candidate.telegram}</span>
                      )}
                    {(candidate.contactType === "viber" ||
                      candidate.contactType === "phone") &&
                      candidate.phone && <span>📞 {candidate.phone}</span>}
                    {candidate.nationality && (
                      <span>🌍 {candidate.nationality}</span>
                    )}
                    {candidate.currentLocation && (
                      <span>📍 {candidate.currentLocation}</span>
                    )}
                     {candidate.age && <span>🎂 {candidate.age} р.</span>}
                    {candidate.gender && (
                      <span>
                        {candidate.gender === "Жінки" ? "👩 Жінка" : 
                         candidate.gender === "Чоловіки" ? "👨 Чоловік" : 
                         candidate.gender === "Пари" ? "👫 Пара" : "👨‍👩‍👧 Сім'я"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Статус */}
                <div className="shrink-0">
                  {editStatus ? (
                    <div className="flex flex-col gap-1">
                      {Object.entries(STATUS_LABELS).map(([val, lbl]) => (
                        <button
                          key={val}
                          onClick={() => handleStatusChange(val)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors text-left ${
                            candidate.status === val
                              ? "bg-emerald-500 text-slate-900"
                              : "bg-slate-50 text-slate-700 hover:bg-slate-700"
                          }`}
                        >
                          {lbl}
                        </button>
                      ))}
                      <button
                        onClick={() => setEditStatus(false)}
                        className="text-xs text-slate-600 mt-1 text-center"
                      >
                        Скасувати
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditStatus(true)}
                      className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer ${STATUS_COLORS[candidate.status]}`}
                    >
                      {STATUS_LABELS[candidate.status]} ▾
                    </button>
                  )}
                </div>
              </div>

              {/* Мета-інфа */}
              <div className="flex gap-4 text-xs text-slate-600">
                <span>
                  📅{" "}
                  {new Date(candidate.createdAt).toLocaleString("uk-UA", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span>
                  {candidate.source === "site" ? "🌐 Тікток" : 
 candidate.source === "telegram_bot" ? "✈️ Telegram" : 
 candidate.source === "referral" ? "🤝 Рекомендація" : "✋ Ручний"}
                </span>
              </div>

              {/* Нататкі рэкрутэра */}
              {candidate.notes && (
                <>
                  <Divider label="📝 Нататкі" />
                  <p className="text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2">
                    {candidate.notes}
                  </p>
                </>
              )}
{/* AI Аналіз пажаданняў */}
{candidate.additionalNotesTags?.length > 0 && (
  <>
    <Divider label="🤖 AI Аналіз пажаданняў" />
    <div className="flex flex-wrap gap-2">
      {candidate.additionalNotesTags.map((tag, i) => (
        <span key={i} className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg font-bold uppercase tracking-wider border border-emerald-500/20">
          {tag}
        </span>
      ))}
    </div>
  </>
)}
              {/* Побажання */}
              {candidate.jobPreferences && ( 
                <>
                  <Divider label="🔍 Побажання да роботи" />
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    {/* Локація */}
                    <div className="text-slate-600">
                      <div className="flex items-center gap-2">
                        📍 <span className="font-medium">Регіон:</span> {
                          candidate.jobPreferences.locationFlexible 
                            ? "Будь-який (Польща)" 
                            : (candidate.jobPreferences.voivodeship?.join(", ") || "Не вказано")
                        }
                      </div>
                      {candidate.jobPreferences.locationNotes && (
                        <div className="ml-6 text-xs italic text-slate-400">
                          — {candidate.jobPreferences.locationNotes}
                        </div>
                      )}
                    </div>

                    {/* Дата гатоўнасці */}
                    {candidate.jobPreferences.readyDate && (
                      <div className="text-slate-600">
                        <div className="flex items-center gap-2">
                          📅 <span className="font-medium">Готовий з:</span> {new Date(candidate.jobPreferences.readyDate).toLocaleDateString('uk-UA')}
                        </div>
                        {candidate.jobPreferences.readyDateNotes && (
                          <div className="ml-6 text-xs italic text-slate-400">
                            — {candidate.jobPreferences.readyDateNotes}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Житло і Транспорт */}
                    <div className="flex flex-wrap gap-4">
                      {candidate.jobPreferences.accommodation?.needed && (
                        <div className="text-slate-600 flex items-center gap-1">
                          🏠 <span className="font-medium">Потрібне житло</span>
                          {candidate.jobPreferences.accommodation.freeOnly && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-bold ml-1">FREE</span>}
                          {(candidate.jobPreferences.accommodation.forCouples || candidate.jobPreferences.accommodation.withChildren) && (
                            <span className="text-slate-400 text-xs">
                              ({[
                                candidate.jobPreferences.accommodation.forCouples ? "пари" : null,
                                candidate.jobPreferences.accommodation.withChildren ? "з дітьми" : null
                              ].filter(Boolean).join(", ")})
                            </span>
                          )}
                        </div>
                      )}
                      {candidate.jobPreferences.transport?.needed && (
                        <div className="text-slate-600 flex items-center gap-1">
                          🚌 <span className="font-medium">Потрібен довіз</span>
                        </div>
                      )}
                    </div>

                    {/* Графік і Мова */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {candidate.jobPreferences.hoursRange?.length > 0 && (
                        <div className="text-slate-600">
                          ⏰ <span className="font-medium">Годин:</span> {candidate.jobPreferences.hoursRange.join(", ")}
                          {candidate.jobPreferences.onlyDayShifts && <span className="ml-2 text-blue-500">☀️ Тільки день</span>}
                        </div>
                      )}
                      {candidate.jobPreferences.polishLanguageLevel && (
                        <div className="text-slate-600">
                          🗣️ <span className="font-medium">Польська:</span> {candidate.jobPreferences.polishLanguageLevel}
                        </div>
                      )}
                    </div>

                    {/* Нюансы */}
                    {(candidate.jobPreferences.nuances?.length > 0 || candidate.jobPreferences.nuancesNotes) && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Особливості / Нюанси</p>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {candidate.jobPreferences.nuances?.map(n => {
  const found = MD.CHECKLIST_ITEMS.find(item => item.value === n);
  return (
    <span key={n} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600 font-medium">
      {found ? found.label : n}
    </span>
  );
})}
                        </div>
                        {candidate.jobPreferences.nuancesNotes && (
                          <p className="text-xs text-slate-500 italic">{candidate.jobPreferences.nuancesNotes}</p>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
                

              {/* Документи */}
              {candidate.documents?.activeDocs?.length > 0 && (
                <>
                  <Divider label="📄 Документи" />
                  <div className="flex gap-2 flex-wrap">
                    {candidate.documents.activeDocs.map((doc) => (
                      <span
                        key={doc}
                        className="text-xs px-2 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                      >
                        ✅ {doc}
                      </span>
                    ))}
                  </div>
                </>
              )}

             {/* Заявки на вакансії */}
              {candidate.appliedVacancies?.length > 0 && (
                <>
                  <Divider label="💼 Заявки на вакансії" />
                  <div className="space-y-2">
                    {candidate.appliedVacancies.map((av, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-sm"
                      >
                        <span className="text-slate-700 font-medium">
                          {av.type === "want_work"
                            ? "🟢 Хоче працювати"
                            : "💬 Хоче деталі"}
                        </span>
                        {(av.vacancyId?.vacancydescription || av.vacancyId?.title) && (
                          <span className="text-slate-500 ml-2">
                            — {av.vacancyId.vacancydescription || av.vacancyId.title}
                          </span>
                        )}
                        {av.vacancyId?.vacancyCode && (
                          <span className="text-slate-400 ml-2 font-mono text-xs">
                            ({av.vacancyId.vacancyCode})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
                {/* Матчинг вакансій */} 
              {matchedVacancies !== null && (
                <>
                  <Divider label="🎯 Відповідні вакансії" />
                  {matchedVacancies.length === 0 ? (
                    <p className="text-xs text-slate-400 italic px-2">
                      Відповідних вакансій не знайдено
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {matchedVacancies.map((v) => (
                        <div
                          key={v._id}
                          className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-slate-900 font-bold">
                                {v.vacancydescription || v.title}
                              </span>
                              {v.vacancyCode && (
                                <span className="text-xs font-mono text-slate-400 ml-2">
                                  ({v.vacancyCode})
                                </span>
                              )}
                            </div>
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                              ⭐ {v.matchScore}
                            </span>
                          </div>
                          <div className="flex gap-3 mt-1 text-xs text-slate-500">
                            <span>📍 {v.location}</span>
                            {v.agencyName && <span>🏢 {v.agencyName}</span>}
                            {/* 👈 ВЫПРАЎЛЕНА: base -> baseNetto (згодна з мадэллю Vacancy) */}
                            {v.salary?.baseNetto && <span>💰 {v.salary.baseNetto}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
                   
              {/* Історія */}
              <Divider label="🗂 Історія спілкування" />
              <div className="space-y-2 mb-3">
                {!candidate.history?.length ? (
                  <p className="text-xs text-slate-400 italic">Історія порожня</p>
                ) : (
                  [...candidate.history].reverse().map((h, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-400">
                          {new Date(h.date).toLocaleString("uk-UA", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase">
                          {h.type === "call"
                            ? "📞 Дзвінок"
                            : h.type === "chat"
                              ? "💬 Чат"
                              : "📝 Нотатка"}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700">{h.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Додати нотатку */}
              <div className="flex gap-2">
                <input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                  placeholder="Додати нотатку..."
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
                />
                <button
                  onClick={handleAddNote}
                  disabled={addingNote || !newNote.trim()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-medium text-sm rounded-lg transition-colors"
                >
                  Додати
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Модалка редагування */}
      {showEdit && candidate && (
        <EditCandidateModal
          candidate={candidate}
          onClose={() => setShowEdit(false)}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
}
