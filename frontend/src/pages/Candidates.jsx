// frontend/src/pages/Candidates.jsx
import { useEffect, useState, useMemo } from "react";
import { getCandidates, deleteCandidate, updateCandidate } from "../services/api";
import ProfileModal from "../components/candidates/ProfileModal";
import AddCandidateModal from "../components/candidates/AddCandidateModal";
import CandidateFilters from "../components/candidates/CandidateFilters";
import { EMPTY_CANDIDATE_FILTERS } from "../constants/filters";
import { LayoutGrid, List as ListIcon, Trash2, User, Globe, MessageSquare } from "lucide-react";
import * as MD from "../constants/masterData";

const STATUS_COLORS = {
  new: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  waiting: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  employed: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  left: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
  blacklist: "bg-red-500/10 text-red-400 border border-red-500/20",
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

    if (filters.voivodeship?.length > 0) {
      const candLocs = Array.isArray(c.jobPreferences?.voivodeship) ? c.jobPreferences.voivodeship : [];
      const isFlexible = !!c.jobPreferences?.locationFlexible;
      
      // Калі кандыдат "Flexible", ён падыходзіць пад любы абраны рэгіён
      const match = filters.voivodeship.some((l) => isFlexible || candLocs.includes(l));
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
function CandidateKanbanCard({ candidate, onOpen, onDragStart }) {
  const aiTags = candidate.additionalNotesTags || [];
  
  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, candidate)}
      onClick={onOpen}
      className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group active:opacity-50 active:scale-[0.98]"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-slate-400 font-medium">
          {new Date(candidate.createdAt).toLocaleDateString('uk-UA')}
        </span>
        <span className="text-[10px] text-slate-500">
          {MD.CANDIDATE_SOURCES.find(s => s.value === candidate.source)?.label || candidate.source}
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
// --- Рэгуляваны сайдбар (перанесена з вакансій) ---
  const [sidebarWidth, setSidebarWidth] = useState(288); // 288px = w-72
  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startWidth = sidebarWidth;
    const onMouseMove = (moveEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      if (newWidth >= 240 && newWidth <= 450) setSidebarWidth(newWidth);
    };
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
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
const handleStatusDrop = async (candidateId, newStatus) => {
    const candidate = candidates.find(c => c._id === candidateId);
    // Калі статус не змяніўся — нічога не робім (эканомія запытаў)
    if (!candidate || candidate.status === newStatus) return;

    try {
      const res = await updateCandidate(candidateId, { status: newStatus });
      handleUpdate(res.data); // Абнаўляем лакальны стан праз існуючую функцыю
    } catch (err) {
      console.error("❌ Памылка змены статусу:", err);
      alert("Не ўдалося змяніць статус кандыдата");
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
      <aside 
        style={{ width: `${sidebarWidth}px` }}
        className="hidden lg:flex flex-col shrink-0 border-r border-slate-200 bg-white sticky top-16 h-[calc(100vh-4rem)] self-start group"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-tight">Фільтри</span>
          {isDirty && (
            <button
              onClick={handleResetFilters}
              className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase"
            >
              Скинути
            </button>
          )}
        </div>
        <CandidateFilters draft={draft} onChange={setDraft} />
        
        {/* Рэйка для рэсайзу */}
        <div
          onMouseDown={handleMouseDown}
          className="absolute top-0 -right-1 w-2 h-full cursor-col-resize z-10 hover:bg-emerald-500/40 transition-colors"
          title="Потягніть, щоб змінити ширину"
        />
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
                      <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status]}`}>
                        {MD.CANDIDATE_STATUSES.find(s => s.value === c.status)?.label || c.status}
                      </span>
                      <span className="text-xs text-slate-600">
                        {MD.CANDIDATE_SOURCES.find(s => s.value === c.source)?.label || c.source}
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
                    {!c.jobPreferences?.locationFlexible && c.jobPreferences?.voivodeship?.length > 0 && (
                      <div className="mt-2 text-xs text-slate-600">
                        🔍 Шукае: {Array.isArray(c.jobPreferences.voivodeship) ? c.jobPreferences.voivodeship.join(", ") : c.jobPreferences.voivodeship}
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
            {MD.CANDIDATE_STATUSES.map((statusObj) => {
              const statusKey = statusObj.value;
              const label = statusObj.label;
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
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const candidateId = e.dataTransfer.getData("candidateId");
                      handleStatusDrop(candidateId, statusKey);
                    }}
                    className="flex flex-col gap-3 p-2 bg-slate-100/50 rounded-2xl flex-1 border border-dashed border-slate-200 transition-colors hover:bg-slate-200/50"
                  >
                    {columnCandidates.map(c => (
                      <CandidateKanbanCard 
                        key={c._id} 
                        candidate={c} 
                        onOpen={() => setProfileId(c._id)} 
                        onDragStart={(e, cand) => {
                          e.dataTransfer.setData("candidateId", cand._id);
                        }}
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
