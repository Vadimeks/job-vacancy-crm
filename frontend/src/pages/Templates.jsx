// frontend/src/pages/Templates.jsx
import { useEffect, useState } from "react";
import { getTemplates, deleteTemplate } from "../services/api";
import AddTemplateModal from "../components/templates/AddTemplateModal";
import EditTemplateModal from "../components/templates/EditTemplateModal";
import TemplateViewModal from "../components/templates/TemplateViewModal";

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAgency, setFilterAgency] = useState("");
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null);
  const [viewTemplate, setViewTemplate] = useState(null);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await getTemplates();
      setTemplates(res.data);
    } catch {
      console.error("Памылка загрузкі шаблонаў");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const agencies = [...new Set(templates.map((t) => t.agencyName))].sort();

  const filtered = templates.filter((t) => {
    const matchAgency = !filterAgency || t.agencyName === filterAgency;
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      t.templateName?.toLowerCase().includes(q) ||
      t.title?.toLowerCase().includes(q) ||
      t.location?.toLowerCase().includes(q) ||
      t.keywords?.some((kw) => kw.toLowerCase().includes(q));
    return matchAgency && matchSearch;
  });

  const handleDelete = async (id) => {
    if (!confirm("Выдаліць шаблон?")) return;
    try {
      await deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => t._id !== id));
    } catch {
      alert("Памылка выдалення");
    }
  };

  const handleAdd = (newTemplate) => {
    setTemplates((prev) => [...prev, newTemplate]);
  };

  const handleSaveEdit = (updated) => {
    setTemplates((prev) =>
      prev.map((t) => (t._id === updated._id ? updated : t)),
    );
  };

  const handleEditFromView = (template) => {
    setViewTemplate(null);
    setEditTemplate(template);
  };

  return (
    <div className="p-8">
      {/* Загаловак */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Шаблоны</h1>
          <p className="text-sm text-slate-500 mt-1">
            {filtered.length} з {templates.length} шаблонаў у {agencies.length}{" "}
            агенцыях
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-medium text-sm rounded-lg transition-colors"
        >
          <span>＋</span> Новы шаблон
        </button>
      </div>

      {/* Пошук */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Пошук па назве, фірме, горадзе, ключавых словах..."
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* Фільтр па агенцыях */}
      {agencies.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setFilterAgency("")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterAgency === ""
                ? "bg-emerald-500 text-slate-900"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            Усе агенцыі
          </button>
          {agencies.map((a) => (
            <button
              key={a}
              onClick={() => setFilterAgency(a)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterAgency === a
                  ? "bg-emerald-500 text-slate-900"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      )}

      {/* Спіс шаблонаў */}
      {loading ? (
        <div className="text-slate-500 text-sm">Загрузка...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <div className="text-4xl mb-3">📋</div>
          <div className="text-sm">
            {search
              ? `Нічога не знойдзена па «${search}»`
              : "Шаблонаў пакуль няма"}
          </div>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mt-3 text-xs text-emerald-500 hover:text-emerald-400"
            >
              Ачысціць пошук
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <div
              key={t._id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors cursor-pointer"
              onClick={() => setViewTemplate(t)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono shrink-0">
                      {t.agencyName}
                    </span>
                    <h3 className="font-medium text-slate-100 truncate">
                      {t.templateName}
                    </h3>
                  </div>
                  {t.title && (
                    <p className="text-sm text-slate-400 mt-1 truncate">
                      {t.title}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {t.keywords?.slice(0, 6).map((kw) => (
                      <span
                        key={kw}
                        className="text-xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded"
                      >
                        {kw}
                      </span>
                    ))}
                    {t.keywords?.length > 6 && (
                      <span className="text-xs text-slate-600">
                        +{t.keywords.length - 6}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className="flex gap-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setViewTemplate(t)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors text-xs"
                    title="Паглядзець"
                  >
                    👁
                  </button>
                  <button
                    onClick={() => setEditTemplate(t)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors text-xs"
                    title="Рэдагаваць"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-xs"
                    title="Выдаліць"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <AddTemplateModal
          onClose={() => setShowAddForm(false)}
          onAdd={handleAdd}
        />
      )}

      {editTemplate && (
        <EditTemplateModal
          template={editTemplate}
          onClose={() => setEditTemplate(null)}
          onSave={handleSaveEdit}
        />
      )}

      {viewTemplate && (
        <TemplateViewModal
          template={viewTemplate}
          onClose={() => setViewTemplate(null)}
          onEdit={handleEditFromView}
        />
      )}
    </div>
  );
}
