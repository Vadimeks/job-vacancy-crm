// frontend/src/components/candidates/EditCandidateModal.jsx
import { useState } from "react";
import { updateCandidate } from "../../services/api";
import Field from "../shared/Field";
import Divider from "../shared/Divider";

const STATUS_LABELS = {
  new: "Новы",
  active: "Актыўны",
  waiting: "Чакае",
  employed: "Працуе",
  left: "Сышоў",
  blacklist: "Блэкліст",
};

export default function EditCandidateModal({ candidate, onClose, onSave }) {
  const [form, setForm] = useState({
    name: candidate.name || "",
    contactType: candidate.contactType || "telegram",
    telegram: candidate.telegram || "",
    phone: candidate.phone || "",
    nationality: candidate.nationality || "",
    currentLocation: candidate.currentLocation || "",
    age: candidate.age || "",
    gender: candidate.gender || "Чоловіки",
    status: candidate.status || "new",
    notes: candidate.notes || "",
    blacklistReason: candidate.blacklistReason || "",
    jobPreferences: {
       location: Array.isArray(candidate.jobPreferences?.location) 
    ? candidate.jobPreferences.location.join(", ") 
    : (candidate.jobPreferences?.location || ""),
      locationFlexible: candidate.jobPreferences?.locationFlexible || false,
      schedule: candidate.jobPreferences?.schedule || [],
      contractType: candidate.jobPreferences?.contractType || "any",
      needsAccommodation: candidate.jobPreferences?.needsAccommodation || false,
      travelGroup: candidate.jobPreferences?.travelGroup || "alone",
      readyDate: candidate.jobPreferences?.readyDate || "",
      notes: candidate.jobPreferences?.notes || "",
    },
    documents: {
      hasVisa: candidate.documents?.hasVisa || false,
      hasSanepid: candidate.documents?.hasSanepid || false,
      hasUDT: candidate.documents?.hasUDT || false,
      other: candidate.documents?.other || [],
    },
  });
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

  const handleSave = async () => {
    if (!form.name.trim()) return alert("Увядзіце імя");
    setSaving(true);
    try {
      const res = await updateCandidate(candidate._id, {
  ...form,
  age: form.age ? Number(form.age) : undefined,
  jobPreferences: {
    ...form.jobPreferences,
    location: typeof form.jobPreferences.location === 'string'
      ? form.jobPreferences.location.split(',').map(l => l.trim()).filter(Boolean)
      : form.jobPreferences.location
  }
});
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
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div>
            <h2 className="font-semibold text-slate-100">
              Рэдагаванне кандыдата
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{candidate.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <Field
            label="Імя і прозвішча *"
            value={form.name}
            onChange={(v) => setField("name", v)}
          />

          <Divider label="📞 Сувязь" />
          <div>
            <label className="block text-xs text-slate-500 mb-2">
              Спосаб сувязі
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

          <Divider label="👤 Асабістыя дадзеныя" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Нацыянальнасць"
              value={form.nationality}
              onChange={(v) => setField("nationality", v)}
            />
            <Field
              label="Дзе знаходзіцца"
              value={form.currentLocation}
              onChange={(v) => setField("currentLocation", v)}
            />
            <Field
              label="Узрост"
              value={form.age}
              type="number"
              onChange={(v) => setField("age", v)}
            />
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                Гендар
              </label>
              <div className="flex gap-2">
                {[
  ["Чоловіки", "👨 Чоловіки"],
  ["Жінки", "👩 Жінки"],
  ["Пари", "👫 Пари"],
  ["Сім'ї", "👨‍👩‍👧 Сім'ї"],
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

          <div>
            <label className="block text-xs text-slate-500 mb-2">Статус</label>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(STATUS_LABELS).map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => setField("status", val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    form.status === val
                      ? "bg-emerald-500 text-slate-900"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Прычына блэкліста */}
          {form.status === "blacklist" && (
            <Field
              label="Прычына блэкліста"
              value={form.blacklistReason}
              onChange={(v) => setField("blacklistReason", v)}
              placeholder="Апішыце прычыну..."
            />
          )}

          <Divider label="🔍 Пажаданні" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Дзе шукае працу"
              value={form.jobPreferences.location}
              onChange={(v) => setField("jobPreferences.location", v)}
            />
            <Field
              label="Гатовы з"
              value={form.jobPreferences.readyDate}
              onChange={(v) => setField("jobPreferences.readyDate", v)}
              placeholder="01.05.2026"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                Гатовы да пераезду
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
                        "jobPreferences.locationFlexible",
                        val === "true",
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      String(form.jobPreferences.locationFlexible) === val
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
                Патрэбна жытло
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-2">Еду</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  ["alone", "Адзін/а"],
                  ["couple", "Пара"],
                  ["family", "Сям'я"],
                ].map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() => setField("jobPreferences.travelGroup", val)}
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
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                Графік
              </label>
              <div className="flex gap-2 flex-wrap">
                {[
                  ["1_shift", "1 зм."],
                  ["2_shifts", "2 зм."],
                  ["3_shifts", "3 зм."],
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
          </div>

          <Divider label="📄 Дакументы" />
          <div className="flex gap-4 flex-wrap">
            {[
              ["hasVisa", "Віза"],
              ["hasSanepid", "Санепід"],
              ["hasUDT", "UDT"],
            ].map(([key, lbl]) => (
              <button
                key={key}
                onClick={() =>
                  setField(`documents.${key}`, !form.documents[key])
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  form.documents[key]
                    ? "bg-emerald-500 text-slate-900"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {form.documents[key] ? "✅" : "❌"} {lbl}
              </button>
            ))}
          </div>

          <Divider label="📝 Нататкі" />
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Нататкі рэкрутэра
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              rows={3}
              placeholder="Любая дадатковая інфармацыя..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-medium text-sm rounded-lg transition-colors"
          >
            {saving ? "Захаванне..." : "Захаваць змены"}
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
