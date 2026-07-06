// frontend/src/components/candidates/AddCandidateModal.jsx
import { useState } from "react";
import { createCandidate } from "../../services/api";
import Field from "../shared/Field";
import Divider from "../shared/Divider";
import * as MD from "../../constants/masterData";
import { EMPTY_CANDIDATE_FILTERS } from "../../constants/filters";

const EMPTY_FORM = {
  name: "",
  contactType: "telegram",
  telegram: "",
  phone: "",
  nationality: "",
  currentLocation: "",
  age: "",
  gender: "Чоловіки",
  status: "new",
  source: "manual",
  notes: "",
  newHistoryEntry: "", // 👈 ДАДАДЗЕНА
  jobPreferences: {
    voivodeship: [], // 👈 ЗМЕНЕНА: было "location" — перайменавана, ідэнтычна Vacancy.voivodeship
    locationFlexible: false,
    locationNotes: "", // 👈 НОВАЕ: тэкставае ўдакладненне лакацыі для AI-матчынгу
    spheres: [], // 👈 НОВАЕ: раней увогуле адсутнічала ў форме, хоць ёсць у мадэлі
    accommodation: { // 👈 НОВАЕ: замест needsAccommodation (Boolean)
      needed: false,
      forCouples: false,
      withChildren: false,
      freeOnly: false,
    },
    transport: { needed: false }, // 👈 НОВАЕ
    polishLanguageLevel: "Не вимагається", // 👈 НОВАЕ
    onlyDayShifts: false, // 👈 ДАДАДЗЕНА: раней было толькі ў UI, не ў пачатковым стане
    hoursRange: [], // 👈 ЗМЕНЕНА: было "schedule"
    contractType: "any",
    nuances: [], // 👈 НОВАЕ
    nuancesNotes: "", // 👈 НОВАЕ
    readyDate: "",
    readyDateNotes: "", // без змен
  },
  documents: {
    activeDocs: [], // без змен
  },
};

