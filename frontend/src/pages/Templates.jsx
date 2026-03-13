// frontend/src/pages/Templates.jsx
import { useEffect, useState } from "react";
import { getTemplates, deleteTemplate, createTemplate } from "../services/api";

const EMPTY_TEMPLATE = {
  agencyName: "",
  templateName: "",
  keywords: "",
  title: "",
  location: "",
  country: "Польща",
  salary: { base: "", student: "", monthly: "", bonus: "", notes: "" },
  schedule: { shifts: "", hours: "", details: "" },
  description: "",
  accommodation: { available: true, cost: "", details: "", deposit: "" },
  transport: { provided: true, cost: "", details: "" },
  requirements: {
    gender: "",
    age: "",
    nationalities: "",
    docs: "",
    physical: "",
  },
  conditions: { temperature: "", workwear: "", food: "" },
  contractType: "",
};

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_TEMPLATE);
  const [saving, setSaving] = useState(false);
  const [filterAgency, setFilterAgency] = useState("");

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

  const filtered = filterAgency
    ? templates.filter((t) => t.agencyName === filterAgency)
    : templates;

  const handleDelete = async (id) => {
    if (!confirm("Выдаліць шаблон?")) return;
    try {
      await deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => t._id !== id));
    } catch {
      alert("Памылка выдалення");
    }
  };

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
    if (!form.agencyName || !form.templateName) {
      alert("Назва агенцыі і шаблона абавязковыя");
      return;
    }
    setSaving(true);
    try {
      const data = {
        ...form,
        keywords: form.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        requirements: {
          ...form.requirements,
          nationalities: form.requirements.nationalities
            .split(",")
            .map((n) => n.trim())
            .filter(Boolean),
          docs: form.requirements.docs
            .split(",")
            .map((d) => d.trim())
            .filter(Boolean),
        },
      };
      await createTemplate(data);
      setForm(EMPTY_TEMPLATE);
      setShowForm(false);
      await fetchTemplates();
    } catch {
      alert("Памылка захавання");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      {/* Загаловак */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Шаблоны</h1>
          <p className="text-sm text-slate-500 mt-1">
            {templates.length} шаблонаў у {agencies.length} агенцыях
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-medium text-sm rounded-lg transition-colors"
        >
          <span>＋</span> Новы шаблон
        </button>
      </div>

      {/* Форма стварэння */}
      {showForm && (
        <div className="mb-8 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-base font-medium text-slate-100 mb-5">
            Новы шаблон вакансіі
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Field
              label="Агенцыя *"
              value={form.agencyName}
              onChange={(v) => setField("agencyName", v)}
              placeholder="напр. EVL"
            />
            <Field
              label="Назва шаблона *"
              value={form.templateName}
              onChange={(v) => setField("templateName", v)}
              placeholder="напр. Golczewo_Marinade"
            />
          </div>

          <div className="mb-4">
            <Field
              label="Ключавыя словы (праз коску)"
              value={form.keywords}
              onChange={(v) => setField("keywords", v)}
              placeholder="Гольчево, Голчево, маринад"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Field
              label="Загаловак"
              value={form.title}
              onChange={(v) => setField("title", v)}
              placeholder="Гольчево. 80 км від Щецина"
            />
            <Field
              label="Лакацыя"
              value={form.location}
              onChange={(v) => setField("location", v)}
              placeholder="Гольчево (Golczewo)"
            />
          </div>

          <Divider label="💰 Аплата" />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Field
              label="Базавая стаўка"
              value={form.salary.base}
              onChange={(v) => setField("salary.base", v)}
              placeholder="25,36 zł нетто/год"
            />
            <Field
              label="Студэнцкая стаўка"
              value={form.salary.student}
              onChange={(v) => setField("salary.student", v)}
              placeholder="31,40 zł нетто/год"
            />
            <Field
              label="Месячны заробак"
              value={form.salary.monthly}
              onChange={(v) => setField("salary.monthly", v)}
              placeholder="4 250 – 6 000 zł/міс"
            />
            <Field
              label="Бонусы"
              value={form.salary.bonus}
              onChange={(v) => setField("salary.bonus", v)}
            />
          </div>

          <Divider label="🕒 Графік" />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Field
              label="Змены"
              value={form.schedule.shifts}
              onChange={(v) => setField("schedule.shifts", v)}
              placeholder="2 зміни по 8-11 годин"
            />
            <Field
              label="Гадзіны ў месяц"
              value={form.schedule.hours}
              onChange={(v) => setField("schedule.hours", v)}
              placeholder="220–270 годин на місяць"
            />
            <div className="col-span-2">
              <Field
                label="Дэталі графіка"
                value={form.schedule.details}
                onChange={(v) => setField("schedule.details", v)}
                placeholder="дадатковая інфа па зменах"
              />
            </div>
          </div>

          <Divider label="🛠 Абавязкі" />
          <div className="mb-4">
            <label className="block text-xs text-slate-500 mb-1">
              Апісанне (праз кропку з коскай)
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={3}
              placeholder="упаковка; сортування; пакування..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <Divider label="🏠 Жытло" />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Field
              label="Кошт"
              value={form.accommodation.cost}
              onChange={(v) => setField("accommodation.cost", v)}
              placeholder="750 zł/місяць"
            />
            <Field
              label="Дэпазіт"
              value={form.accommodation.deposit}
              onChange={(v) => setField("accommodation.deposit", v)}
              placeholder="200 zł"
            />
            <div className="col-span-2">
              <Field
                label="Дэталі"
                value={form.accommodation.details}
                onChange={(v) => setField("accommodation.details", v)}
                placeholder="для пар — 2-місні кімнати"
              />
            </div>
          </div>

          <Divider label="🚌 Транспарт" />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Field
              label="Кошт"
              value={form.transport.cost}
              onChange={(v) => setField("transport.cost", v)}
              placeholder="безкоштовно"
            />
            <Field
              label="Дэталі"
              value={form.transport.details}
              onChange={(v) => setField("transport.details", v)}
              placeholder="транспорт роботодавця"
            />
          </div>

          <Divider label="📋 Патрабаванні" />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Field
              label="Гендар"
              value={form.requirements.gender}
              onChange={(v) => setField("requirements.gender", v)}
              placeholder="жінки"
            />
            <Field
              label="Узрост"
              value={form.requirements.age}
              onChange={(v) => setField("requirements.age", v)}
              placeholder="до 58 років"
            />
            <Field
              label="Нацыянальнасці (праз коску)"
              value={form.requirements.nationalities}
              onChange={(v) => setField("requirements.nationalities", v)}
              placeholder="Україна, Молдова"
            />
            <Field
              label="Дакументы (праз коску)"
              value={form.requirements.docs}
              onChange={(v) => setField("requirements.docs", v)}
              placeholder="санепід, віза"
            />
          </div>

          <Divider label="🌡 Умовы" />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Field
              label="Тэмпература"
              value={form.conditions.temperature}
              onChange={(v) => setField("conditions.temperature", v)}
              placeholder="+10°C"
            />
            <Field
              label="Тып дагавора"
              value={form.contractType}
              onChange={(v) => setField("contractType", v)}
              placeholder="Umowa zlecenie"
            />
            <div className="col-span-2">
              <Field
                label="Спецвопратка"
                value={form.conditions.workwear}
                onChange={(v) => setField("conditions.workwear", v)}
                placeholder="спецодяг надається"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-medium text-sm rounded-lg transition-colors"
            >
              {saving ? "Захаванне..." : "Захаваць шаблон"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setForm(EMPTY_TEMPLATE);
              }}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
            >
              Адмена
            </button>
          </div>
        </div>
      )}

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
          <div className="text-sm">Шаблонаў пакуль няма</div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <div
              key={t._id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono">
                      {t.agencyName}
                    </span>
                    <h3 className="font-medium text-slate-100">
                      {t.templateName}
                    </h3>
                  </div>
                  {t.title && (
                    <p className="text-sm text-slate-400 mt-1">{t.title}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {t.keywords?.map((kw) => (
                      <span
                        key={kw}
                        className="text-xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
                  title="Выдаліць"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Дапаможны кампанент — поле ўводу
function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1">{label}</label>
      <input
        type="text"
        value={value}
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
