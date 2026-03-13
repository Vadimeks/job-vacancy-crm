// frontend/src/pages/Vacancies.jsx
import { useEffect, useState } from "react";
import {
  getVacancies,
  deleteVacancy,
  createVacancyAuto,
  updateVacancy,
} from "../services/api";

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

// Дапаможны кампанент — поле ўводу
function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1">{label}</label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
      />
    </div>
  );
}

// Дапаможны кампанент — раздзяляльнік
function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <div className="flex-1 h-px bg-slate-800" />
    </div>
  );
}

// Мадальнае акно рэдагавання
function EditModal({ vacancy, onClose, onSave }) {
  const [form, setForm] = useState({ ...vacancy });
  const [saving, setSaving] = useState(false);

  const setField = (path, value) => {
    const parts = path.split(".");
    setForm((prev) => {
      const next = { ...prev };
      if (parts.length === 1) {
        next[parts[0]] = value;
      } else {
        next[parts[0]] = { ...next[parts[0]], [parts[1]]: value };
      }
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateVacancy(vacancy._id, form);
      onSave(res.data);
      onClose();
    } catch {
      alert("Памылка захавання");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Фон */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Мадалка */}
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4">
        {/* Загаловак мадалкі */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div>
            <h2 className="font-semibold text-slate-100">
              Рэдагаванне вакансіі
            </h2>
            <div className="flex items-center gap-3 mt-1">
              {vacancy.vacancyCode && (
                <span className="text-xs font-mono text-slate-500">
                  {vacancy.vacancyCode}
                </span>
              )}
              <span className="text-xs text-slate-600">
                Створана:{" "}
                {new Date(vacancy.createdAt).toLocaleString("uk-UA", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {vacancy.agencyName && (
                <span className="text-xs bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono">
                  {vacancy.agencyName}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Змест */}
        <div className="px-6 py-5 space-y-2">
          {/* Статус */}
          <div className="mb-4">
            <label className="block text-xs text-slate-500 mb-1">Статус</label>
            <select
              value={form.status}
              onChange={(e) => setField("status", e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="active">Актыўная</option>
              <option value="closed">Закрыта</option>
              <option value="archived">Архіў</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field
                label="Загаловак"
                value={form.title}
                onChange={(v) => setField("title", v)}
              />
            </div>
            <Field
              label="Лакацыя"
              value={form.location}
              onChange={(v) => setField("location", v)}
            />
            <Field
              label="Агенцыя"
              value={form.agencyName}
              onChange={(v) => setField("agencyName", v)}
            />
            <Field
              label="Краіна"
              value={form.country}
              onChange={(v) => setField("country", v)}
            />
            <Field
              label="Дата прыезду"
              value={form.arrivalDate}
              onChange={(v) => setField("arrivalDate", v)}
              placeholder="напр. 20.04"
            />
          </div>

          <Divider label="💰 Аплата" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Базавая стаўка"
              value={form.salary?.base}
              onChange={(v) => setField("salary.base", v)}
            />
            <Field
              label="Студэнцкая стаўка"
              value={form.salary?.student}
              onChange={(v) => setField("salary.student", v)}
            />
            <Field
              label="Месячны заробак"
              value={form.salary?.monthly}
              onChange={(v) => setField("salary.monthly", v)}
            />
            <Field
              label="Бонусы"
              value={form.salary?.bonus}
              onChange={(v) => setField("salary.bonus", v)}
            />
          </div>

          <Divider label="🕒 Графік" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Змены"
              value={form.schedule?.shifts}
              onChange={(v) => setField("schedule.shifts", v)}
            />
            <Field
              label="Гадзіны ў месяц"
              value={form.schedule?.hours}
              onChange={(v) => setField("schedule.hours", v)}
            />
            <div className="col-span-2">
              <Field
                label="Дэталі графіка"
                value={form.schedule?.details}
                onChange={(v) => setField("schedule.details", v)}
              />
            </div>
          </div>

          <Divider label="🛠 Абавязкі" />
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Апісанне
            </label>
            <textarea
              value={form.description || ""}
              onChange={(e) => setField("description", e.target.value)}
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <Divider label="📋 Патрабаванні" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Гендар"
              value={form.requirements?.gender}
              onChange={(v) => setField("requirements.gender", v)}
            />
            <Field
              label="Узрост"
              value={form.requirements?.age}
              onChange={(v) => setField("requirements.age", v)}
            />
            <Field
              label="Фізічная форма"
              value={form.requirements?.physical}
              onChange={(v) => setField("requirements.physical", v)}
            />
            <Field
              label="Тып дагавора"
              value={form.contractType}
              onChange={(v) => setField("contractType", v)}
            />
          </div>

          <Divider label="🏠 Жытло" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Кошт"
              value={form.accommodation?.cost}
              onChange={(v) => setField("accommodation.cost", v)}
            />
            <Field
              label="Дэпазіт"
              value={form.accommodation?.deposit}
              onChange={(v) => setField("accommodation.deposit", v)}
            />
            <div className="col-span-2">
              <Field
                label="Дэталі"
                value={form.accommodation?.details}
                onChange={(v) => setField("accommodation.details", v)}
              />
            </div>
          </div>

          <Divider label="🚌 Транспарт" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Кошт"
              value={form.transport?.cost}
              onChange={(v) => setField("transport.cost", v)}
            />
            <Field
              label="Дэталі"
              value={form.transport?.details}
              onChange={(v) => setField("transport.details", v)}
            />
          </div>

          <Divider label="🌡 Умовы" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Тэмпература"
              value={form.conditions?.temperature}
              onChange={(v) => setField("conditions.temperature", v)}
            />
            <Field
              label="Спецвопратка"
              value={form.conditions?.workwear}
              onChange={(v) => setField("conditions.workwear", v)}
            />
            <Field
              label="Харчаванне"
              value={form.conditions?.food}
              onChange={(v) => setField("conditions.food", v)}
            />
          </div>
        </div>

        {/* Кнопкі */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-medium text-sm rounded-lg transition-colors"
          >
            {saving ? "Захаванне..." : "Захаваць"}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
          >
            Адмена
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Vacancies() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoText, setAutoText] = useState("");
  const [autoLoading, setAutoLoading] = useState(false);
  const [showAutoForm, setShowAutoForm] = useState(false);
  const [editVacancy, setEditVacancy] = useState(null);

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
                  <div className="flex items-center gap-3 mb-2">
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
                    {/* Дата стварэння */}
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
                </div>

                {/* Кнопкі */}
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setEditVacancy(v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors text-xs"
                    title="Рэдагаваць"
                  >
                    ✏️ Рэд.
                  </button>
                  <button
                    onClick={() => handleDelete(v._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-xs"
                    title="Выдаліць"
                  >
                    🗑 Выд.
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Мадальнае акно рэдагавання */}
      {editVacancy && (
        <EditModal
          vacancy={editVacancy}
          onClose={() => setEditVacancy(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
