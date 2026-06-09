import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getInboxMessages,
  getInboxStats,
  deleteInboxMessage,
  bulkDeleteInbox,
  getVacancies,
  aiUpdateVacancy,
} from "../services/api";

const CATEGORY_LABELS = {
  vacancy: {
    label: "Вакансія",
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  update: {
    label: "Оновлення",
    color: "text-amber-700 bg-amber-50 border-amber-200",
  },
  info: {
    label: "Інфо",
    color: "text-blue-700 bg-blue-50 border-blue-200",
  },
};

const SOURCE_ICON = {
  viber: "💜",
  telegram: "✈️",
  macrodroid_raw: "📱",
  telegram_userbot: "🤖",
  error_fallback: "⚠️",
};

export default function Inbox() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    vacancy: 0,
    update: 0,
    info: 0,
    pendingAi: 0, // Новае поле для статыстыкі
  });
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());
  const [expandedId, setExpandedId] = useState(null);
  const [showUpdatePicker, setShowUpdatePicker] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const notifyUpdate = () => {
    window.dispatchEvent(new CustomEvent("inboxUpdated"));
  };

  const fetchAll = useCallback(async () => {
    try {
      const [msgsRes, statsRes, vacRes] = await Promise.all([
        getInboxMessages(),
        getInboxStats(),
        getVacancies(),
      ]);

      const msgs = msgsRes.data;
      setMessages(msgs);

      // Падлічваем колькасць тых, хто чакае AI, калі бэкенд яшчэ не аддае гэта ў stats
      const pendingAiCount = msgs.filter((m) => !m.aiAnalyzed).length;

      setStats({
        ...statsRes.data,
        pendingAi: pendingAiCount,
      });

      setVacancies(vacRes.data.filter((v) => v.status === "active"));
      notifyUpdate();
    } catch (err) {
      console.error("Памылка загрузкі:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleDelete = async (id) => {
    if (!window.confirm("Выдаліць паведамленне?")) return;
    try {
      await deleteInboxMessage(id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      notifyUpdate();
    } catch (err) {
      alert("Памылка выдалення");
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selected);
    if (!ids.length || !window.confirm(`Выдаліць ${ids.length} паведамленняў?`))
      return;
    try {
      await bulkDeleteInbox({ ids });
      setMessages((prev) => prev.filter((m) => !selected.has(m._id)));
      setSelected(new Set());
      notifyUpdate();
      const res = await getInboxStats();
      setStats(res.data);
    } catch (err) {
      alert("Памылка масавага выдалення");
    }
  };

  const handleCreateVacancy = (msg) => {
    navigate("/vacancies", {
      state: { initialText: msg.rawText || msg.text, messageId: msg._id },
    });
  };

  const handleAiUpdate = async (msg, vacancyId) => {
    setProcessingId(msg._id);
    try {
      await aiUpdateVacancy(vacancyId, msg.rawText || msg.text, msg._id);
      notifyUpdate();
      alert("✅ Вакансія оновлена!");
      fetchAll();
    } catch (err) {
      alert("❌ Помилка: " + err.message);
    } finally {
      setProcessingId(null);
      setShowUpdatePicker(null);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((m) => m._id)));
    }
  };

  const filtered = messages.filter(
    (m) => categoryFilter === "all" || m.category === categoryFilter,
  );

  if (loading)
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-slate-500 text-center">
        Загрузка...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Пісочниця (Inbox)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Обробка вхідних повідомлень
          </p>
        </div>
        <div className="flex gap-2">
          {selected.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              Видалити вибрані ({selected.size})
            </button>
          )}
          <button
            onClick={fetchAll}
            className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Оновити список
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          {
            key: "all",
            label: "Усі",
            count: stats.total,
            color: "text-slate-300",
          },
          {
            key: "vacancy",
            label: "Вакансії",
            count: stats.vacancy,
            color: "text-emerald-400",
          },
          {
            key: "update",
            label: "Оновлення",
            count: stats.update,
            color: "text-amber-400",
          },
          {
            key: "info",
            label: "Інфо",
            count: stats.info || 0,
            color: "text-blue-400",
          },
          {
            key: "pending",
            label: "Чекають AI",
            count: stats.pendingAi || 0,
            color: "text-indigo-400",
          },
        ].map(({ key, label, count, color }) => (
          <button
            key={key}
            onClick={() => key !== "pending" && setCategoryFilter(key)}
            className={`bg-white border rounded-2xl p-4 text-left transition-all shadow-sm ${categoryFilter === key ? "border-emerald-500 ring-2 ring-emerald-500/10 bg-emerald-50/30" : "border-slate-200 hover:border-slate-300"}`}
          >
            <div
              className={`text-3xl font-black ${color.replace("400", "600")}`}
            >
              {count}
            </div>
            <div className="text-xs text-slate-500">{label}</div>
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-[40px_1fr_150px_100px_80px] gap-3 px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 bg-slate-50/50">
          <input
            type="checkbox"
            checked={selected.size > 0 && selected.size === filtered.length}
            onChange={toggleSelectAll}
            className="accent-emerald-500"
          />
          <span>Змест повидомлення</span>
          <span>Агенція / Чат</span>
          <span>Час</span>
          <span className="text-right">Дії</span>
        </div>

        <div className="divide-y divide-slate-800/50">
          {filtered.map((msg) => {
            const isExpanded = expandedId === msg._id;
            const isPicking = showUpdatePicker === msg._id;
            const isProcessing = processingId === msg._id;
            const cat = CATEGORY_LABELS[msg.category] || CATEGORY_LABELS.info;
            const isAnalyzed = msg.aiAnalyzed;

            return (
              <div
                key={msg._id}
                className={`${selected.has(msg._id) ? "bg-emerald-50/50" : ""} ${!isAnalyzed ? "opacity-60" : ""} border-b border-slate-100 last:border-0`}
              >
                <div className="grid grid-cols-[40px_1fr_150px_100px_80px] gap-3 px-5 py-4 items-center hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={selected.has(msg._id)}
                    onChange={() => toggleSelect(msg._id)}
                    className="accent-emerald-500"
                  />
                  <div
                    className="min-w-0 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : msg._id)}
                  >
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold ${cat.color}`}
                      >
                        {cat.label}
                      </span>

                      {/* СТАТУС AI */}
                      {isAnalyzed ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold">
                          ✨ Оброблено
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 border-dashed font-medium">
                          ⏳ Не оброблено
                        </span>
                      )}

                      {msg.agencyName && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {msg.agencyName}
                        </span>
                      )}
                      {msg.isTruncated && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-bold animate-pulse">
                          ⚠️ Обрізано
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-sm font-medium  ${isExpanded ? "text-slate-900" : "text-slate-500 truncate"}`}
                    >
                      {/* Паказваем пераклад, калі ён ёсць, інакш арыгінал */}
                      {isAnalyzed ? msg.rawText || msg.text : msg.text}
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {SOURCE_ICON[msg.source] || "📩"} {msg.sender}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {new Date(msg.createdAt).toLocaleString("be-BY", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => handleCreateVacancy(msg)}
                      title="Стварыць"
                      disabled={!isAnalyzed}
                      className={`p-1.5 rounded-md ${isAnalyzed ? "hover:bg-emerald-500/20 text-emerald-500" : "text-slate-700 cursor-not-allowed"}`}
                    >
                      🤖
                    </button>
                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="p-1.5 hover:bg-red-500/20 text-slate-500 hover:text-red-500 rounded-md"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-14 pb-4 animate-in fade-in slide-in-from-top-1">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-base text-slate-800 whitespace-pre-wrap leading-relaxed shadow-inner">
                      {isAnalyzed ? msg.rawText || msg.text : msg.text}
                    </div>

                    {isAnalyzed && !isPicking && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleCreateVacancy(msg)}
                          className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-md transition-colors"
                        >
                          Створити вакансію
                        </button>
                        <button
                          onClick={() => setShowUpdatePicker(msg._id)}
                          className="text-xs bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-md transition-colors"
                        >
                          Оновити існуючую
                        </button>
                      </div>
                    )}

                    {isAnalyzed && isPicking && (
                      <div className="mt-6 p-6 bg-white rounded-2xl border border-amber-200 shadow-xl ring-1 ring-amber-500/10">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                            Оберить вакансію:
                          </h4>
                          <button
                            onClick={() => setShowUpdatePicker(null)}
                            className="text-slate-500 hover:text-white text-xs"
                          >
                            Скосувати
                          </button>
                        </div>
                        {isProcessing ? (
                          <div className="py-4 text-center text-amber-400 text-xs animate-pulse">
                            AI обробляє...
                          </div>
                        ) : (
                          <div className="max-h-60 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                            {vacancies.map((v) => (
                              <button
                                key={v._id}
                                onClick={() => handleAiUpdate(msg, v._id)}
                                className="w-full text-left p-2.5 text-xs hover:bg-slate-700 rounded border border-slate-700 text-slate-300 flex justify-between items-center group"
                              >
                                <span>
                                  <b className="text-emerald-500 mr-2">
                                    {v.vacancyCode}
                                  </b>
                                  {v.templateName || v.vacancydescription}
                                </span>
                                <span className="opacity-0 group-hover:opacity-100 text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded">
                                  Обрати
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {!isAnalyzed && (
                      <div className="mt-3 text-[10px] text-slate-500 italic">
                        Повідомлення чекає на чергову ітерацію AI-аналізу (кожні
                        10 хвилин)...
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
