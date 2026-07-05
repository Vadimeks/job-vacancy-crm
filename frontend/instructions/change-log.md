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
--------------
import { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  getVacancies,
  getTemplates,
  deleteVacancy,
  createVacancyAuto,
  createVacancyFromTemplate,
  aiUpdateVacancy,
  toggleFavoriteVacancy,
  bulkDeleteVacancies,
  syncAgency,
  getSyncProgress, // 👈 Дададзена
  stopSync,        // 👈 Дададзена
} from "../services/api";
import EditVacancyModal from "../components/vacancies/EditVacancyModal";
import ApplyModal from "../components/vacancies/ApplyModal";
import VacancyMatchModal from "../components/vacancies/VacancyMatchModal";
import VacancyViewModal from "../components/vacancies/VacancyViewModal";
import VacancyFilters from "../components/vacancies/VacancyFilters";
import BulkPublishModal from "../components/vacancies/BulkPublishModal";
import { EMPTY_FILTERS } from "../constants/filters";
import * as MD from "../constants/masterData";
import VacancyMap from "../components/vacancies/VacancyMap";

const STATUS_COLORS = {
  active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  closed: "bg-red-500/10 text-red-400 border border-red-500/20",
  archived: "bg-slate-500/10 text-slate-500 border border-slate-100/20",
};

const STATUS_LABELS = {
  active: "Активна",
  closed: "Закрита",
  archived: "Архів",
};

// 1. Поўная і карэктная функцыя фільтрацыі
function applyFilters(vacancies, filters) {
  if (!vacancies) return [];

  return vacancies.filter((v) => {
    if (filters.isFavorite && !v.isFavorite) return false;
    // --- 1. Пошук ---
    if (filters.search) {
      const s = filters.search.toLowerCase();
      const matchSearch =
        v.templateName?.toLowerCase().includes(s) ||
        v.vacancydescription?.toLowerCase().includes(s) ||
        v.location?.toLowerCase().includes(s) ||
        v.agencyName?.toLowerCase().includes(s) ||
        v.brand?.toLowerCase().includes(s) ||
        v.vacancyCode?.toLowerCase().includes(s);
      if (!matchSearch) return false;
    }

    // --- 2. Статус і Катэгорыя ---
    if (filters.status?.length > 0 && !filters.status.includes(v.status))
      return false;
    if (filters.category?.length > 0 && !filters.category.includes(v.category))
      return false;

    // --- 3. Ваяводства / Рэгіён (ФІКС: Польшча і Еўропа) ---
    if (filters.voivodeship?.length > 0) {
      const vVoiv = v.voivodeship || "";
      const vCountry = v.country || "Polska";
      const isEurope = vCountry !== "Polska";

      const match = filters.voivodeship.some((fv) => {
        // 1. Калі выбрана "Польшча" — паказваем усё, дзе краіна Polska
        if (fv === "Польща") return vCountry === "Polska";

        // 2. Калі выбрана "Еўропа" — паказваем усё, што не Polska
        if (fv === "Інші країни Європи") return isEurope;

        // 3. Для канкрэтных ваяводстваў правяраем уваходжанне ў радок (для спісаў праз коску)
        return vVoiv.toLowerCase().includes(fv.toLowerCase());
      });

      if (!match) return false;
    }

    // --- 4. Лакацыя (ФІКС: Замежныя гарады з дужкамі) ---
    if (filters.location?.length > 0) {
      const vLocs = v.location.split(",").map((loc) => {
        let clean = loc.trim();
        // Калі гэта замежжа, прыводзім да фармату "City (Country)" для супадзення з фільтрам
        if (v.country && v.country !== "Polska" && !clean.includes("(")) {
          return `${clean} (${v.country})`.toLowerCase();
        }
        return clean.toLowerCase();
      });

      const match = filters.location.some((fl) =>
        vLocs.includes(fl.toLowerCase()),
      );
      if (!match) return false;
    }
// --- 5.0. Бяскоштаўнае жытло (Quick Toggle) ---
    if (filters.freeHousing && !v.accommodation?.isFree) {
      return false;
    }
    // --- 5. Жыллё ---
    if (filters.accommodation?.length > 0) {
      const accType = (v.accommodation?.type || "").toLowerCase();
      const isCouples = !!v.accommodation?.forCouples;
      const match = filters.accommodation.some((fa) => {
        if (fa === "provided") return accType && !accType.includes("власн");
        if (fa === "couples") return isCouples;
        if (fa === "none")
          return accType.includes("власн") || accType.includes("не надаєт");
        return false;
      });
      if (!match) return false;
    }

    // --- 6. Транспарт ---
    if (filters.transport?.length > 0) {
      const hasTransport = !!v.transport?.provided;
      const match = filters.transport.some((ft) =>
        ft === "provided" ? hasTransport : !hasTransport,
      );
      if (!match) return false;
    }

    // --- 7. Хто їде (Gender) ---
    if (filters.gender?.length > 0) {
      const vGenders = v.requirements?.gender || [];
      // Калі хаця б адзін выбраны гендэр ёсць у масіве вакансіі
      const match = filters.gender.some((fg) => vGenders.includes(fg));
      if (!match) return false;
    }

    // --- 8. Мова ---
    if (filters.language?.length > 0) {
      const vLang = v.requirements?.polishLanguageLevel || "Не вимагається";
      if (!filters.language.includes(vLang)) return false;
    }

    // --- 9. Нацыянальнасць ---
    if (filters.nationality?.length > 0) {
      const vNats =
        Array.isArray(v.requirements?.nationalities) &&
        v.requirements.nationalities.length > 0
          ? v.requirements.nationalities
          : ["Україна"];
      if (!filters.nationality.some((fn) => vNats.includes(fn))) return false;
    }

    // --- 10. Дакументы ---
    if (filters.docs?.length > 0) {
      const vDocs = v.requirements?.standardDocs || [];
      if (!filters.docs.some((d) => vDocs.includes(d))) return false;
    }

    // --- 11. Асаблівасці (ФІКС: па катэгорыях) ---
    if (filters.nuances?.length > 0) {
      const vNuances = v.conditions?.specificNuances || [];
      const hasMatch = filters.nuances.some((fn) =>
        vNuances.some((vn) => {
          const vnCat =
            typeof vn === "object" && vn !== null ? vn.category : vn;
          return vnCat === fn; // Дакладнае супадзенне катэгорыі
        }),
      );
      if (!hasMatch) return false;
    }

    // --- 12. Агенцыя і Брэнд ---
    if (
      filters.agencyName?.length > 0 &&
      !filters.agencyName.includes(v.agencyName)
    )
      return false;
    if (filters.brand?.length > 0) {
      const match = filters.brand.some((fb) => {
        if (fb === "NO BRAND") return !v.brand || v.brand === "БРЕНДОВИЙ ОДЯГ";
        return v.brand === fb;
      });
      if (!match) return false;
    }
    // 🆕 КРОПКАВАЕ ДАДАННЕ (v4.1): Фільтр па крыніцах (sourceType)
    if (
      filters.sourceType?.length &&
      !filters.sourceType.includes(v.sourceType || "manual")
    )
      return false;
    // 👈 ДАДАДЗЕНА: Фільтр па тыпу дагавору (case-insensitive)
    if (filters.contractType?.length > 0) {
      const ct = (v.contractType || "").toLowerCase();
      const match = filters.contractType.some((fc) => {
        if (fc === "zlecenie") return ct.includes("zlecenie");
        if (fc === "oprace") return ct.includes("o prac");
        if (fc === "null") return !v.contractType;
        return false;
      });
      if (!match) return false;
    }
  if (filters.onlyDayShifts && !v.schedule?.onlyDayShifts) {
      return false;
    }
    // 👈 ДАДАДЗЕНА: Фільтр па гадзінах у месяц (парсінг hoursRange)
    if (filters.hoursRange?.length > 0) {
      // Парсім першую лічбу з радка: "210-270"→210, "240+"→240, "170–220"→170
      const raw = v.salary?.hoursRange || "";
      const parsed = raw.replace("–", "-").match(/(\d+)/);
      const minH = parsed ? parseInt(parsed[1]) : null;

      const match = filters.hoursRange.some((fh) => {
        if (fh === "low") return minH !== null && minH < 170;
        if (fh === "mid") return minH !== null && minH >= 170 && minH <= 220;
        if (fh === "high") return minH !== null && minH > 220;
        if (fh === "unknown") return minH === null;
        return false;
      });
      if (!match) return false;
    }
    // --- 13. Зарплата (Лічбавы фільтр) ---
    const fMinSal =
      filters.minSalary !== "" ? parseFloat(filters.minSalary) : null;
    const fMaxSal =
      filters.maxSalary !== "" ? parseFloat(filters.maxSalary) : null;
    const vSal = v.salary?.baseNetto; // Можа быць лічбай або null

    if (fMinSal !== null || fMaxSal !== null) {
      // Калі ў вакансіі няма лічбавай ЗП, а мы фільтруем — хаваем яе
      if (vSal === null || vSal === undefined || isNaN(vSal)) return false;
      if (fMinSal !== null && vSal < fMinSal) return false;
      if (fMaxSal !== null && vSal > fMaxSal) return false;
    }

    // --- 14. Узрост (Лічбавы фільтр па maxAge) ---
    const fMinAge = filters.minAge !== "" ? parseFloat(filters.minAge) : null;
    const fMaxAge = filters.maxAge !== "" ? parseFloat(filters.maxAge) : null;
    // 🆕 КРОПКАВАЕ ДАДАННЕ (v4.6): Строгая фільтрацыя па updatedAt
    if (filters.startDate) {
      const start = new Date(filters.startDate);
      start.setHours(0, 0, 0, 0);
      const vDate = new Date(v.updatedAt || v.createdAt).getTime();
      if (vDate < start.getTime()) return false;
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      const vDate = new Date(v.updatedAt || v.createdAt).getTime();
      if (vDate > end.getTime()) return false;
    }
    const vAge = v.requirements?.age?.max; // Можа быць лічбай або null

    if (fMinAge !== null || fMaxAge !== null) {
      // Калі ў вакансіі няма ўзросту, а мы фільтруем — хаваем яе
      if (vAge === null || vAge === undefined || isNaN(vAge)) return false;
      if (fMinAge !== null && vAge < fMinAge) return false;
      if (fMaxAge !== null && vAge > fMaxAge) return false;
    }
    // --- 15. Крыніца (Source Type) ---
    if (
      filters.sourceType?.length > 0 &&
      !filters.sourceType.includes(v.sourceType)
    ) {
      return false;
    }
    return true;
  });
}

