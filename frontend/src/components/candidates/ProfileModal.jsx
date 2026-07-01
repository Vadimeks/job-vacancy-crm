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
      alert("Памылка матчынгу");
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
        console.error("Памылка загрузкі профілю");
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
      alert("Памылка змены статусу");
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
      alert("Памылка дадання нататкі");
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
        <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
          {/* Загаловак */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
            <h2 className="font-semibold text-slate-100">Профіль кандыдата</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors"
              >
                ✏️ Рэдагаваць
              </button>
              <button
                onClick={handleMatch}
                disabled={matchLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors disabled:opacity-50"
              >
                🎯 {matchLoading ? "Пошук..." : "Вакансіі"}
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">Загрузка...</div>
          ) : !candidate ? (
            <div className="p-8 text-center text-slate-500">Не знойдзена</div>
          ) : (
            <div className="px-6 py-5 space-y-5">
              {/* Асноўная інфа */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-100">
                    {candidate.name}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-400">
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
                    {candidate.age && <span>🎂 {candidate.age} г.</span>}
                    {candidate.gender && (
  <span>
    {candidate.gender === "Жінки" ? "👩 Жанчына" : 
     candidate.gender === "Чоловіки" ? "👨 Мужчына" : 
     candidate.gender === "Пари" ? "👫 Пара" : "👨‍👩‍👧 Сям'я"}
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
                              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                          }`}
                        >
                          {lbl}
                        </button>
                      ))}
                      <button
                        onClick={() => setEditStatus(false)}
                        className="text-xs text-slate-600 mt-1 text-center"
                      >
                        Адмена
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
                  {candidate.source === "site"
                    ? "🌐 Сайт"
                    : candidate.source === "telegram_bot"
                      ? "✈️ Telegram"
                      : "✋ Ручны"}
                </span>
              </div>

              {/* Нататкі рэкрутэра */}
              {candidate.notes && (
                <>
                  <Divider label="📝 Нататкі" />
                  <p className="text-sm text-slate-400 bg-slate-800 rounded-lg px-3 py-2">
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
              {/* Пажаданні */}
              {candidate.jobPreferences && (
                <>
                  <Divider label="🔍 Пажаданні да працы" />
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {candidate.jobPreferences.locationFlexible ? (
                      <div className="text-slate-400">
                        📍 Гатовы да пераезду
                      </div>
                    ) : candidate.jobPreferences.location?.length > 0 ? (
  <div className="text-slate-400">
    📍 {Array.isArray(candidate.jobPreferences.location) 
        ? candidate.jobPreferences.location.join(", ") 
        : candidate.jobPreferences.location}
  </div>
) : null}
                    {candidate.jobPreferences.readyDate && (
                      <div className="text-slate-400">
                        📅 Гатовы з: {candidate.jobPreferences.readyDate}
                      </div>
                    )}
                    {candidate.jobPreferences.needsAccommodation && (
                      <div className="text-slate-400">🏠 Патрэбна жытло</div>
                    )}
                    {candidate.jobPreferences.travelGroup && (
                      <div className="text-slate-400">
                        👥{" "}
                        {candidate.jobPreferences.travelGroup === "alone"
                          ? "Адзін/а"
                          : candidate.jobPreferences.travelGroup === "couple"
                            ? "Пара"
                            : "З сям'ёй"}
                      </div>
                    )}
                    {candidate.jobPreferences.schedule?.length > 0 && (
                      <div className="text-slate-400">
                        ⏰ {candidate.jobPreferences.schedule.join(", ")}
                      </div>
                    )}
                    {candidate.jobPreferences.contractType && (
                      <div className="text-slate-400">
                        📄 {candidate.jobPreferences.contractType}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Дакументы */}
              {candidate.documents && (
                <>
                  <Divider label="📄 Дакументы" />
                  <div className="flex gap-3 flex-wrap">
                    {[
                      [candidate.documents.hasVisa, "Віза"],
                      [candidate.documents.hasSanepid, "Санепід"],
                      [candidate.documents.hasUDT, "UDT"],
                    ].map(([has, label]) => (
                      <span
                        key={label}
                        className={`text-xs px-2 py-1 rounded-lg ${
                          has
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-slate-800 text-slate-600"
                        }`}
                      >
                        {has ? "✅" : "❌"} {label}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* Заяўкі на вакансіі */}
              {candidate.appliedVacancies?.length > 0 && (
                <>
                  <Divider label="💼 Заяўкі на вакансіі" />
                  <div className="space-y-2">
                    {candidate.appliedVacancies.map((av, i) => (
                      <div
                        key={i}
                        className="bg-slate-800 rounded-lg px-3 py-2 text-sm"
                      >
                        <span className="text-slate-300">
                          {av.type === "want_work"
                            ? "🟢 Хоча працаваць"
                            : "💬 Хоча дэталі"}
                        </span>
                        {(av.vacancyId?.vacancydescription || av.vacancyId?.title) && (
  <span className="text-slate-500 ml-2">
    — {av.vacancyId.vacancydescription || av.vacancyId.title}
  </span>
)}
                        {av.vacancyId?.vacancyCode && (
                          <span className="text-slate-600 ml-2 font-mono text-xs">
                            ({av.vacancyId.vacancyCode})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
              {/* Матчынг вакансій */}
              {matchedVacancies !== null && (
                <>
                  <Divider label="🎯 Падыходзячыя вакансіі" />
                  {matchedVacancies.length === 0 ? (
                    <p className="text-xs text-slate-600">
                      Падыходзячых вакансій не знойдзена
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {matchedVacancies.map((v) => (
                        <div
                          key={v._id}
                          className="bg-slate-800 rounded-lg px-3 py-2"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-slate-200 font-medium">
  {v.vacancydescription || v.title}
</span>
                              {v.vacancyCode && (
                                <span className="text-xs font-mono text-slate-500 ml-2">
                                  ({v.vacancyCode})
                                </span>
                              )}
                            </div>
                            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">
                              ⭐ {v.matchScore}
                            </span>
                          </div>
                          <div className="flex gap-3 mt-1 text-xs text-slate-500">
                            <span>📍 {v.location}</span>
                            {v.agencyName && <span>🏢 {v.agencyName}</span>}
                            {v.salary?.base && <span>💰 {v.salary.base}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              {/* Гісторыя */}
              <Divider label="🗂 Гісторыя зносін" />
              <div className="space-y-2 mb-3">
                {!candidate.history?.length ? (
                  <p className="text-xs text-slate-600">Гісторыя пустая</p>
                ) : (
                  [...candidate.history].reverse().map((h, i) => (
                    <div key={i} className="bg-slate-800 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-500">
                          {new Date(h.date).toLocaleString("uk-UA", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="text-xs bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">
                          {h.type === "call"
                            ? "📞 Званок"
                            : h.type === "chat"
                              ? "💬 Чат"
                              : "📝 Нататка"}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300">{h.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Дадаць нататку */}
              <div className="flex gap-2">
                <input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                  placeholder="Дадаць нататку..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleAddNote}
                  disabled={addingNote || !newNote.trim()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-medium text-sm rounded-lg transition-colors"
                >
                  Дадаць
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Мадалка рэдагавання */}
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
