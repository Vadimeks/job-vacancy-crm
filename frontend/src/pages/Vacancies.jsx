// frontend/src/pages/Vacancies.jsx
import { useEffect, useState } from "react";
import {
  getVacancies,
  deleteVacancy,
  createVacancyAuto,
  updateVacancy,
  submitApplication,
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

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1">{label}</label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
      />
    </div>
  );
}

function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <div className="flex-1 h-px bg-slate-800" />
    </div>
  );
}

// --- МАДАЛКА ЗАЯЎКІ ---
function ApplyModal({ vacancy, applyType, onClose }) {
  const [form, setForm] = useState({
    name: "",
    contactType: "telegram",
    telegram: "",
    phone: "",
    nationality: "",
    currentLocation: "",
    age: "",
    gender: "",
    jobPreferences: {
      location: "",
      locationFlexible: false,
      needsAccommodation: false,
      travelGroup: "alone",
      readyDate: "",
      schedule: [],
      contractType: "any",
    },
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

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

  const toggleSchedule = (val) => {
    setForm((prev) => {
      const cur = prev.jobPreferences.schedule;
      const next = cur.includes(val)
        ? cur.filter((s) => s !== val)
        : [...cur, val];
      return {
        ...prev,
        jobPreferences: { ...prev.jobPreferences, schedule: next },
      };
    });
  };

  const handleSubmit = async () => {
    console.log("handleSubmit выкліканы");
    console.log("form:", form);
    setSending(true);
    try {
      const payload = {
        vacancyId: vacancy._id,
        applyType,
        ...form,
        age: form.age ? Number(form.age) : undefined,
      };
      console.log("payload:", JSON.stringify(payload, null, 2));
      await submitApplication(payload);
      setSent(true);
    } catch (err) {
      console.error("Памылка:", err.response?.data || err.message);
      alert("Памылка: " + JSON.stringify(err.response?.data));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        {/* Загаловак */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div>
            <h2 className="font-semibold text-slate-100">
              {applyType === "want_work"
                ? "🟢 Хачу тут працаваць"
                : "💬 Дазнацца дэталі"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{vacancy.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {sent ? (
          <div className="px-6 py-16 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="font-semibold text-slate-100 mb-2">
              Заяўка адпраўлена!
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Рэкрутэр звяжацца з вамі ў бліжэйшы час.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-medium text-sm rounded-lg transition-colors"
            >
              Закрыць
            </button>
          </div>
        ) : (
          <>
            <div className="px-6 py-5 space-y-4">
              <Field
                label="Імя і прозвішча *"
                value={form.name}
                onChange={(v) => setField("name", v)}
                placeholder="Іван Іваноў"
              />

              <Divider label="📞 Спосаб сувязі" />
              <div>
                <label className="block text-xs text-slate-500 mb-2">
                  Як з вамі звязацца? *
                </label>
                <div className="flex gap-2 mb-3">
                  {["telegram", "viber", "phone"].map((ct) => (
                    <button
                      key={ct}
                      onClick={() => setField("contactType", ct)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        form.contactType === ct
                          ? "bg-emerald-500 text-slate-900"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {ct === "telegram"
                        ? "✈️ Telegram"
                        : ct === "viber"
                          ? "📱 Viber"
                          : "📞 Тэлефон"}
                    </button>
                  ))}
                </div>
                {form.contactType === "telegram" ? (
                  <Field
                    label="Telegram username *"
                    value={form.telegram}
                    onChange={(v) => setField("telegram", v)}
                    placeholder="@username"
                  />
                ) : (
                  <Field
                    label="Нумар тэлефона *"
                    value={form.phone}
                    onChange={(v) => setField("phone", v)}
                    placeholder="+380XXXXXXXXX"
                  />
                )}
              </div>

              <Divider label="👤 Асабістыя дадзеныя" />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Нацыянальнасць"
                  value={form.nationality}
                  onChange={(v) => setField("nationality", v)}
                  placeholder="Украіна"
                />
                <Field
                  label="Дзе зараз знаходзіцеся"
                  value={form.currentLocation}
                  onChange={(v) => setField("currentLocation", v)}
                  placeholder="Кіеў"
                />
                <Field
                  label="Узрост *"
                  value={form.age}
                  type="number"
                  onChange={(v) => setField("age", v)}
                  placeholder="25"
                />
                <div>
                  <label className="block text-xs text-slate-500 mb-2">
                    Гендар
                  </label>
                  <div className="flex gap-2">
                    {[
                      ["male", "👨 Мужчына"],
                      ["female", "👩 Жанчына"],
                    ].map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => setField("gender", val)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          form.gender === val
                            ? "bg-emerald-500 text-slate-900"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Divider label="🔍 Пажаданні да працы" />

              {/* Лакацыя */}
              <div>
                <label className="block text-xs text-slate-500 mb-2">
                  Дзе шукаеце працу?
                </label>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {[
                    ["here", "Дзе зараз знаходжуся"],
                    ["specific", "У пэўным месцы"],
                    ["flexible", "Гатовы да пераезду"],
                  ].map(([val, lbl]) => (
                    <button
                      key={val}
                      onClick={() => {
                        setField(
                          "jobPreferences.locationFlexible",
                          val === "flexible",
                        );
                        if (val === "here")
                          setField(
                            "jobPreferences.location",
                            form.currentLocation,
                          );
                        if (val !== "specific")
                          setField("jobPreferences.location", "");
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        (val === "flexible" &&
                          form.jobPreferences.locationFlexible) ||
                        (val === "here" &&
                          !form.jobPreferences.locationFlexible &&
                          form.jobPreferences.location ===
                            form.currentLocation) ||
                        (val === "specific" &&
                          !form.jobPreferences.locationFlexible &&
                          form.jobPreferences.location &&
                          form.jobPreferences.location !== form.currentLocation)
                          ? "bg-emerald-500 text-slate-900"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
                {!form.jobPreferences.locationFlexible && (
                  <Field
                    label="Горад"
                    value={form.jobPreferences.location}
                    onChange={(v) => setField("jobPreferences.location", v)}
                    placeholder="напр. Варшава"
                  />
                )}
              </div>

              {/* Калі гатовы */}
              <Field
                label="Калі гатовы прыступіць"
                value={form.jobPreferences.readyDate}
                onChange={(v) => setField("jobPreferences.readyDate", v)}
                placeholder="напр. 01.05.2026"
              />

              {/* Жытло і група */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-2">
                    Патрэбна жытло?
                  </label>
                  <div className="flex gap-2">
                    {[
                      ["true", "Так"],
                      ["false", "Не"],
                    ].map(([val, lbl]) => (
                      <button
                        key={val}
                        onClick={() =>
                          setField(
                            "jobPreferences.needsAccommodation",
                            val === "true",
                          )
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          String(form.jobPreferences.needsAccommodation) === val
                            ? "bg-emerald-500 text-slate-900"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-2">
                    Еду
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      ["alone", "Адзін/а"],
                      ["couple", "Пара"],
                      ["family", "З сям'ёй"],
                    ].map(([val, lbl]) => (
                      <button
                        key={val}
                        onClick={() =>
                          setField("jobPreferences.travelGroup", val)
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          form.jobPreferences.travelGroup === val
                            ? "bg-emerald-500 text-slate-900"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Графік */}
              <div>
                <label className="block text-xs text-slate-500 mb-2">
                  Графік працы
                </label>
                <div className="flex gap-2">
                  {[
                    ["1_shift", "1 змена"],
                    ["2_shifts", "2 змены"],
                    ["3_shifts", "3 змены"],
                  ].map(([val, lbl]) => (
                    <button
                      key={val}
                      onClick={() => toggleSchedule(val)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        form.jobPreferences.schedule.includes(val)
                          ? "bg-emerald-500 text-slate-900"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Тып дагавора */}
              <div>
                <label className="block text-xs text-slate-500 mb-2">
                  Тып дагавора
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    ["zlecenie", "Umowa zlecenie"],
                    ["o_prace", "Umowa o pracę"],
                    ["any", "Любы"],
                  ].map(([val, lbl]) => (
                    <button
                      key={val}
                      onClick={() =>
                        setField("jobPreferences.contractType", val)
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        form.jobPreferences.contractType === val
                          ? "bg-emerald-500 text-slate-900"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Кнопкі */}
            <div className="flex gap-3 px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900">
              <button
                onClick={handleSubmit}
                disabled={sending}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-medium text-sm rounded-lg transition-colors"
              >
                {sending ? "Адпраўка..." : "Адправіць заяўку"}
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
              >
                Адмена
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// --- МАДАЛКА РЭДАГАВАННЯ ---
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
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4">
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

        <div className="px-6 py-5 space-y-2">
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
  const [applyVacancy, setApplyVacancy] = useState(null);
  const [applyType, setApplyType] = useState(null);

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

  const openApply = (vacancy, type) => {
    setApplyVacancy(vacancy);
    setApplyType(type);
  };

  return (
    <div className="p-8">
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
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
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

                  {/* Кнопкі заяўкі */}
                  {v.status === "active" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => openApply(v, "want_work")}
                        className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-medium transition-colors"
                      >
                        🟢 Хачу тут працаваць
                      </button>
                      <button
                        onClick={() => openApply(v, "want_info")}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-xs font-medium transition-colors"
                      >
                        💬 Дазнацца дэталі
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setEditVacancy(v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors text-xs"
                  >
                    ✏️ Рэд.
                  </button>
                  <button
                    onClick={() => handleDelete(v._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-xs"
                  >
                    🗑 Выд.
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editVacancy && (
        <EditModal
          vacancy={editVacancy}
          onClose={() => setEditVacancy(null)}
          onSave={handleSaveEdit}
        />
      )}

      {applyVacancy && (
        <ApplyModal
          vacancy={applyVacancy}
          applyType={applyType}
          onClose={() => {
            setApplyVacancy(null);
            setApplyType(null);
          }}
        />
      )}
    </div>
  );
}
