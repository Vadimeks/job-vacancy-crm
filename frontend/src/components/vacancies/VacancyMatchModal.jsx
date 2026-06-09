// frontend/src/components/vacancies/VacancyMatchModal.jsx
import { useEffect, useState } from "react";
import { matchCandidatesForVacancy } from "../../services/api";

const STATUS_COLORS = {
  new: "bg-blue-500/10 text-blue-400",
  active: "bg-emerald-500/10 text-emerald-400",
  waiting: "bg-yellow-500/10 text-yellow-400",
  employed: "bg-purple-500/10 text-purple-400",
  left: "bg-slate-500/10 text-slate-500",
  blacklist: "bg-red-500/10 text-red-400",
};

const STATUS_LABELS = {
  new: "Новий",
  active: "Активний",
  waiting: "Очікує",
  employed: "Працює",
  left: "Звільнився", // Было "Пішов"
  blacklist: "Чорний список", // Было "Блекліст"
};

export default function VacancyMatchModal({ vacancy, onClose }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await matchCandidatesForVacancy(vacancy._id);
        setCandidates(res.data);
      } catch {
        console.error("Помилка матчингу");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [vacancy._id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 shadow-2xl">
        {/* Заголовок */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div>
            <h2 className="font-semibold text-slate-500">
              🎯 Відповідні кандидати
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {vacancy.title}
              {vacancy.vacancyCode && (
                <span className="font-mono ml-2">({vacancy.vacancyCode})</span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-500 hover:bg-slate-800 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Зміст */}
        <div className="px-6 py-5">
          {loading ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              Пошук кандидатів...
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-8 text-slate-600">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-sm">Відповідних кандидатів не знайдено</p>
              <p className="text-xs text-slate-700 mt-1">
                Переконайтеся, що в базі є кандидати зі статусами
                new/active/waiting
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-500 mb-4">
                Знайдено {candidates.length} кандидатів
              </p>
              <div className="space-y-3">
                {candidates.map((c) => (
                  <div
                    key={c._id}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-500 text-sm">
                            {c.name}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status]}`}
                          >
                            {STATUS_LABELS[c.status]}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                          {c.contactType === "telegram" && c.telegram && (
                            <span>✈️ {c.telegram}</span>
                          )}
                          {(c.contactType === "viber" ||
                            c.contactType === "phone") &&
                            c.phone && <span>📞 {c.phone}</span>}
                          {c.nationality && <span>🌍 {c.nationality}</span>}
                          {c.currentLocation && (
                            <span>📍 {c.currentLocation}</span>
                          )}
                          {c.age && <span>🎂 {c.age} р.</span>}
                          {c.gender && (
                            <span>{c.gender === "female" ? "👩" : "👨"}</span>
                          )}
                        </div>

                        {/* Побажання */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {c.jobPreferences?.locationFlexible && (
                            <span className="text-xs bg-slate-700 text-slate-500 px-2 py-0.5 rounded">
                              🗺 Готовий до переїзду
                            </span>
                          )}
                          {c.jobPreferences?.needsAccommodation && (
                            <span className="text-xs bg-slate-700 text-slate-500 px-2 py-0.5 rounded">
                              🏠 Потрібне житло
                            </span>
                          )}
                          {c.jobPreferences?.readyDate && (
                            <span className="text-xs bg-slate-700 text-slate-500 px-2 py-0.5 rounded">
                              📅 Готовий з: {c.jobPreferences.readyDate}
                            </span>
                          )}
                        </div>

                        {/* Документи */}
                        <div className="flex gap-2 mt-2">
                          {[
                            [c.documents?.hasVisa, "Віза"],
                            [c.documents?.hasSanepid, "Санепід"],
                            [c.documents?.hasUDT, "UDT"],
                          ].map(([has, label]) => (
                            <span
                              key={label}
                              className={`text-xs px-2 py-0.5 rounded ${
                                has
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-slate-700 text-slate-600"
                              }`}
                            >
                              {has ? "✅" : "❌"} {label}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Оцінка */}
                      <div className="shrink-0 text-center">
                        <div className="text-2xl font-black text-emerald-600">
                          {c.matchScore}
                        </div>
                        <div className="text-xs text-slate-600">балів</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
