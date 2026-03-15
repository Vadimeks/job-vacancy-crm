// frontend/src/pages/Candidates.jsx
import { useEffect, useState, useCallback } from "react";
import { getCandidates, deleteCandidate } from "../services/api";
import ProfileModal from "../components/candidates/ProfileModal";
import AddCandidateModal from "../components/candidates/AddCandidateModal";

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

const STATUSES = Object.keys(STATUS_LABELS);

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [profileId, setProfileId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const res = await getCandidates(params);
      setCandidates(res.data);
    } catch {
      console.error("Памылка загрузкі кандыдатаў");
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

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
    <div className="p-8">
      {/* Загаловак */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Кандыдаты</h1>
          <p className="text-sm text-slate-500 mt-1">
            {candidates.length} кандыдатаў
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-medium text-sm rounded-lg transition-colors"
        >
          <span>＋</span> Дадаць кандыдата
        </button>
      </div>

      {/* Фільтр */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilterStatus("")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filterStatus === ""
              ? "bg-emerald-500 text-slate-900"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
          }`}
        >
          Усе
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === s
                ? "bg-emerald-500 text-slate-900"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Спіс */}
      {loading ? (
        <div className="text-slate-500 text-sm">Загрузка...</div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <div className="text-4xl mb-3">👥</div>
          <div className="text-sm">Кандыдатаў пакуль няма</div>
        </div>
      ) : (
        <div className="space-y-3">
          {candidates.map((c) => (
            <div
              key={c._id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors cursor-pointer"
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

                  <h3 className="font-medium text-slate-100">{c.name}</h3>

                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                    {c.contactType === "telegram" && c.telegram && (
                      <span>✈️ {c.telegram}</span>
                    )}
                    {(c.contactType === "viber" || c.contactType === "phone") &&
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
