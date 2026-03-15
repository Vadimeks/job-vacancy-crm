// frontend/src/components/vacancies/ApplyModal.jsx
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
    if (!form.name.trim()) return alert("Увядзіце імя");
    if (form.contactType === "telegram" && !form.telegram.trim())
      return alert("Увядзіце Telegram username");
    if (
      (form.contactType === "viber" || form.contactType === "phone") &&
      !form.phone.trim()
    )
      return alert("Увядзіце нумар тэлефона");

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
      alert("Памылка адпраўкі заяўкі");
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
                    ].map(([val, lbl]) => (
                      <button
                        key={val}
                        onClick={() => setField("gender", val)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          form.gender === val
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

              <Divider label="🔍 Пажаданні да працы" />
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

              <Field
                label="Калі гатовы прыступіць"
                value={form.jobPreferences.readyDate}
                onChange={(v) => setField("jobPreferences.readyDate", v)}
                placeholder="напр. 01.05.2026"
              />

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
