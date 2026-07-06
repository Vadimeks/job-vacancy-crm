import { useState } from "react";
import { submitApplication } from "../../services/api";
import Field from "../shared/Field";
import Divider from "../shared/Divider";
import * as MD from "../../constants/masterData";

export default function ApplyModal({ vacancy, applyType, onClose }) {
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
      voivodeship: [],
      locationFlexible: false,
      locationNotes: "",
      spheres: [],
      accommodation: {
        needed: false,
        forCouples: false,
        withChildren: false,
        freeOnly: false,
      },
      transport: { needed: false },
      polishLanguageLevel: "Не вимагається",
      onlyDayShifts: false,
      hoursRange: [],
      contractType: "any",
      nuances: [],
      nuancesNotes: "",
      readyDate: "",
      readyDateNotes: "",
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
      } else if (parts.length === 2) {
        next[parts[0]] = { ...next[parts[0]], [parts[1]]: value };
      } else if (parts.length === 3) {
        next[parts[0]] = {
          ...next[parts[0]],
          [parts[1]]: { ...next[parts[0]]?.[parts[1]], [parts[2]]: value },
        };
      }
      return next;
    });
  };

  const toggleArrayPref = (field, val) => {
    setForm((prev) => {
      const cur = prev.jobPreferences[field] || [];
      const next = cur.includes(val)
        ? cur.filter((s) => s !== val)
        : [...cur, val];
      return {
        ...prev,
        jobPreferences: { ...prev.jobPreferences, [field]: next },
      };
    });
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return alert("Введіть ім'я та прізвище");
    if (!form.gender) return alert("Будь ласка, оберіть стать");
    
    if (form.contactType === "telegram" && !form.telegram.trim()) {
      return alert("Введіть Telegram username");
    }

    const phoneRegex = /^\+\d{10,15}$/;
    if (form.contactType !== "telegram") {
      if (!phoneRegex.test(form.phone)) {
        return alert("Невірний формат телефону. Використовуйте +380XXXXXXXXX (від 10 да 15 цифр)");
      }
    }

    setSending(true);
    try {
      await submitApplication({
        vacancyId: vacancy._id,
        applyType,
        ...form,
        age: form.age ? Number(form.age) : undefined,
      });
      setSent(true);
    } catch {
      alert("Помилка відправки заявки");
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
      <div className="relative bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 shadow-2xl">
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {applyType === "want_work"
                ? "🟢 Хочу тут працювати"
                : "💬 Дізнатися деталі"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{vacancy.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            ✕
          </button>
        </div>

        {sent ? (
          <div className="px-6 py-16 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="font-semibold text-slate-500 mb-2">
              Заявка відправлена!
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Рекрутер зв'яжеться з вами найближчим часом.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-medium text-sm rounded-lg transition-colors"
            >
              Закрити
            </button>
          </div>
        ) : (
          <>
            <div className="px-6 py-5 space-y-4">
              <Field
                label="Ім'я та прізвище *"
                value={form.name}
                onChange={(v) => setField("name", v)}
                placeholder="Іван Іванов"
              />

              <Divider label="📞 Спосіб зв'язку" />
              <div>
                <label className="block text-xs text-slate-500 mb-2">
                  Як з вами зв'язатися? *
                </label>
                <div className="flex gap-2 mb-3">
                  {["telegram", "viber", "phone"].map((ct) => (
                    <button
                      key={ct}
                      onClick={() => setField("contactType", ct)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                        form.contactType === ct
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {ct === "telegram"
                        ? "✈️ Telegram"
                        : ct === "viber"
                          ? "📱 Viber"
                          : "📞 Телефон"}
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
                    label="Номер телефону (у форматі +380...) *"
                    value={form.phone}
                    onChange={(v) => setField("phone", v)}
                    placeholder="+380991234567"
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
                  label="Де зараз перебуваєте"
                  value={form.currentLocation}
                  onChange={(v) => setField("currentLocation", v)}
                  placeholder="Київ"
                />
                <Field
                  label="Вік *"
                  value={form.age}
                  type="number"
                  onChange={(v) => setField("age", v)}
                  placeholder="25"
                />
                <div>
                  <label className="block text-xs text-slate-500 mb-2">
                    Стать
                  </label>
                  {/* 👈 ВЫПРАЎЛЕНА: было values "male"/"female" — не супадалі з enum мадэлі Candidate.gender ["Чоловіки","Жінки","Пари","Сім'ї"], захаванне ў базе адхілялася б */}
                  <div className="flex gap-2 flex-wrap">
                    {MD.GENDERS.map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => setField("gender", g.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                          form.gender === g.value
                            ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Divider label="🔍 Побажання до роботи" />
              <div>
                <label className="block text-xs text-slate-500 mb-2">
                  Регіон пошуку роботи (Воєводство)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setField("jobPreferences.locationFlexible", !form.jobPreferences.locationFlexible)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                      form.jobPreferences.locationFlexible
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    ✈️ Будь-який регіон
                  </button>
                  {MD.VOIVODESHIPS.map((vov) => (
                    <button
                      key={vov.value}
                      type="button"
                      onClick={() => toggleArrayPref("voivodeship", vov.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                        form.jobPreferences.voivodeship.includes(vov.value)
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
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
 {/* 👈 НОВАЕ: секцыя Сфера, ідэнтычна AddCandidateModal.jsx/EditCandidateModal.jsx (MD.CATEGORIES) */}
              <div>
                <label className="block text-xs text-slate-500 mb-2">Сфера</label>
                <div className="flex flex-wrap gap-2">
                  {MD.CATEGORIES.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => toggleArrayPref("spheres", s.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                        form.jobPreferences.spheres.includes(s.value)
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Коли готові приступити"
                  value={form.jobPreferences.readyDate}
                  type="date"
                  onChange={(v) => setField("jobPreferences.readyDate", v)}
                />
                <Field
                  label="Нюанси щодо дати"
                  value={form.jobPreferences.readyDateNotes}
                  onChange={(v) => setField("jobPreferences.readyDateNotes", v)}
                  placeholder="Напр. 'можна раніше'"
                />
              </div>

              <div className="space-y-4">
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
                        onClick={() => setField(`jobPreferences.accommodation.${key}`, !form.jobPreferences.accommodation[key])}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                          form.jobPreferences.accommodation[key]
                            ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
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
                        onClick={() => setField("jobPreferences.transport.needed", val === "true")}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                          String(form.jobPreferences.transport.needed) === val
                            ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-2">Графік та години</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setField("jobPreferences.onlyDayShifts", !form.jobPreferences.onlyDayShifts)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                      form.jobPreferences.onlyDayShifts
                        ? "bg-blue-600 border-blue-600 text-white shadow-md"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    ☀️ Тільки день
                  </button>
                  {MD.HOURS_RANGE_OPTIONS.map((h) => (
                    <button
                      key={h.value}
                      type="button"
                      onClick={() => toggleArrayPref("hoursRange", h.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                        form.jobPreferences.hoursRange.includes(h.value)
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {h.label}
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
                <label className="block text-xs text-slate-500 mb-2">
                  Тип договору
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    ["zlecenie", "Umowa zlecenie"],
                    ["o_prace", "Umowa o pracę"],
                    ["any", "Будь-який"],
                  ].map(([val, lbl]) => (
                    <button
                      key={val}
                      onClick={() =>
                        setField("jobPreferences.contractType", val)
                      }
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                        form.jobPreferences.contractType === val
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
              <Divider label="🌡 Нюанси (Чек-лист)" />
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {MD.CHECKLIST_ITEMS.map((n) => (
                    <button
                      key={n.value}
                      type="button"
                      onClick={() => toggleArrayPref("nuances", n.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                        form.jobPreferences.nuances.includes(n.value)
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
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
              </div>
            </div>

            <div className="flex gap-4 px-8 py-5 border-t border-slate-100 sticky bottom-0 bg-white/95 backdrop-blur-md z-10">
              <button
                onClick={handleSubmit}
                disabled={sending}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-medium text-sm rounded-lg transition-colors"
              >
                {sending ? "Відправка..." : "Відправити заявку"}
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-700 text-slate-500 text-sm rounded-lg transition-colors"
              >
                Скасувати
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