export default function AddCandidateModal({ onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

const setField = (path, value) => {
    const parts = path.split(".");
    setForm((prev) => {
      const next = { ...prev };
      if (parts.length === 1) {
        next[parts[0]] = value;
      } else if (parts.length === 2) {
        next[parts[0]] = { ...next[parts[0]], [parts[1]]: value };
      } else if (parts.length === 3) {
        // 👈 ДАДАДЗЕНА: падтрымка 3-ўзроўневых шляхоў (напр. jobPreferences.accommodation.needed) — той жа падыход, што ў EditVacancyModal.jsx
        next[parts[0]] = {
          ...next[parts[0]],
          [parts[1]]: { ...next[parts[0]]?.[parts[1]], [parts[2]]: value },
        };
      }
      return next;
    });
  };

  // 👈 ЗМЕНЕНА: было toggleSchedule (толькі для schedule) — цяпер універсальная функцыя для любога масіва ўнутры jobPreferences (hoursRange, spheres, nuances, voivodeship)
  const toggleArrayPref = (field, val) => {
    setForm((prev) => {
      const cur = prev.jobPreferences[field];
      const next = cur.includes(val)
        ? cur.filter((s) => s !== val)
        : [...cur, val];
      return {
        ...prev,
        jobPreferences: { ...prev.jobPreferences, [field]: next },
      };
    });
  };

  const handleSave = async () => {
    // 1. Валідацыя
    if (!form.name.trim()) return alert("Введіть ім'я та прізвище");
    if (!form.gender) return alert("Оберіть стать (Хто їде)");
    
    const phoneRegex = /^\+\d{10,15}$/;
    if (form.phone && !phoneRegex.test(form.phone)) {
      return alert("Невірний формат телефону. Використовуйте формат +380XXXXXXXXX (від 10 до 15 цифр)");
    }

    setSaving(true);
    try {
      const ad = form.documents.activeDocs;
      const syncedDocuments = {
        ...form.documents,
        hasVisa: ad.includes("Віза"),
        hasSanepid: ad.includes("Книжка санепід"),
        hasUDT: ad.includes("UDT"),
        hasPeselUkr: ad.includes("PESEL UKR"),
        hasKartaPobytu: ad.includes("Карта побуту"),
        residencyCertificate: ad.includes("Довідка резидента")
      };

      let dataToSave = { 
        ...form, 
        documents: syncedDocuments,
        age: form.age ? Number(form.age) : undefined 
      };

      // Дадаем першы запіс у гісторыю, калі ён ёсць
      if (form.newHistoryEntry.trim()) {
        dataToSave.history = [{
          date: new Date(),
          type: "note",
          text: form.newHistoryEntry.trim()
        }];
      }

      const res = await createCandidate(dataToSave);
      onAdd(res.data);
      onClose();
    } catch (err) {
      alert("Помилка збереження: " + (err.response?.data?.message || err.message));
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
      <div className="relative bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-slate-900">Новий кандидат</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <Field
            label="Ім'я та прізвище *"
            value={form.name}
            onChange={(v) => setField("name", v)}
            placeholder="Іван Іванов"
          />

          <Divider label="📞 Зв'язок" />
          <div>
            <label className="block text-xs text-slate-500 mb-2">
              Спосіб зв'язку
            </label>
            <div className="flex gap-2 mb-3">
              {["telegram", "viber", "phone"].map((ct) => (
                <button
                  key={ct}
                  onClick={() => setField("contactType", ct)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    form.contactType === ct
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-50 text-slate-600 border border-slate-200"
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
                label="Telegram username"
                value={form.telegram}
                onChange={(v) => setField("telegram", v)}
                placeholder="@username"
              />
            ) : (
              <Field
                label="Нумар тэлефона"
                value={form.phone}
                onChange={(v) => setField("phone", v)}
                placeholder="+380XXXXXXXXX"
              />
            )}
          </div>

          <Divider label="👤 Особисті дані" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-2">Національність</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {MD.NATIONALITIES.map(n => (
                  <button
                    key={n.value}
                    type="button"
                    onClick={() => setField("nationality", n.value)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${form.nationality === n.value ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={form.nationality}
                onChange={(e) => setField("nationality", e.target.value)}
                placeholder="Або введіть іншу..."
                className="w-full bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-yellow-400 transition-all"
              />
            </div>
            <Field
              label="Де знаходиться зараз"
              value={form.currentLocation}
              onChange={(v) => setField("currentLocation", v)}
              placeholder="Київ"
            />
            <Field
              label="Вік"
              value={form.age}
              type="number"
              onChange={(v) => setField("age", v)}
            />
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                Хто їде
              </label>
              <div className="flex gap-2">
                {MD.GENDERS.map((g) => (
  <button
    key={g.value}
    onClick={() => setField("gender", g.value)}
    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
      form.gender === g.value
        ? "bg-emerald-500 text-white"
        : "bg-slate-100 text-slate-600 border border-slate-200"
    }`}
  >
    {g.label}
  </button>
))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">Статус</label>
            <div className="flex gap-2 flex-wrap">
              {MD.CANDIDATE_STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setField("status", s.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    form.status === s.value
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-50 text-slate-600 border border-slate-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <Divider label="🔍 Побажання" />
          <div>
            <label className="block text-xs text-slate-500 mb-2">
              Регіон пошуку роботи (Воєводство)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              <button
                type="button"
                onClick={() => setField("jobPreferences.locationFlexible", !form.jobPreferences.locationFlexible)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  form.jobPreferences.locationFlexible
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-50 text-slate-600 border border-slate-200"
                }`}
              >
                ✈️ Готовий до будь-якого регіону
              </button>
              {MD.VOIVODESHIPS.map((vov) => (
                <button
                  key={vov.value}
                  type="button"
                  onClick={() => toggleArrayPref("voivodeship", vov.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    form.jobPreferences.voivodeship.includes(vov.value)
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-50 text-slate-600 border border-slate-200"
                  }`}
                >
                  {vov.label}
                </button>
              ))}
            </div>
            <div className="bg-yellow-50/50 p-3 rounded-2xl border border-yellow-100">
              <Field
                label="Уточнення локації (напр. конкретне місто)"
                value={form.jobPreferences.locationNotes}
                onChange={(v) => setField("jobPreferences.locationNotes", v)}
                placeholder="Наприклад: Wrocław..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">Сфера</label>
            <div className="flex flex-wrap gap-2">
              {MD.CATEGORIES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => toggleArrayPref("spheres", s.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    form.jobPreferences.spheres.includes(s.value)
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-50 text-slate-600 border border-slate-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Field
              label="Дата виходу (готовий з)"
              value={form.jobPreferences.readyDate}
              type="date"
              onChange={(v) => setField("jobPreferences.readyDate", v)}
            />
            <Field
              label="Нюансы па даце (напр. 'можна раніше')"
              value={form.jobPreferences.readyDateNotes}
              onChange={(v) => setField("jobPreferences.readyDateNotes", v)}
              placeholder="Дадаткова інфо..."
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">Житло</label>
            <div className="flex flex-wrap gap-2">
              {[
                ["needed", "🏠 Потрібне житло"],
                ["forCouples", "👫 Для пар"],
                ["withChildren", "👨‍👩‍👧 З дітьми"],
                ["freeOnly", "🆓 Тільки безкоштовне"],
              ].map(([key, lbl]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setField(
                      `jobPreferences.accommodation.${key}`,
                      !form.jobPreferences.accommodation[key],
                    )
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    form.jobPreferences.accommodation[key]
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-50 text-slate-600 border border-slate-200"
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">Транспорт</label>
            <div className="flex gap-2">
              {[
                ["true", "🚌 Потрібен довіз"],
                ["false", "❌ Не потрібен"],
              ].map(([val, lbl]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() =>
                    setField("jobPreferences.transport.needed", val === "true")
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    String(form.jobPreferences.transport.needed) === val
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-50 text-slate-600 border border-slate-200"
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">Рівень польської</label>
            <div className="flex flex-wrap gap-2">
              {MD.LANGUAGES.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setField("jobPreferences.polishLanguageLevel", l.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    form.jobPreferences.polishLanguageLevel === l.value
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-50 text-slate-600 border border-slate-200"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div>
  <label className="block text-xs text-slate-500 mb-2">Графік</label>
  <div className="flex flex-wrap gap-2">
    <button
      onClick={() => setField("jobPreferences.onlyDayShifts", !form.jobPreferences.onlyDayShifts)}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
        form.jobPreferences.onlyDayShifts ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-600 border border-slate-200"
      }`}
    >
      <span>☀️</span> Тільки день
    </button>
    {MD.HOURS_RANGE_OPTIONS.map((h) => (
      <button
        key={h.value}
        onClick={() => toggleArrayPref("hoursRange", h.value)} // 👈 ЗМЕНЕНА: было toggleSchedule(h.value)
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          form.jobPreferences.hoursRange.includes(h.value) // 👈 ЗМЕНЕНА: было form.jobPreferences.schedule
            ? "bg-emerald-500 text-white"
            : "bg-slate-100 text-slate-600 border border-slate-200"
        }`}
      >
        {h.label}
      </button>
    ))}
  </div>
</div>
<Divider label="🌡 Нюанси (Чек-лист)" />
          <div className="flex flex-wrap gap-2">
            {MD.CHECKLIST_ITEMS.map((n) => (
              <button
                key={n.value}
                type="button"
                onClick={() => toggleArrayPref("nuances", n.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  form.jobPreferences.nuances.includes(n.value)
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>
          <div className="bg-yellow-50/50 p-3 rounded-2xl border border-yellow-100">
            <Field
              label="Додаткові нюанси (вільний текст)"
              value={form.jobPreferences.nuancesNotes}
              onChange={(v) => setField("jobPreferences.nuancesNotes", v)}
              placeholder="Якщо є нюанси, яких немає у списку..."
            />
          </div>
          <Divider label="📄 Документи" />
          <div className="flex gap-2 flex-wrap">
            {MD.DOCS.map((doc) => {
              const isActive = form.documents.activeDocs.includes(doc.value);
              return (
                <button
                  key={doc.value}
                  type="button"
                  onClick={() => {
                    const current = form.documents.activeDocs;
                    const next = isActive
                      ? current.filter((d) => d !== doc.value)
                      : [...current, doc.value];
                    setField("documents.activeDocs", next);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    isActive
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {isActive ? "✅" : "❌"} {doc.label}
                </button>
              );
            })}
          </div>

           <Divider label="📜 Перший запис у історію" />
          <textarea
            value={form.newHistoryEntry}
            onChange={(e) => setField("newHistoryEntry", e.target.value)}
            rows={2}
            placeholder="Наприклад: Кандидат зацікавлений у вакансії на склад..."
            className="w-full bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-amber-400 resize-none shadow-inner"
          />

          <Divider label="📝 Нотатки рекрутера" />
          <textarea
            value={form.notes}
            onChange={(e) => setField("notes", e.target.value)}
            rows={3}
            placeholder="Будь-яка додаткова інформація..."
            className="w-full bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-yellow-400 resize-none shadow-inner"
          />
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 sticky bottom-0 bg-white">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-medium text-sm rounded-lg transition-colors"
          >
            {saving ? "Збереження..." : "Зберегти"}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm rounded-lg transition-colors"
          >
            Скасувати
          </button>
        </div>
      </div>
    </div>
  );
}
