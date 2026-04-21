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
  info: {
    label: "Інфа",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
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
    info: 0,
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

  const handleDelete = async (id) => {
    await deleteInboxMessage(id);
    setMessages((prev) => prev.filter((m) => m._id !== id));
  };

  const handleBulkDelete = async (what) => {
    if (!window.confirm("Вы ўпэўнены?")) return;
    setBulkLoading(true);
    try {
      if (what === "selected" && selected.size > 0) {
        await bulkDeleteInbox({ ids: Array.from(selected) });
      } else if (what === "category" && categoryFilter !== "all") {
        await bulkDeleteInbox({ category: categoryFilter });
      } else if (what === "all") {
        await bulkDeleteInbox({ all: true });
      }
    } finally {
      setBulkLoading(false);
      setSelected(new Set());
      fetchAll();
    }
  };

  const handleCreateVacancy = (msg) => {
    navigate("/vacancies", { state: { initialText: msg.text } });
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

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleString("be-BY", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-slate-500">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">
            Пясочніца (Inbox)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Апрацоўка ўваходных паведамленняў
          </p>
        </div>
        <div className="flex gap-2">
          {selected.size > 0 && (
            <button
              onClick={() => handleBulkDelete("selected")}
              className="px-3 py-1.5 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg"
            >
              Выдаліць выбраныя ({selected.size})
            </button>
          )}
          <button
            onClick={() => handleBulkDelete("all")}
            className="px-3 py-1.5 text-xs bg-slate-800 text-slate-400 rounded-lg"
          >
            Ачысціць усё
          </button>
        </div>
      </div>

      {/* СТАТЫСТЫКА / ФІЛЬТРЫ */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
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
            key: "info",
            label: "Інфа",
            count: stats.info || 0,
            color: "text-blue-400",
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
            onClick={() => setCategoryFilter(key)}
            className={`bg-slate-900 border rounded-xl p-3 text-left transition-all ${
              categoryFilter === key
                ? "border-emerald-500/40 bg-emerald-500/5"
                : "border-slate-800"
            }`}
          >
            <div className={`text-2xl font-bold ${color}`}>{count}</div>
            <div className="text-xs text-slate-500">{label}</div>
          </button>
        ))}
      </div>

      {/* СПІС */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[40px_1fr_120px_100px_80px] gap-3 px-4 py-2 text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800 bg-slate-950">
          <input
            type="checkbox"
            checked={selected.size === filtered.length}
            onChange={toggleSelectAll}
            className="accent-emerald-500"
          />
          <span>Змест (Пераклад)</span>
          <span>Агенцыя / Чат</span>
          <span>Час</span>
          <span className="text-right">Дзеянні</span>
        </div>

        <div className="divide-y divide-slate-800/50">
          {filtered.map((msg) => {
            const isExpanded = expandedId === msg._id;
            const cat = CATEGORY_LABELS[msg.category] || CATEGORY_LABELS.chat;

            return (
              <div
                key={msg._id}
                className={`${selected.has(msg._id) ? "bg-emerald-500/5" : ""}`}
              >
                <div className="grid grid-cols-[40px_1fr_120px_100px_80px] gap-3 px-4 py-3 items-center hover:bg-slate-800/30 transition-colors">
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
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold ${cat.color}`}
                      >
                        {cat.label}
                      </span>
                      {msg.agencyName && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {msg.agencyName}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-sm ${isExpanded ? "text-slate-100" : "text-slate-400 truncate"}`}
                    >
                      {msg.text}
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-500 truncate">
                    {SOURCE_ICON[msg.source]} {msg.sender}
                  </div>

                  <div className="text-[11px] text-slate-600">
                    {formatTime(msg.createdAt)}
                  </div>

                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => handleCreateVacancy(msg)}
                      className="p-1.5 hover:bg-emerald-500/20 text-emerald-500 rounded-md"
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
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {msg.text}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleCreateVacancy(msg)}
                        className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-md transition-colors"
                      >
                        Стварыць вакансію
                      </button>
                    </div>
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
