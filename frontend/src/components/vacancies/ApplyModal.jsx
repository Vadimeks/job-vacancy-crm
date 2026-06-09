import { useState } from "react";
import { submitApplication } from "../../services/api";
import Field from "../shared/Field";
import Divider from "../shared/Divider";

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
      // Абарона: калі schedule адсутнічае, выкарыстоўваем пусты масіў
      const cur = prev.jobPreferences.schedule || [];
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
    // Лакалізацыя паведамленняў валідацыі
    if (!form.name.trim()) return alert("Введіть ім'я та прізвище");
    if (form.contactType === "telegram" && !form.telegram.trim())
      return alert("Введіть Telegram username");
    if (
      (form.contactType === "viber" || form.contactType === "phone") &&
      !form.phone.trim()
    )
      return alert("Введіть номер телефону");

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
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div>
            <h2 className="font-semibold text-slate-500">
              {applyType === "want_work"
                ? "🟢 Хочу тут працювати"
                : "💬 Дізнатися деталі"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{vacancy.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-500 hover:bg-slate-800 rounded-lg transition-colors"
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
                    label="Номер телефону *"
                    value={form.phone}
                    onChange={(v) => setField("phone", v)}
                    placeholder="+380XXXXXXXXX"
                  />
                )}
              </div>

              <Divider label="👤 Особисті дані" />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Національність"
                  value={form.nationality}
                  onChange={(v) => setField("nationality", v)}
                  placeholder="Україна"
                />
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
                  <div className="flex gap-2">
                    {[
                      ["male", "👨 Чоловік"],
                      ["female", "👩 Жінка"],
                    ].map(([val, lbl]) => (
                      <button
                        key={val}
                        onClick={() => setField("gender", val)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                          form.gender === val
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

              <Divider label="🔍 Побажання до роботи" />
              <div>
                <label className="block text-xs text-slate-500 mb-2">
                  Де шукаєте роботу?
                </label>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {[
                    ["here", "Де зараз перебуваю"],
                    ["specific", "У певному місці"],
                    ["flexible", "Готовий до переїзду"],
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
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
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
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
                {!form.jobPreferences.locationFlexible && (
                  <Field
                    label="Місто"
                    value={form.jobPreferences.location}
                    onChange={(v) => setField("jobPreferences.location", v)}
                    placeholder="напр. Варшава"
                  />
                )}
              </div>

              <Field
                label="Коли готові приступити"
                value={form.jobPreferences.readyDate}
                onChange={(v) => setField("jobPreferences.readyDate", v)}
                placeholder="напр. 01.05.2026"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-2">
                    Потрібне житло?
                  </label>
                  <div className="flex gap-2">
                    {[
                      ["true", "Так"],
                      ["false", "Ні"],
                    ].map(([val, lbl]) => (
                      <button
                        key={val}
                        onClick={() =>
                          setField(
                            "jobPreferences.needsAccommodation",
                            val === "true",
                          )
                        }
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                          String(form.jobPreferences.needsAccommodation) === val
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
                  <label className="block text-xs text-slate-500 mb-2">
                    Їду
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      ["alone", "Один/одна"],
                      ["couple", "Пара"],
                      ["family", "З сім'єю"],
                    ].map(([val, lbl]) => (
                      <button
                        key={val}
                        onClick={() =>
                          setField("jobPreferences.travelGroup", val)
                        }
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                          form.jobPreferences.travelGroup === val
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
                <label className="block text-xs text-slate-500 mb-2">
                  Графік роботи
                </label>
                <div className="flex gap-2">
                  {[
                    ["1_shift", "1 зміна"],
                    ["2_shifts", "2 зміни"],
                    ["3_shifts", "3 зміни"],
                  ].map(([val, lbl]) => (
                    <button
                      key={val}
                      onClick={() => toggleSchedule(val)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                        (form.jobPreferences.schedule || []).includes(val)
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
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900">
              <button
                onClick={handleSubmit}
                disabled={sending}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-medium text-sm rounded-lg transition-colors"
              >
                {sending ? "Відправка..." : "Відправити заявку"}
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-500 text-sm rounded-lg transition-colors"
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