export default function Vacancies() {
  const location = useLocation(); // Дадалі
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [syncing, setSyncing] = useState(false); // 👈 ДАДАДЗЕНА: стан ручнога сканавання
  
  const [progress, setProgress] = useState({ current: 0, total: 0, status: 'idle' }); // 👈 Дададзена
  const [syncStatusMsg, setSyncStatusMsg] = useState({ text: "", type: "" }); // type: 'success' або 'error'
  // --- Рэгуляваны сайдбар (v4.5) ---
  const [sidebarWidth, setSidebarWidth] = useState(320); // Пачатковая шырыня 320px (w-80)
  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const onMouseMove = (moveEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      // Абмежаванні: мінімум 280px, максімум 450px
      if (newWidth >= 280 && newWidth <= 450) {
        setSidebarWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };
  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length && filtered.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((v) => v._id));
    }
  };
  const handleBulkDelete = async () => {
    if (!window.confirm(`Видалити ${selectedIds.length} вакансій?`)) return;
    try {
      await bulkDeleteVacancies(selectedIds);
      setVacancies((prev) => prev.filter((v) => !selectedIds.includes(v._id)));
      setSelectedIds([]);
    } catch (err) {
      alert("Помилка масового видалення");
    }
  };
  // -----------------------

  const [vacancies, setVacancies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [autoText, setAutoText] = useState("");
  const [autoLoading, setAutoLoading] = useState(false);
  const [showAutoForm, setShowAutoForm] = useState(false);
  const [formMode, setFormMode] = useState("auto");

  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState("");
  const [templateSearch, setTemplateSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [editVacancy, setEditVacancy] = useState(null);
  const [applyVacancy, setApplyVacancy] = useState(null);
  const [matchVacancy, setMatchVacancy] = useState(null);
  const [viewVacancy, setViewVacancy] = useState(null);
  const [vacancySearch, setVacancySearch] = useState("");
  const [selectedVacancyForUpdate, setSelectedVacancyForUpdate] =
    useState(null);
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  // Па змаўчанні паказваем і актыўныя, і закрытыя вакансіі
  const [applied, setApplied] = useState({
    ...EMPTY_FILTERS,
    status: ["active", "closed"],
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sourceMessageId, setSourceMessageId] = useState(null);
  const notifyUpdate = () => {
    window.dispatchEvent(new CustomEvent("inboxUpdated"));
  };
  useEffect(() => {
    if (location.state && location.state.initialText) {
      setShowAutoForm(true);
      setFormMode("auto");
      setAutoText(location.state.initialText);
      setSourceMessageId(location.state.messageId); // Захоўваем ID
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchVacancies = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const res = await getVacancies(params);
      setVacancies(res.data || []);
    } catch (err) {
      console.error("Помилка при завантаженні вакансій:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Калі ўсе фільтры пустыя (скінуты), аўтаматычна прымяняем іх
    if (JSON.stringify(draft) === JSON.stringify(EMPTY_FILTERS)) {
      setApplied(EMPTY_FILTERS);
    }
  }, [draft]);
  // Калі змяняюцца актыўныя зафіксаваныя фільтры — адпраўляем даты на сервер для аптымізацыі
  useEffect(() => {
    const params = {
      // Бярэм даты з draft, каб previewCount заўсёды меў свежыя дадзеныя з сервера
      startDate: draft.startDate || undefined,
      endDate: draft.endDate || undefined,
     onlyDayShifts: draft.onlyDayShifts || undefined,
      status: applied.status?.join(","),
      agency: applied.agencyName?.join(","),
      category: applied.category?.join(","),
    };
    fetchVacancies(params);
  }, [
    fetchVacancies,
    applied.status,
    applied.agencyName,
    applied.category,
    draft.startDate,
    draft.endDate,
    draft.onlyDayShifts,
  ]);

  useEffect(() => {
    if (showAutoForm && formMode === "template" && templates.length === 0) {
      setTemplatesLoading(true);
      getTemplates()
        .then((res) => setTemplates(res.data))
        .catch(() => console.error("Памылка загрузкі шаблонаў"))
        .finally(() => setTemplatesLoading(false));
    }
  }, [showAutoForm, formMode, templates.length]);

  const handleToggleFavorite = async (id) => {
    try {
      const res = await toggleFavoriteVacancy(id);
      // Аптымістычна абнаўляем лакальны спіс вакансій
      setVacancies((prev) =>
        prev.map((v) =>
          v._id === id ? { ...v, isFavorite: res.data.isFavorite } : v,
        ),
      );
    } catch (err) {
      console.error("Памылка пераключэння абранага:", err);
    }
  };
// 👈 ДADADЗЕНА: ручны запуск сканавання для выбранай агенцыі
 const handleManualSync = async () => {
    const selectedAgencies = draft.agencyName;
    if (!selectedAgencies?.length) return;
    
    const label = selectedAgencies.length === 1 ? selectedAgencies[0] : `${selectedAgencies.length} агенцій`;
    if (!window.confirm(`Запусціць сканавання для ${label}?`)) return;
    
    setSyncStatusMsg({ text: "", type: "" }); // 👈 Чысцім старое
    setSyncing(true);
    try {
      await syncAgency(selectedAgencies);
      // alert выдалены 👈
    } catch (err) {
      setSyncStatusMsg({ text: "❌ Помилка запуску. Спробуйте пізніше.", type: "error" });
      setSyncing(false);
    }
  };
const handleStopSync = async () => {
    if (!window.confirm("Спыніць сінхранізацыю?")) return;
    try {
      await stopSync();
    } catch (err) {
      console.error("Памылка прыпынку:", err);
    }
  };

 useEffect(() => {
    let interval;
    if (syncing) {
      interval = setInterval(async () => {
        try {
          const res = await getSyncProgress();
          setProgress(res.data);
          
          // 1. Поспех (прайшлі ўсё да канца)
          if (res.data.status === 'idle') {
            setSyncing(false);
            setSyncStatusMsg({ text: "✅ Сканування завершено!", type: "success" });
            clearInterval(interval);
            await fetchVacancies();
          }
          
          // 2. Ліміты AI (спынена аўтаматычна)
          else if (res.data.status === 'limit') {
            setSyncing(false);
            setSyncStatusMsg({ text: "⚠️ Ліміти AI вичерпано. Спробуйте пізніше.", type: "error" });
            clearInterval(interval);
            await fetchVacancies();
          }

          // 3. Прыпынак карыстальнікам (націснута кнопка СТОП)
          else if (res.data.status === 'interrupted') {
            setSyncing(false);
            setSyncStatusMsg({ text: "🛑 Сканування зупинено користувачем.", type: "error" });
            clearInterval(interval);
            await fetchVacancies();
          }

          // 4. Тэхнічная памылка (краш сервера або базы)
          else if (res.data.status === 'error') {
            setSyncing(false);
            setSyncStatusMsg({ text: "❌ Сталася технічна помилка сервера.", type: "error" });
            clearInterval(interval);
          }
        } catch (e) { 
          console.error(e);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [syncing, fetchVacancies]);
  // 1. Вакансіі, адфільтраваныя ТОЛЬКІ па датах і пошуку (Кантэкст для фільтраў)
  const instantFiltered = useMemo(() => {
    return vacancies.filter((v) => {
      // Пошук
      if (draft.search) {
        const s = draft.search.toLowerCase();
        const match =
          v.templateName?.toLowerCase().includes(s) ||
          v.vacancydescription?.toLowerCase().includes(s) ||
          v.vacancyCode?.toLowerCase().includes(s);
        if (!match) return false;
      }
      // Даты
      const vDate = new Date(v.updatedAt || v.createdAt).getTime();
      if (draft.startDate) {
        const start = new Date(draft.startDate).setHours(0, 0, 0, 0);
        if (vDate < start) return false;
      }
      if (draft.endDate) {
        const end = new Date(draft.endDate).setHours(23, 59, 59, 999);
        if (vDate > end) return false;
      }
      return true;
    });
  }, [vacancies, draft.startDate, draft.endDate, draft.search]);
  // 2. Абнаўляем dynamicData: цяпер яно глядзіць толькі на instantFiltered
  const dynamicData = useMemo(() => {
    const agencies = new Set();
    const brands = new Set();
    const locations = new Set();
     // 👈 ВЫДАЛЕНА: const voivodeships = new Set(); — цяпер бярэм гатовы хардкодны спіс з MD.VOIVODESHIPS, дынамічны збор не патрэбны
    const nuances = new Set();

    const VOIV_LIST = [
      "Dolnośląskie",
      "Kujawsko-Pomorskie",
      "Lubelskie",
      "Lubuskie",
      "Łódzkie",
      "Małopolskie",
      "Mazowieckie",
      "Opolskie",
      "Podkarpackie",
      "Podlaskie",
      "Pomorskie",
      "Śląskie",
      "Świętokrzyskie",
      "Warmińsko-Mazurskie",
      "Wielkopolskie",
      "Zachodniopomorskie",
    ].map((v) => v.toLowerCase());

    const EUROPE_LABEL = "Інші країни Європи";
    const sourceTypes = new Set(); // 👈 Дададзена
    // ВАЖНА: Цяпер бярэм дадзеныя з instantFiltered замест vacancies
    instantFiltered.forEach((v) => {
      if (v.agencyName) agencies.add(v.agencyName);
      if (v.sourceType) sourceTypes.add(v.sourceType);

      if (v.brand && v.brand !== "БРЕНДОВИЙ ОДЯГ") {
        brands.add(v.brand.toUpperCase().trim());
      } else {
        brands.add("NO BRAND");
      }

      if (v.location) {
        v.location.split(",").forEach((loc) => {
          let clean = loc.trim();
          const lowClean = clean.toLowerCase();
          if (v.country && v.country !== "Polska" && !clean.includes("(")) {
            clean = `${clean} (${v.country})`;
          }
          const noiseWords = [
            "польща",
            "уточнюється",
            "різні локалізації",
            "європа",
            "europe",
          ];
          const isActualNoise = noiseWords.some((word) =>
            lowClean.includes(word),
          );
          const hasCyrillic = /[А-ЯЁІЎ]/.test(clean);

          if (
            clean &&
            !isActualNoise &&
            !hasCyrillic &&
            !VOIV_LIST.includes(lowClean)
          ) {
            locations.add(clean);
          }
        });
      }

      if (v.conditions?.specificNuances) {
        v.conditions.specificNuances.forEach((n) => {
          const category = typeof n === "object" && n !== null ? n.category : n;
          if (category) nuances.add(category);
        });
      }
    });

    return {
      agencies: Array.from(agencies).sort(),
      brands: Array.from(brands).sort(),
      locations: Array.from(locations).sort(),
      voivodeships: MD.VOIVODESHIPS, // 👈 ЗМЕНЕНА: было Array.from(voivodeships).sort(...) — цяпер хардкодны спіс {value, label} з masterData.js
      nuances: Array.from(nuances).sort(),
      sourceTypes: Array.from(sourceTypes).sort(),
    };
  }, [instantFiltered]); // 👈 Залежым ад instantFiltered

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchAgency = !selectedAgency || t.agencyName === selectedAgency;
      const q = templateSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.templateName?.toLowerCase().includes(q) ||
        t.location?.toLowerCase().includes(q);
      return matchAgency && matchSearch;
    });
  }, [templates, selectedAgency, templateSearch]);
  const filteredVacanciesForUpdate = useMemo(() => {
    return vacancies
      .filter((v) => v.status === "active")
      .filter((v) => {
        const q = vacancySearch.toLowerCase().trim();
        return (
          !q ||
          v.vacancyCode?.toLowerCase().includes(q) ||
          v.vacancydescription?.toLowerCase().includes(q) ||
          v.location?.toLowerCase().includes(q)
        );
      });
  }, [vacancies, vacancySearch]);
  const previewCount = useMemo(
    () => applyFilters(vacancies, draft).length,
    [vacancies, draft],
  );
  // 3. Фінальны спіс: прымяняем "цяжкія" фільтры (агенцыя, статус і г.д.) да ўжо адфільтраваных па даце вакансій
  const filtered = useMemo(() => {
    // Мы перадаем applied, але даты і пошук у ім цяпер не важныя,
    // бо яны ўжо апрацаваны ў instantFiltered
    return applyFilters(instantFiltered, applied);
  }, [instantFiltered, applied]);
  const isDirty = useMemo(() => {
    const { search, startDate, endDate, ...restDraft } = draft;
    const { search: s, startDate: sd, endDate: ed, ...restApplied } = applied;
    return JSON.stringify(restDraft) !== JSON.stringify(restApplied);
  }, [draft, applied]);

  const handleApplyFilters = () => {
    setApplied(draft);
    setSidebarOpen(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Видалити вакансію?")) return;
    try {
      await deleteVacancy(id);
      setVacancies((prev) => prev.filter((v) => v._id !== id));
    } catch {
      alert("Помилка видалення");
    }
  };

  const handleAutoCreate = async () => {
    if (!autoText.trim()) return;
    setAutoLoading(true);
    try {
      await createVacancyAuto(autoText, sourceMessageId);
      notifyUpdate();
      handleCloseForm();
      await fetchVacancies();
    } catch (err) {
      const isLimit = err.response?.status === 429 || err.response?.status === 503;
      const msg = isLimit 
        ? "Здається, ваш AI досяг ліміту. Спробуйте, будь ласка, пізніше." 
        : "Ой, щось пішло не так при створенні вакансії. Спробуйте пізніше.";
      alert(msg);
    } finally {
      setAutoLoading(false);
    }
  };

  const handleTemplateCreate = async () => {
    if (!selectedTemplate || !autoText.trim())
      return alert("Заповніть усі поля");
    setAutoLoading(true);
   try {
      await createVacancyFromTemplate(
        selectedTemplate._id,
        autoText,
        sourceMessageId,
      );
      notifyUpdate();
      handleCloseForm();
      setSourceMessageId(null);
      await fetchVacancies();
    } catch (err) {
      const isLimit = err.response?.status === 429 || err.response?.status === 503;
      const msg = isLimit 
        ? "Здається, ваш AI досяг ліміту. Спробуйте, будь ласка, пізніше." 
        : "Ой, щось пішло не так пры створенні з шаблона. Спробуйте пізніше.";
      alert(msg);
    } finally {
      setAutoLoading(false);
    }
  };
  const handleAIUpdate = async () => {
    if (!selectedVacancyForUpdate || !autoText.trim())
      return alert("Оберіть вакансію та введіть текст");
    setAutoLoading(true);
    try {
      await aiUpdateVacancy(
        selectedVacancyForUpdate._id,
        autoText,
        sourceMessageId,
      );
      notifyUpdate();
      handleCloseForm();
      setSourceMessageId(null);
      await fetchVacancies();
    } catch (err) {
      const isLimit = err.response?.status === 429 || err.response?.status === 503;
      const msg = isLimit 
        ? "Здається, ваш AI досяг ліміту. Спробуйте, будь ласка, пізніше." 
        : "Ой, щось пішло не так при оновленні вакансії. Спробуйте пізніше.";
      alert(msg);
    } finally {
      setAutoLoading(false);
    }
  };
  const handleCloseForm = () => {
    setShowAutoForm(false);
    setAutoText("");
    setSelectedTemplate(null);
    setSelectedVacancyForUpdate(null); // 👈 Дададзена
    setVacancySearch(""); // 👈 Дададзена
    setFormMode("auto");
  };

  const handleSaveEdit = (updated) => {
    setVacancies((prev) =>
      prev.map((v) => (v._id === updated._id ? updated : v)),
    );
  };
const [viewMode, setViewMode] = useState("list"); // Стан для пераключэння Спіс/Мапа

  const setQuickDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    const dateStr = date.toISOString().split('T')[0];
    
    // Абнаўляем і чарнавік, і прымененыя фільтры адразу
    const newFilters = { ...draft, startDate: dateStr, endDate: "" };
    setDraft(newFilters);
    setApplied(newFilters);
  };
  return (
    <div className="flex items-start min-h-screen bg-slate-50">
      {/* САЙДБАР З РЭГУЛЯВАННЕМ ШЫРЫНІ */}
      <aside
        style={{ width: `${sidebarWidth}px` }}
        className="hidden lg:flex flex-col shrink-0 border-r border-slate-200 bg-white sticky top-16 h-[calc(100vh-4rem)] group shadow-sm self-start"
      >
        <VacancyFilters
          filters={draft}
          setFilters={setDraft}
          agencies={dynamicData.agencies}
          brands={dynamicData.brands}
          locations={dynamicData.locations}
          voivodeships={dynamicData.voivodeships}
          nuances={dynamicData.nuances}
          vacancies={vacancies}
        />
        {/* Рэйка для перацягвання (Resize Handle) - тонкая лінія справа */}
        <div
          onMouseDown={handleMouseDown}
          className="absolute top-0 -right-1 w-2 h-full cursor-col-resize z-10 hover:bg-emerald-500/40 transition-colors"
          title="Пацягніце, каб змяніць шырыню"
        />
      </aside>

      {/* МАБІЛЬНЫ САЙДБАР */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-80 bg-slate-200 border-r border-slate-500 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <VacancyFilters
                filters={draft}
                setFilters={setDraft}
                agencies={dynamicData.agencies}
                brands={dynamicData.brands}
                locations={dynamicData.locations}
                voivodeships={dynamicData.voivodeships}
                nuances={dynamicData.nuances}
                vacancies={instantFiltered} // 👈 ПЕРАДАЕМ ІМГНЕННЫ КАНТЭКСТ ДЛЯ ЛІЧЫЛЬНІКАЎ
              />
            </div>
            <div className="p-4 border-t border-slate-100">
              <button
                onClick={handleApplyFilters}
                className="w-full py-2.5 bg-emerald-500 text-slate-900 font-bold rounded-lg"
              >
                Показати {previewCount} вакансій
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden px-3 py-2 bg-slate-100 text-slate-500 rounded-lg"
            >
              ⚙️ Фільтри {isDirty && "●"}
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Вакансії</h1>
              <p className="text-sm text-slate-500">
                Знайдено: {filtered.length}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAutoForm(!showAutoForm)}
            className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-md shadow-emerald-100 hover:bg-emerald-700 transition-all"
          >
            ＋ Додати
          </button>
        </div>

        {/* ФОРМА ДАДАВАННЯ */}
        {showAutoForm && (
          <div className="mb-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
            <div className="flex gap-2 mb-4">
              {["auto", "template", "update"].map((m) => (
                <button
                  key={m}
                  onClick={() => setFormMode(m)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${formMode === m ? "bg-emerald-500 text-slate-900" : "bg-slate-100 text-slate-500"}`}
                >
                  {m === "auto"
                    ? "🤖 Авто (AI)"
                    : m === "template"
                      ? "📋 З шаблона"
                      : "🔄 Оновити VAC"}
                </button>
              ))}
            </div>

            {formMode === "template" && (
              <div className="mb-4 space-y-3">
                <input
                  type="text"
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  placeholder="Пошук шаблона (назва, горад)..."
                  className="w-full bg-slate-100 border border-slate-100 rounded-lg px-3 py-2 text-sm text-slate-500"
                />
                <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-lg p-1 bg-white">
                  {filteredTemplates.map((t) => (
                    <button
                      key={t._id}
                      onClick={() => setSelectedTemplate(t)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 ${selectedTemplate?._id === t._id ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-500 hover:bg-slate-100"}`}
                    >
                      <span className="font-bold">{t.templateName}</span>
                      <span className="text-slate-500 ml-2 text-xs">
                        ({t.agencyName})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {formMode === "update" && (
              <div className="mb-4 space-y-3">
                <input
                  type="text"
                  value={vacancySearch}
                  onChange={(e) => setVacancySearch(e.target.value)}
                  placeholder="Пошук вакансії (код, назва, горад)..."
                  className="w-full bg-slate-100 border border-slate-100 rounded-lg px-3 py-2 text-sm text-slate-500"
                />
                <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-lg p-1 bg-white">
                  {filteredVacanciesForUpdate.map((v) => (
                    <button
                      key={v._id}
                      onClick={() => setSelectedVacancyForUpdate(v)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 ${selectedVacancyForUpdate?._id === v._id ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-slate-500 hover:bg-slate-100"}`}
                    >
                      <span className="font-mono text-xs bg-slate-100 px-1 rounded mr-2">
                        {v.vacancyCode}
                      </span>
                      <span className="font-medium">
                        {v.vacancydescription || v.templateName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <textarea
              value={autoText}
              onChange={(e) => setAutoText(e.target.value)}
              placeholder="Вставте текст вакансії..."
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all resize-none"
            />

            <div className="flex gap-3 mt-3">
              <button
                onClick={
                  formMode === "template"
                    ? handleTemplateCreate
                    : formMode === "update"
                      ? handleAIUpdate
                      : handleAutoCreate
                }
                disabled={autoLoading || !autoText.trim()}
                className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-md shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50"
              >
                {autoLoading ? "Обробка..." : "Обробити та додати"}
              </button>
              <button
                onClick={handleCloseForm}
                className="px-4 py-2 bg-slate-100 text-slate-500 rounded-lg"
              >
                Скасувати
              </button>
            </div>
          </div>
        )}
        {/* ХУТКІЯ ФІЛЬТРЫ І ПЕРАКЛЮЧАЛЬНІК ВЫВАДУ */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">ЗА:</span>
            {[
              { label: "Сьогодні", days: 0 },
              { label: "2 дні", days: 1 },
              { label: "Тиждень", days: 6 },
              { label: "2 тижні", days: 13 },
            ].map((tag) => {
              const isActive = draft.startDate === new Date(new Date().setDate(new Date().getDate() - tag.days)).toISOString().split('T')[0];
              return (
                <button
                  key={tag.label}
                  onClick={() => setQuickDate(tag.days)}
                  className={`px-3 py-1.5 border rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm ${
                    isActive 
                      ? "bg-emerald-600 border-emerald-600 text-white" 
                      : "bg-white border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
                  }`}
                >
                  {tag.label}
                </button>
              );
            })}

            {/* ВІЗУАЛЬНЫ ПАДЗЯЛЯЛЬНІК */}
            <div className="w-px h-6 bg-slate-200 mx-2 shrink-0" />

            {/* КНОПКА АБРАНАЕ */}
            <button
              onClick={() => {
                const newVal = !draft.isFavorite;
                setDraft(prev => ({ ...prev, isFavorite: newVal }));
                setApplied(prev => ({ ...prev, isFavorite: newVal }));
              }}
              className={`px-3 py-1.5 border rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm flex items-center gap-1.5 ${
                draft.isFavorite 
                  ? "bg-amber-500 border-amber-500 text-white" 
                  : "bg-white border-slate-200 text-slate-600 hover:border-amber-500 hover:text-amber-600"
              }`}
            >
              <span>{draft.isFavorite ? "★" : "☆"}</span>
              ОБРАНІ
            </button>

            {/* КНОПКА ДЗЁННЫЯ ЗМЕНЫ */}
            <button
              onClick={() => {
                const newVal = !draft.onlyDayShifts;
                setDraft(prev => ({ ...prev, onlyDayShifts: newVal }));
                setApplied(prev => ({ ...prev, onlyDayShifts: newVal }));
              }}
              className={`px-3 py-1.5 border rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm flex items-center gap-1.5 ${
                draft.onlyDayShifts 
                  ? "bg-blue-500 border-blue-500 text-white" 
                  : "bg-white border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600"
              }`}
            >
              <span>☀️</span>
              ДЕННІ ЗМІНИ
            </button>
{/* КНОПКА БЕЗКОШТОВНЕ ЖИТЛО */}
            <button
              onClick={() => {
                const newVal = !draft.freeHousing;
                setDraft(prev => ({ ...prev, freeHousing: newVal }));
                setApplied(prev => ({ ...prev, freeHousing: newVal }));
              }}
              className={`px-3 py-1.5 border rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm flex items-center gap-1.5 ${
                draft.freeHousing 
                  ? "bg-indigo-600 border-indigo-600 text-white" 
                  : "bg-white border-slate-200 text-slate-600 hover:border-indigo-500 hover:text-indigo-600"
              }`}
            >
              <span>🏠</span>
              БЕЗКОШТОВНЕ ЖИТЛО
            </button>
            {(draft.startDate || draft.endDate) && (
              <button 
                onClick={() => {
                  const resetDates = { ...draft, startDate: "", endDate: "" };
                  setDraft(resetDates);
                  setApplied(resetDates);
                }}
                className="text-[10px] font-bold text-red-400 hover:text-red-600 ml-2 uppercase"
              >
                ✕ Скинути час
              </button>
            )}
          </div>

          {/* ПЕРАКЛЮЧАЛЬНІК СПІС / МАПА */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
            <button 
              onClick={() => setViewMode("list")}
              className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${viewMode === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              СПИСОК
            </button>
            <button 
              onClick={() => setViewMode("map")}
              className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${viewMode === "map" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              МАПА
            </button>
          </div>
        </div>
        {/* ПАНЭЛЬ МАСАВЫХ ДЗЕЯННЯЎ */}
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-5 py-4 mb-6 shadow-sm">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={
                filtered.length > 0 && selectedIds.length === filtered.length
              }
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-slate-100 bg-slate-100 text-emerald-500 focus:ring-emerald-500/20"
            />
            <span className="text-sm text-slate-500 font-medium">
              {selectedIds.length > 0
                ? `Обрано: ${selectedIds.length}`
                : "Обрати усі відфільтровані вакансії"}
            </span>
          </div>
          {draft.agencyName?.length > 0 && (
            <div className="flex flex-col items-end">
              {syncing ? (
                /* СТАН СКАНАВАННЯ: Прагрэс + Кнопка СТОП */
                <div className="flex items-center gap-3 bg-blue-50 px-4 py-1.5 rounded-lg border border-blue-100 shadow-sm">
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] font-black text-blue-600 uppercase leading-none">Синхронізація</span>
                    <span className="text-xs font-bold text-blue-700">
                      ⏳ {progress.current} / {progress.total}
                    </span>
                  </div>
                  <div className="w-px h-6 bg-blue-200 mx-1" />
                  <button 
                    onClick={handleStopSync}
                    className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-600 text-[10px] font-black rounded-md transition-colors"
                  >
                    СТОП
                  </button>
                </div>
              ) : (
                /* ЗВЫЧАЙНЫ СТАН: Кнопка запуску */
                <button
                  onClick={handleManualSync}
                  className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-lg transition-all shadow-md shadow-blue-100"
                >
                  <span>🔄</span> 
                  <span>СКАНУВАТИ ({draft.agencyName.length})</span>
                </button>
              )}
              
              {/* ПАВЕДАМЛЕННЕ АБ ВЫНІКУ (пад кнопкай) */}
               {syncStatusMsg.text && (
                <div className={`mt-1 text-[9px] font-bold uppercase tracking-tight ${syncStatusMsg.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {syncStatusMsg.text}
                </div>
              )}
            </div>
          )}

{selectedIds.length > 0 && (
  <div className="flex gap-2">
    <button
  onClick={() => setShowBulkModal(true)}
  className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-lg transition-all shadow-md shadow-emerald-100"
>
  📢
  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 14.239l-2.95-.924c-.64-.203-.654-.64.136-.953l11.57-4.461c.537-.194 1.006.131.836.347z"/>
  </svg>
  <span className="hidden md:inline">У ТЕЛЕГРАМ</span>
  <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-0.5">
    {selectedIds.length}
  </span>
</button>
    <button
      onClick={handleBulkDelete}
      className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-black rounded-lg border border-red-500/20 transition-all"
    >
      🗑️<span className="hidden md:inline">&#8201;ВИДАЛІТЬ</span>
    </button>
  </div>
)}
          
        </div>
        {/* ВЫВАД: СПІС АБО МАПА */}
        {viewMode === "list" ? (
          <div className="space-y-3">
            {filtered.map((v) => {
            // Разумная лакацыя: дадаем краіну толькі калі яе яшчэ няма ў назве горада
            const cityOnly = (v.location || "").split("(")[0].trim();
            const locationDisplay =
              v.country && v.country !== "Polska"
                ? `${cityOnly} (${v.country})`
                : cityOnly;
            // Збіраем толькі унікальныя катэгорыі нюансаў для кампактнага вываду
            const uniqueCategories = Array.from(
              new Set(
                (v.conditions?.specificNuances || []).map((n) =>
                  typeof n === "object" && n !== null ? n.category : n,
                ),
              ),
            );
            return (
              <div
                key={v._id}
                className={`bg-white border rounded-2xl p-6 transition-all shadow-sm hover:shadow-md ${
                  selectedIds.includes(v._id)
                    ? "border-emerald-500 ring-2 ring-emerald-500/10"
                    : "border-slate-200"
                }`}
              >
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap border-b border-slate-100/50 pb-2">
                      {/* ЧЭКБОКС ДЛЯ ВЫБАРУ */}
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(v._id)}
                        onChange={() => toggleSelect(v._id)}
                        className="w-5 h-5 rounded-md border-slate-300 bg-white text-emerald-600 focus:ring-emerald-500/20"
                      />

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(v._id);
                          }}
                          className={`text-lg transition-transform active:scale-125 ${
                            v.isFavorite
                              ? "text-amber-400"
                              : "text-slate-600 hover:text-slate-500"
                          }`}
                        >
                          {v.isFavorite ? "★" : "☆"}
                        </button>
                        <span className="text-[11px] font-bold font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-lg flex items-center gap-1 border border-slate-200">
                          {v.vacancyCode}
                          {v.isTruncated && (
                            <span
                              className="text-amber-500"
                              title="Текст обірваний"
                            >
                              ⚠️
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Статус (Украінізаваны) */}
                      <span
                        className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${STATUS_COLORS[v.status]}`}
                      >
                        {STATUS_LABELS[v.status]}
                      </span>
{/* ІНДЫКАТАРЫ ПУБЛІКАЦЫІ */}
<div className="flex items-center gap-1.5 ml-1">
  {v.isPublished ? (
    <span 
      className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold border border-emerald-200"
      title="Апублікавана ў Telegram"
    >
      📢 ТГ
    </span>
  ) : (
    <span 
      className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-md font-bold border border-slate-200"
      title="Яшчэ не публікавалася"
    >
      💤
    </span>
  )}

  {v.postOutdated && (
    <span 
      className="flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md font-bold border border-amber-200 animate-pulse"
      title="Дадзеныя вакансіі змяніліся, трэба абнавіць пост"
    >
      🔄 UPD
    </span>
  )}
</div>
                      {/* Агенція */}
                      <span className="text-[10px] uppercase tracking-wider font-black bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded-md">
                        🏢 {v.agencyName}
                      </span>

                      {/* Брэнд (Завод) */}
                      {v.brand && (
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                          🏭 {v.brand}
                        </span>
                      )}

                      {/* Категорія */}
                      {v.category && (
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                          📁 {v.category}
                        </span>
                      )}

                      {/* Лакацыя + Ваяводства (толькі для Польшчы) */}
                      <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-blue-100 shadow-sm">
                        📍 {locationDisplay}
                        {v.voivodeship &&
                          v.voivodeship !== "Європа (інші країни)" && (
                            <span className="text-slate-500 ml-1 font-medium">
                              ({v.voivodeship})
                            </span>
                          )}
                      </span>

                      {/* Крыніца і Даты (v4.5 - Фікс Invalid Date і іконак) */}
                      <div className="flex items-center gap-3 md:ml-auto">
                        <span
                          className="text-base"
                          title={`Джерело: ${v.sourceType || "manual"}`}
                        >
                          {v.sourceType === "viber"
                            ? "📱"
                            : v.sourceType === "telegram"
                              ? "✈️"
                              : v.sourceType === "spreadsheet"
                                ? "📊"
                                : v.sourceType === "trello"
                                  ? "🔵"
                                  : v.sourceType === "airtable"
                                    ? "🗄️"
                                    : "📝"}{" "}
                        </span>

                        <div className="flex flex-col items-start md:items-end leading-none">
                          <span className="text-[10px] text-slate-500 font-mono">
                            {v.createdAt
                              ? new Date(v.createdAt).toLocaleDateString(
                                  "uk-UA",
                                )
                              : "---"}
                          </span>
                          {/* Паказваем UPD толькі калі дата рэальна адрозніваецца больш чым на 5 сек */}
                          {v.updatedAt &&
                            v.createdAt &&
                            new Date(v.updatedAt).getTime() >
                              new Date(v.createdAt).getTime() + 5000 && (
                              <span className="text-[9px] text-emerald-500 font-bold font-mono mt-0.5">
                                (upd:{" "}
                                {new Date(v.updatedAt).toLocaleDateString(
                                  "uk-UA",
                                )}
                                )
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                    {/* ЗАГАЛОВАК */}
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-3">
                      {v.vacancydescription || v.templateName}
                    </h3>

                    {/* РАДОК 2: БАЗАВЫЯ ЎМОВЫ (Гендэр, Вік, Графік, Жытло, Давоз, Мова) + ЗАРПЛАТА */}
                    <div className="flex flex-wrap gap-3 text-xs items-center mb-3">
                      {/* ГЕНДАР / НАБОР */}
                      <div className="flex items-center gap-2 bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-500">
                        <span className="text-slate-500 text-[10px]">👥</span>
                        <span className="text-slate-600 font-bold uppercase tracking-tight text-[10px]">
                          {Array.isArray(v.requirements?.gender)
                            ? v.requirements.gender.join(", ")
                            : v.gender || "Будь-хто"}
                          {v.requirements?.genderDescription && (
                            <span className="text-emerald-500 ml-1">*</span>
                          )}
                        </span>
                      </div>

                      {/* ВІК (Захавана) */}
                      {v.requirements?.age?.max && (
                        <div className="flex items-center gap-2 bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-500">
                          <span className="text-slate-500 text-[10px]">🎂</span>
                          <span className="text-slate-600 font-bold text-[10px]">
                            {v.requirements.age.min || 18}-{v.requirements.age.max} р.
                          </span>
                        </div>
                      )}

                      {/* ЖИТЛО (Захавана логіка "Без житла") */}
                      <div className="flex items-center gap-1.5 text-slate-500 ml-1 bg-orange-200/50 px-3 py-1.5 rounded-xl border border-orange-500">
                        <span>🏠</span>
                        <span className="font-medium">
                          {!v.accommodation?.type || v.accommodation?.type === ""
                            ? "Не вказано"
                            : v.accommodation.type.toLowerCase().includes("власн") || v.accommodation.type.toLowerCase().includes("не надаєт")
                              ? "Без житла"
                              : "Житло є"}
                          {v.accommodation?.forCouples && <span className="text-orange-400 ml-1">👫</span>}
                        </span>
                      </div>

                      {/* ДОВІЗ */}
                      <div className="flex items-center gap-1.5 text-slate-500 bg-green-200/50 px-3 py-1.5 rounded-xl border border-green-500">
                        <span>🚌</span>
                        <span className="font-medium">{v.transport?.provided ? "Є довіз" : "Немає"}</span>
                      </div>

                      {/* МОВА */}
                      <div className="flex items-center gap-1.5 text-slate-500 bg-amber-200/50 px-3 py-1.5 rounded-xl border border-amber-500">
                        <span>🗣️</span>
                        <span className="font-medium">{v.requirements?.polishLanguageLevel || "—"}</span>
                      </div>
                      </div>
<div className="flex flex-wrap gap-3 text-xs items-center mb-3 justify-start">
{/* ГРАФІК І ГАДЗІНЫ (Новы яркі блок) */}
                      <div className="flex items-center gap-2 bg-blue-200/50 px-3 py-1.5 rounded-xl border border-blue-500">
                        <span className="text-blue-600 text-[10px]">{v.schedule?.onlyDayShifts ? "☀️" : "🔄"}</span>
                        <span className="text-blue-700 font-bold uppercase tracking-tight text-[10px]">
                          {v.schedule?.onlyDayShifts ? "Тільки день" : "Зміни"}
                          {v.salary?.hoursRange && (
                            <span className="ml-1.5 pl-1.5 border-l border-blue-200">
                              ⏱️ {v.salary.hoursRange} год/міс
                            </span>
                          )}
                        </span>
                      </div>
                      {/* ЗАРПЛАТА (Зроблена яркай) */}
                      {(v.salary?.rawSalaryDisplay || v.salary?.baseNetto) && (
                        <div className="flex items-center gap-2 bg-emerald-200/50 px-4 py-2 rounded-2xl border border-emerald-500">
                          <span className="text-emerald-700 font-black text-base">
                            💰 {v.salary.rawSalaryDisplay ? v.salary.rawSalaryDisplay.split(";")[0] : `${v.salary.baseNetto} PLN`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ХМАРА ТЕГІВ v2.2 (Спецыфічныя патрабаванні: Нацыі, Дакументы, Нюансы) */}
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100/50">
                      {/* НАЦІОНАЛЬНІСТЬ */}
                      {(v.requirements?.nationalities || []).length > 0 && (
                        <span className="text-[10px] px-2 py-1 rounded-lg bg-blue-200 text-blue-700 border border-blue-500 font-bold uppercase tracking-tight shadow-sm">
                          🌍 {v.requirements.nationalities.join(", ")}
                        </span>
                      )}

                      {/* ДОКУМЕНТИ */}
                      {(v.requirements?.standardDocs || []).length > 0 && (
                        <span className="text-[10px] px-2 py-1 rounded-lg bg-slate-200 text-slate-700  font-bold uppercase tracking-tighter">
                          📄 {v.requirements.standardDocs.join(" / ")}
                        </span>
                      )}

                      {/* ОСОБЛИВОСТІ (Толькі унікальныя катэгорыі з кантэнтам) */}
                      {uniqueCategories.map((category, idx) => {
                        const icons = {
                          "Температурний режим": "🌡️",
                          "Фізично-важка праця": "🏋️",
                          Шум: "📢",
                          Норми: "📈",
                          "Санітарні обмеження": "🚫",
                          "Запахи та алергени": "👃",
                          "Характер праці": "🚶",
                          "Специфічні навички": "🛠️",
                          "Тести пры вступі": "📝",
                        };

                        // Калі тэксту для гэтай катэгорыі няма (схаваны як дубль), не паказваем пусты тэг
                        const hasContent = v.conditions?.specificNuances?.some(
                          (n) =>
                            typeof n === "object"
                              ? n.category === category
                              : n === category,
                        );
                        if (!hasContent) return null;

                        return (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 font-bold uppercase tracking-tight shadow-sm"
                          >
                            {icons[category] || "✨"} {category}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* КНОПКІ ДЗЕЯННЯЎ */}
<div className="flex flex-row md:flex-col gap-2 shrink-0 md:w-32 w-full mt-2 md:mt-0">
  <button
    onClick={() => setViewVacancy(v)}
    className="flex-1 md:w-32 px-3 py-2.5 bg-orange-200 text-orange-700 hover:bg-orange-100 border border-orange-200 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all shadow-sm flex items-center justify-center gap-2"
  >
    <span className="text-sm">👁️</span>
    <span className="hidden md:inline">ПЕРЕГЛЯД</span>
  </button>
  <button
    onClick={() => setMatchVacancy(v)}
    className="flex-1 md:w-32 px-3 py-2.5 bg-indigo-200 text-white hover:bg-indigo-700 border border-indigo-200 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
  >
    <span className="text-sm">🎯</span>
    <span className="hidden md:inline">КАНДИДАТИ</span>
  </button>
  <button
    onClick={() => setEditVacancy(v)}
    className="flex-1 md:w-32 px-3 py-2.5 bg-emerald-200 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all flex items-center justify-center gap-2"
  >
    <span className="text-sm">✏️</span>
    <span className="hidden md:inline">РЕДАГУВАТИ</span>
  </button>
</div>
                </div>
              </div>
            );
          })}
        </div>
        ) : (
          <div className="w-full h-[70vh] min-h-[500px] block relative z-0 animate-in fade-in duration-500">
            <VacancyMap 
              vacancies={filtered} 
              onViewVacancy={(v) => setViewVacancy(v)} 
            />
          </div>
        )}
      </div>

      {/* ПЛАВАЮЧАЯ КНОПКА */}
      {isDirty && (
        <div className="hidden lg:block fixed bottom-6 right-6 z-30">
          <button
            onClick={handleApplyFilters}
            className="px-6 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95"
          >
            Показати {previewCount} вакансій ✓
          </button>
        </div>
      )}

      {/* МАДАЛКІ */}
      {editVacancy && (
        <EditVacancyModal
          vacancy={editVacancy}
          onClose={() => setEditVacancy(null)}
          onSave={handleSaveEdit}
        />
      )}
      {matchVacancy && (
        <VacancyMatchModal
          vacancy={matchVacancy}
          onClose={() => setMatchVacancy(null)}
        />
      )}
      {/* МАДАЛКА ПРАГЛЯДУ З НАВІГАЦЫЯЙ (КАРУСЕЛЬ) */}
      {viewVacancy && (() => {
        // 1. Знаходзім, на якой пазіцыі зараз знаходзіцца адкрытая вакансія ў спісе filtered
        const currentIndex = filtered.findIndex(v => v._id === viewVacancy._id);
        
        // 2. Правяраем, ці ёсць куды гартаць
        const hasNext = currentIndex < filtered.length - 1;
        const hasPrev = currentIndex > 0;

        // 3. Функцыі для пераключэння
        const handleNext = () => {
          if (hasNext) setViewVacancy(filtered[currentIndex + 1]);
        };

        const handlePrev = () => {
          if (hasPrev) setViewVacancy(filtered[currentIndex - 1]);
        };

        return (
          <VacancyViewModal
            vacancy={viewVacancy}
            onClose={() => setViewVacancy(null)}
            onNext={hasNext ? handleNext : null} // Перадаем функцыю, калі ёсць наступная
            onPrev={hasPrev ? handlePrev : null} // Перадаем функцыю, калі ёсць папярэдняя
            currentIndex={currentIndex + 1}      // Нумар для лічыльніка (напр. 5)
            totalCount={filtered.length}         // Агульная колькасць (напр. 120)
            onEdit={(v) => {
              setViewVacancy(null);
              setEditVacancy(v);
            }}
            onDelete={(id) => {
              setViewVacancy(null);
              handleDelete(id);
            }}
            onMatch={(v) => {
              setViewVacancy(null);
              setMatchVacancy(v);
            }}
          />
        );
      })()}
      {showBulkModal && (
        <BulkPublishModal
          selectedIds={selectedIds}
          onClose={() => {
            setShowBulkModal(false);
            setSelectedIds([]); // Скідваем выбар пасля закрыцця
          }}
        />
      )}
    </div>
  );
}
----------------
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
-----------------
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
