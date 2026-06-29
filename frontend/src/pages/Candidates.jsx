// frontend/src/pages/Candidates.jsx
import { useEffect, useState, useMemo } from "react";
import { getCandidates, deleteCandidate } from "../services/api";
import ProfileModal from "../components/candidates/ProfileModal";
import AddCandidateModal from "../components/candidates/AddCandidateModal";
import CandidateFilters from "../components/candidates/CandidateFilters";
import { EMPTY_CANDIDATE_FILTERS } from "../constants/filters";

const STATUS_COLORS = {
  new: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  waiting: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  employed: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  left: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
  blacklist: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const STATUS_LABELS = {
  new: "Новы",
  active: "Актыўны",
  waiting: "Чакае",
  employed: "Працуе",
  left: "Сышоў",
  blacklist: "Блэкліст",
};

function applyFilters(candidates, filters) {
  return candidates.filter((c) => {
    // Пошук
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (
        !c.name?.toLowerCase().includes(s) &&
        !c.phone?.toLowerCase().includes(s) &&
        !c.telegram?.toLowerCase().includes(s) &&
        !c.currentLocation?.toLowerCase().includes(s)
      ) return false;
    }

    // Статус — масіў
    if (filters.status?.length > 0) {
      if (!filters.status.includes(c.status)) return false;
    }

    // Гендар
    if (filters.gender?.length > 0) {
      if (!filters.gender.includes(c.gender)) return false;
    }

    // Нацыянальнасць
    if (filters.nationality?.length > 0) {
      if (!filters.nationality.some((n) => c.nationality?.toLowerCase() === n.toLowerCase())) return false;
    }

    // Сфера
    if (filters.sphere?.length > 0) {
      const prefs = c.jobPreferences?.spheres || [];
      if (!filters.sphere.some((s) => prefs.includes(s))) return false;
    }

    // Лакацыя
    if (filters.location?.length > 0) {
      const match = filters.location.some((l) => {
        if (l === "any") return c.jobPreferences?.locationFlexible;
        if (l === "city_area") return c.jobPreferences?.locationRadius;
        if (l === "region") return c.jobPreferences?.locationRadius;
        if (l === "city") return !c.jobPreferences?.locationFlexible && !c.jobPreferences?.locationRadius;
        return false;
      });
      if (!match) return false;
    }

    // Жытло
    if (filters.accommodation?.length > 0) {
      const match = filters.accommodation.some((a) => {
        if (a === "needs") return c.jobPreferences?.needsAccommodation;
        if (a === "own") return !c.jobPreferences?.needsAccommodation;
        return false;
      });
      if (!match) return false;
    }

    // Група
    if (filters.travelGroup?.length > 0) {
      if (!filters.travelGroup.includes(c.jobPreferences?.travelGroup)) return false;
    }

    // Графік
    if (filters.schedule?.length > 0) {
      const prefs = c.jobPreferences?.schedule || [];
      if (!filters.schedule.some((s) => prefs.includes(s))) return false;
    }

    // Дакументы
    if (filters.docs?.length > 0) {
      const match = filters.docs.some((d) => {
        if (d === "visa") return c.documents?.hasVisa;
        if (d === "sanepid") return c.documents?.hasSanepid;
        if (d === "udt") return c.documents?.hasUDT;
        return false;
      });
      if (!match) return false;
    }

    // Крыніца
    if (filters.source?.length > 0) {
      if (!filters.source.includes(c.source)) return false;
    }

    return true;
  });
}

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [draft, setDraft] = useState(EMPTY_CANDIDATE_FILTERS);
  const [applied, setApplied] = useState(EMPTY_CANDIDATE_FILTERS);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getCandidates();
        setCandidates(res.data);
      } catch {
        console.error("Памылка загрузкі кандыдатаў");
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
    if (!confirm("Выдаліць кандыдата?")) return;
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
      <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-slate-200 bg-white sticky top-16 h-[calc(100vh-4rem)]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <span className="text-sm font-medium text-slate-300">Фільтры</span>
          {isDirty && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Скінуць
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
                Паказаць {previewCount} кандыдатаў
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
              ⚙️ Фільтры
              {isDirty && (
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              )}
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                Кандыдаты
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {filtered.length} з {candidates.length} кандыдатаў
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-medium text-sm rounded-lg transition-colors"
          >
            <span>＋</span> Дадаць кандыдата
          </button>
        </div>

        {/* Спіс */}
        {loading ? (
          <div className="text-slate-500 text-sm">Загрузка...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-600">
            <div className="text-4xl mb-3">👥</div>
            <div className="text-sm">
              Кандыдатаў па гэтых фільтрах не знойдзена
            </div>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded-lg transition-colors"
            >
              Скінуць фільтры
            </button>
          </div>
        ) : (
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
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status]}`}
                      >
                        {STATUS_LABELS[c.status]}
                      </span>
                      <span className="text-xs text-slate-600">
                        {c.source === "site"
                          ? "🌐 Сайт"
                          : c.source === "telegram_bot"
                            ? "✈️ Telegram"
                            : "✋ Ручны"}
                      </span>
                      <span className="text-xs text-slate-700">
                        {new Date(c.createdAt).toLocaleDateString("uk-UA")}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{c.name}</h3>

                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                      {c.contactType === "telegram" && c.telegram && (
                        <span>✈️ {c.telegram}</span>
                      )}
                      {(c.contactType === "viber" ||
                        c.contactType === "phone") &&
                        c.phone && <span>📞 {c.phone}</span>}
                      {c.nationality && <span>🌍 {c.nationality}</span>}
                      {c.currentLocation && <span>📍 {c.currentLocation}</span>}
                      {c.age && <span>🎂 {c.age} г.</span>}
                      {c.gender && (
                        <span>{c.gender === "female" ? "👩" : "👨"}</span>
                      )}
                    </div>

                    {c.jobPreferences?.locationFlexible && (
                      <div className="mt-2 text-xs text-slate-600">
                        🔍 Гатовы да пераезду
                      </div>
                    )}
                    {!c.jobPreferences?.locationFlexible &&
                      c.jobPreferences?.location && (
                        <div className="mt-2 text-xs text-slate-600">
                          🔍 Шукае: {c.jobPreferences.location}
                        </div>
                      )}
                  </div>

                  <div
                    className="flex gap-2 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setProfileId(c._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors text-xs"
                    >
                      👤 Профіль
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-xs"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
            Паказаць {previewCount} кандыдатаў ✓
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
