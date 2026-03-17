// frontend/src/pages/Vacancies.jsx
import { useEffect, useState } from "react";
import {
  getVacancies,
  deleteVacancy,
  createVacancyAuto,
} from "../services/api";
import EditVacancyModal from "../components/vacancies/EditVacancyModal";
import ApplyModal from "../components/vacancies/ApplyModal";
import VacancyMatchModal from "../components/vacancies/VacancyMatchModal";
import VacancyViewModal from "../components/vacancies/VacancyViewModal";

const STATUS_COLORS = {
  active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  closed: "bg-red-500/10 text-red-400 border border-red-500/20",
  archived: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
};

const STATUS_LABELS = {
  active: "Актыўная",
  closed: "Закрыта",
  archived: "Архіў",
};

export default function Vacancies() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoText, setAutoText] = useState("");
  const [autoLoading, setAutoLoading] = useState(false);
  const [showAutoForm, setShowAutoForm] = useState(false);
  const [editVacancy, setEditVacancy] = useState(null);
  const [applyVacancy, setApplyVacancy] = useState(null);
  const [matchVacancy, setMatchVacancy] = useState(null);
  const [applyType, setApplyType] = useState(null);
  const [viewVacancy, setViewVacancy] = useState(null);
  const fetchVacancies = async () => {
    try {
      const res = await getVacancies();
      setVacancies(res.data);
    } catch {
      console.error("Памылка загрузкі вакансій");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Выдаліць вакансію?")) return;
    try {
      await deleteVacancy(id);
      setVacancies((prev) => prev.filter((v) => v._id !== id));
    } catch {
      alert("Памылка выдалення");
    }
  };

  const handleAutoCreate = async () => {
    if (!autoText.trim()) return;
    setAutoLoading(true);
    try {
      await createVacancyAuto(autoText);
      setAutoText("");
      setShowAutoForm(false);
      await fetchVacancies();
    } catch {
      alert("Памылка стварэння вакансіі");
    } finally {
      setAutoLoading(false);
    }
  };

  const handleSaveEdit = (updated) => {
    setVacancies((prev) =>
      prev.map((v) => (v._id === updated._id ? updated : v)),
    );
  };

  const openApply = (vacancy, type) => {
    setApplyVacancy(vacancy);
    setApplyType(type);
  };

  return (
    <div className="p-8">
      {/* Загаловак */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Вакансіі</h1>
          <p className="text-sm text-slate-500 mt-1">
            {vacancies.length} вакансій у базе
          </p>
        </div>
        <button
          onClick={() => setShowAutoForm(!showAutoForm)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-medium text-sm rounded-lg transition-colors"
        >
          <span>＋</span> Дадаць вакансію
        </button>
      </div>

      {/* Форма аўтаматычнага стварэння */}
      {showAutoForm && (
        <div className="mb-6 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-medium text-slate-300 mb-3">
            🤖 Аўтаматычная апрацоўка праз AI
          </h3>
          <textarea
            value={autoText}
            onChange={(e) => setAutoText(e.target.value)}
            placeholder="Устаўце тэкст вакансіі з чата агенцыі..."
            rows={4}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
          />
          <div className="flex gap-3 mt-3">
            <button
              onClick={handleAutoCreate}
              disabled={autoLoading || !autoText.trim()}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-medium text-sm rounded-lg transition-colors"
            >
              {autoLoading ? "Апрацоўка..." : "Апрацаваць і дадаць"}
            </button>
            <button
              onClick={() => setShowAutoForm(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
            >
              Адмена
            </button>
          </div>
        </div>
      )}

      {/* Спіс вакансій */}
      {loading ? (
        <div className="text-slate-500 text-sm">Загрузка...</div>
      ) : vacancies.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <div className="text-4xl mb-3">💼</div>
          <div className="text-sm">Вакансій пакуль няма</div>
        </div>
      ) : (
        <div className="space-y-3">
          {vacancies.map((v) => (
            <div
              key={v._id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    {v.vacancyCode && (
                      <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                        {v.vacancyCode}
                      </span>
                    )}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[v.status]}`}
                    >
                      {STATUS_LABELS[v.status]}
                    </span>
                    <span className="text-xs text-slate-600">
                      {new Date(v.createdAt).toLocaleString("uk-UA", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <h3 className="font-medium text-slate-100 truncate">
                    {v.title}
                  </h3>

                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                    <span>📍 {v.location}</span>
                    {v.agencyName && <span>🏢 {v.agencyName}</span>}
                    {v.salary?.base && <span>💰 {v.salary.base}</span>}
                    {v.requirements?.gender && (
                      <span>👤 {v.requirements.gender}</span>
                    )}
                    {v.arrivalDate && <span>📅 {v.arrivalDate}</span>}
                  </div>

                  {v.status === "active" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => openApply(v, "want_work")}
                        className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-medium transition-colors"
                      >
                        🟢 Хачу тут працаваць
                      </button>
                      <button
                        onClick={() => openApply(v, "want_info")}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-xs font-medium transition-colors"
                      >
                        💬 Дазнацца дэталі
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setViewVacancy(v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors text-xs"
                  >
                    👁 Паглядзець
                  </button>
                  <button
                    onClick={() => setMatchVacancy(v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors text-xs"
                  >
                    🎯 Кандыдаты
                  </button>
                  <button
                    onClick={() => setEditVacancy(v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors text-xs"
                  >
                    ✏️ Рэд.
                  </button>
                  <button
                    onClick={() => handleDelete(v._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-xs"
                  >
                    🗑 Выд.
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editVacancy && (
        <EditVacancyModal
          vacancy={editVacancy}
          onClose={() => setEditVacancy(null)}
          onSave={handleSaveEdit}
        />
      )}

      {applyVacancy && (
        <ApplyModal
          vacancy={applyVacancy}
          applyType={applyType}
          onClose={() => {
            setApplyVacancy(null);
            setApplyType(null);
          }}
        />
      )}
      {matchVacancy && (
        <VacancyMatchModal
          vacancy={matchVacancy}
          onClose={() => setMatchVacancy(null)}
        />
      )}
      {viewVacancy && (
        <VacancyViewModal
          vacancy={viewVacancy}
          onClose={() => setViewVacancy(null)}
          onEdit={(v) => {
            setViewVacancy(null);
            setEditVacancy(v);
          }}
          onDelete={(id) => {
            setViewVacancy(null);
            handleDelete(id);
          }}
          onApply={openApply}
          onMatch={(v) => {
            setViewVacancy(null);
            setMatchVacancy(v);
          }}
        />
      )}
    </div>
  );
}
