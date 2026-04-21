// frontend/src/pages/Inbox.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getInboxMessages,
  getInboxStats,
  deleteInboxMessage,
  bulkDeleteInbox,
} from "../services/api";

const CATEGORY_LABELS = {
  vacancy: {
    label: "Вакансія",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  update: {
    label: "Абнаўленне",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  chat: {
    label: "Чат",
    color: "text-slate-400 bg-slate-500/10 border-slate-500/20",
  },
};

const SOURCE_ICON = {
  viber: "💜",
  telegram: "✈️",
};

export default function Inbox() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    vacancy: 0,
    update: 0,
    chat: 0,
  });
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      const [msgsRes, statsRes] = await Promise.all([
        getInboxMessages(),
        getInboxStats(),
      ]);
      setMessages(msgsRes.data);
      setStats(statsRes.data);
    } catch {
      console.error("Памылка загрузкі");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filtered = messages.filter(
    (m) => categoryFilter === "all" || m.category === categoryFilter,
  );

  // --- ВЫДАЛЕННЕ ---
  const handleDelete = async (id) => {
    await deleteInboxMessage(id);
    setMessages((prev) => prev.filter((m) => m._id !== id));
  };

  const handleBulkDelete = async (what) => {
    setBulkLoading(true);
    try {
      if (what === "selected" && selected.size > 0) {
        await bulkDeleteInbox({ ids: Array.from(selected) });
        setMessages((prev) => prev.filter((m) => !selected.has(m._id)));
        setSelected(new Set());
      } else if (what === "category" && categoryFilter !== "all") {
        await bulkDeleteInbox({ category: categoryFilter });
        setMessages((prev) =>
          prev.filter((m) => m.category !== categoryFilter),
        );
      } else if (what === "all") {
        await bulkDeleteInbox({ all: true });
        setMessages([]);
      }
    } finally {
      setBulkLoading(false);
      fetchAll(); // абновіць статыстыку
    }
  };

  // --- СТВАРЫЦЬ ВАКАНСІЮ ---
  const handleCreateVacancy = (msg) => {
    navigate("/vacancies", { state: { initialText: msg.text } });
  };

  // --- ВЫБАРКА ---
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

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 pt-8">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          Загрузка...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* ЗАГАЛОВАК */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Уваходныя</h1>
          <p className="text-sm text-slate-500 mt-1">
            Паведамленні з Viber і Telegram
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {selected.size > 0 && (
            <button
              onClick={() => handleBulkDelete("selected")}
              disabled={bulkLoading}
              className="px-3 py-1.5 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
            >
              🗑 Выдаліць выбраныя ({selected.size})
            </button>
          )}
          {categoryFilter !== "all" && (
            <button
              onClick={() => handleBulkDelete("category")}
              disabled={bulkLoading}
              className="px-3 py-1.5 text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-colors disabled:opacity-50"
            >
              🗑 Выдаліць усе «{CATEGORY_LABELS[categoryFilter]?.label}»
            </button>
          )}
          <button
            onClick={() => handleBulkDelete("all")}
            disabled={bulkLoading}
            className="px-3 py-1.5 text-xs bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            🗑 Выдаліць усё
          </button>
        </div>
      </div>

      {/* СТАТЫСТЫКА */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          {
            key: "all",
            label: "Усе",
            count: stats.total,
            color: "text-slate-300",
          },
          {
            key: "vacancy",
            label: "Вакансіі",
            count: stats.vacancy,
            color: "text-emerald-400",
          },
          {
            key: "update",
            label: "Абнаўленні",
            count: stats.update,
            color: "text-amber-400",
          },
          {
            key: "chat",
            label: "Чат",
            count: stats.chat,
            color: "text-slate-500",
          },
        ].map(({ key, label, count, color }) => (
          <button
            key={key}
            onClick={() => {
              setCategoryFilter(key);
              setSelected(new Set());
            }}
            className={`bg-slate-900 border rounded-xl p-3 text-left transition-all ${
              categoryFilter === key
                ? "border-emerald-500/40 bg-emerald-500/5"
                : "border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className={`text-2xl font-bold ${color}`}>{count}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </button>
        ))}
      </div>

      {/* ТАБЛІЦА */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <div className="text-4xl mb-3">📭</div>
          <p>Паведамленняў няма</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {/* Загаловак табліцы */}
          <div className="grid grid-cols-[24px_1fr_140px_90px_90px] gap-3 px-4 py-2.5 text-xs text-slate-500 border-b border-slate-800 bg-slate-950">
            <input
              type="checkbox"
              checked={selected.size === filtered.length && filtered.length > 0}
              onChange={toggleSelectAll}
              className="rounded accent-emerald-500 cursor-pointer"
            />
            <span>Паведамленне</span>
            <span>Адпраўнік</span>
            <span>Час</span>
            <span className="text-right">Дзеянні</span>
          </div>

          {/* Радкі */}
          <div className="divide-y divide-slate-800/60">
            {filtered.map((msg) => {
              const isExpanded = expandedId === msg._id;
              const catInfo =
                CATEGORY_LABELS[msg.category] || CATEGORY_LABELS.chat;
              const isVacancyLike =
                msg.category === "vacancy" || msg.category === "update";

              return (
                <div
                  key={msg._id}
                  className={`transition-colors ${selected.has(msg._id) ? "bg-emerald-500/5" : "hover:bg-slate-800/30"}`}
                >
                  <div className="grid grid-cols-[24px_1fr_140px_90px_90px] gap-3 px-4 py-3 items-center">
                    {/* Чэкбокс */}
                    <input
                      type="checkbox"
                      checked={selected.has(msg._id)}
                      onChange={() => toggleSelect(msg._id)}
                      className="rounded accent-emerald-500 cursor-pointer"
                    />

                    {/* Тэкст */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${catInfo.color}`}
                        >
                          {catInfo.label}
                        </span>
                        <span className="text-[10px] text-slate-600">
                          {SOURCE_ICON[msg.source] || "📩"} {msg.source}
                        </span>
                      </div>
                      <p
                        className={`text-sm text-slate-300 cursor-pointer ${isExpanded ? "" : "truncate"}`}
                        onClick={() =>
                          setExpandedId(isExpanded ? null : msg._id)
                        }
                      >
                        {msg.text}
                      </p>
                    </div>

                    {/* Адпраўнік */}
                    <span className="text-xs text-slate-500 truncate">
                      {msg.sender}
                    </span>

                    {/* Час */}
                    <span className="text-xs text-slate-600">
                      {formatTime(msg.createdAt)}
                    </span>

                    {/* Дзеянні */}
                    <div className="flex items-center justify-end gap-1">
                      {isVacancyLike && (
                        <button
                          onClick={() => handleCreateVacancy(msg)}
                          title="Стварыць вакансію"
                          className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg text-xs transition-colors"
                        >
                          🤖
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(msg._id)}
                        title="Выдаліць"
                        className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-xs transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Разгорнуты тэкст */}
                  {isExpanded && (
                    <div className="px-10 pb-3">
                      <div className="bg-slate-800/50 rounded-lg p-3 text-sm text-slate-300 whitespace-pre-wrap break-words border border-slate-700/50">
                        {msg.text}
                      </div>
                      {isVacancyLike && (
                        <button
                          onClick={() => handleCreateVacancy(msg)}
                          className="mt-2 px-3 py-1.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors"
                        >
                          🤖 Стварыць вакансію з гэтага тэксту
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-xs text-slate-600 mt-4 text-center">
        Паказана {filtered.length} з {messages.length} паведамленняў
      </p>
    </div>
  );
}
