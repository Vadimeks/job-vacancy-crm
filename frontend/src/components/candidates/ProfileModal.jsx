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
                          {candidate.jobPreferences.nuances?.map(n => (
                            <span key={n} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600 font-medium">
                              {n}
                            </span>
                          ))}
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
