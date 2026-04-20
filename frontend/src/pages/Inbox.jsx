import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getInboxMessages, deleteInboxMessage } from "../services/api";

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMessages = useCallback(async () => {
    try {
      const res = await getInboxMessages();
      setMessages(res.data);
    } catch (err) {
      console.error("Памылка загрузкі паведамленняў", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleDelete = async (id) => {
    if (!window.confirm("Выдаліць гэтае паведамленне?")) return;
    try {
      await deleteInboxMessage(id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Памылка выдалення", err);
    }
  };

  const handleCreateVacancy = (msg) => {
    navigate("/vacancies", { state: { initialText: msg.text } });
  };

  if (loading) return <div className="p-8 text-slate-500">Загрузка...</div>;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Уваходныя</h1>
          <p className="text-sm text-slate-500">
            Паведамленні з Viber і Telegram
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center">
            <p className="text-slate-500">Няма новых паведамленняў</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      msg.source === "viber"
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}
                  >
                    {msg.source}
                  </span>
                  <strong className="text-slate-200">{msg.sender}</strong>
                </div>
                <span className="text-xs text-slate-600 font-mono">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="bg-slate-950/50 rounded-lg p-4 mb-4 border border-slate-800/50">
                <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.text}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleCreateVacancy(msg)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-xs rounded-lg transition-colors"
                >
                  🤖 Стварыць вакансію
                </button>
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="px-4 py-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 text-xs rounded-lg transition-colors"
                >
                  Выдаліць
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Inbox;
