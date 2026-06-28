// frontend/src/components/candidates/AddCandidateModal.jsx
import { useState } from "react";
import { createCandidate } from "../../services/api";
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

const EMPTY_FORM = {
  name: "",
  contactType: "telegram",
  telegram: "",
  phone: "",
  nationality: "",
  currentLocation: "",
  age: "",
  gender: "",
  status: "new",
  source: "manual",
  notes: "",
  jobPreferences: {
    location: "",
    locationFlexible: false,
    schedule: [],
    contractType: "any",
    needsAccommodation: false,
    travelGroup: "alone",
    readyDate: "",
  },
  documents: {
    hasVisa: false,
    hasSanepid: false,
    hasUDT: false,
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
      const res = await createCandidate({
        ...form,
        age: form.age ? Number(form.age) : undefined,
      });
      onAdd(res.data);
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
          <h2 className="font-semibold text-slate-100">Новы кандыдат</h2>
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
            placeholder="Іван Іваноў"
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
              placeholder="Украіна"
            />
            <Field
              label="Дзе знаходзіцца"
              value={form.currentLocation}
              onChange={(v) => setField("currentLocation", v)}
              placeholder="Кіеў"
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

          <Divider label="🔍 Пажаданні" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Дзе шукае працу"
              value={form.jobPreferences.location}
              onChange={(v) => setField("jobPreferences.location", v)}
              placeholder="Варшава"
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
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">Графік</label>
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
-----
// frontend/src/components/candidates/CandidateFilters.jsx
import { EMPTY_CANDIDATE_FILTERS } from "../../constants/filters";

const SPHERES = [
  { value: "warehouse", label: "Склад" },
  { value: "food_production", label: "Харчаванне" },
  { value: "automotive", label: "Аўтазавод" },
  { value: "agriculture", label: "Сельская гаспадарка" },
  { value: "retail", label: "Магазін" },
  { value: "other", label: "Іншае" },
];

function Section({ label, children }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
        {label}
      </p>
      {children}
    </div>
  );
}

function MultiBtn({ value, label, active, onClick }) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors mb-1 mr-1 ${
        active
          ? "bg-emerald-500 text-slate-900"
          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
      }`}
    >
      {label}
    </button>
  );
}

export default function CandidateFilters({ draft, onChange }) {
  const toggle = (key, value) => {
    const cur = draft[key];
    const next = cur.includes(value)
      ? cur.filter((v) => v !== value)
      : [...cur, value];
    onChange({ ...draft, [key]: next });
  };

  const activeCount = Object.entries(draft).filter(([k, v]) => {
    if (k === "search") return v.length > 0;
    if (k === "status") return v !== "";
    return Array.isArray(v) && v.length > 0;
  }).length;

  return (
    <div className="h-full overflow-y-auto px-4 py-5">
      {/* Пошук */}
      <Section label="Пошук">
        <div className="relative">
          <input
            type="text"
            value={draft.search}
            onChange={(e) => onChange({ ...draft, search: e.target.value })}
            placeholder="Імя, тэлефон, горад..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
          />
          {draft.search && (
            <button
              onClick={() => onChange({ ...draft, search: "" })}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </Section>

      {/* Статус */}
      <Section label="Статус">
        <div className="flex flex-wrap">
          {[
            { value: "", label: "Усе" },
            { value: "new", label: "Новы" },
            { value: "active", label: "Актыўны" },
            { value: "waiting", label: "Чакае" },
            { value: "employed", label: "Працуе" },
            { value: "left", label: "Сышоў" },
            { value: "blacklist", label: "Блэкліст" },
          ].map((s) => (
            <button
              key={s.value}
              onClick={() => onChange({ ...draft, status: s.value })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors mb-1 mr-1 ${
                draft.status === s.value
                  ? "bg-emerald-500 text-slate-900"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Гендар */}
      <Section label="Гендар">
        <div className="flex flex-wrap">
          {[
            { value: "female", label: "👩 Жанчыны" },
            { value: "male", label: "👨 Мужчыны" },
          ].map((g) => (
            <MultiBtn
              key={g.value}
              value={g.value}
              label={g.label}
              active={draft.gender.includes(g.value)}
              onClick={(v) => toggle("gender", v)}
            />
          ))}
        </div>
      </Section>

      {/* Нацыянальнасць */}
      <Section label="Нацыянальнасць">
        <div className="flex flex-wrap">
          {[
            { value: "Україна", label: "🇺🇦 Украіна" },
            { value: "Молдова", label: "🇲🇩 Малдова" },
            { value: "Білорусь", label: "🇧🇾 Беларусь" },
          ].map((n) => (
            <MultiBtn
              key={n.value}
              value={n.value}
              label={n.label}
              active={draft.nationality.includes(n.value)}
              onClick={(v) => toggle("nationality", v)}
            />
          ))}
        </div>
      </Section>

      {/* Сфера */}
      <Section label="Сфера">
        <div className="flex flex-wrap">
          {SPHERES.map((s) => (
            <MultiBtn
              key={s.value}
              value={s.value}
              label={s.label}
              active={draft.sphere.includes(s.value)}
              onClick={(v) => toggle("sphere", v)}
            />
          ))}
        </div>
      </Section>

      {/* Лакацыя */}
      <Section label="Лакацыя">
        <div className="flex flex-wrap">
          {[
            { value: "city", label: "📍 Канкрэтны горад" },
            { value: "city_area", label: "🏘 Горад + 50км" },
            { value: "region", label: "🗺 Рэгіён/ваяводства" },
            { value: "any", label: "✈️ Без розніцы" },
          ].map((l) => (
            <MultiBtn
              key={l.value}
              value={l.value}
              label={l.label}
              active={draft.location.includes(l.value)}
              onClick={(v) => toggle("location", v)}
            />
          ))}
        </div>
      </Section>

      {/* Жытло */}
      <Section label="Жытло">
        <div className="flex flex-wrap">
          {[
            { value: "needs", label: "🏠 Патрэбна жытло" },
            { value: "own", label: "❌ Сваё жытло" },
          ].map((a) => (
            <MultiBtn
              key={a.value}
              value={a.value}
              label={a.label}
              active={draft.accommodation.includes(a.value)}
              onClick={(v) => toggle("accommodation", v)}
            />
          ))}
        </div>
      </Section>

      {/* Група */}
      <Section label="Еду">
        <div className="flex flex-wrap">
          {[
            { value: "alone", label: "👤 Адзін/а" },
            { value: "couple", label: "👫 Пара" },
            { value: "family", label: "👨‍👩‍👧 Сям'я" },
          ].map((g) => (
            <MultiBtn
              key={g.value}
              value={g.value}
              label={g.label}
              active={draft.travelGroup.includes(g.value)}
              onClick={(v) => toggle("travelGroup", v)}
            />
          ))}
        </div>
      </Section>

      {/* Графік */}
      <Section label="Графік">
        <div className="flex flex-wrap">
          {[
            { value: "1_shift", label: "1 змена" },
            { value: "2_shifts", label: "2 змены" },
            { value: "3_shifts", label: "3 змены" },
          ].map((s) => (
            <MultiBtn
              key={s.value}
              value={s.value}
              label={s.label}
              active={draft.schedule.includes(s.value)}
              onClick={(v) => toggle("schedule", v)}
            />
          ))}
        </div>
      </Section>

      {/* Дакументы */}
      <Section label="Дакументы">
        <div className="flex flex-wrap">
          {[
            { value: "visa", label: "Віза/Пабыт" },
            { value: "sanepid", label: "Санепід" },
            { value: "udt", label: "UDT" },
          ].map((d) => (
            <MultiBtn
              key={d.value}
              value={d.value}
              label={d.label}
              active={draft.docs.includes(d.value)}
              onClick={(v) => toggle("docs", v)}
            />
          ))}
        </div>
      </Section>

      {/* Крыніца */}
      <Section label="Крыніца">
        <div className="flex flex-wrap">
          {[
            { value: "site", label: "🌐 Сайт" },
            { value: "manual", label: "✋ Ручны" },
            { value: "telegram_bot", label: "✈️ Telegram" },
          ].map((s) => (
            <MultiBtn
              key={s.value}
              value={s.value}
              label={s.label}
              active={draft.source.includes(s.value)}
              onClick={(v) => toggle("source", v)}
            />
          ))}
        </div>
      </Section>

      {/* Скінуць */}
      {activeCount > 0 && (
        <button
          onClick={() => onChange(EMPTY_CANDIDATE_FILTERS)}
          className="w-full mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded-lg transition-colors"
        >
          Скінуць усе фільтры ({activeCount})
        </button>
      )}
    </div>
  );
}
-------
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
    gender: candidate.gender || "",
    status: candidate.status || "new",
    notes: candidate.notes || "",
    blacklistReason: candidate.blacklistReason || "",
    jobPreferences: {
      location: candidate.jobPreferences?.location || "",
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
-----
// frontend/src/components/candidates/ProfileModal.jsx
import { useEffect, useState } from "react";
import {
  getCandidate,
  updateCandidate,
  addCandidateHistory,
  matchVacanciesForCandidate,
} from "../../services/api";
import Divider from "../shared/Divider";
import EditCandidateModal from "./EditCandidateModal";

const STATUS_COLORS = {
  new: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  waiting: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  employed: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  left: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
  blacklist: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const STATUS_LABELS = {
  new: "Новы",
  active: "Актыўны",
  waiting: "Чакае",
  employed: "Працуе",
  left: "Сышоў",
  blacklist: "Блэкліст",
};

export default function ProfileModal({ candidateId, onClose, onUpdate }) {
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [matchedVacancies, setMatchedVacancies] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);

  const handleMatch = async () => {
    setMatchLoading(true);
    try {
      const res = await matchVacanciesForCandidate(candidate._id);
      setMatchedVacancies(res.data);
    } catch {
      alert("Памылка матчынгу");
    } finally {
      setMatchLoading(false);
    }
  };
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getCandidate(candidateId);
        setCandidate(res.data);
      } catch {
        console.error("Памылка загрузкі профілю");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [candidateId]);

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await updateCandidate(candidate._id, { status: newStatus });
      setCandidate(res.data);
      onUpdate(res.data);
      setEditStatus(false);
    } catch {
      alert("Памылка змены статусу");
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setAddingNote(true);
    try {
      const res = await addCandidateHistory(candidate._id, {
        type: "note",
        text: newNote,
      });
      setCandidate(res.data);
      setNewNote("");
    } catch {
      alert("Памылка дадання нататкі");
    } finally {
      setAddingNote(false);
    }
  };

  const handleSaveEdit = (updated) => {
    setCandidate(updated);
    onUpdate(updated);
    setShowEdit(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
          {/* Загаловак */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
            <h2 className="font-semibold text-slate-100">Профіль кандыдата</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors"
              >
                ✏️ Рэдагаваць
              </button>
              <button
                onClick={handleMatch}
                disabled={matchLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors disabled:opacity-50"
              >
                🎯 {matchLoading ? "Пошук..." : "Вакансіі"}
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">Загрузка...</div>
          ) : !candidate ? (
            <div className="p-8 text-center text-slate-500">Не знойдзена</div>
          ) : (
            <div className="px-6 py-5 space-y-5">
              {/* Асноўная інфа */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-100">
                    {candidate.name}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-400">
                    {candidate.contactType === "telegram" &&
                      candidate.telegram && (
                        <span>✈️ {candidate.telegram}</span>
                      )}
                    {(candidate.contactType === "viber" ||
                      candidate.contactType === "phone") &&
                      candidate.phone && <span>📞 {candidate.phone}</span>}
                    {candidate.nationality && (
                      <span>🌍 {candidate.nationality}</span>
                    )}
                    {candidate.currentLocation && (
                      <span>📍 {candidate.currentLocation}</span>
                    )}
                    {candidate.age && <span>🎂 {candidate.age} г.</span>}
                    {candidate.gender && (
                      <span>
                        {candidate.gender === "female"
                          ? "👩 Жанчына"
                          : "👨 Мужчына"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Статус */}
                <div className="shrink-0">
                  {editStatus ? (
                    <div className="flex flex-col gap-1">
                      {Object.entries(STATUS_LABELS).map(([val, lbl]) => (
                        <button
                          key={val}
                          onClick={() => handleStatusChange(val)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors text-left ${
                            candidate.status === val
                              ? "bg-emerald-500 text-slate-900"
                              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                          }`}
                        >
                          {lbl}
                        </button>
                      ))}
                      <button
                        onClick={() => setEditStatus(false)}
                        className="text-xs text-slate-600 mt-1 text-center"
                      >
                        Адмена
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditStatus(true)}
                      className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer ${STATUS_COLORS[candidate.status]}`}
                    >
                      {STATUS_LABELS[candidate.status]} ▾
                    </button>
                  )}
                </div>
              </div>

              {/* Мета-інфа */}
              <div className="flex gap-4 text-xs text-slate-600">
                <span>
                  📅{" "}
                  {new Date(candidate.createdAt).toLocaleString("uk-UA", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span>
                  {candidate.source === "site"
                    ? "🌐 Сайт"
                    : candidate.source === "telegram_bot"
                      ? "✈️ Telegram"
                      : "✋ Ручны"}
                </span>
              </div>

              {/* Нататкі рэкрутэра */}
              {candidate.notes && (
                <>
                  <Divider label="📝 Нататкі" />
                  <p className="text-sm text-slate-400 bg-slate-800 rounded-lg px-3 py-2">
                    {candidate.notes}
                  </p>
                </>
              )}

              {/* Пажаданні */}
              {candidate.jobPreferences && (
                <>
                  <Divider label="🔍 Пажаданні да працы" />
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {candidate.jobPreferences.locationFlexible ? (
                      <div className="text-slate-400">
                        📍 Гатовы да пераезду
                      </div>
                    ) : candidate.jobPreferences.location ? (
                      <div className="text-slate-400">
                        📍 {candidate.jobPreferences.location}
                      </div>
                    ) : null}
                    {candidate.jobPreferences.readyDate && (
                      <div className="text-slate-400">
                        📅 Гатовы з: {candidate.jobPreferences.readyDate}
                      </div>
                    )}
                    {candidate.jobPreferences.needsAccommodation && (
                      <div className="text-slate-400">🏠 Патрэбна жытло</div>
                    )}
                    {candidate.jobPreferences.travelGroup && (
                      <div className="text-slate-400">
                        👥{" "}
                        {candidate.jobPreferences.travelGroup === "alone"
                          ? "Адзін/а"
                          : candidate.jobPreferences.travelGroup === "couple"
                            ? "Пара"
                            : "З сям'ёй"}
                      </div>
                    )}
                    {candidate.jobPreferences.schedule?.length > 0 && (
                      <div className="text-slate-400">
                        ⏰ {candidate.jobPreferences.schedule.join(", ")}
                      </div>
                    )}
                    {candidate.jobPreferences.contractType && (
                      <div className="text-slate-400">
                        📄 {candidate.jobPreferences.contractType}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Дакументы */}
              {candidate.documents && (
                <>
                  <Divider label="📄 Дакументы" />
                  <div className="flex gap-3 flex-wrap">
                    {[
                      [candidate.documents.hasVisa, "Віза"],
                      [candidate.documents.hasSanepid, "Санепід"],
                      [candidate.documents.hasUDT, "UDT"],
                    ].map(([has, label]) => (
                      <span
                        key={label}
                        className={`text-xs px-2 py-1 rounded-lg ${
                          has
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-slate-800 text-slate-600"
                        }`}
                      >
                        {has ? "✅" : "❌"} {label}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* Заяўкі на вакансіі */}
              {candidate.appliedVacancies?.length > 0 && (
                <>
                  <Divider label="💼 Заяўкі на вакансіі" />
                  <div className="space-y-2">
                    {candidate.appliedVacancies.map((av, i) => (
                      <div
                        key={i}
                        className="bg-slate-800 rounded-lg px-3 py-2 text-sm"
                      >
                        <span className="text-slate-300">
                          {av.type === "want_work"
                            ? "🟢 Хоча працаваць"
                            : "💬 Хоча дэталі"}
                        </span>
                        {av.vacancyId?.title && (
                          <span className="text-slate-500 ml-2">
                            — {av.vacancyId.title}
                          </span>
                        )}
                        {av.vacancyId?.vacancyCode && (
                          <span className="text-slate-600 ml-2 font-mono text-xs">
                            ({av.vacancyId.vacancyCode})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
              {/* Матчынг вакансій */}
              {matchedVacancies !== null && (
                <>
                  <Divider label="🎯 Падыходзячыя вакансіі" />
                  {matchedVacancies.length === 0 ? (
                    <p className="text-xs text-slate-600">
                      Падыходзячых вакансій не знойдзена
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {matchedVacancies.map((v) => (
                        <div
                          key={v._id}
                          className="bg-slate-800 rounded-lg px-3 py-2"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-slate-200 font-medium">
                                {v.title}
                              </span>
                              {v.vacancyCode && (
                                <span className="text-xs font-mono text-slate-500 ml-2">
                                  ({v.vacancyCode})
                                </span>
                              )}
                            </div>
                            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">
                              ⭐ {v.matchScore}
                            </span>
                          </div>
                          <div className="flex gap-3 mt-1 text-xs text-slate-500">
                            <span>📍 {v.location}</span>
                            {v.agencyName && <span>🏢 {v.agencyName}</span>}
                            {v.salary?.base && <span>💰 {v.salary.base}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              {/* Гісторыя */}
              <Divider label="🗂 Гісторыя зносін" />
              <div className="space-y-2 mb-3">
                {!candidate.history?.length ? (
                  <p className="text-xs text-slate-600">Гісторыя пустая</p>
                ) : (
                  [...candidate.history].reverse().map((h, i) => (
                    <div key={i} className="bg-slate-800 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-500">
                          {new Date(h.date).toLocaleString("uk-UA", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="text-xs bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">
                          {h.type === "call"
                            ? "📞 Званок"
                            : h.type === "chat"
                              ? "💬 Чат"
                              : "📝 Нататка"}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300">{h.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Дадаць нататку */}
              <div className="flex gap-2">
                <input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                  placeholder="Дадаць нататку..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleAddNote}
                  disabled={addingNote || !newNote.trim()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-medium text-sm rounded-lg transition-colors"
                >
                  Дадаць
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Мадалка рэдагавання */}
      {showEdit && candidate && (
        <EditCandidateModal
          candidate={candidate}
          onClose={() => setShowEdit(false)}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
}
-------
// frontend/src/components/shared/Divider.jsx
export default function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
        {label}
      </span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}
------
// frontend/src/components/shared/Field.jsx
export default function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-base text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
      />
    </div>
  );
}
------
import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

export default function MultiSelect({
  label,
  options = [],
  selected = [],
  onChange,
  placeholder = "Выбраць...",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (val) => {
    const next = selected.includes(val)
      ? selected.filter((s) => s !== val)
      : [...selected, val];
    onChange(next);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
          {label}
        </label>
      )}

      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`min-h-[44px] w-full bg-white border ${
          isOpen
            ? "border-emerald-500/50 ring-4 ring-emerald-500/5"
            : "border-slate-200"
        } rounded-xl px-4 py-2 flex items-center justify-between cursor-pointer transition-all shadow-sm hover:border-slate-300`}
      >
        <div className="flex flex-wrap gap-1">
          {selected.length === 0 ? (
            <span className="text-slate-400 text-sm">{placeholder}</span>
          ) : (
            selected.map((val) => {
              // Шукаем аб'ект опцыі або выкарыстоўваем само значэнне
              const opt = options.find((o) => o.value === val || o === val);
              const displayLabel = opt?.label || opt || val;

              return (
                <span
                  key={val}
                  className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1.5 shadow-sm"
                >
                  {displayLabel}
                  <X
                    size={10}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(val);
                    }}
                    className="hover:text-emerald-200 transition-colors"
                  />
                </span>
              );
            })
          )}
        </div>
        <ChevronDown
          size={14}
          className={`text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[100] max-h-72 overflow-y-auto custom-scrollbar p-1.5">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-xs text-slate-500 italic">
              Няма варыянтаў
            </div>
          ) : (
            options.map((opt) => {
              const val = opt.value || opt;
              const lbl = opt.label || opt;
              const isSelected = selected.includes(val);

              return (
                <div
                  key={val}
                  onClick={() => toggleOption(val)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-4 h-4 border rounded-md flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-slate-300"
                    }`}
                  >
                    {isSelected && (
                      <span className="text-white text-[10px]">✓</span>
                    )}
                  </div>
                  <span className="truncate">{lbl}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
------// frontend/src/components/templates/AddTemplateModal.jsx
import { useState } from "react";
import { createTemplate } from "../../services/api";
import Field from "../shared/Field";
import Divider from "../shared/Divider";

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

export default function AddTemplateModal({ onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY_TEMPLATE);
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
      const res = await createTemplate(data);
      onAdd(res.data);
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
          <h2 className="font-semibold text-slate-100">Новы шаблон вакансіі</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
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

          <Field
            label="Ключавыя словы (праз коску)"
            value={form.keywords}
            onChange={(v) => setField("keywords", v)}
            placeholder="Гольчево, Голчево, маринад"
          />

          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
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
          <div>
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
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
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
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-medium text-sm rounded-lg transition-colors"
          >
            {saving ? "Захаванне..." : "Захаваць шаблон"}
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
-------
// frontend/src/components/templates/EditTemplateModal.jsx
import { useState } from "react";
import { updateTemplate } from "../../services/api";
import Field from "../shared/Field";
import Divider from "../shared/Divider";

export default function EditTemplateModal({ template, onClose, onSave }) {
  const [form, setForm] = useState({
    ...template,
    keywords: Array.isArray(template.keywords)
      ? template.keywords.join(", ")
      : "",
    requirements: {
      ...template.requirements,
      gender: Array.isArray(template.requirements?.gender)
        ? template.requirements.gender.join(", ")
        : template.requirements?.gender || "",
      standardDocs: Array.isArray(template.requirements?.standardDocs)
        ? template.requirements.standardDocs.join(", ")
        : template.requirements?.standardDocs || "",
      nationalities: Array.isArray(template.requirements?.nationalities)
        ? template.requirements.nationalities.join(", ")
        : template.requirements?.nationalities || "",
    },
    conditions: {
      ...template.conditions,
      specificNuances: Array.isArray(template.conditions?.specificNuances)
        ? template.conditions.specificNuances.join(", ")
        : template.conditions?.specificNuances || "",
    },
  });
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
        next[parts[0]] = {
          ...next[parts[0]],
          [parts[1]]: {
            ...next[parts[0]]?.[parts[1]],
            [parts[2]]: value,
          },
        };
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
        keywords:
          typeof form.keywords === "string"
            ? form.keywords
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean)
            : form.keywords,
        requirements: {
          ...form.requirements,
          gender:
            typeof form.requirements.gender === "string"
              ? form.requirements.gender
                  .split(",")
                  .map((g) => g.trim())
                  .filter(Boolean)
              : form.requirements.gender,
          standardDocs:
            typeof form.requirements.standardDocs === "string"
              ? form.requirements.standardDocs
                  .split(",")
                  .map((d) => d.trim())
                  .filter(Boolean)
              : form.requirements.standardDocs,
          nationalities:
            typeof form.requirements.nationalities === "string"
              ? form.requirements.nationalities
                  .split(",")
                  .map((n) => n.trim())
                  .filter(Boolean)
              : form.requirements.nationalities,
        },
        conditions: {
          ...form.conditions,
          specificNuances:
            typeof form.conditions.specificNuances === "string"
              ? form.conditions.specificNuances
                  .split(",")
                  .map((n) => n.trim())
                  .filter(Boolean)
              : form.conditions.specificNuances,
        },
      };
      const res = await updateTemplate(template._id, data);
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
        {/* ЗАГАЛОВАК */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div>
            <h2 className="font-semibold text-slate-100">
              Рэдагаванне шаблона
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              <span className="text-emerald-400 font-mono">
                {template.agencyName}
              </span>
              {" · "}
              {template.templateName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-3">
          {/* СІСТЭМНЫЯ ПАЛІ */}
          <Divider label="⚙️ Сістэмныя палі" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Агенцыя *"
              value={form.agencyName}
              onChange={(v) => setField("agencyName", v)}
            />
            <Field
              label="Назва шаблона *"
              value={form.templateName}
              onChange={(v) => setField("templateName", v)}
            />
            <div className="col-span-2">
              <Field
                label="Публічны загаловак (vacancydescription)"
                value={form.vacancydescription}
                onChange={(v) => setField("vacancydescription", v)}
              />
            </div>
            <div className="col-span-2">
              <Field
                label="Ключавыя словы (праз коску)"
                value={form.keywords}
                onChange={(v) => setField("keywords", v)}
              />
            </div>
            <Field
              label="Катэгорыя"
              value={form.category}
              onChange={(v) => setField("category", v)}
            />
            <Field
              label="Тып дагавора"
              value={form.contractType}
              onChange={(v) => setField("contractType", v)}
            />
          </div>

          {/* ЛАКАЦЫЯ */}
          <Divider label="📍 Лакацыя" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Горад (location)"
              value={form.location}
              onChange={(v) => setField("location", v)}
            />
            <Field
              label="Горад аформлення (checkInCity)"
              value={form.checkInCity}
              onChange={(v) => setField("checkInCity", v)}
            />
            <div className="col-span-2">
              <Field
                label="Поўны адрас (locationDescription)"
                value={form.locationDescription}
                onChange={(v) => setField("locationDescription", v)}
              />
            </div>
            <Field
              label="Ваяводства"
              value={form.voivodeship}
              onChange={(v) => setField("voivodeship", v)}
            />
            <Field
              label="Краіна"
              value={form.country}
              onChange={(v) => setField("country", v)}
            />
          </div>

          {/* АПЛАТА */}
          <Divider label="💰 Аплата" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Базавая стаўка (baseNetto)"
              value={form.salary?.baseNetto}
              onChange={(v) => setField("salary.baseNetto", v)}
            />
            <Field
              label="Студэнцкая стаўка (studentNetto)"
              value={form.salary?.studentNetto}
              onChange={(v) => setField("salary.studentNetto", v)}
            />
            <Field
              label="Гадзін у месяц (hoursRange)"
              value={form.salary?.hoursRange}
              onChange={(v) => setField("salary.hoursRange", v)}
            />
            <Field
              label="Даты выплат (payoutDates)"
              value={form.salary?.payoutDates}
              onChange={(v) => setField("salary.payoutDates", v)}
            />
            <div className="col-span-2">
              <Field
                label="Бонусы (bonusDetails)"
                value={form.salary?.bonusDetails}
                onChange={(v) => setField("salary.bonusDetails", v)}
              />
            </div>
            <div className="col-span-2">
              <Field
                label="Нататкі па аплаце (salaryNotes)"
                value={form.salary?.salaryNotes}
                onChange={(v) => setField("salary.salaryNotes", v)}
              />
            </div>
          </div>

          {/* ГРАФІК */}
          <Divider label="🕒 Графік" />
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field
                label="Апісанне графіка (description)"
                value={form.schedule?.description}
                onChange={(v) => setField("schedule.description", v)}
              />
            </div>
            <Field
              label="Колькасць змен (shiftsCount)"
              value={form.schedule?.shiftsCount}
              onChange={(v) => setField("schedule.shiftsCount", v)}
            />
            <Field
              label="Гадзін за змену (hoursPerShift)"
              value={form.schedule?.hoursPerShift}
              onChange={(v) => setField("schedule.hoursPerShift", v)}
            />
            <Field
              label="Дні тыдня (workDaysWeek)"
              value={form.schedule?.workDaysWeek}
              onChange={(v) => setField("schedule.workDaysWeek", v)}
            />
            <Field
              label="Перапынак (breakDuration)"
              value={form.schedule?.breakDuration}
              onChange={(v) => setField("schedule.breakDuration", v)}
            />
          </div>

          {/* АБАВЯЗКІ */}
          <Divider label="🛠 Абавязкі" />
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Апісанне (праз кропку)
            </label>
            <textarea
              value={form.description || ""}
              onChange={(e) => setField("description", e.target.value)}
              rows={4}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* ПАТРАБАВАННІ */}
          <Divider label="📋 Патрабаванні" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Гендар (праз коску)"
              value={form.requirements?.gender}
              onChange={(v) => setField("requirements.gender", v)}
            />
            <Field
              label="Максімальны ўзрост (ageMax)"
              value={form.requirements?.ageMax}
              onChange={(v) => setField("requirements.ageMax", v)}
            />
            <Field
              label="Узровень польскай"
              value={form.requirements?.polishLanguageLevel}
              onChange={(v) => setField("requirements.polishLanguageLevel", v)}
            />
            <Field
              label="Фізічная нагрузка"
              value={form.requirements?.physicalLoad}
              onChange={(v) => setField("requirements.physicalLoad", v)}
            />
            <div className="col-span-2">
              <Field
                label="Дакументы (праз коску)"
                value={form.requirements?.standardDocs}
                onChange={(v) => setField("requirements.standardDocs", v)}
              />
            </div>
            <div className="col-span-2">
              <Field
                label="Нацыянальнасці (праз коску)"
                value={form.requirements?.nationalities}
                onChange={(v) => setField("requirements.nationalities", v)}
              />
            </div>
            <div className="col-span-2">
              <Field
                label="Дадатковыя дакументы"
                value={form.requirements?.additionalDocsDetails}
                onChange={(v) =>
                  setField("requirements.additionalDocsDetails", v)
                }
              />
            </div>
          </div>

          {/* ЖЫТЛО */}
          <Divider label="🏠 Жытло" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Тып жытла (type)"
              value={form.accommodation?.type}
              onChange={(v) => setField("accommodation.type", v)}
            />
            <Field
              label="Кошт (costRaw)"
              value={form.accommodation?.costRaw}
              onChange={(v) => setField("accommodation.costRaw", v)}
            />
            <div className="col-span-2">
              <Field
                label="Дэталі"
                value={form.accommodation?.details}
                onChange={(v) => setField("accommodation.details", v)}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="tplForCouples"
                checked={!!form.accommodation?.forCouples}
                onChange={(e) =>
                  setField("accommodation.forCouples", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <label htmlFor="tplForCouples" className="text-xs text-slate-400">
                Для пар
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="tplWithChildren"
                checked={!!form.accommodation?.withChildren}
                onChange={(e) =>
                  setField("accommodation.withChildren", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <label
                htmlFor="tplWithChildren"
                className="text-xs text-slate-400"
              >
                З дзецьмі
              </label>
            </div>
          </div>

          {/* ТРАНСПАРТ */}
          <Divider label="🚌 Транспарт" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="tplTransportProvided"
                checked={!!form.transport?.provided}
                onChange={(e) =>
                  setField("transport.provided", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <label
                htmlFor="tplTransportProvided"
                className="text-xs text-slate-400"
              >
                Прадастаўляецца
              </label>
            </div>
            <Field
              label="Кошт (costRaw)"
              value={form.transport?.costRaw}
              onChange={(v) => setField("transport.costRaw", v)}
            />
            <div className="col-span-2">
              <Field
                label="Дэталі"
                value={form.transport?.details}
                onChange={(v) => setField("transport.details", v)}
              />
            </div>
          </div>

          {/* ВЫДАТКІ */}
          <Divider label="💸 Выдаткі і адказнасць" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="tplHasStartExpenses"
                checked={!!form.startExpenses?.hasStartExpenses}
                onChange={(e) =>
                  setField("startExpenses.hasStartExpenses", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <label
                htmlFor="tplHasStartExpenses"
                className="text-xs text-slate-400"
              >
                Ёсць выдаткі на старце
              </label>
            </div>
            <div className="col-span-2">
              <Field
                label="Дэталі выдаткаў на старце"
                value={form.startExpenses?.details}
                onChange={(v) => setField("startExpenses.details", v)}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="tplHasLiability"
                checked={!!form.earlyTerminationLiability?.hasLiability}
                onChange={(e) =>
                  setField(
                    "earlyTerminationLiability.hasLiability",
                    e.target.checked,
                  )
                }
                className="accent-emerald-500"
              />
              <label
                htmlFor="tplHasLiability"
                className="text-xs text-slate-400"
              >
                Ёсць штраф за датэрміновае звальненне
              </label>
            </div>
            <div className="col-span-2">
              <Field
                label="Дэталі штрафу"
                value={form.earlyTerminationLiability?.details}
                onChange={(v) =>
                  setField("earlyTerminationLiability.details", v)
                }
              />
            </div>
          </div>

          {/* УМОВЫ ПРАЦЫ */}
          <Divider label="🌡 Умовы працы" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="tplWorkwearFree"
                checked={!!form.conditions?.workwearFree}
                onChange={(e) =>
                  setField("conditions.workwearFree", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <label
                htmlFor="tplWorkwearFree"
                className="text-xs text-slate-400"
              >
                Вопратка бясплатна
              </label>
            </div>
            <Field
              label="Тып харчавання (foodType)"
              value={form.conditions?.foodType}
              onChange={(v) => setField("conditions.foodType", v)}
            />
            <div className="col-span-2">
              <Field
                label="Дэталі харчавання (foodDetails)"
                value={form.conditions?.foodDetails}
                onChange={(v) => setField("conditions.foodDetails", v)}
              />
            </div>
            <div className="col-span-2">
              <Field
                label="Спецыфічныя нюансы (праз коску)"
                value={form.conditions?.specificNuances}
                onChange={(v) => setField("conditions.specificNuances", v)}
              />
            </div>
            <div className="col-span-2">
              <Field
                label="Дэталі ўмоў (specificConditionsDetails)"
                value={form.conditions?.specificConditionsDetails}
                onChange={(v) =>
                  setField("conditions.specificConditionsDetails", v)
                }
              />
            </div>
          </div>

          {/* КАМПЕНСАЦЫІ */}
          <Divider label="🎁 Кампенсацыі" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="tplHasCompensations"
                checked={!!form.employerCompensations?.hasCompensations}
                onChange={(e) =>
                  setField(
                    "employerCompensations.hasCompensations",
                    e.target.checked,
                  )
                }
                className="accent-emerald-500"
              />
              <label
                htmlFor="tplHasCompensations"
                className="text-xs text-slate-400"
              >
                Ёсць кампенсацыі
              </label>
            </div>
            <div className="col-span-2">
              <Field
                label="Дэталі кампенсацый"
                value={form.employerCompensations?.details}
                onChange={(v) => setField("employerCompensations.details", v)}
              />
            </div>
          </div>

          {/* ДАДАТКОВАЯ ІНФАРМАЦЫЯ */}
          <Divider label="📝 Дадаткова" />
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Дадатковыя нататкі
            </label>
            <textarea
              value={form.additionalNotes || ""}
              onChange={(e) => setField("additionalNotes", e.target.value)}
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>
        </div>

        {/* КНОПКІ */}
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
--------
// frontend/src/components/templates/TemplateViewModal.jsx
import React from "react";
import Divider from "../shared/Divider";
import {
  MapPin,
  Wallet,
  Clock,
  Info,
  Shirt,
  Check,
  User,
  Globe,
  FileText,
  Home,
  Bus,
  Utensils,
  Tag,
} from "lucide-react";

export default function TemplateViewModal({ template, onClose, onEdit }) {
  if (!template) return null;

  const t = template;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 shadow-2xl">
        {/* ЗАГАЛОВАК */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              {t.agencyName && (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/20 uppercase tracking-wider font-bold">
                  {t.agencyName}
                </span>
              )}
            </div>
            <h2 className="font-bold text-slate-100 text-lg leading-tight">
              {t.templateName}
            </h2>
            {t.vacancydescription &&
              t.vacancydescription !== t.templateName && (
                <p className="text-sm text-slate-400 mt-0.5">
                  {t.vacancydescription}
                </p>
              )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* ЗМЕСТ */}
        <div className="px-6 py-5 space-y-6">
          {/* ЛАКАЦЫЯ */}
          {(t.location || t.checkInCity) && (
            <div className="flex flex-wrap gap-2 text-sm">
              {t.location && (
                <span className="flex items-center gap-1.5 bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                  <MapPin size={14} className="text-red-400" /> {t.location}
                </span>
              )}
              {t.checkInCity && (
                <span className="flex items-center gap-1.5 bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700 text-xs">
                  📋 Аформленне: {t.checkInCity}
                </span>
              )}
              {t.country && (
                <span className="flex items-center gap-1.5 bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700 text-xs">
                  <Globe size={12} className="text-blue-400" /> {t.country}
                </span>
              )}
            </div>
          )}

          {/* КЛЮЧАВЫЯ СЛОВЫ */}
          {t.keywords?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {t.keywords.map((kw) => (
                <span
                  key={kw}
                  className="flex items-center gap-1 text-xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded border border-slate-700/50"
                >
                  <Tag size={10} /> {kw}
                </span>
              ))}
            </div>
          )}

          {/* АПЛАТА */}
          {(t.salary?.baseNetto ||
            t.salary?.bonusDetails ||
            t.salary?.salaryNotes) && (
            <>
              <Divider label="💰 Аплата" />
              <div className="space-y-1.5 text-sm">
                {t.salary.baseNetto && (
                  <div className="text-slate-100 font-bold text-base flex items-center gap-2">
                    <Wallet size={16} className="text-slate-500 shrink-0" />
                    {t.salary.baseNetto}
                  </div>
                )}
                {t.salary.studentNetto && (
                  <div className="text-emerald-400/90 ml-6 font-medium">
                    Студэнты: {t.salary.studentNetto}
                  </div>
                )}
                {t.salary.hoursRange && (
                  <div className="text-slate-400 ml-6">
                    Гадзін: {t.salary.hoursRange}
                  </div>
                )}
                {t.salary.payoutDates && (
                  <div className="text-slate-400 ml-6">
                    Выплаты: {t.salary.payoutDates}
                  </div>
                )}
                {t.salary.bonusDetails && (
                  <div className="text-emerald-400 text-xs bg-emerald-500/5 py-1.5 px-3 rounded-lg mt-1 ml-6 border border-emerald-500/10">
                    🎁 {t.salary.bonusDetails}
                  </div>
                )}
                {t.salary.salaryNotes && (
                  <div className="text-amber-400/90 text-xs mt-2 italic border-l-2 border-amber-500/30 pl-3 ml-6">
                    {t.salary.salaryNotes}
                  </div>
                )}
              </div>
            </>
          )}

          {/* АБАВЯЗКІ */}
          {t.description && (
            <>
              <Divider label="🛠 Абавязкі" />
              <ul className="space-y-2">
                {t.description.split(/[.;]/).map(
                  (item, i) =>
                    item.trim() && (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-slate-300"
                      >
                        <span className="text-emerald-500 mt-1 shrink-0">
                          <Check size={14} />
                        </span>
                        <span>{item.trim()}</span>
                      </li>
                    ),
                )}
              </ul>
            </>
          )}

          {/* ПАТРАБАВАННІ */}
          {(t.requirements?.gender?.length > 0 ||
            t.requirements?.ageMax ||
            t.requirements?.standardDocs?.length > 0 ||
            t.requirements?.polishLanguageLevel ||
            t.requirements?.physicalLoad) && (
            <>
              <Divider label="📋 Патрабаванні" />
              <div className="flex flex-wrap gap-2">
                {t.requirements.gender?.length > 0 && (
                  <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    <User size={12} className="text-blue-400" />
                    {Array.isArray(t.requirements.gender)
                      ? t.requirements.gender.join(", ")
                      : t.requirements.gender}
                  </span>
                )}
                {t.requirements.ageMax && (
                  <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    🎂 да {t.requirements.ageMax} гадоў
                  </span>
                )}
                {t.requirements.polishLanguageLevel && (
                  <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    🗣 {t.requirements.polishLanguageLevel}
                  </span>
                )}
                {t.requirements.standardDocs?.map((doc) => (
                  <span
                    key={doc}
                    className="flex items-center gap-1.5 text-xs bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20"
                  >
                    <FileText size={12} /> {doc}
                  </span>
                ))}
              </div>
              {t.requirements.physicalLoad && (
                <div className="text-xs text-slate-500 italic mt-2 pl-1">
                  {t.requirements.physicalLoad}
                </div>
              )}
            </>
          )}

          {/* ГРАФІК */}
          {(t.schedule?.description ||
            t.schedule?.workDaysWeek ||
            t.schedule?.hoursPerShift) && (
            <>
              <Divider label="🕒 Графік" />
              <div className="text-sm space-y-1.5 ml-1">
                {t.schedule.description && (
                  <div className="text-slate-300 flex items-start gap-2">
                    <Clock
                      size={16}
                      className="text-slate-500 shrink-0 mt-0.5"
                    />
                    {t.schedule.description}
                  </div>
                )}
                {t.schedule.workDaysWeek && (
                  <div className="text-slate-400 text-xs ml-6">
                    {t.schedule.workDaysWeek}
                  </div>
                )}
                {t.schedule.hoursPerShift && (
                  <div className="text-slate-400 text-xs font-mono ml-6 bg-slate-800/50 px-2 py-0.5 rounded inline-block">
                    {t.schedule.hoursPerShift}
                  </div>
                )}
                {t.schedule.breakDuration && (
                  <div className="text-slate-500 text-xs ml-6 italic">
                    Перапынак: {t.schedule.breakDuration}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ТЫП ДАГАВОРА */}
          {t.contractType && (
            <div className="text-sm text-slate-400 bg-slate-800/40 p-3 rounded-xl border border-slate-800 inline-flex items-center gap-2">
              <FileText size={16} className="text-blue-400" />
              Тып дагавора:{" "}
              <span className="text-slate-200 font-medium">
                {t.contractType}
              </span>
            </div>
          )}

          {/* ЖЫТЛО */}
          {(t.accommodation?.type || t.accommodation?.costRaw) && (
            <>
              <Divider label="🏠 Жытло" />
              <div className="text-sm space-y-1.5 ml-1">
                <div className="text-slate-300 font-medium flex items-center gap-2">
                  <Home size={16} className="text-orange-400" />
                  {t.accommodation.type}
                  {t.accommodation.forCouples && (
                    <span className="text-xs bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded border border-pink-500/20 ml-1">
                      💑 Пары
                    </span>
                  )}
                </div>
                {t.accommodation.costRaw && (
                  <div className="text-slate-400 ml-6">
                    {t.accommodation.costRaw}
                  </div>
                )}
                {t.accommodation.details && (
                  <div className="text-slate-500 text-xs leading-relaxed ml-6">
                    {t.accommodation.details}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ТРАНСПАРТ */}
          {(t.transport?.provided ||
            t.transport?.costRaw ||
            t.transport?.details) && (
            <>
              <Divider label="🚌 Транспарт" />
              <div className="text-sm text-slate-300 flex items-start gap-2 ml-1">
                <Bus size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <div>
                  {t.transport.costRaw && <span>{t.transport.costRaw}</span>}
                  {t.transport.details && (
                    <div className="text-slate-500 text-xs mt-0.5">
                      {t.transport.details}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ВЫДАТКІ І АДКАЗНАСЦЬ */}
          {(t.startExpenses?.hasStartExpenses ||
            t.earlyTerminationLiability?.hasLiability) && (
            <>
              <Divider label="💸 Выдаткі і адказнасць" />
              <div className="space-y-1.5 text-sm ml-1">
                {t.startExpenses?.hasStartExpenses &&
                  t.startExpenses.details && (
                    <div className="text-orange-400/80 text-xs bg-orange-500/5 px-3 py-2 rounded-lg border border-orange-500/10">
                      На старце: {t.startExpenses.details}
                    </div>
                  )}
                {t.earlyTerminationLiability?.hasLiability &&
                  t.earlyTerminationLiability.details && (
                    <div className="text-red-400/80 text-xs bg-red-500/5 px-3 py-2 rounded-lg border border-red-500/10">
                      Датэрміновае звальненне:{" "}
                      {t.earlyTerminationLiability.details}
                    </div>
                  )}
              </div>
            </>
          )}

          {/* УМОВЫ ПРАЦЫ */}
          {(t.conditions?.specificConditionsDetails ||
            t.conditions?.specificNuances?.length > 0 ||
            t.conditions?.foodType) && (
            <>
              <Divider label="🌡 Умовы працы" />
              <div className="space-y-2 text-sm ml-1">
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    <Shirt size={12} className="text-orange-400" />
                    Вопратка:{" "}
                    {t.conditions.workwearFree
                      ? "Бясплатна"
                      : "За кошт работніка"}
                  </span>
                  {t.conditions.foodType && (
                    <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                      <Utensils size={12} className="text-emerald-400" />
                      {t.conditions.foodType}
                    </span>
                  )}
                </div>
                {t.conditions.specificNuances?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {t.conditions.specificNuances.map((n) => (
                      <span
                        key={n}
                        className="text-xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded border border-slate-700/50"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                )}
                {t.conditions.specificConditionsDetails && (
                  <div className="text-slate-500 text-xs italic pl-1">
                    {t.conditions.specificConditionsDetails}
                  </div>
                )}
                {t.conditions.foodDetails && (
                  <div className="text-slate-500 text-xs italic pl-1">
                    {t.conditions.foodDetails}
                  </div>
                )}
              </div>
            </>
          )}

          {/* КАМПЕНСАЦЫІ */}
          {t.employerCompensations?.hasCompensations &&
            t.employerCompensations.details && (
              <>
                <Divider label="🎁 Кампенсацыі" />
                <div className="text-sm text-slate-300 ml-1">
                  {t.employerCompensations.details}
                </div>
              </>
            )}

          {/* ДАДАТКОВАЯ ІНФАРМАЦЫЯ */}
          {t.additionalNotes && (
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <div className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <Info size={14} /> Дадатковая інфармацыя
              </div>
              <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {t.additionalNotes}
              </div>
            </div>
          )}

          {/* МЕТА */}
          <div className="text-[10px] text-slate-600 pt-4 border-t border-slate-800 flex justify-between font-mono">
            <span>ID: {t._id?.substring(t._id.length - 8).toUpperCase()}</span>
            {t.createdAt && (
              <span>
                ДАДАНА: {new Date(t.createdAt).toLocaleString("uk-UA")}
              </span>
            )}
          </div>
        </div>

        {/* КНОПКІ */}
        <div className="flex gap-2 px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900 z-10">
          {onEdit && (
            <button
              onClick={() => onEdit(t)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg transition-all border border-slate-700"
            >
              ✏️ Рэдагаваць
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-sm rounded-lg transition-colors border border-slate-700 ml-auto"
          >
            Закрыць
          </button>
        </div>
      </div>
    </div>
  );
}
--------
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
-----
import React, { useState, useEffect } from "react";
import { X, Send, Plus, Trash2, Image, AlertCircle, Sparkles, FileText } from "lucide-react";
import { generateBulkPreview, publishBulk } from "../../services/api";

export default function BulkPublishModal({ selectedIds, onClose }) {
  const [parts, setParts] = useState([""]); 
  const [caption, setCaption] = useState(""); // 👈 Подпіс да фота
  const [previewUrl, setPreviewUrl] = useState(null); // 👈 Для прэв'ю файла
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // 1. Загрузка і разумнае разбіццё тэксту пры адкрыцці
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await generateBulkPreview(selectedIds);
        setParts([res.data.text]); // 👈 Увесь тэкст у адзін блок па змаўчанні
      } catch (err) {
        alert("Помилка завантаження: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [selectedIds]);
useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);
  // 2. Кіраванне часткамі
  const updatePart = (index, value) => {
    const newParts = [...parts];
    newParts[index] = value;
    setParts(newParts);
  };

  const addPart = () => setParts([...parts, ""]);
  
  const removePart = (index) => {
    if (parts.length > 1) {
      setParts(parts.filter((_, i) => i !== index));
    }
  };

  // 3. Адпраўка
  const handlePublish = async () => {
    if (!confirm(`Опублікувати дайджест у Telegram?`)) return;

    setPublishing(true);
    try {
      const formData = new FormData();
      // Збіраем подпіс (калі ёсць) і ўсе часткі ў адзін масіў, потым склейваем
      const allContent = [];
      if (selectedFile && caption.trim()) allContent.push(caption);
      parts.forEach(p => { if(p.trim()) allContent.push(p); });

      formData.append("text", allContent.join("\n\n=== SPLIT ===\n\n"));
      if (selectedFile) formData.append("file", selectedFile);

      await publishBulk(formData);
      alert("✅ Опубліковано!");
      onClose();
    } catch (err) {
      alert("Помилка: " + (err.response?.data?.message || err.message));
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-3xl flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-600">Готую дайджест...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative bg-slate-50 border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* ШАПКА */}
        <div className="px-8 py-5 bg-white border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="text-emerald-500" size={20} />
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Конструктор дайджесту</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">Вибрано вакансій: {selectedIds.length}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* КАНТЭНТ (ЧАСТКІ) */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {/* 1. ВЫБАР ФАЙЛА */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Медіа-файл (фото/відео)</label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-emerald-400 transition-all">
                <Image size={20} className="text-slate-400" />
                <span className="text-sm text-slate-500 truncate">{selectedFile ? selectedFile.name : "Додати медіа..."}</span>
                <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
              </label>
              {selectedFile && (
                <button onClick={() => setSelectedFile(null)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={20} /></button>
              )}
            </div>
          </div>

          {/* 2. НУЛЯВЫ БЛОК (ПОДПІС ДА МЕДЫЯ) */}
          {selectedFile && (
            <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 animate-in zoom-in-95 duration-300">
              <div className="flex gap-4 mb-4">
                {previewUrl && (
                  <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-emerald-200 shadow-sm bg-white">
                    {selectedFile.type.startsWith('video') 
                      ? <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white text-[10px]">VIDEO</div>
                      : <img src={previewUrl} className="w-full h-full object-cover" alt="preview" />
                    }
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Блок 0: Підпис до медіа</span>
                    <span className={`text-[10px] font-bold ${caption.length > 1024 ? "text-red-500" : "text-emerald-600/60"}`}>
                      {caption.length} / 1024 символів
                    </span>
                  </div>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full h-24 bg-white border border-emerald-200 rounded-xl p-3 text-sm text-slate-700 focus:border-emerald-500 outline-none resize-none"
                    placeholder="Вставте тут опис для поста з фото (до 1000 симв.)..."
                  />
                </div>
              </div>
              {caption.length > 1024 && (
                <p className="text-[10px] text-red-500 font-bold uppercase flex items-center gap-1">
                  <AlertCircle size={12} /> Забагато тексту для підпису! Перенесіть частину в Блок 1.
                </p>
              )}
            </div>
          )}

          {/* 3. АСНОЎНЫЯ БЛОКІ ТЭКСТУ */}
          {parts.map((text, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-widest">
                  Блок {idx + 1}
                </span>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-bold ${text.length > 4000 ? "text-red-500" : "text-slate-400"}`}>
                    {text.length} / 4096 символів
                  </span>
                  {parts.length > 1 && (
                    <button onClick={() => removePart(idx)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  )}
                </div>
              </div>
              
              <textarea
                value={text}
                onChange={(e) => updatePart(idx, e.target.value)}
                className={`w-full h-64 bg-white border ${text.length > 4000 ? 'border-red-300 ring-4 ring-red-500/5' : 'border-slate-200'} rounded-2xl p-5 text-sm font-mono leading-relaxed text-slate-700 focus:border-emerald-500 outline-none transition-all shadow-sm resize-none`}
                placeholder="Текст повідомлення..."
              />
              
              {text.length > 4000 && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-start gap-2 text-red-600">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <p className="text-xs font-medium">
                    <strong>Забагато символів!</strong> Telegram не прийме такий довгий пост. 
                    Натисніть "Додати ще один блок" нижче і перенесіть туди частину тексту.
                  </p>
                </div>
              )}
            </div>
          ))}

          <button 
            onClick={addPart}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-500 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all flex flex-col items-center justify-center gap-1"
          >
            <div className="flex items-center gap-2 font-bold text-sm"><Plus size={20} /> ДОДАТИ НОВИЙ БЛОК</div>
            <span className="text-[10px] opacity-60">Щоб розбити дайджест на кілька повідомлень</span>
          </button>
        </div>

        {/* ФУТЭР */}
        <div className="px-8 py-6 bg-white border-t border-slate-100 flex items-center justify-between">
          <button onClick={onClose} className="px-6 py-3 text-slate-500 font-bold text-sm hover:text-slate-700 transition-colors">
            Скасувати
          </button>
          <button 
            onClick={handlePublish}
            disabled={publishing || parts.some(p => !p.trim())}
            className="flex items-center gap-3 px-10 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-2xl transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {publishing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ВІДПРАВКА...
              </>
            ) : (
              <>
                <Send size={18} /> ОПУБЛІКУВАТИ В ТЕЛЕГРАМ
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
--------
import { useState } from "react";
import { updateVacancy } from "../../services/api";
import Field from "../shared/Field";
import Divider from "../shared/Divider";
import * as MD from "../../constants/masterData";

const CONTRACT_OPTIONS = [
  { value: "Umowa zlecenie", label: "Umowa zlecenie" },
  { value: "Umowa o pracę", label: "Umowa o pracę" },
  { value: "other", label: "Інше (ввести вручну)" },
];

const COUNT_OPTIONS = [
  { value: "Чоловік", label: "Чоловік" },
  { value: "Жінка", label: "Жінка" },
  { value: "Пара", label: "Пара" },
  { value: "Сім'я", label: "Сім'я" },
];

const FOOD_OPTIONS = ["Власне", "Обіди", "Субсидоване"];

const ACCOMMODATION_TYPE_OPTIONS = [
  { value: "Надається", label: "Надається" },
  { value: "Надається (для пар)", label: "Надається (для пар)" },
  { value: "Не надається", label: "Не надається" },
];

export default function EditVacancyModal({ vacancy, onClose, onSave }) {
  const [form, setForm] = useState({
    ...vacancy,
    brand: vacancy.brand || "",
    voivodeship: vacancy.voivodeship || "",
    category: vacancy.category || "",
    keywords: Array.isArray(vacancy.keywords)
      ? vacancy.keywords.join(", ")
      : vacancy.keywords || "",
    requirements: {
      ...vacancy.requirements,
      ageMax: vacancy.requirements?.ageMax || "",
      physicalLoad: !!vacancy.requirements?.physicalLoad,
      gender: Array.isArray(vacancy.requirements?.gender)
        ? vacancy.requirements.gender
        : [],
      standardDocs: Array.isArray(vacancy.requirements?.standardDocs)
        ? vacancy.requirements.standardDocs
        : [],
      nationalities: Array.isArray(vacancy.requirements?.nationalities)
        ? vacancy.requirements.nationalities
        : [],
    },
    conditions: {
      ...vacancy.conditions,
      specificNuances: Array.isArray(vacancy.conditions?.specificNuances)
        ? vacancy.conditions.specificNuances
            .map((n) => (typeof n === "object" ? n.text : n))
            .join(", ")
        : vacancy.conditions?.specificNuances || "",
    },
  });

  // Для поля contractType: якщо значення не зі списку — режим "other"
  const isCustomContract = !["Umowa zlecenie", "Umowa o pracę", ""].includes(
    form.contractType || "",
  );
  const [contractMode, setContractMode] = useState(
    isCustomContract ? "other" : form.contractType || "",
  );

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
        next[parts[0]] = {
          ...next[parts[0]],
          [parts[1]]: { ...next[parts[0]]?.[parts[1]], [parts[2]]: value },
        };
      }
      return next;
    });
  };

  const toggleArrayItem = (path, value) => {
    const parts = path.split(".");
    setForm((prev) => {
      const next = { ...prev };
      if (parts.length === 1) {
        const arr = Array.isArray(next[parts[0]]) ? next[parts[0]] : [];
        next[parts[0]] = arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value];
      } else {
        const parent = { ...next[parts[0]] };
        const arr = Array.isArray(parent[parts[1]]) ? parent[parts[1]] : [];
        parent[parts[1]] = arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value];
        next[parts[0]] = parent;
      }
      return next;
    });
  };

  const handleContractSelect = (val) => {
    setContractMode(val);
    if (val !== "other") setField("contractType", val);
    else setField("contractType", "");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        ...form,
        requirements: {
          ...form.requirements,
          // ageMax залишається рядком зі стану form
        },
        keywords:
          typeof form.keywords === "string"
            ? form.keywords
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean)
            : form.keywords,
        conditions: {
          ...form.conditions,
          specificNuances:
            typeof form.conditions.specificNuances === "string"
              ? form.conditions.specificNuances
                  .split(",")
                  .map((txt) => {
                    const trimmed = txt.trim();
                    // Бяспечны пошук арыгінальнай катэгорыі нюансу
                    const originalNuances = Array.isArray(
                      vacancy.conditions?.specificNuances,
                    )
                      ? vacancy.conditions.specificNuances
                      : [];

                    const original = originalNuances.find(
                      (on) =>
                        (typeof on === "object" ? on.text : on) === trimmed,
                    );
                    return {
                      category: original?.category || "Інше",
                      text: trimmed,
                    };
                  })
                  .filter((n) => n.text)
              : form.conditions.specificNuances,
        },
      };
      const res = await updateVacancy(vacancy._id, data);
      onSave(res.data);
      onClose();
    } catch (err) {
      console.error("Save Error:", err.response?.data || err.message);
      alert(
        "Помилка збереження: " +
          (err.response?.data?.message || "перевірте поля"),
      );
    } finally {
      setSaving(false);
    }
  };

  // --- UI КОМПОНЕНТИ ---

  const SingleBtnGroup = ({
    label,
    options,
    selectedValue,
    onSelect,
    small,
  }) => (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div
        className={`flex flex-wrap gap-2 p-2.5 bg-slate-50 rounded-2xl border border-slate-100`}
      >
        {options.map((opt) => {
          const val = opt.value ?? opt;
          const lbl = opt.label ?? opt;
          const isActive = selectedValue === val;
          return (
            <button
              key={val}
              type="button"
              onClick={() => onSelect(val)}
              className={`px-4 py-2 rounded-xl transition-all border font-bold ${
                small ? "text-xs" : "text-sm"
              } ${
                isActive
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {lbl}
            </button>
          );
        })}
      </div>
    </div>
  );

  const MultiBtnGroup = ({ label, options, selectedValues, onToggle }) => (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2 p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
        {options.map((opt) => {
          const val = opt.value ?? opt;
          const lbl = opt.label ?? opt;
          const isActive = selectedValues?.includes(val);
          return (
            <button
              key={val}
              type="button"
              onClick={() => onToggle(val)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                isActive
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {lbl}
            </button>
          );
        })}
      </div>
    </div>
  );

  // Dropdown для агенції
  const AgencyDropdown = () => (
    <div className="mb-0">
      <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
        Агенція
      </label>
      <select
        value={form.agencyName || "MANUAL"}
        onChange={(e) => setField("agencyName", e.target.value)}
        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-base font-medium text-slate-900 shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
      >
        {MD.AGENCIES.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4 shadow-2xl custom-scrollbar">
        {/* ШАПКА */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <h2 className="font-semibold text-slate-500">
              Редагування вакансії
            </h2>
            <div className="flex items-center gap-3 mt-1 text-xs font-mono">
              <span className="text-slate-500">{vacancy.vacancyCode}</span>
              <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-md font-bold">
                {vacancy.agencyName}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-500 hover:bg-slate-300 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-8">
          {/* СТАТУС */}
          <SingleBtnGroup
            label="Статус"
            options={MD.STATUSES}
            selectedValue={form.status}
            onSelect={(v) => setField("status", v)}
          />

          <Divider label="⚙️ Системні поля" />
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field
                label="Назва для адмінки (внутрішня)"
                value={form.templateName}
                onChange={(v) => setField("templateName", v)}
              />
            </div>
            <div className="col-span-2">
              <Field
                label="Публічний заголовок (для Telegram)"
                value={form.vacancydescription}
                onChange={(v) => setField("vacancydescription", v)}
              />
            </div>
            {/* Агенція — dropdown */}
            <AgencyDropdown />
            <div className="col-span-2">
              <Field
                label="Коментар щодо набору (напр. 2 пари + 1 жінка)"
                value={form.requirements?.genderDescription}
                onChange={(v) => setField("requirements.genderDescription", v)}
              />
            </div>
            <Field
              label="Бренд / Завод"
              value={form.brand}
              onChange={(v) => setField("brand", v)}
            />
            <Field
              label="Дата приїзду"
              value={form.arrivalDate}
              onChange={(v) => setField("arrivalDate", v)}
            />
            <Field
              label="Ключові слова"
              value={form.keywords}
              onChange={(v) => setField("keywords", v)}
            />
          </div>

          {/* КІЛЬКІСТЬ — кнопки */}
          <SingleBtnGroup
            label="Хто їде / Категорія"
            options={COUNT_OPTIONS}
            selectedValue={form.count}
            onSelect={(v) => setField("count", v)}
          />

          {/* Тип договору — кнопки + поле для custom */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
              Тип договору
            </label>
            <div className="flex flex-wrap gap-2 p-2.5 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
              {CONTRACT_OPTIONS.map((opt) => {
                const isActive = contractMode === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleContractSelect(opt.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                      isActive
                        ? "bg-emerald-500 border-emerald-500 text-slate-900"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {contractMode === "other" && (
              <Field
                label="Введіть тип договору"
                value={form.contractType || ""}
                onChange={(v) => setField("contractType", v)}
              />
            )}
          </div>

          {/* Категорія */}
          <SingleBtnGroup
            label="Категорія"
            options={MD.CATEGORIES}
            selectedValue={form.category}
            onSelect={(v) => setField("category", v)}
            small
          />

          <Divider label="📍 Локація" />
          <SingleBtnGroup
            label="Воєводство / Регіон"
            options={MD.VOIVODESHIPS}
            selectedValue={form.voivodeship}
            onSelect={(v) => setField("voivodeship", v)}
            small
          />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Місто (польською)"
              value={form.location}
              onChange={(v) => setField("location", v)}
            />
            <Field
              label="Місто оформлення"
              value={form.checkInCity}
              onChange={(v) => setField("checkInCity", v)}
            />
            <div className="col-span-2">
              <Field
                label="Повна адреса"
                value={form.locationDescription}
                onChange={(v) => setField("locationDescription", v)}
              />
            </div>
            <Field
              label="Країна"
              value={form.country}
              onChange={(v) => setField("country", v)}
            />
          </div>

          <Divider label="💰 Оплата" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Базова ставка"
              value={form.salary?.baseNetto}
              onChange={(v) => setField("salary.baseNetto", v)}
            />
            <Field
              label="Студентська ставка"
              value={form.salary?.studentNetto}
              onChange={(v) => setField("salary.studentNetto", v)}
            />
            <Field
              label="Годин на місяць"
              value={form.salary?.hoursRange}
              onChange={(v) => setField("salary.hoursRange", v)}
            />
            <Field
              label="Дати виплат"
              value={form.salary?.payoutDates}
              onChange={(v) => setField("salary.payoutDates", v)}
            />
            <div className="col-span-2">
              <Field
                label="Бонуси"
                value={form.salary?.bonusDetails}
                onChange={(v) => setField("salary.bonusDetails", v)}
              />
            </div>
            <div className="col-span-2">
              <Field
                label="Нотатки щодо оплати"
                value={form.salary?.salaryNotes}
                onChange={(v) => setField("salary.salaryNotes", v)}
              />
            </div>
          </div>

          <Divider label="🕒 Графік" />
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field
                label="Опис графіка"
                value={form.schedule?.description}
                onChange={(v) => setField("schedule.description", v)}
              />
            </div>
            <Field
              label="Кількість змін"
              value={form.schedule?.shiftsCount}
              onChange={(v) => setField("schedule.shiftsCount", v)}
            />
            <Field
              label="Годин за зміну"
              value={form.schedule?.hoursPerShift}
              onChange={(v) => setField("schedule.hoursPerShift", v)}
            />
            <Field
              label="Дні тижня"
              value={form.schedule?.workDaysWeek}
              onChange={(v) => setField("schedule.workDaysWeek", v)}
            />
            <Field
              label="Перерва"
              value={form.schedule?.breakDuration}
              onChange={(v) => setField("schedule.breakDuration", v)}
            />
          </div>

          <Divider label="🛠 Обов'язки" />
          <textarea
            value={form.description || ""}
            onChange={(e) => setField("description", e.target.value)}
            rows={4}
            placeholder="Обов'язки через крапку з комою (;)"
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-base font-medium text-slate-900 shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all resize-none"
          />

          <Divider label="📋 Вимоги" />
          <MultiBtnGroup
            label="Набір (Стать)"
            options={MD.GENDERS}
            selectedValues={form.requirements.gender}
            onToggle={(v) => toggleArrayItem("requirements.gender", v)}
          />
          <MultiBtnGroup
            label="Національності"
            options={MD.NATIONALITIES}
            selectedValues={form.requirements.nationalities}
            onToggle={(v) => toggleArrayItem("requirements.nationalities", v)}
          />
          <MultiBtnGroup
            label="Документи"
            options={MD.DOCS}
            selectedValues={form.requirements.standardDocs}
            onToggle={(v) => toggleArrayItem("requirements.standardDocs", v)}
          />

          {/* РІВЕНЬ ПОЛЬСЬКОЇ — кнопки */}
          <SingleBtnGroup
            label="Рівень польської"
            options={MD.LANGUAGES}
            selectedValue={form.requirements?.polishLanguageLevel}
            onSelect={(v) => setField("requirements.polishLanguageLevel", v)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Вік (напр. 18-55, до 60 років)"
              value={form.requirements?.ageMax || ""}
              onChange={(v) => setField("requirements.ageMax", v)}
              type="text"
            />

            <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={!!form.requirements?.physicalLoad}
                onChange={(e) =>
                  setField("requirements.physicalLoad", e.target.checked)
                }
                className="w-4 h-4 accent-emerald-500"
              />
              <span className="text-xs text-slate-500 font-medium">
                Фізично важка праця (Так/Ні)
              </span>
            </label>
            <div className="col-span-2">
              <Field
                label="Додаткові документи (текст)"
                value={form.requirements?.additionalDocsDetails}
                onChange={(v) =>
                  setField("requirements.additionalDocsDetails", v)
                }
              />
            </div>
          </div>

          <Divider label="🏠 Житло" />

          {/* ТИП ЖИТЛА — кнопки */}
          <SingleBtnGroup
            label="Тип житла"
            options={ACCOMMODATION_TYPE_OPTIONS}
            selectedValue={form.accommodation?.type}
            onSelect={(v) => {
              setField("accommodation.type", v);
              setField("accommodation.forCouples", v === "Надається (для пар)");
            }}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field
                label="Деталі житла"
                value={form.accommodation?.details}
                onChange={(v) => setField("accommodation.details", v)}
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.accommodation?.withChildren}
                onChange={(e) =>
                  setField("accommodation.withChildren", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <span className="text-xs text-slate-500">З дітьми</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.accommodation?.withPets}
                onChange={(e) =>
                  setField("accommodation.withPets", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <span className="text-xs text-slate-500">З тваринами</span>
            </label>
          </div>

          <Divider label="🚌 Транспорт" />
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.transport?.provided}
                onChange={(e) =>
                  setField("transport.provided", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <span className="text-xs text-slate-500">Надається</span>
            </label>
            <Field
              label="Вартість транспорту"
              value={form.transport?.costRaw}
              onChange={(v) => setField("transport.costRaw", v)}
            />
            <div className="col-span-2">
              <Field
                label="Деталі транспорту"
                value={form.transport?.details}
                onChange={(v) => setField("transport.details", v)}
              />
            </div>
          </div>

          <Divider label="🌡 Умови праці" />

          {/* ХАРЧУВАННЯ — кнопки */}
          <SingleBtnGroup
            label="Тип харчування"
            options={FOOD_OPTIONS}
            selectedValue={form.conditions?.foodType}
            onSelect={(v) => setField("conditions.foodType", v)}
          />

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.conditions?.workwearFree}
                onChange={(e) =>
                  setField("conditions.workwearFree", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <span className="text-xs text-slate-500">Одяг безкоштовно</span>
            </label>
            <div className="col-span-2">
              <Field
                label="Деталі харчування"
                value={form.conditions?.foodDetails}
                onChange={(v) => setField("conditions.foodDetails", v)}
              />
            </div>
            <div className="col-span-2">
              <Field
                label="Специфічні нюанси (через кому)"
                value={form.conditions?.specificNuances}
                onChange={(v) => setField("conditions.specificNuances", v)}
              />
            </div>
            <div className="col-span-2">
              <Field
                label="Деталі умов"
                value={form.conditions?.specificConditionsDetails}
                onChange={(v) =>
                  setField("conditions.specificConditionsDetails", v)
                }
              />
            </div>
          </div>

          <Divider label="💸 Витрати та відповідальність" />
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.startExpenses?.hasStartExpenses}
                onChange={(e) =>
                  setField("startExpenses.hasStartExpenses", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <span className="text-xs text-slate-500">Витрати на старті</span>
            </label>
            <div className="col-span-2">
              <Field
                label="Деталі витрат"
                value={form.startExpenses?.details}
                onChange={(v) => setField("startExpenses.details", v)}
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.earlyTerminationLiability?.hasLiability}
                onChange={(e) =>
                  setField(
                    "earlyTerminationLiability.hasLiability",
                    e.target.checked,
                  )
                }
                className="accent-emerald-500"
              />
              <span className="text-xs text-slate-500">
                Штраф за звільнення
              </span>
            </label>
            <div className="col-span-2">
              <Field
                label="Деталі штрафу"
                value={form.earlyTerminationLiability?.details}
                onChange={(v) =>
                  setField("earlyTerminationLiability.details", v)
                }
              />
            </div>
          </div>

          <Divider label="🎁 Компенсації" />
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.employerCompensations?.hasCompensations}
                onChange={(e) =>
                  setField(
                    "employerCompensations.hasCompensations",
                    e.target.checked,
                  )
                }
                className="accent-emerald-500"
              />
              <span className="text-xs text-slate-500">Є компенсації</span>
            </label>
            <div className="col-span-2">
              <Field
                label="Деталі компенсацій"
                value={form.employerCompensations?.details}
                onChange={(v) => setField("employerCompensations.details", v)}
              />
            </div>
          </div>

          <Divider label="📝 Додатково" />
          <textarea
            value={form.additionalNotes || ""}
            onChange={(e) => setField("additionalNotes", e.target.value)}
            rows={3}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-base font-medium text-slate-900 shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all resize-none"
            placeholder="Додаткові нотатки..."
          />

          <Divider label="🔒 Для рекрутера" />
          <textarea
            value={form.forRecruiter?.internalNotes || ""}
            onChange={(e) =>
              setField("forRecruiter.internalNotes", e.target.value)
            }
            rows={2}
            placeholder="Внутрішні нотатки для рекрутера (не відображаються в ТГ)..."
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-base font-medium text-slate-900 shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all resize-none"
          />
        </div>

        {/* КНОПКИ */}
        <div className="flex gap-4 px-8 py-5 border-t border-slate-100 sticky bottom-0 bg-white/95 backdrop-blur-md z-10">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-base rounded-2xl transition-all shadow-lg shadow-emerald-100 active:scale-95"
          >
            {saving ? "Збереження..." : "Зберегти зміни"}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all"
          >
            Скасувати
          </button>
        </div>
      </div>
    </div>
  );
}
--------
// frontend/src/components/vacancies/VacancyFilters.jsx
import React, { useState } from "react";
import { EMPTY_FILTERS } from "../../constants/filters";
import * as MD from "../../constants/masterData";
import MultiSelect from "../shared/MultiSelect";
import { Search, Sun } from "lucide-react";

function AccordionSection({ label, isOpen, onToggle, hasActiveFilters, icon, children }) {
  return (
    <div className="mb-2 border-b border-slate-100 pb-2">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 px-1 hover:bg-slate-50 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon && <span className={hasActiveFilters ? 'text-emerald-600' : 'text-slate-400'}>{icon}</span>}
          <span className={`text-sm font-bold ${hasActiveFilters ? 'text-emerald-600' : 'text-slate-700'}`}>
            {label}
          </span>
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-sm shadow-emerald-200" />
          )}
        </div>
        <span className={`text-[10px] text-slate-400 transition-transform duration-200 ${isOpen || hasActiveFilters ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {(isOpen || hasActiveFilters) && (
        <div className="mt-2 px-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

export default function VacancyFilters({
  filters = EMPTY_FILTERS,
  setFilters,
  agencies = [],
  brands = [],
  locations = [],
  voivodeships = [],
  nuances = [],
  vacancies = [], // 👈 Прымаем прамы масіў vacancies з бацькоўскага кампанента
}) {
  const draft = filters || EMPTY_FILTERS;
const [openSections, setOpenSections] = useState({
   search: false,
    status: false,
    category: false,
    voivodeship: false,
    location: false,
    agencyName: false,
    brand: false,
    nuances: false,
    sourceType: false,
    contract: false,
    hours: false,
    dates: false,
    salary: false,
    age: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  const updateField = (key, val) => {
    setFilters({ ...draft, [key]: val });
  };

  // Підрахунок активних фільтрів (v4.2 - З улікам дат і крыніц)
  const activeCount = Object.entries(draft).reduce((acc, [key, val]) => {
    if (key === "search") return acc;
    if (key === "startDate" || key === "endDate") {
      return val ? acc + 1 : acc;
    }
    if (Array.isArray(val) && val.length > 0) return acc + 1;
    if (typeof val === "boolean" && val === true) return acc + 1; // Для Favorites
    return acc;
  }, 0);
  // Мапінг тэхнічных ключоў нюансаў у прыгожыя лэйблы з masterData
  const mappedNuances = nuances.map((key) => {
    const found = MD.CHECKLIST_ITEMS.find((item) => item.value === key);
    return found ? found : { value: key, label: key };
  });
  // SMART-ПАДЛІК (v4.3): Функцыя для дадання лічільнікаў, якая цалкам паўтарае логіку applyFilters
  const getSmartOptions = (rawItems, fieldName, isMasterData = false) => {
    if (!rawItems) return [];
    return rawItems.map((item) => {
      const value = isMasterData ? item.value : item;
      const baseLabel = isMasterData ? item.label : item;

      const count = vacancies.filter((v) => {
        // --- 1. Статус, Катэгорыя, Агенцыя, Брэнд (Простыя палі) ---
        if (["status", "category", "agencyName", "brand"].includes(fieldName)) {
          if (fieldName === "brand" && value === "NO BRAND") {
            return !v.brand || v.brand === "БРЕНДОВИЙ ОДЯГ";
          }
          return v[fieldName] === value;
        }

        // --- 2. Рэгіён і Горад (Улік Польшчы/Еўропы і масіваў) ---
        if (fieldName === "voivodeship") {
          if (value === "Польща") return v.country === "Polska";
          if (value === "Інші країни Європи")
            return v.country && v.country !== "Polska";
          return (v.voivodeship || "")
            .toLowerCase()
            .includes(value.toLowerCase());
        }

        if (fieldName === "location") {
          const vLocs = (v.location || "").split(",").map((loc) => {
            let clean = loc.trim();
            if (v.country && v.country !== "Polska" && !clean.includes("(")) {
              return `${clean} (${v.country})`.toLowerCase();
            }
            return clean.toLowerCase();
          });
          return vLocs.includes(value.toLowerCase());
        }

        // --- 3. Жытло (Складаная логіка з applyFilters) ---
        if (fieldName === "accommodation") {
          const accType = (v.accommodation?.type || "").toLowerCase();
          const isCouples = !!v.accommodation?.forCouples;
          if (value === "provided")
            return (
              accType &&
              !accType.includes("власн") &&
              !accType.includes("не надаєт")
            );
          if (value === "couples") return isCouples;
          if (value === "none")
            return accType.includes("власн") || accType.includes("не надаєт");
        }

        // --- 4. Транспарт ---
        if (fieldName === "transport") {
          const hasTransport = !!v.transport?.provided;
          return value === "provided" ? hasTransport : !hasTransport;
        }

        // --- 5. Патрабаванні (Gender, Language, Nationality, Docs) ---
        if (fieldName === "gender") {
          const vGenders = v.requirements?.gender || [];
          return vGenders.includes(value);
        }

        if (fieldName === "language") {
          const vLang = v.requirements?.polishLanguageLevel || "Не вимагається";
          return vLang === value;
        }

        if (fieldName === "nationality") {
          const vNats =
            Array.isArray(v.requirements?.nationalities) &&
            v.requirements.nationalities.length > 0
              ? v.requirements.nationalities
              : ["Україна"];
          return vNats.includes(value);
        }

        if (fieldName === "docs") {
          const vDocs = v.requirements?.standardDocs || [];
          return vDocs.includes(value);
        }

        // --- 6. Нюансы (Чэк-ліст) ---
        if (fieldName === "nuances") {
          const vNuances = v.conditions?.specificNuances || [];
          return vNuances.some((vn) => {
            const vnCat =
              typeof vn === "object" && vn !== null ? vn.category : vn;
            return vnCat === value;
          });
        }

        // --- 7. Крыніца (v4.4 - Сінхранізацыя manual/spreadsheet) ---
        if (fieldName === "sourceType") {
          const s = v.sourceType || "manual";
          return s === value;
        }

        // --- 8. Тып дагавору (case-insensitive) --- // 👈 ДАДАДЗЕНА
        if (fieldName === "contractType") {
          const ct = (v.contractType || "").toLowerCase();
          if (value === "zlecenie") return ct.includes("zlecenie");
          if (value === "oprace") return ct.includes("o prac");
          if (value === "null") return !v.contractType;
          return false;
        }

        // --- 9. Гадзіны ў месяц (bucket-фільтр) --- // 👈 ДАДАДЗЕНА
        if (fieldName === "hoursRange") {
          const raw = v.salary?.hoursRange || "";
          const parsed = raw.replace("–", "-").match(/(\d+)/);
          const minH = parsed ? parseInt(parsed[1]) : null;
          if (value === "low") return minH !== null && minH < 170;
          if (value === "mid")
            return minH !== null && minH >= 170 && minH <= 220;
          if (value === "high") return minH !== null && minH > 220;
          if (value === "unknown") return minH === null;
          return false;
        }

        return false;
      }).length;

      return {
        value: value,
        label: `${baseLabel} (${count})`,
      };
    });
  };
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 h-full overflow-y-auto custom-scrollbar shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black text-emerald-600 tracking-tight uppercase">
          ФІЛЬТРИ
        </h3>
        {activeCount > 0 && (
          <button
            onClick={() => setFilters(EMPTY_FILTERS)}
            className="text-[10px] font-bold text-slate-500 hover:text-red-400 transition-colors uppercase"
          >
            Скинути ({activeCount})
          </button>
        )}
      </div>
      {/* ПОШУК (Цяпер у акардэоне з лупай) */}
      <AccordionSection 
        label="Пошук" 
        icon={<Search size={14} />}
        isOpen={openSections.search} 
        onToggle={() => toggleSection("search")}
        hasActiveFilters={!!draft.search}
      >
        <input
          type="text"
          value={draft.search || ""}
          onChange={(e) => setFilters({ ...draft, search: e.target.value })}
          placeholder="Назва, опис, код..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
        />
      </AccordionSection>
      {/* СТАТУС */}
      <AccordionSection 
        label="Статус" 
        isOpen={openSections.status} 
        onToggle={() => toggleSection("status")}
        hasActiveFilters={draft.status?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(MD.STATUSES, "status", true)}
          selected={draft.status}
          onChange={(v) => updateField("status", v)}
          placeholder="Будь-який status"
        />
      </AccordionSection>
      {/* ДЫЯПАЗОН ДАТ */}
      <AccordionSection 
        label="Період оновлення" 
        isOpen={openSections.dates} 
        onToggle={() => toggleSection("dates")}
        hasActiveFilters={!!(draft.startDate || draft.endDate)}
      >
        <div className="flex gap-2">
          <input
            type="date"
            value={draft.startDate || ""}
            onChange={(e) => updateField("startDate", e.target.value)}
            className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:border-emerald-500 transition-all"
            style={{ colorScheme: "light" }}
          />
          <input
            type="date"
            value={draft.endDate || ""}
            onChange={(e) => updateField("endDate", e.target.value)}
            className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:border-emerald-500 transition-all"
            style={{ colorScheme: "light" }}
          />
        </div>
      </AccordionSection>
      {/* КАТЕГОРІЯ */}
      <AccordionSection 
        label="Категорія" 
        isOpen={openSections.category} 
        onToggle={() => toggleSection("category")}
        hasActiveFilters={draft.category?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(MD.CATEGORIES, "category", true)}
          selected={draft.category}
          onChange={(v) => updateField("category", v)}
          placeholder="Усі категорії"
        />
      </AccordionSection>

      {/* РЕГІОН (Воєводство) */}
      <AccordionSection 
        label="Регіон (Воєводство)" 
        isOpen={openSections.voivodeship} 
        onToggle={() => toggleSection("voivodeship")}
        hasActiveFilters={draft.voivodeship?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(voivodeships, "voivodeship")}
          selected={draft.voivodeship}
          onChange={(v) => updateField("voivodeship", v)}
          placeholder="Усі регіони"
        />
      </AccordionSection>
      
      {/* МІСТО */}
      <AccordionSection 
        label="Місто" 
        isOpen={openSections.location} 
        onToggle={() => toggleSection("location")}
        hasActiveFilters={draft.location?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(locations, "location")}
          selected={draft.location}
          onChange={(v) => updateField("location", v)}
          placeholder="Усі міста"
        />
      </AccordionSection>
      
      {/* ЗАРПЛАТА */}
      <AccordionSection 
        label="Зарплата" 
        isOpen={openSections.salary} 
        onToggle={() => toggleSection("salary")}
        hasActiveFilters={!!(draft.minSalary || draft.maxSalary)}
      >
        <div className="flex gap-2">
          <input
            type="number"
            value={draft.minSalary || ""}
            onChange={(e) => updateField("minSalary", e.target.value)}
            placeholder="Від"
            className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-base text-slate-900 shadow-sm focus:outline-none focus:border-emerald-500 transition-all"
          />
          <input
            type="number"
            value={draft.maxSalary || ""}
            onChange={(e) => updateField("maxSalary", e.target.value)}
            placeholder="До"
            className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-base text-slate-900 shadow-sm focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>
      </AccordionSection>

      {/* ТИП ДОГОВОРУ */} 
      <AccordionSection 
        label="Тип договору" 
        isOpen={openSections.contract} 
        onToggle={() => toggleSection("contract")}
        hasActiveFilters={draft.contractType?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(MD.CONTRACT_TYPES, "contractType", true)}
          selected={draft.contractType}
          onChange={(v) => updateField("contractType", v)}
          placeholder="Будь-який договір"
        />
      </AccordionSection>
      
      {/* ГОДИНИ НА МІСЯЦЬ */} 
      <AccordionSection 
        label="Години на місяць" 
        isOpen={openSections.hours} 
        onToggle={() => toggleSection("hours")}
        hasActiveFilters={draft.hoursRange?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(MD.HOURS_RANGE_OPTIONS, "hoursRange", true)}
          selected={draft.hoursRange}
          onChange={(v) => updateField("hoursRange", v)}
          placeholder="Будь-яка кількість"
        />
      </AccordionSection>

      {/* ЖИТЛО */}
      <AccordionSection 
        label="Житло" 
        isOpen={openSections.accommodation} 
        onToggle={() => toggleSection("accommodation")}
        hasActiveFilters={draft.accommodation?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(MD.ACCOMMODATION_OPTIONS, "accommodation", true)}
          selected={draft.accommodation}
          onChange={(v) => updateField("accommodation", v)}
          placeholder="Будь-які умови"
        />
      </AccordionSection>
      {/* ДОВІЗ */}
      <AccordionSection 
        label="Довіз до роботи" 
        isOpen={openSections.transport} 
        onToggle={() => toggleSection("transport")}
        hasActiveFilters={draft.transport?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(MD.TRANSPORT_OPTIONS, "transport", true)}
          selected={draft.transport}
          onChange={(v) => updateField("transport", v)}
          placeholder="Не важливо"
        />
      </AccordionSection>

      {/* ХТО ЇДЕ */}
      <AccordionSection 
        label="Хто їде" 
        isOpen={openSections.gender} 
        onToggle={() => toggleSection("gender")}
        hasActiveFilters={draft.gender?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(MD.GENDERS, "gender", true)}
          selected={draft.gender}
          onChange={(v) => updateField("gender", v)}
          placeholder="Будь-хто"
        />
      </AccordionSection>

      {/* ВІК */}
      <AccordionSection 
        label="Вік" 
        isOpen={openSections.age} 
        onToggle={() => toggleSection("age")}
        hasActiveFilters={!!(draft.minAge || draft.maxAge)}
      >
        <div className="flex gap-2">
          <input
            type="number"
            value={draft.minAge || ""}
            onChange={(e) => updateField("minAge", e.target.value)}
            placeholder="Від"
            className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-base text-slate-900 shadow-sm focus:outline-none focus:border-emerald-500 transition-all"
          />
          <input
            type="number"
            value={draft.maxAge || ""}
            onChange={(e) => updateField("maxAge", e.target.value)}
            placeholder="До"
            className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-base text-slate-900 shadow-sm focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>
      </AccordionSection>
      {/* МОВА */}
      <AccordionSection 
        label="Рівень польської" 
        isOpen={openSections.language} 
        onToggle={() => toggleSection("language")}
        hasActiveFilters={draft.language?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(MD.LANGUAGES, "language", true)}
          selected={draft.language}
          onChange={(v) => updateField("language", v)}
          placeholder="Будь-який рівень"
        />
      </AccordionSection>

      {/* НАЦІОНАЛЬНІСТЬ */}
      <AccordionSection 
        label="Національність" 
        isOpen={openSections.nationality} 
        onToggle={() => toggleSection("nationality")}
        hasActiveFilters={draft.nationality?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(MD.NATIONALITIES, "nationality", true)}
          selected={draft.nationality}
          onChange={(v) => updateField("nationality", v)}
          placeholder="Усі нації"
        />
      </AccordionSection>

      {/* ДОКУМЕНТИ */}
      <AccordionSection 
        label="Документи" 
        isOpen={openSections.docs} 
        onToggle={() => toggleSection("docs")}
        hasActiveFilters={draft.docs?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(MD.DOCS, "docs", true)}
          selected={draft.docs}
          onChange={(v) => updateField("docs", v)}
          placeholder="Будь-які документи"
        />
      </AccordionSection>
      {/* ОСОБЛИВОСТІ (ЧЕК-ЛИСТ) */}
      <AccordionSection 
        label="Особливості (Чек-лист)" 
        isOpen={openSections.nuances} 
        onToggle={() => toggleSection("nuances")}
        hasActiveFilters={draft.nuances?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(mappedNuances, "nuances", true)}
          selected={draft.nuances}
          onChange={(v) => updateField("nuances", v)}
          placeholder="Вибрати нюанси..."
        />
      </AccordionSection>

      {/* АГЕНЦІЯ */}
      <AccordionSection 
        label="Агенція" 
        isOpen={openSections.agencyName} 
        onToggle={() => toggleSection("agencyName")}
        hasActiveFilters={draft.agencyName?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(agencies, "agencyName")}
          selected={draft.agencyName}
          onChange={(v) => updateField("agencyName", v)}
          placeholder="Усі агенції"
        />
      </AccordionSection>

      {/* БРЕНД */}
      <AccordionSection 
        label="Бренд" 
        isOpen={openSections.brand} 
        onToggle={() => toggleSection("brand")}
        hasActiveFilters={draft.brand?.length > 0}
      >
        <MultiSelect
          options={getSmartOptions(brands, "brand")}
          selected={draft.brand}
          onChange={(v) => updateField("brand", v)}
          placeholder="Усі бренди"
        />
      </AccordionSection>
      {/* КРЫНІЦЫ */}
      <AccordionSection 
        label="Джерело вакансії" 
        isOpen={openSections.sourceType} 
        onToggle={() => toggleSection("sourceType")}
        hasActiveFilters={draft.sourceType?.length > 0}
      >
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "viber", label: "📱 Viber" },
            { id: "telegram", label: "✈️ Telegram" },
            { id: "spreadsheet", label: "📊 Таблиця" },
            { id: "trello", label: "🔵 Trello" },
            { id: "airtable", label: "🗄️ Airtable" },
            { id: "manual", label: "📝 Ручне" },
          ].map((src) => {
            const isSelected = draft.sourceType?.includes(src.id);
            const count = vacancies.filter(
              (v) => (v.sourceType || "manual") === src.id
            ).length;

            return (
              <button
                key={src.id}
                type="button"
                onClick={() => {
                  const current = draft.sourceType || [];
                  const next = isSelected
                    ? current.filter((x) => x !== src.id)
                    : [...current, src.id];
                  updateField("sourceType", next);
                }}
                className={`py-2.5 px-3 flex items-center justify-between rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                <span>{src.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </AccordionSection>
      
    </div>
  );
}
-----
import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Фікс для стандартных іконак Leaflet у React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function VacancyMap({ vacancies, onViewVacancy }) {
  // Групуем вакансіі па гарадах для адлюстравання адной кропкі на горад
  const groupedByCity = useMemo(() => {
    const groups = {};
    
    vacancies.forEach(v => {
      // Вызначаем імя горада для групавання
      const cityKey = v.location?.split(',')[0].split('(')[0].trim();
      
      // Бяром каардынаты з аб'екта вакансіі (з базы)
      if (v.locationCoords?.lat && v.locationCoords?.lng) {
        if (!groups[cityKey]) {
          groups[cityKey] = {
            coords: [v.locationCoords.lat, v.locationCoords.lng],
            items: []
          };
        }
        groups[cityKey].items.push(v);
      }
    });
    
    return groups;
  }, [vacancies]);

  return (
    <div className="h-[calc(100vh-250px)] min-h-[500px] w-full rounded-3xl border border-slate-200 overflow-hidden shadow-sm bg-slate-50 relative z-0">
      <MapContainer 
        center={[52.0689, 19.4797]} // Цэнтр Польшчы
        zoom={6} 
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {Object.entries(groupedByCity).map(([cityName, group]) => (
          <Marker key={cityName} position={group.coords}>
            <Popup className="custom-map-popup">
              <div className="p-1 min-w-[220px]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-1">
                    📍 {cityName}
                  </h4>
                  <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {group.items.length}
                  </span>
                </div>
                
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                  {group.items.map(vac => (
                    <div 
                      key={vac._id} 
                      onClick={() => onViewVacancy(vac)}
                      className="p-2 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[9px] font-mono font-bold text-slate-400 group-hover:text-emerald-600">
                          {vac.vacancyCode}
                        </span>
                        <span className="text-[9px] font-black text-emerald-600 uppercase">
                          {vac.salary?.baseNetto ? `${vac.salary.baseNetto} ${vac.salary.currency || 'PLN'}` : ''}
                        </span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-700 leading-tight line-clamp-2">
                        {vac.vacancydescription || vac.templateName}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-1 flex items-center gap-1">
                        🏢 {vac.agencyName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Легенда або падказка */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl border border-slate-200 shadow-sm text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        Націсніце на маркер, каб убачыць вакансіі
      </div>
    </div>
  );
}
-------
// frontend/src/components/vacancies/VacancyMatchModal.jsx
import { useEffect, useState } from "react";
import { matchCandidatesForVacancy } from "../../services/api";

const STATUS_COLORS = {
  new: "bg-blue-500/10 text-blue-400",
  active: "bg-emerald-500/10 text-emerald-400",
  waiting: "bg-yellow-500/10 text-yellow-400",
  employed: "bg-purple-500/10 text-purple-400",
  left: "bg-slate-500/10 text-slate-500",
  blacklist: "bg-red-500/10 text-red-400",
};

const STATUS_LABELS = {
  new: "Новий",
  active: "Активний",
  waiting: "Очікує",
  employed: "Працює",
  left: "Звільнився", // Было "Пішов"
  blacklist: "Чорний список", // Было "Блекліст"
};

export default function VacancyMatchModal({ vacancy, onClose }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await matchCandidatesForVacancy(vacancy._id);
        setCandidates(res.data);
      } catch {
        console.error("Помилка матчингу");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [vacancy._id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 shadow-2xl">
        {/* Заголовок */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              🎯 Відповідні кандидати
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {vacancy.title}
              {vacancy.vacancyCode && (
                <span className="font-mono ml-2">({vacancy.vacancyCode})</span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-500 hover:bg-slate-800 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Зміст */}
        <div className="px-6 py-5">
          {loading ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              Пошук кандидатів...
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-8 text-slate-600">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-sm">Відповідних кандидатів не знайдено</p>
              <p className="text-xs text-slate-700 mt-1">
                Переконайтеся, що в базі є кандидати зі статусами
                new/active/waiting
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-500 mb-4">
                Знайдено {candidates.length} кандидатів
              </p>
              <div className="space-y-3">
                {candidates.map((c) => (
                  <div
                    key={c._id}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-500 text-sm">
                            {c.name}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status]}`}
                          >
                            {STATUS_LABELS[c.status]}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                          {c.contactType === "telegram" && c.telegram && (
                            <span>✈️ {c.telegram}</span>
                          )}
                          {(c.contactType === "viber" ||
                            c.contactType === "phone") &&
                            c.phone && <span>📞 {c.phone}</span>}
                          {c.nationality && <span>🌍 {c.nationality}</span>}
                          {c.currentLocation && (
                            <span>📍 {c.currentLocation}</span>
                          )}
                          {c.age && <span>🎂 {c.age} р.</span>}
                          {c.gender && (
                            <span>{c.gender === "female" ? "👩" : "👨"}</span>
                          )}
                        </div>

                        {/* Побажання */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {c.jobPreferences?.locationFlexible && (
                            <span className="text-[10px] font-bold uppercase bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-lg shadow-sm">
                              🗺 Готовий до переїзду
                            </span>
                          )}
                          {c.jobPreferences?.needsAccommodation && (
                            <span className="text-[10px] font-bold uppercase bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-lg shadow-sm">
                              🏠 Потрібне житло
                            </span>
                          )}
                          {c.jobPreferences?.readyDate && (
                            <span className="text-[10px] font-bold uppercase bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-lg shadow-sm">
                              📅 Готовий з: {c.jobPreferences.readyDate}
                            </span>
                          )}
                        </div>

                        {/* Документи */}
                        <div className="flex gap-2 mt-2">
                          {[
                            [c.documents?.hasVisa, "Віза"],
                            [c.documents?.hasSanepid, "Санепід"],
                            [c.documents?.hasUDT, "UDT"],
                          ].map(([has, label]) => (
                            <span
                              key={label}
                              className={`text-xs px-2 py-0.5 rounded ${
                                has
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-slate-100 text-slate-400 border border-slate-200"
                              }`}
                            >
                              {has ? "✅" : "❌"} {label}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Оцінка */}
                      <div className="shrink-0 text-center">
                        <div className="text-2xl font-black text-emerald-600">
                          {c.matchScore}
                        </div>
                        <div className="text-xs text-slate-600">балів</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
-------
import React, { useState, useEffect } from "react"; // Дадалі useEffect
import { 
  Copy, Check, X, Factory, Tag, Building2, 
  ChevronLeft, ChevronRight, Sparkles, Send, 
  AlertCircle, Share2, Image, Link, Calendar, RefreshCw 
} from "lucide-react";
import { generateVacancyPreview, publishVacancy } from "../../services/api";
const formatText = (text) => {
  if (!text || typeof text !== "string") return "";

  // Калі ў тэксце ўжо ёсць пераносы радкоў — значыць, AI ўжо яго аформіў, вяртаем як ёсць
  if (text.includes("\n")) return text;

  // Разбіваем тэкст па:
  // 1. Кропцы з коскай (;)
  // 2. Кропцы (.), пасля якой ідзе прабел і ВЯЛІКАЯ літара (каб не зламаць "м. Poznań" ці "25.36")
  const parts = text
    .split(/[;]\s*|\.\s+(?=[A-ZА-ЯЁІЎ])/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  if (parts.length > 1) {
    // Дадаем буліт да кожнага пункта і злучаем пераносам радка
    return "• " + parts.join("\n• ");
  }

  return text;
};
const SectionTitle = ({
  icon,
  label,
  color = "text-emerald-400",
  border = "border-emerald-500/20",
}) => (
  <h3
    className={`text-sm font-bold ${color} uppercase tracking-widest mb-3 border-b ${border} pb-1`}
  >
    {icon} {label}
  </h3>
);

const Note = ({ children }) =>
  children ? (
    <p className="text-xs text-slate-700 italic mt-1 leading-relaxed">
      {children}
    </p>
  ) : null;

const Row = ({ label, value }) =>
  value ? (
    <p className="text-sm text-slate-700 leading-snug">
      • <span className="font-semibold text-slate-700">{label}:</span>{" "}
      <span>{value}</span>
    </p>
  ) : null;

export default function VacancyViewModal({
  vacancy,
  onClose,
  onEdit,
  onDelete,
  onMatch,
   onNext,      // Новае
  onPrev,      // Новае
  currentIndex, // Новае
  totalCount   // Новае
}) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [editedFull, setEditedFull] = useState(vacancy?.telegramFull || "");
  const [editedShort, setEditedShort] = useState(vacancy?.telegramShort || "");
  const [showEditor, setShowEditor] = useState(false);
  const [activeTab, setActiveTab] = useState("full"); // 'full' або 'short'
  const [selectedFile, setSelectedFile] = useState(null);
  // Скрол уверх пры змене вакансіі
  useEffect(() => {
    const modalElement = document.getElementById("vacancy-view-modal-content");
    if (modalElement) modalElement.scrollTop = 0;
  }, [vacancy?._id]);
  // 👈 ФІКС ПАМЫЛКІ: Сінхранізацыя стэйту пры змене вакансіі (карусель)
  // Гэты патэрн працуе хутчэй за useEffect і не выклікае памылак лінтэра
  // 👈 ФІКС ПАМЫЛКІ: Выкарыстоўваем vacancy напрамую, бо v яшчэ не аб'яўлена
  const [prevId, setPrevId] = useState(vacancy?._id);
  if (vacancy?._id !== prevId) {
    setPrevId(vacancy?._id);
    setEditedFull(vacancy?.telegramFull || "");
    setEditedShort(vacancy?.telegramShort || "");
    setShowEditor(!!(vacancy?.telegramFull || vacancy?.telegramShort));
  }
  // Кіраванне клавіятурай
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" && onNext) onNext();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext, onPrev, onClose]);
  
  if (!vacancy) return null;
  const v = vacancy;

 const handleCopyTelegram = () => {
    // Калі рэдактар адкрыты — капіюем адрэдагаваны тэкст з актыўнай укладкі
    const textToCopy = showEditor 
      ? (activeTab === "full" ? editedFull : editedShort)
      : (vacancy?.telegramPost || ""); // 👈 Выкарыстоўваем vacancy для надзейнасці
      
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generateVacancyPreview(v._id);
      setEditedFull(res.data.full);
      setEditedShort(res.data.short);
      setShowEditor(true);
    } catch (err) {
      // Бяром паведамленне непасрэдна з адказу сервера
      const errorMsg = err.response?.data?.message || "Памылка генерацыі. Паспрабуйце пазней.";
      alert(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    const modeLabel = activeTab === 'full' ? 'ПОВНУ' : 'КОРОТКУ';
    if (!confirm(`Опублікувати ${modeLabel} версію в Telegram?`)) return;
    
    setIsPublishing(true);
    try {
      const formData = new FormData();
      formData.append("fullText", editedFull);
      formData.append("shortText", editedShort);
      formData.append("mode", activeTab);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      await publishVacancy(v._id, formData); // Перадаем formData замест JSON
      alert("✅ Опубліковано!");
    } catch (err) {
      alert("Помилка публікації: " + (err.response?.data?.message || err.message));
    } finally {
      setIsPublishing(true); // Пакідаем true, пакуль не закрыем (або ставім false)
      setIsPublishing(false);
    }
  };
  const handleShare = async () => {
    const text = activeTab === "full" ? editedFull : editedShort;
    if (navigator.share) {
      try {
        await navigator.share({ title: v.vacancydescription, text: text });
      } catch (err) { console.log("Share failed", err); }
    } else {
      handleCopyTelegram(); // Фолбэк на капіяванне
      alert("Спасылка скапіявана (ваш браўзер не падтрымлівае Share API)");
    }
  };
  // Разумная лакацыя: дадаем краіну толькі калі яе няма ў назве горада
  const locationDisplay =
    v.country && v.country !== "Polska" && !v.location?.includes(v.country)
      ? `${v.location} (${v.country})`
      : v.location;

  // Статусы на ўкраінскай
  const STATUS_LABELS = {
    active: "Активна",
    closed: "Закрита",
    archived: "Архів",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* КНОПКА НАЗАД (Desktop) */}
      {onPrev && (
        <button
          onClick={onPrev}
          className="hidden lg:flex absolute left-8 z-50 w-14 h-14 items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/20"
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {/* КНОПКА НАПЕРАД (Desktop) */}
      {onNext && (
        <button
          onClick={onNext}
          className="hidden lg:flex absolute right-8 z-50 w-14 h-14 items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/20"
        >
          <ChevronRight size={32} />
        </button>
      )}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      <div id="vacancy-view-modal-content" className="relative bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar">
        {/* ШАПКА */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex flex-wrap gap-2 items-center">
            {currentIndex && totalCount && (
  <span className="text-[10px] font-black bg-emerald-600 text-white px-2.5 py-1 rounded-full shadow-sm mr-2">
    {currentIndex} / {totalCount}
  </span>
)}
<span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-100">
  {v.vacancyCode}
</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-bold border uppercase tracking-wider ${
                v.status === "active"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : v.status === "closed"
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : "bg-slate-300/10 text-slate-700 border-slate-500/20"
              }`}
            >
              {STATUS_LABELS[v.status] || v.status}
            </span>
            {v.agencyName && (
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold border border-slate-100 uppercase tracking-wider">
                <Building2 size={9} className="inline mr-1" /> {v.agencyName}
              </span>
            )}
            {v.category && (
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold border border-blue-100 uppercase tracking-wider">
                <Tag size={9} className="inline mr-1" /> {v.category}
              </span>
            )}
            {v.brand && (
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-100 uppercase tracking-wider">
                <Factory size={9} className="inline mr-1" /> {v.brand}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyTelegram}
              className="p-2 text-slate-700 hover:text-emerald-400 transition-all"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-700 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="px-8 py-6 space-y-7">
          {/* ГАЛОЎНЫ ЗАГАЛОВАК І ЛАКАЦЫЯ */}
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight mb-4">
              {v.vacancydescription}
            </h2>
            <div className="space-y-1">
              <p className="text-base text-slate-700">
                📍 <span className="font-semibold">Місто:</span>{" "}
                <span className="text-slate-700 font-bold">
                  {locationDisplay}
                </span>
              </p>
              {v.checkInCity && (
                <p className="text-sm text-slate-700">
                  🏢 <span className="font-semibold">Оформлення:</span> м.{" "}
                  {v.checkInCity}
                </p>
              )}
              <p className="text-sm text-slate-700">
                👥 <span className="font-semibold">Набір:</span>{" "}
                <span className="text-slate-700 font-bold">
                  {v.gender ||
                    (Array.isArray(v.requirements?.gender)
                      ? v.requirements.gender.join(", ")
                      : "Будь-хто")}
                </span>
                {v.requirements?.genderDescription && (
                  <span className="text-slate-700 ml-1 italic">
                    ({v.requirements.genderDescription})
                  </span>
                )}
                {v.arrivalDate && (
                  <span className="text-emerald-500 font-bold">
                    , приїзд {v.arrivalDate}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* АРЫГІНАЛЬНЫ ТЭКСТ (Перанесены сюды і стылізаваны) */}
          <details className="group bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
            <summary className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-slate-100 transition-colors list-none flex items-center gap-2">
              <span className="group-open:rotate-90 transition-transform inline-block text-xs">
                ▶
              </span>
              Оригінальний текст повідомлення
            </summary>
            <div className="px-5 pb-4 text-[11px] text-slate-600 font-mono leading-relaxed whitespace-pre-wrap border-t border-slate-100 pt-3">
              {v.rawText || "Текст повідомлення відсутній"}
            </div>
          </details>
{/* --- TELEGRAM РЭДАКТАР (ІДЭНТЫЧНЫ СТЫЛЬ) --- */}
      <details className="group bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden" open={showEditor}>
        <summary className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-slate-100 transition-colors list-none flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="group-open:rotate-90 transition-transform inline-block text-xs">▶</span>
            <Sparkles size={12} className="text-emerald-500" />
            <span>Telegram Редактор</span>
            {v.postOutdated && (
              <span className="ml-2 text-amber-600 animate-pulse">● Потребує оновлення</span>
            )}
          </div>
          {v.postGeneratedAt && (
            <span className="text-[9px] font-mono opacity-60 lowercase tracking-tighter">
              згенеровано: {new Date(v.postGeneratedAt).toLocaleString("uk-UA")}
            </span>
          )}
        </summary>
        
        <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
          {/* Падказка і кнопка генерацыі */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/50 p-3 rounded-xl border border-slate-100">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Якщо ви хочете згенерувати пост для Telegram або оновити вже існуючий пост на основі актуальних даних вакансії, натисніть кнопку:
            </p>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="shrink-0 flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-[10px] font-black rounded-lg transition-all disabled:opacity-50"
            >
              <RefreshCw size={12} className={isGenerating ? "animate-spin" : ""} />
              {isGenerating ? "ОБРОБКА..." : "ЗГЕНЕРУВАТИ ПОСТ"}
            </button>
          </div>

          {/* Рэдактар */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-inner">
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              {["full", "short"].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-white text-emerald-600 border-b-2 border-emerald-500" : "text-slate-400 hover:text-slate-600"}`}
                >
                  {tab === "full" ? "Повний пост" : "Короткий пост"}
                </button>
              ))}
            </div>
            
            <textarea
              value={activeTab === "full" ? editedFull : editedShort}
              onChange={(e) => activeTab === "full" ? setEditedFull(e.target.value) : setEditedShort(e.target.value)}
              className="w-full h-64 bg-transparent text-slate-700 p-4 text-xs font-mono leading-relaxed focus:outline-none resize-none custom-scrollbar"
              placeholder="Текст поста з'явиться тут..."
            />

            <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className={`text-[9px] font-bold ${(activeTab === "full" ? editedFull : editedShort).length > 4000 ? "text-red-500" : "text-slate-400"}`}>
                  Символів: {(activeTab === "full" ? editedFull : editedShort).length} / 4096
                </span>
                <button onClick={handleShare} className="text-slate-400 hover:text-emerald-500 transition-colors">
                  <Share2 size={14} />
                </button>
              </div>
              
              <button 
                onClick={handlePublish}
                disabled={isPublishing || !(activeTab === "full" ? editedFull : editedShort)}
                className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black rounded-lg transition-all disabled:opacity-50"
              >
                <Send size={12} /> {isPublishing ? "ВІДПРАВКА..." : "ОПУБЛІКУВАТИ В TG"}
              </button>
            </div>
          </div>

          {/* Загрузка файла */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Додати медіа (фото/відео)</label>
            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-emerald-400 transition-all">
                <Image size={14} className="text-slate-400" />
                <span className="text-[11px] text-slate-500 truncate">
                  {selectedFile ? selectedFile.name : "Оберіть файл з комп'ютера..."}
                </span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*,video/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </label>
              {selectedFile && (
                <button onClick={() => setSelectedFile(null)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </details>
          {/* ОПЛАТА ПРАЦІ */}
          <section>
            <SectionTitle
              icon="💰"
              label="Оплата праці"
              color="text-emerald-400"
              border="border-emerald-500/20"
            />
            <div className="space-y-1.5">
              <Row label="Ставка" value={v.salary?.baseNetto} />
              <Row label="Студенти" value={v.salary?.studentNetto} />
              <Row label="Годин на місяць" value={v.salary?.hoursRange} />
              <Row label="Виплати" value={v.salary?.payoutDates} />

              {v.salary?.bonusDetails && (
                <div className="text-sm text-emerald-400 mt-2 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 flex items-start gap-2">
                  <span className="shrink-0">🎁</span>
                  <span>{formatText(v.salary.bonusDetails)}</span>
                </div>
              )}
              <Note>{v.salary?.salaryNotes}</Note>
            </div>
          </section>

          {/* ХАРАКТЕР РОБОТИ (АБАВЯЗКІ) */}
          <section>
            <SectionTitle
              icon="🛠"
              label="Характер роботи"
              color="text-blue-400"
              border="border-blue-500/20"
            />
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
              {v.description ? (
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {formatText(v.description)}
                </div>
              ) : (
                <p className="text-sm text-slate-700 italic">
                  Опис обов'язків відсутній
                </p>
              )}
            </div>
          </section>

          {/* ВИМОГИ */}
          <section>
            <SectionTitle
              icon="📋"
              label="Вимоги"
              color="text-amber-400"
              border="border-amber-500/20"
            />
            <div className="space-y-1.5">
              {v.requirements?.ageMax && (
                <Row label="Вік" value={v.requirements.ageMax} />
              )}

              {/* Бяспечны вывад нацыянальнасцяў */}
              {Array.isArray(v.requirements?.nationalities) &&
                v.requirements.nationalities.length > 0 && (
                  <Row
                    label="Національність"
                    value={v.requirements.nationalities.join(", ")}
                  />
                )}

              {/* Бяспечны вывад дакументаў */}
              {Array.isArray(v.requirements?.standardDocs) &&
                v.requirements.standardDocs.length > 0 && (
                  <Row
                    label="Документи"
                    value={v.requirements.standardDocs.join(", ")}
                  />
                )}

              {v.requirements?.additionalDocsDetails && (
                <Note>
                  Додатково:{" "}
                  {v.requirements.additionalDocsDetails.replace(/^з\s+/i, "")}
                </Note>
              )}

              <Row label="Мова" value={v.requirements?.polishLanguageLevel} />

              {v.requirements?.physicalLoad === true && (
                <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 font-bold text-sm">
                  <span>⚡</span>
                  <span>Фізично важка праця</span>
                </div>
              )}
            </div>
          </section>

          {/* ГРАФІК ТА ДОГОВІР */}
          <section>
            <SectionTitle
              icon="🕒"
              label="Графік та договір"
              color="text-purple-400"
              border="border-purple-500/20"
            />
            <div className="space-y-1.5">
              {v.schedule?.description && (
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-2 whitespace-pre-wrap">
                  {formatText(v.schedule.description)}
                </p>
              )}
              <Row label="Робочі дні" value={v.schedule?.workDaysWeek} />
              <Row label="Перерва" value={v.schedule?.breakDuration} />

              {v.contractType && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Тип договору:
                  </span>
                  <span className="text-sm text-blue-400 font-black bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {v.contractType}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* ЖЫТЛО І ТРАНСПАРТ */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <SectionTitle
                icon="🏠"
                label="Проживання"
                color="text-orange-400"
                border="border-orange-500/20"
              />
              <div className="space-y-1">
                {v.accommodation?.type ? (
                  <p className="text-sm text-slate-700 font-semibold">
                    {v.accommodation.type}
                    {v.accommodation?.forCouples && " (можливо для пар 👫)"}
                  </p>
                ) : (
                  <p className="text-sm text-slate-700 italic">
                    Інформація про житло відсутня
                  </p>
                )}
                {v.accommodation?.withChildren && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <span>✓</span> Можна з дітьми
                  </p>
                )}
                {v.accommodation?.withPets && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <span>✓</span> Можна з тваринами
                  </p>
                )}
                <div className="text-xs text-slate-700 whitespace-pre-wrap mt-2">
                  {v.accommodation?.details}
                </div>
              </div>
            </div>
            <div>
              <SectionTitle
                icon="🚌"
                label="Транспорт"
                color="text-cyan-400"
                border="border-cyan-500/20"
              />
              <div className="space-y-1">
                <p className="text-sm text-slate-700 font-semibold">
                  {v.transport?.provided
                    ? "Надається роботодавцем"
                    : "Власний / Не надається"}
                </p>
                {v.transport?.costRaw && (
                  <p className="text-sm text-cyan-300 font-medium">
                    {v.transport.costRaw}
                  </p>
                )}
                <Note>{v.transport?.details}</Note>
              </div>
            </div>
          </section>

          {/* УМОВИ ПРАЦІ ТА НЮАНСИ */}
          <section>
            <SectionTitle
              icon="🌡"
              label="Умови праці"
              color="text-rose-400"
              border="border-rose-500/20"
            />
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Row
                  label="Робочий одяг"
                  value={
                    v.conditions?.workwearFree
                      ? "Безкоштовно"
                      : "За рахунок працівника"
                  }
                />
                <Row label="Харчування" value={v.conditions?.foodType} />
              </div>
              <Note>{v.conditions?.foodDetails}</Note>

              {/* РАЗУМНАЯ ДЭДУПЛІКАЦЫЯ НЮАНСАЎ */}
              {Array.isArray(v.conditions?.specificNuances) &&
                v.conditions.specificNuances.length > 0 && (
                  <div className="flex flex-col gap-2 mt-4">
                    {v.conditions.specificNuances.map((n, idx) => {
                      const text = (typeof n === "object" ? n.text : n) || "";
                      const category =
                        (typeof n === "object" ? n.category : "other") ||
                        "other";

                      // Збіраем увесь тэкст для праверкі на дублікаты
                      const mainText =
                        `${v.vacancydescription || ""} ${v.description || ""} ${v.conditions?.characterOfWork || ""}`.toLowerCase();

                      // Калі тэкст нюансу ўжо ёсць у апісанні — не рэндэрым яго
                      if (text && mainText.includes(text.toLowerCase()))
                        return null;

                      const categoryLabels = {
                        "Температурний режим": "Температурний режим",
                        "Фізично-важка праця": "Фізично-важка праця",
                        "Санітарні обмеження": "Санітарні обмеження",
                        "Запахи та алергени": "Запахи та алергени",
                        Шум: "Шум",
                        "Характер праці": "Характер праці",
                        "Специфічні навички": "Специфічні навички",
                        Норми: "Норми",
                        "Тести при вступі": "Тести при вступі",
                        Інше: "Особливості",
                      };

                      const isUrgent =
                        category === "Температурний режим" ||
                        category === "Фізично-важка праця";

                      return (
                        <div
                          key={idx}
                          className={`px-4 py-3 rounded-xl border flex flex-col gap-1 transition-all hover:bg-slate-300/50 ${
                            isUrgent
                              ? "bg-red-500/5 text-red-400 border-red-500/10"
                              : "bg-slate-50 text-slate-700 border-slate-800"
                          }`}
                        >
                          <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">
                            {categoryLabels[category] || categoryLabels.other}
                          </span>
                          <span className="text-sm leading-relaxed font-medium">
                            {text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              <Note>{v.conditions?.specificConditionsDetails}</Note>
            </div>
          </section>

          {/* ВИТРАТИ ТА КОМПЕНСАЦІЇ */}
          {(v.startExpenses?.hasStartExpenses ||
            v.earlyTerminationLiability?.hasLiability ||
            v.employerCompensations?.hasCompensations) && (
            <section className="bg-slate-50 p-5 rounded-2xl border border-slate-800 space-y-4">
              {v.startExpenses?.hasStartExpenses &&
                v.startExpenses?.details && (
                  <div>
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1.5">
                      💸 Витрати на старті
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {v.startExpenses.details}
                    </p>
                  </div>
                )}
              {v.earlyTerminationLiability?.hasLiability &&
                v.earlyTerminationLiability?.details && (
                  <div>
                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1.5">
                      ⚠️ При достроковому звільненні
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {v.earlyTerminationLiability.details}
                    </p>
                  </div>
                )}
              {v.employerCompensations?.hasCompensations &&
                v.employerCompensations?.details && (
                  <div>
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1.5">
                      🎁 Компенсації та бонуси
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {v.employerCompensations.details}
                    </p>
                  </div>
                )}
            </section>
          )}

          {/* ДОДАТКОВА ІНФОРМАЦІЯ */}
          {v.additionalNotes && (
            <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
              <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest mb-2">
                📝 Додаткова інформація
              </p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {formatText(v.additionalNotes)}
              </p>
            </div>
          )}

          {/* ДЖЕРЕЛО ТА СИСТЕМНА ІНФО */}
          <section className="mt-8 pt-6 border-t border-slate-800 space-y-4">
            {v.isTruncated && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-xs font-bold flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                <span>
                  Увага: Ця вакансія створена з обрізаного повідомлення. Деякі
                  деталі можуть бути відсутні.
                </span>
              </div>
            )}

            
          </section>

          {/* МЕТА-ДАНІ */}
          <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[9px] font-mono text-slate-700 uppercase tracking-tighter">
            <span>ID: {v._id}</span>
            <span>
              СТВОРЕНО: {new Date(v.createdAt).toLocaleString("uk-UA")}
            </span>
          </div>
        </div>

        {/* КНОПКИ ДІЙ */}
        <div className="flex flex-wrap gap-4 px-8 py-6 border-t border-slate-100 sticky bottom-0 bg-white/95 backdrop-blur-md z-10">
          <button
            onClick={() => onMatch(v)}
            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/10"
          >
            🎯 КАНДИДАТИ
          </button>
          <button
            onClick={() => onEdit(v)}
            className="px-8 py-3 bg-slate-100 hover:bg-slate-300 text-slate-700 text-sm font-bold rounded-xl border border-slate-700 transition-all"
          >
            ✏️ РЕДАГУВАТИ
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(v._id); // Пацверджанне спрацуе ў асноўнай функцыі handleDelete
            }}
            className="px-8 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-bold rounded-xl border border-red-500/20 ml-auto transition-all"
          >
            🗑️ ВИДАЛИТИ
          </button>
        </div>
      </div>
    </div>
  );
}
-----
// Layout.jsx
import { useState, useEffect, useCallback } from "react";
import { NavLink, Link } from "react-router-dom";
import { getInboxStats } from "../services/api";

const NAV_ITEMS = [
  { to: "/", label: "Головна", exact: true },
  { to: "/vacancies", label: "Вакансії" },
  { to: "/candidates", label: "Кандидати" },
  { to: "/templates", label: "Шаблони" },
  { to: "/agencies", label: "Агенції" },
  { to: "/inbox", label: "Вхідні" },
];

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = useCallback(async () => {
    try {
      const res = await getInboxStats();
      setUnreadCount(res.data.total || 0);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUnread();
    }, 0);

    const handleUpdate = () => fetchUnread();
    window.addEventListener("inboxUpdated", handleUpdate);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("inboxUpdated", handleUpdate);
    };
  }, [fetchUnread]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-['IBM_Plex_Sans']">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                RC
              </div>
              <span className="font-bold text-slate-900 hidden sm:block tracking-tight">
                RecrutCRM
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center gap-2 ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`
                  }
                >
                  {item.label}
                  {item.to === "/inbox" && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center font-bold shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <div className="relative">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      menuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
                {!menuOpen && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </div>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white shadow-xl">
            <nav className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-600 hover:bg-white"
                    }`
                  }
                >
                  <span>{item.label}</span>
                  {item.to === "/inbox" && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>
      <main className="pt-16">{children}</main>
    </div>
  );
}
-----
// frontend/src/pages/Candidates.jsx
import { useEffect, useState, useMemo } from "react";
import { getCandidates, deleteCandidate } from "../services/api";
import ProfileModal from "../components/candidates/ProfileModal";
import AddCandidateModal from "../components/candidates/AddCandidateModal";
import CandidateFilters from "../components/candidates/CandidateFilters";
import { EMPTY_CANDIDATE_FILTERS } from "../constants/filters";

const STATUS_COLORS = {
  new: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  waiting: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  employed: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  left: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
  blacklist: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const STATUS_LABELS = {
  new: "Новы",
  active: "Актыўны",
  waiting: "Чакае",
  employed: "Працуе",
  left: "Сышоў",
  blacklist: "Блэкліст",
};

function applyFilters(candidates, filters) {
  return candidates.filter((c) => {
    // Пошук
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (
        !c.name?.toLowerCase().includes(s) &&
        !c.phone?.toLowerCase().includes(s) &&
        !c.telegram?.toLowerCase().includes(s) &&
        !c.currentLocation?.toLowerCase().includes(s)
      )
        return false;
    }

    // Статус
    if (filters.status && c.status !== filters.status) return false;

    // Гендар
    if (filters.gender.length > 0) {
      if (!filters.gender.includes(c.gender)) return false;
    }

    // Нацыянальнасць
    if (filters.nationality.length > 0) {
      if (
        !filters.nationality.some(
          (n) => c.nationality?.toLowerCase() === n.toLowerCase(),
        )
      )
        return false;
    }

    // Сфера
    if (filters.sphere.length > 0) {
      const prefs = c.jobPreferences?.spheres || [];
      if (!filters.sphere.some((s) => prefs.includes(s))) return false;
    }

    // Лакацыя
    if (filters.location.length > 0) {
      const match = filters.location.some((l) => {
        if (l === "any") return c.jobPreferences?.locationFlexible;
        if (l === "city_area") return c.jobPreferences?.locationRadius;
        if (l === "region") return c.jobPreferences?.locationRadius;
        if (l === "city")
          return (
            !c.jobPreferences?.locationFlexible &&
            !c.jobPreferences?.locationRadius
          );
        return false;
      });
      if (!match) return false;
    }

    // Жытло
    if (filters.accommodation.length > 0) {
      const match = filters.accommodation.some((a) => {
        if (a === "needs") return c.jobPreferences?.needsAccommodation;
        if (a === "own") return !c.jobPreferences?.needsAccommodation;
        return false;
      });
      if (!match) return false;
    }

    // Група
    if (filters.travelGroup.length > 0) {
      if (!filters.travelGroup.includes(c.jobPreferences?.travelGroup))
        return false;
    }

    // Графік
    if (filters.schedule.length > 0) {
      const prefs = c.jobPreferences?.schedule || [];
      if (!filters.schedule.some((s) => prefs.includes(s))) return false;
    }

    // Дакументы
    if (filters.docs.length > 0) {
      const match = filters.docs.some((d) => {
        if (d === "visa") return c.documents?.hasVisa;
        if (d === "sanepid") return c.documents?.hasSanepid;
        if (d === "udt") return c.documents?.hasUDT;
        return false;
      });
      if (!match) return false;
    }

    // Крыніца
    if (filters.source.length > 0) {
      if (!filters.source.includes(c.source)) return false;
    }

    return true;
  });
}

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [draft, setDraft] = useState(EMPTY_CANDIDATE_FILTERS);
  const [applied, setApplied] = useState(EMPTY_CANDIDATE_FILTERS);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getCandidates();
        setCandidates(res.data);
      } catch {
        console.error("Памылка загрузкі кандыдатаў");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const previewCount = useMemo(
    () => applyFilters(candidates, draft).length,
    [candidates, draft],
  );

  const filtered = useMemo(
    () => applyFilters(candidates, applied),
    [candidates, applied],
  );

  const isDirty = JSON.stringify(draft) !== JSON.stringify(applied);

  const handleApplyFilters = () => {
    setApplied(draft);
    setSidebarOpen(false);
  };

  const handleResetFilters = () => {
    setDraft(EMPTY_CANDIDATE_FILTERS);
    setApplied(EMPTY_CANDIDATE_FILTERS);
  };

  const handleDelete = async (id) => {
    if (!confirm("Выдаліць кандыдата?")) return;
    try {
      await deleteCandidate(id);
      setCandidates((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert("Памылка выдалення");
    }
  };

  const handleUpdate = (updated) => {
    setCandidates((prev) =>
      prev.map((c) => (c._id === updated._id ? updated : c)),
    );
  };

  const handleAdd = (newCandidate) => {
    setCandidates((prev) => [newCandidate, ...prev]);
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* САЙДБАР — дэсктоп */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-slate-800 bg-slate-900/50 sticky top-16 h-[calc(100vh-4rem)]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <span className="text-sm font-medium text-slate-300">Фільтры</span>
          {isDirty && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Скінуць
            </button>
          )}
        </div>
        <CandidateFilters draft={draft} onChange={setDraft} />
      </aside>

      {/* САЙДБАР — мабільны */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <span className="text-sm font-medium text-slate-300">
                Фільтры
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-slate-500 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <CandidateFilters draft={draft} onChange={setDraft} />
            </div>
            <div className="p-4 border-t border-slate-800">
              <button
                onClick={handleApplyFilters}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold text-sm rounded-lg transition-colors"
              >
                Паказаць {previewCount} кандыдатаў
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ГАЛОЎНАЯ ВОБЛАСЦЬ */}
      <div className="flex-1 min-w-0 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
            >
              ⚙️ Фільтры
              {isDirty && (
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              )}
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-slate-100">
                Кандыдаты
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {filtered.length} з {candidates.length} кандыдатаў
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-medium text-sm rounded-lg transition-colors"
          >
            <span>＋</span> Дадаць кандыдата
          </button>
        </div>

        {/* Спіс */}
        {loading ? (
          <div className="text-slate-500 text-sm">Загрузка...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-600">
            <div className="text-4xl mb-3">👥</div>
            <div className="text-sm">
              Кандыдатаў па гэтых фільтрах не знойдзена
            </div>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded-lg transition-colors"
            >
              Скінуць фільтры
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((c) => (
              <div
                key={c._id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors cursor-pointer"
                onClick={() => setProfileId(c._id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status]}`}
                      >
                        {STATUS_LABELS[c.status]}
                      </span>
                      <span className="text-xs text-slate-600">
                        {c.source === "site"
                          ? "🌐 Сайт"
                          : c.source === "telegram_bot"
                            ? "✈️ Telegram"
                            : "✋ Ручны"}
                      </span>
                      <span className="text-xs text-slate-700">
                        {new Date(c.createdAt).toLocaleDateString("uk-UA")}
                      </span>
                    </div>

                    <h3 className="font-medium text-slate-100">{c.name}</h3>

                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                      {c.contactType === "telegram" && c.telegram && (
                        <span>✈️ {c.telegram}</span>
                      )}
                      {(c.contactType === "viber" ||
                        c.contactType === "phone") &&
                        c.phone && <span>📞 {c.phone}</span>}
                      {c.nationality && <span>🌍 {c.nationality}</span>}
                      {c.currentLocation && <span>📍 {c.currentLocation}</span>}
                      {c.age && <span>🎂 {c.age} г.</span>}
                      {c.gender && (
                        <span>{c.gender === "female" ? "👩" : "👨"}</span>
                      )}
                    </div>

                    {c.jobPreferences?.locationFlexible && (
                      <div className="mt-2 text-xs text-slate-600">
                        🔍 Гатовы да пераезду
                      </div>
                    )}
                    {!c.jobPreferences?.locationFlexible &&
                      c.jobPreferences?.location && (
                        <div className="mt-2 text-xs text-slate-600">
                          🔍 Шукае: {c.jobPreferences.location}
                        </div>
                      )}
                  </div>

                  <div
                    className="flex gap-2 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setProfileId(c._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors text-xs"
                    >
                      👤 Профіль
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-xs"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ПЛАВАЮЧАЯ КНОПКА */}
      {isDirty && (
        <div className="hidden lg:block fixed bottom-6 right-6 z-30">
          <button
            onClick={handleApplyFilters}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
          >
            Паказаць {previewCount} кандыдатаў ✓
          </button>
        </div>
      )}

      {profileId && (
        <ProfileModal
          candidateId={profileId}
          onClose={() => setProfileId(null)}
          onUpdate={handleUpdate}
        />
      )}
      {showAddForm && (
        <AddCandidateModal
          onClose={() => setShowAddForm(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}
-----
// frontend/src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getVacancies } from "../services/api";
import VacancyViewModal from "../components/vacancies/VacancyViewModal";
import ApplyModal from "../components/vacancies/ApplyModal";

const STATUS_COLORS = {
  active: "bg-emerald-500/10 text-emerald-400",
  closed: "bg-red-500/10 text-red-400",
  archived: "bg-slate-500/10 text-slate-400",
};

export default function Home() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, today: 0 });
  const [viewVacancy, setViewVacancy] = useState(null);
  const [applyVacancy, setApplyVacancy] = useState(null);
  const [applyType, setApplyType] = useState(null);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getVacancies();
        const all = res.data;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        setStats({
          total: all.length,
          active: all.filter((v) => v.status === "active").length,
          today: all.filter((v) => new Date(v.createdAt) >= today).length,
        });

        // 4 самых свежых актыўных вакансіі
        setVacancies(all.filter((v) => v.status === "active").slice(0, 4));
      } catch {
        console.error("Памылка загрузкі");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-slate-950 to-slate-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium">
                {stats.today > 0
                  ? `+${stats.today} вакансій сёння`
                  : "Сістэма актыўная"}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-100 leading-tight mb-6">
              Робота в Польщі
              <span className="block text-emerald-400">для українців</span>
            </h1>

            <p className="text-lg text-slate-400 mb-8 max-w-xl">
              Актуальні вакансії від перевірених агенцій. Безкоштовне
              посередництво, офіційне оформлення, житло та транспорт.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/vacancies"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-xl transition-colors"
              >
                Усі вакансії &#8594;
              </Link>

              <a
                href="#vacancies"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium rounded-xl transition-colors"
              >
                Свіжі вакансії
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* СТАТЫСТЫКА */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Всього вакансій", value: stats.total },
            { label: "Активних", value: stats.active },
            { label: "Додано сьогодні", value: stats.today },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center"
            >
              <div className="text-3xl font-bold text-emerald-400">
                {s.value}
              </div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* СВЕЖЫЯ ВАКАНСІІ */}
      <section
        id="vacancies"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">
            Свіжі вакансії
          </h2>
          <Link
            to="/vacancies"
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Усі вакансії &#8594;
          </Link>
        </div>

        {loading ? (
          <div className="text-slate-500 text-sm">Завантаження...</div>
        ) : vacancies.length === 0 ? (
          <div className="text-center py-12 text-slate-600">
            <div className="text-3xl mb-2">💼</div>
            <div className="text-sm">Вакансій поки немає</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vacancies.map((v) => (
              <div
                key={v._id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {v.vacancyCode && (
                        <span className="text-xs font-mono text-slate-600">
                          {v.vacancyCode}
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[v.status]}`}
                      >
                        Активна
                      </span>
                    </div>
                    <h3 className="font-medium text-slate-100 truncate">
                      {v.vacancydescription || v.templateName}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-4">
                  <span>📍 {v.location}</span>
                  {v.agencyName && v.agencyName !== "Manual" && (
                    <span>🏢 {v.agencyName}</span>
                  )}
                  {v.salary?.baseNetto && <span>💰 {v.salary.baseNetto}</span>}
                  {v.requirements?.gender && (
                    <span>
                      👤{" "}
                      {Array.isArray(v.requirements.gender)
                        ? v.requirements.gender.join(", ")
                        : v.requirements.gender}
                    </span>
                  )}
                  {v.arrivalDate && <span>📅 {v.arrivalDate}</span>}
                </div>

                <div className="text-xs text-slate-600">
                  {new Date(v.createdAt).toLocaleString("uk-UA", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                {/* Кнопкі */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setViewVacancy(v)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors"
                  >
                    👁 Переглянути
                  </button>
                  {v.status === "active" && (
                    <button
                      onClick={() => {
                        setApplyVacancy(v);
                        setApplyType("want_work");
                      }}
                      className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs rounded-lg transition-colors"
                    >
                      🟢 Хочу тут працювати
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ФУТАР */}
      <footer className="border-t border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-900 font-bold text-xs">
                RC
              </div>
              <span className="text-sm text-slate-400">RecrutCRM</span>
            </div>
            <div className="text-xs text-slate-600">
              © 2026 · Безкоштовне посередництво · Офіційне оформлення
            </div>
          </div>
        </div>
      </footer>
      {viewVacancy && (
        <VacancyViewModal
          vacancy={viewVacancy}
          onClose={() => setViewVacancy(null)}
          onApply={(v, type) => {
            setViewVacancy(null);
            setApplyVacancy(v);
            setApplyType(type);
          }}
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
------
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getInboxMessages,
  getInboxStats,
  deleteInboxMessage,
  bulkDeleteInbox,
  getVacancies,
  aiUpdateVacancy,
} from "../services/api";

const CATEGORY_LABELS = {
  vacancy: {
    label: "Вакансія",
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  update: {
    label: "Оновлення",
    color: "text-amber-700 bg-amber-50 border-amber-200",
  },
  info: {
    label: "Інфо",
    color: "text-blue-700 bg-blue-50 border-blue-200",
  },
};

const SOURCE_ICON = {
  viber: "💜",
  telegram: "✈️",
  macrodroid_raw: "📱",
  telegram_userbot: "🤖",
  error_fallback: "⚠️",
};

export default function Inbox() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    vacancy: 0,
    update: 0,
    info: 0,
    pendingAi: 0, // Новае поле для статыстыкі
  });
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());
  const [expandedId, setExpandedId] = useState(null);
  const [showUpdatePicker, setShowUpdatePicker] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const notifyUpdate = () => {
    window.dispatchEvent(new CustomEvent("inboxUpdated"));
  };

  const fetchAll = useCallback(async () => {
    try {
      const [msgsRes, statsRes, vacRes] = await Promise.all([
        getInboxMessages(),
        getInboxStats(),
        getVacancies(),
      ]);

      const msgs = msgsRes.data;
      setMessages(msgs);

      // Падлічваем колькасць тых, хто чакае AI, калі бэкенд яшчэ не аддае гэта ў stats
      const pendingAiCount = msgs.filter((m) => !m.aiAnalyzed).length;

      setStats({
        ...statsRes.data,
        pendingAi: pendingAiCount,
      });

      setVacancies(vacRes.data.filter((v) => v.status === "active"));
      notifyUpdate();
    } catch (err) {
      console.error("Памылка загрузкі:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleDelete = async (id) => {
    if (!window.confirm("Выдаліць паведамленне?")) return;
    try {
      await deleteInboxMessage(id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      notifyUpdate();
    } catch (err) {
      alert("Памылка выдалення");
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selected);
    if (!ids.length || !window.confirm(`Выдаліць ${ids.length} паведамленняў?`))
      return;
    try {
      await bulkDeleteInbox({ ids });
      setMessages((prev) => prev.filter((m) => !selected.has(m._id)));
      setSelected(new Set());
      notifyUpdate();
      const res = await getInboxStats();
      setStats(res.data);
    } catch (err) {
      alert("Памылка масавага выдалення");
    }
  };

  const handleCreateVacancy = (msg) => {
    navigate("/vacancies", {
      state: { initialText: msg.rawText || msg.text, messageId: msg._id },
    });
  };

  const handleAiUpdate = async (msg, vacancyId) => {
    setProcessingId(msg._id);
    try {
      await aiUpdateVacancy(vacancyId, msg.rawText || msg.text, msg._id);
      notifyUpdate();
      alert("✅ Вакансія оновлена!");
      fetchAll();
    } catch (err) {
      alert("❌ Помилка: " + err.message);
    } finally {
      setProcessingId(null);
      setShowUpdatePicker(null);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((m) => m._id)));
    }
  };

  const filtered = messages.filter(
    (m) => categoryFilter === "all" || m.category === categoryFilter,
  );

  if (loading)
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-slate-500 text-center">
        Загрузка...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Пісочниця (Inbox)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Обробка вхідних повідомлень
          </p>
        </div>
        <div className="flex gap-2">
          {selected.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              Видалити вибрані ({selected.size})
            </button>
          )}
          <button
            onClick={fetchAll}
            className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Оновити список
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          {
            key: "all",
            label: "Усі",
            count: stats.total,
            color: "text-slate-300",
          },
          {
            key: "vacancy",
            label: "Вакансії",
            count: stats.vacancy,
            color: "text-emerald-400",
          },
          {
            key: "update",
            label: "Оновлення",
            count: stats.update,
            color: "text-amber-400",
          },
          {
            key: "info",
            label: "Інфо",
            count: stats.info || 0,
            color: "text-blue-400",
          },
          {
            key: "pending",
            label: "Чекають AI",
            count: stats.pendingAi || 0,
            color: "text-indigo-400",
          },
        ].map(({ key, label, count, color }) => (
          <button
            key={key}
            onClick={() => key !== "pending" && setCategoryFilter(key)}
            className={`bg-white border rounded-2xl p-4 text-left transition-all shadow-sm ${categoryFilter === key ? "border-emerald-500 ring-2 ring-emerald-500/10 bg-emerald-50/30" : "border-slate-200 hover:border-slate-300"}`}
          >
            <div
              className={`text-3xl font-black ${color.replace("400", "600")}`}
            >
              {count}
            </div>
            <div className="text-xs text-slate-500">{label}</div>
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-[40px_1fr_150px_100px_80px] gap-3 px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 bg-slate-50/50">
          <input
            type="checkbox"
            checked={selected.size > 0 && selected.size === filtered.length}
            onChange={toggleSelectAll}
            className="accent-emerald-500"
          />
          <span>Змест повидомлення</span>
          <span>Агенція / Чат</span>
          <span>Час</span>
          <span className="text-right">Дії</span>
        </div>

        <div className="divide-y divide-slate-800/50">
          {filtered.map((msg) => {
            const isExpanded = expandedId === msg._id;
            const isPicking = showUpdatePicker === msg._id;
            const isProcessing = processingId === msg._id;
            const cat = CATEGORY_LABELS[msg.category] || CATEGORY_LABELS.info;
            const isAnalyzed = msg.aiAnalyzed;

            return (
              <div
                key={msg._id}
                className={`${selected.has(msg._id) ? "bg-emerald-50/50" : ""} ${!isAnalyzed ? "opacity-60" : ""} border-b border-slate-100 last:border-0`}
              >
                <div className="grid grid-cols-[40px_1fr_150px_100px_80px] gap-3 px-5 py-4 items-center hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={selected.has(msg._id)}
                    onChange={() => toggleSelect(msg._id)}
                    className="accent-emerald-500"
                  />
                  <div
                    className="min-w-0 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : msg._id)}
                  >
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold ${cat.color}`}
                      >
                        {cat.label}
                      </span>

                      {/* СТАТУС AI */}
                      {isAnalyzed ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold">
                          ✨ Оброблено
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 border-dashed font-medium">
                          ⏳ Не оброблено
                        </span>
                      )}

                      {msg.agencyName && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {msg.agencyName}
                        </span>
                      )}
                      {msg.isTruncated && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-bold animate-pulse">
                          ⚠️ Обрізано
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-sm font-medium  ${isExpanded ? "text-slate-900" : "text-slate-500 truncate"}`}
                    >
                      {/* Паказваем пераклад, калі ён ёсць, інакш арыгінал */}
                      {isAnalyzed ? msg.rawText || msg.text : msg.text}
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {SOURCE_ICON[msg.source] || "📩"} {msg.sender}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {new Date(msg.createdAt).toLocaleString("be-BY", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => handleCreateVacancy(msg)}
                      title="Стварыць"
                      disabled={!isAnalyzed}
                      className={`p-1.5 rounded-md ${isAnalyzed ? "hover:bg-emerald-500/20 text-emerald-500" : "text-slate-700 cursor-not-allowed"}`}
                    >
                      🤖
                    </button>
                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="p-1.5 hover:bg-red-500/20 text-slate-500 hover:text-red-500 rounded-md"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-14 pb-4 animate-in fade-in slide-in-from-top-1">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-base text-slate-800 whitespace-pre-wrap leading-relaxed shadow-inner">
                      {isAnalyzed ? msg.rawText || msg.text : msg.text}
                    </div>

                    {isAnalyzed && !isPicking && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleCreateVacancy(msg)}
                          className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-md transition-colors"
                        >
                          Створити вакансію
                        </button>
                        <button
                          onClick={() => setShowUpdatePicker(msg._id)}
                          className="text-xs bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-md transition-colors"
                        >
                          Оновити існуючую
                        </button>
                      </div>
                    )}

                    {isAnalyzed && isPicking && (
                      <div className="mt-6 p-6 bg-white rounded-2xl border border-amber-200 shadow-xl ring-1 ring-amber-500/10">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                            Оберить вакансію:
                          </h4>
                          <button
                            onClick={() => setShowUpdatePicker(null)}
                            className="text-slate-500 hover:text-white text-xs"
                          >
                            Скосувати
                          </button>
                        </div>
                        {isProcessing ? (
                          <div className="py-4 text-center text-amber-400 text-xs animate-pulse">
                            AI обробляє...
                          </div>
                        ) : (
                          <div className="max-h-60 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                            {vacancies.map((v) => (
                              <button
                                key={v._id}
                                onClick={() => handleAiUpdate(msg, v._id)}
                                className="w-full text-left p-2.5 text-xs hover:bg-slate-700 rounded border border-slate-700 text-slate-300 flex justify-between items-center group"
                              >
                                <span>
                                  <b className="text-emerald-500 mr-2">
                                    {v.vacancyCode}
                                  </b>
                                  {v.templateName || v.vacancydescription}
                                </span>
                                <span className="opacity-0 group-hover:opacity-100 text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded">
                                  Обрати
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {!isAnalyzed && (
                      <div className="mt-3 text-[10px] text-slate-500 italic">
                        Повідомлення чекає на чергову ітерацію AI-аналізу (кожні
                        10 хвилин)...
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
-----
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
      console.error("Помилка завантаження шаблонів");
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
    if (!confirm("Видалити шаблон?")) return;
    try {
      await deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => t._id !== id));
    } catch {
      alert("Помилка видалення");
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
          <h1 className="text-2xl font-semibold text-slate-100">Шаблони</h1>
          <p className="text-sm text-slate-500 mt-1">
            {filtered.length} з {templates.length} шаблонів у {agencies.length}{" "}
            агенціях
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-medium text-sm rounded-lg transition-colors"
        >
          <span>＋</span> Новий шаблон
        </button>
      </div>

      {/* Пошук */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Пошук за назвою, фірмою, містом, ключовими словами..."
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
            Усі агенції
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
        <div className="text-slate-500 text-sm">Завантаження...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <div className="text-4xl mb-3">📋</div>
          <div className="text-sm">
            {search
              ? `Нічого не знайдено за «${search}»`
              : "Шаблонів поки немає"}
          </div>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mt-3 text-xs text-emerald-500 hover:text-emerald-400"
            >
              Очистити пошук
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
-----
import { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  getVacancies,
  getTemplates,
  deleteVacancy,
  createVacancyAuto,
  createVacancyFromTemplate,
  aiUpdateVacancy,
  toggleFavoriteVacancy,
  bulkDeleteVacancies,
} from "../services/api";
import EditVacancyModal from "../components/vacancies/EditVacancyModal";
import ApplyModal from "../components/vacancies/ApplyModal";
import VacancyMatchModal from "../components/vacancies/VacancyMatchModal";
import VacancyViewModal from "../components/vacancies/VacancyViewModal";
import VacancyFilters from "../components/vacancies/VacancyFilters";
import BulkPublishModal from "../components/vacancies/BulkPublishModal";
import { EMPTY_FILTERS } from "../constants/filters";
import VacancyMap from "../components/vacancies/VacancyMap";

const STATUS_COLORS = {
  active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  closed: "bg-red-500/10 text-red-400 border border-red-500/20",
  archived: "bg-slate-500/10 text-slate-500 border border-slate-100/20",
};

const STATUS_LABELS = {
  active: "Активна",
  closed: "Закрита",
  archived: "Архів",
};

// 1. Поўная і карэктная функцыя фільтрацыі
function applyFilters(vacancies, filters) {
  if (!vacancies) return [];

  return vacancies.filter((v) => {
    if (filters.isFavorite && !v.isFavorite) return false;
    // --- 1. Пошук ---
    if (filters.search) {
      const s = filters.search.toLowerCase();
      const matchSearch =
        v.templateName?.toLowerCase().includes(s) ||
        v.vacancydescription?.toLowerCase().includes(s) ||
        v.location?.toLowerCase().includes(s) ||
        v.agencyName?.toLowerCase().includes(s) ||
        v.brand?.toLowerCase().includes(s) ||
        v.vacancyCode?.toLowerCase().includes(s);
      if (!matchSearch) return false;
    }

    // --- 2. Статус і Катэгорыя ---
    if (filters.status?.length > 0 && !filters.status.includes(v.status))
      return false;
    if (filters.category?.length > 0 && !filters.category.includes(v.category))
      return false;

    // --- 3. Ваяводства / Рэгіён (ФІКС: Польшча і Еўропа) ---
    if (filters.voivodeship?.length > 0) {
      const vVoiv = v.voivodeship || "";
      const vCountry = v.country || "Polska";
      const isEurope = vCountry !== "Polska";

      const match = filters.voivodeship.some((fv) => {
        // 1. Калі выбрана "Польшча" — паказваем усё, дзе краіна Polska
        if (fv === "Польща") return vCountry === "Polska";

        // 2. Калі выбрана "Еўропа" — паказваем усё, што не Polska
        if (fv === "Інші країни Європи") return isEurope;

        // 3. Для канкрэтных ваяводстваў правяраем уваходжанне ў радок (для спісаў праз коску)
        return vVoiv.toLowerCase().includes(fv.toLowerCase());
      });

      if (!match) return false;
    }

    // --- 4. Лакацыя (ФІКС: Замежныя гарады з дужкамі) ---
    if (filters.location?.length > 0) {
      const vLocs = v.location.split(",").map((loc) => {
        let clean = loc.trim();
        // Калі гэта замежжа, прыводзім да фармату "City (Country)" для супадзення з фільтрам
        if (v.country && v.country !== "Polska" && !clean.includes("(")) {
          return `${clean} (${v.country})`.toLowerCase();
        }
        return clean.toLowerCase();
      });

      const match = filters.location.some((fl) =>
        vLocs.includes(fl.toLowerCase()),
      );
      if (!match) return false;
    }
// --- 5.0. Бяскоштаўнае жытло (Quick Toggle) ---
    if (filters.freeHousing && !v.accommodation?.isFree) {
      return false;
    }
    // --- 5. Жыллё ---
    if (filters.accommodation?.length > 0) {
      const accType = (v.accommodation?.type || "").toLowerCase();
      const isCouples = !!v.accommodation?.forCouples;
      const match = filters.accommodation.some((fa) => {
        if (fa === "provided") return accType && !accType.includes("власн");
        if (fa === "couples") return isCouples;
        if (fa === "none")
          return accType.includes("власн") || accType.includes("не надаєт");
        return false;
      });
      if (!match) return false;
    }

    // --- 6. Транспарт ---
    if (filters.transport?.length > 0) {
      const hasTransport = !!v.transport?.provided;
      const match = filters.transport.some((ft) =>
        ft === "provided" ? hasTransport : !hasTransport,
      );
      if (!match) return false;
    }

    // --- 7. Хто їде (Gender) ---
    if (filters.gender?.length > 0) {
      const vGenders = v.requirements?.gender || [];
      // Калі хаця б адзін выбраны гендэр ёсць у масіве вакансіі
      const match = filters.gender.some((fg) => vGenders.includes(fg));
      if (!match) return false;
    }

    // --- 8. Мова ---
    if (filters.language?.length > 0) {
      const vLang = v.requirements?.polishLanguageLevel || "Не вимагається";
      if (!filters.language.includes(vLang)) return false;
    }

    // --- 9. Нацыянальнасць ---
    if (filters.nationality?.length > 0) {
      const vNats =
        Array.isArray(v.requirements?.nationalities) &&
        v.requirements.nationalities.length > 0
          ? v.requirements.nationalities
          : ["Україна"];
      if (!filters.nationality.some((fn) => vNats.includes(fn))) return false;
    }

    // --- 10. Дакументы ---
    if (filters.docs?.length > 0) {
      const vDocs = v.requirements?.standardDocs || [];
      if (!filters.docs.some((d) => vDocs.includes(d))) return false;
    }

    // --- 11. Асаблівасці (ФІКС: па катэгорыях) ---
    if (filters.nuances?.length > 0) {
      const vNuances = v.conditions?.specificNuances || [];
      const hasMatch = filters.nuances.some((fn) =>
        vNuances.some((vn) => {
          const vnCat =
            typeof vn === "object" && vn !== null ? vn.category : vn;
          return vnCat === fn; // Дакладнае супадзенне катэгорыі
        }),
      );
      if (!hasMatch) return false;
    }

    // --- 12. Агенцыя і Брэнд ---
    if (
      filters.agencyName?.length > 0 &&
      !filters.agencyName.includes(v.agencyName)
    )
      return false;
    if (filters.brand?.length > 0) {
      const match = filters.brand.some((fb) => {
        if (fb === "NO BRAND") return !v.brand || v.brand === "БРЕНДОВИЙ ОДЯГ";
        return v.brand === fb;
      });
      if (!match) return false;
    }
    // 🆕 КРОПКАВАЕ ДАДАННЕ (v4.1): Фільтр па крыніцах (sourceType)
    if (
      filters.sourceType?.length &&
      !filters.sourceType.includes(v.sourceType || "manual")
    )
      return false;
    // 👈 ДАДАДЗЕНА: Фільтр па тыпу дагавору (case-insensitive)
    if (filters.contractType?.length > 0) {
      const ct = (v.contractType || "").toLowerCase();
      const match = filters.contractType.some((fc) => {
        if (fc === "zlecenie") return ct.includes("zlecenie");
        if (fc === "oprace") return ct.includes("o prac");
        if (fc === "null") return !v.contractType;
        return false;
      });
      if (!match) return false;
    }
  if (filters.onlyDayShifts && !v.schedule?.onlyDayShifts) {
      return false;
    }
    // 👈 ДАДАДЗЕНА: Фільтр па гадзінах у месяц (парсінг hoursRange)
    if (filters.hoursRange?.length > 0) {
      // Парсім першую лічбу з радка: "210-270"→210, "240+"→240, "170–220"→170
      const raw = v.salary?.hoursRange || "";
      const parsed = raw.replace("–", "-").match(/(\d+)/);
      const minH = parsed ? parseInt(parsed[1]) : null;

      const match = filters.hoursRange.some((fh) => {
        if (fh === "low") return minH !== null && minH < 170;
        if (fh === "mid") return minH !== null && minH >= 170 && minH <= 220;
        if (fh === "high") return minH !== null && minH > 220;
        if (fh === "unknown") return minH === null;
        return false;
      });
      if (!match) return false;
    }
    // --- 13. Зарплата (Лічбавы фільтр) ---
    const fMinSal =
      filters.minSalary !== "" ? parseFloat(filters.minSalary) : null;
    const fMaxSal =
      filters.maxSalary !== "" ? parseFloat(filters.maxSalary) : null;
    const vSal = v.salary?.baseNetto; // Можа быць лічбай або null

    if (fMinSal !== null || fMaxSal !== null) {
      // Калі ў вакансіі няма лічбавай ЗП, а мы фільтруем — хаваем яе
      if (vSal === null || vSal === undefined || isNaN(vSal)) return false;
      if (fMinSal !== null && vSal < fMinSal) return false;
      if (fMaxSal !== null && vSal > fMaxSal) return false;
    }

    // --- 14. Узрост (Лічбавы фільтр па maxAge) ---
    const fMinAge = filters.minAge !== "" ? parseFloat(filters.minAge) : null;
    const fMaxAge = filters.maxAge !== "" ? parseFloat(filters.maxAge) : null;
    // 🆕 КРОПКАВАЕ ДАДАННЕ (v4.6): Строгая фільтрацыя па updatedAt
    if (filters.startDate) {
      const start = new Date(filters.startDate);
      start.setHours(0, 0, 0, 0);
      const vDate = new Date(v.updatedAt || v.createdAt).getTime();
      if (vDate < start.getTime()) return false;
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      const vDate = new Date(v.updatedAt || v.createdAt).getTime();
      if (vDate > end.getTime()) return false;
    }
    const vAge = v.requirements?.age?.max; // Можа быць лічбай або null

    if (fMinAge !== null || fMaxAge !== null) {
      // Калі ў вакансіі няма ўзросту, а мы фільтруем — хаваем яе
      if (vAge === null || vAge === undefined || isNaN(vAge)) return false;
      if (fMinAge !== null && vAge < fMinAge) return false;
      if (fMaxAge !== null && vAge > fMaxAge) return false;
    }
    // --- 15. Крыніца (Source Type) ---
    if (
      filters.sourceType?.length > 0 &&
      !filters.sourceType.includes(v.sourceType)
    ) {
      return false;
    }
    return true;
  });
}

export default function Vacancies() {
  const location = useLocation(); // Дадалі
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  // --- Рэгуляваны сайдбар (v4.5) ---
  const [sidebarWidth, setSidebarWidth] = useState(320); // Пачатковая шырыня 320px (w-80)
  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const onMouseMove = (moveEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      // Абмежаванні: мінімум 280px, максімум 450px
      if (newWidth >= 280 && newWidth <= 450) {
        setSidebarWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };
  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length && filtered.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((v) => v._id));
    }
  };
  const handleBulkDelete = async () => {
    if (!window.confirm(`Видалити ${selectedIds.length} вакансій?`)) return;
    try {
      await bulkDeleteVacancies(selectedIds);
      setVacancies((prev) => prev.filter((v) => !selectedIds.includes(v._id)));
      setSelectedIds([]);
    } catch (err) {
      alert("Помилка масового видалення");
    }
  };
  // -----------------------

  const [vacancies, setVacancies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [autoText, setAutoText] = useState("");
  const [autoLoading, setAutoLoading] = useState(false);
  const [showAutoForm, setShowAutoForm] = useState(false);
  const [formMode, setFormMode] = useState("auto");

  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState("");
  const [templateSearch, setTemplateSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [editVacancy, setEditVacancy] = useState(null);
  const [applyVacancy, setApplyVacancy] = useState(null);
  const [matchVacancy, setMatchVacancy] = useState(null);
  const [viewVacancy, setViewVacancy] = useState(null);
  const [vacancySearch, setVacancySearch] = useState("");
  const [selectedVacancyForUpdate, setSelectedVacancyForUpdate] =
    useState(null);
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  // Па змаўчанні паказваем і актыўныя, і закрытыя вакансіі
  const [applied, setApplied] = useState({
    ...EMPTY_FILTERS,
    status: ["active", "closed"],
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sourceMessageId, setSourceMessageId] = useState(null);
  const notifyUpdate = () => {
    window.dispatchEvent(new CustomEvent("inboxUpdated"));
  };
  useEffect(() => {
    if (location.state && location.state.initialText) {
      setShowAutoForm(true);
      setFormMode("auto");
      setAutoText(location.state.initialText);
      setSourceMessageId(location.state.messageId); // Захоўваем ID
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchVacancies = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const res = await getVacancies(params);
      setVacancies(res.data || []);
    } catch (err) {
      console.error("Помилка при завантаженні вакансій:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Калі ўсе фільтры пустыя (скінуты), аўтаматычна прымяняем іх
    if (JSON.stringify(draft) === JSON.stringify(EMPTY_FILTERS)) {
      setApplied(EMPTY_FILTERS);
    }
  }, [draft]);
  // Калі змяняюцца актыўныя зафіксаваныя фільтры — адпраўляем даты на сервер для аптымізацыі
  useEffect(() => {
    const params = {
      // Бярэм даты з draft, каб previewCount заўсёды меў свежыя дадзеныя з сервера
      startDate: draft.startDate || undefined,
      endDate: draft.endDate || undefined,
     onlyDayShifts: draft.onlyDayShifts || undefined,
      status: applied.status?.join(","),
      agency: applied.agencyName?.join(","),
      category: applied.category?.join(","),
    };
    fetchVacancies(params);
  }, [
    fetchVacancies,
    applied.status,
    applied.agencyName,
    applied.category,
    draft.startDate,
    draft.endDate,
    draft.onlyDayShifts,
  ]);

  useEffect(() => {
    if (showAutoForm && formMode === "template" && templates.length === 0) {
      setTemplatesLoading(true);
      getTemplates()
        .then((res) => setTemplates(res.data))
        .catch(() => console.error("Памылка загрузкі шаблонаў"))
        .finally(() => setTemplatesLoading(false));
    }
  }, [showAutoForm, formMode, templates.length]);

  const handleToggleFavorite = async (id) => {
    try {
      const res = await toggleFavoriteVacancy(id);
      // Аптымістычна абнаўляем лакальны спіс вакансій
      setVacancies((prev) =>
        prev.map((v) =>
          v._id === id ? { ...v, isFavorite: res.data.isFavorite } : v,
        ),
      );
    } catch (err) {
      console.error("Памылка пераключэння абранага:", err);
    }
  };
  // 1. Вакансіі, адфільтраваныя ТОЛЬКІ па датах і пошуку (Кантэкст для фільтраў)
  const instantFiltered = useMemo(() => {
    return vacancies.filter((v) => {
      // Пошук
      if (draft.search) {
        const s = draft.search.toLowerCase();
        const match =
          v.templateName?.toLowerCase().includes(s) ||
          v.vacancydescription?.toLowerCase().includes(s) ||
          v.vacancyCode?.toLowerCase().includes(s);
        if (!match) return false;
      }
      // Даты
      const vDate = new Date(v.updatedAt || v.createdAt).getTime();
      if (draft.startDate) {
        const start = new Date(draft.startDate).setHours(0, 0, 0, 0);
        if (vDate < start) return false;
      }
      if (draft.endDate) {
        const end = new Date(draft.endDate).setHours(23, 59, 59, 999);
        if (vDate > end) return false;
      }
      return true;
    });
  }, [vacancies, draft.startDate, draft.endDate, draft.search]);
  // 2. Абнаўляем dynamicData: цяпер яно глядзіць толькі на instantFiltered
  const dynamicData = useMemo(() => {
    const agencies = new Set();
    const brands = new Set();
    const locations = new Set();
    const voivodeships = new Set();
    const nuances = new Set();

    const VOIV_LIST = [
      "Dolnośląskie",
      "Kujawsko-Pomorskie",
      "Lubelskie",
      "Lubuskie",
      "Łódzkie",
      "Małopolskie",
      "Mazowieckie",
      "Opolskie",
      "Podkarpackie",
      "Podlaskie",
      "Pomorskie",
      "Śląskie",
      "Świętokrzyskie",
      "Warmińsko-Mazurskie",
      "Wielkopolskie",
      "Zachodniopomorskie",
    ].map((v) => v.toLowerCase());

    const EUROPE_LABEL = "Інші країни Європи";
    const sourceTypes = new Set(); // 👈 Дададзена
    // ВАЖНА: Цяпер бярэм дадзеныя з instantFiltered замест vacancies
    instantFiltered.forEach((v) => {
      if (v.agencyName) agencies.add(v.agencyName);
      if (v.sourceType) sourceTypes.add(v.sourceType);

      if (v.brand && v.brand !== "БРЕНДОВИЙ ОДЯГ") {
        brands.add(v.brand.toUpperCase().trim());
      } else {
        brands.add("NO BRAND");
      }

      if (v.country === "Polska") {
        voivodeships.add("Польща");
      }

      if (v.voivodeship) {
        v.voivodeship.split(",").forEach((vovPart) => {
          const vov = vovPart.trim();
          const lowVov = vov.toLowerCase();
          if (!vov || lowVov === "польща") return;

          if (lowVov.includes("європа") || lowVov.includes("країни європи")) {
            voivodeships.add(EUROPE_LABEL);
          } else {
            const normalizedVov = vov
              .split("-")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
              )
              .join("-");
            voivodeships.add(normalizedVov);
          }
        });
      }

      if (v.country && v.country !== "Polska") {
        voivodeships.add(EUROPE_LABEL);
      }

      if (v.location) {
        v.location.split(",").forEach((loc) => {
          let clean = loc.trim();
          const lowClean = clean.toLowerCase();
          if (v.country && v.country !== "Polska" && !clean.includes("(")) {
            clean = `${clean} (${v.country})`;
          }
          const noiseWords = [
            "польща",
            "уточнюється",
            "різні локалізації",
            "європа",
            "europe",
          ];
          const isActualNoise = noiseWords.some((word) =>
            lowClean.includes(word),
          );
          const hasCyrillic = /[А-ЯЁІЎ]/.test(clean);

          if (
            clean &&
            !isActualNoise &&
            !hasCyrillic &&
            !VOIV_LIST.includes(lowClean)
          ) {
            locations.add(clean);
          }
        });
      }

      if (v.conditions?.specificNuances) {
        v.conditions.specificNuances.forEach((n) => {
          const category = typeof n === "object" && n !== null ? n.category : n;
          if (category) nuances.add(category);
        });
      }
    });

    return {
      agencies: Array.from(agencies).sort(),
      brands: Array.from(brands).sort(),
      locations: Array.from(locations).sort(),
      voivodeships: Array.from(voivodeships).sort((a, b) => {
        if (a === "Польща") return -1;
        if (b === "Польща") return 1;
        if (a === "Інші країни Європи") return 1;
        if (b === "Інші країни Європи") return -1;
        return a.localeCompare(b, 'uk-UA');
      }),
      nuances: Array.from(nuances).sort(),
      sourceTypes: Array.from(sourceTypes).sort(),
    };
  }, [instantFiltered]); // 👈 Залежым ад instantFiltered

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchAgency = !selectedAgency || t.agencyName === selectedAgency;
      const q = templateSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.templateName?.toLowerCase().includes(q) ||
        t.location?.toLowerCase().includes(q);
      return matchAgency && matchSearch;
    });
  }, [templates, selectedAgency, templateSearch]);
  const filteredVacanciesForUpdate = useMemo(() => {
    return vacancies
      .filter((v) => v.status === "active")
      .filter((v) => {
        const q = vacancySearch.toLowerCase().trim();
        return (
          !q ||
          v.vacancyCode?.toLowerCase().includes(q) ||
          v.vacancydescription?.toLowerCase().includes(q) ||
          v.location?.toLowerCase().includes(q)
        );
      });
  }, [vacancies, vacancySearch]);
  const previewCount = useMemo(
    () => applyFilters(vacancies, draft).length,
    [vacancies, draft],
  );
  // 3. Фінальны спіс: прымяняем "цяжкія" фільтры (агенцыя, статус і г.д.) да ўжо адфільтраваных па даце вакансій
  const filtered = useMemo(() => {
    // Мы перадаем applied, але даты і пошук у ім цяпер не важныя,
    // бо яны ўжо апрацаваны ў instantFiltered
    return applyFilters(instantFiltered, applied);
  }, [instantFiltered, applied]);
  const isDirty = useMemo(() => {
    const { search, startDate, endDate, ...restDraft } = draft;
    const { search: s, startDate: sd, endDate: ed, ...restApplied } = applied;
    return JSON.stringify(restDraft) !== JSON.stringify(restApplied);
  }, [draft, applied]);

  const handleApplyFilters = () => {
    setApplied(draft);
    setSidebarOpen(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Видалити вакансію?")) return;
    try {
      await deleteVacancy(id);
      setVacancies((prev) => prev.filter((v) => v._id !== id));
    } catch {
      alert("Помилка видалення");
    }
  };

  const handleAutoCreate = async () => {
    if (!autoText.trim()) return;
    setAutoLoading(true);
    try {
      await createVacancyAuto(autoText, sourceMessageId);
      notifyUpdate();
      handleCloseForm();
      await fetchVacancies();
    } catch {
      alert("Помилка створення");
    } finally {
      setAutoLoading(false);
    }
  };

  const handleTemplateCreate = async () => {
    if (!selectedTemplate || !autoText.trim())
      return alert("Заповніть усі поля");
    setAutoLoading(true);
    try {
      await createVacancyFromTemplate(
        selectedTemplate._id,
        autoText,
        sourceMessageId,
      );
      notifyUpdate();
      handleCloseForm();
      setSourceMessageId(null);
      await fetchVacancies();
    } catch {
      alert("Помилка створення");
    } finally {
      setAutoLoading(false);
    }
  };
  const handleAIUpdate = async () => {
    if (!selectedVacancyForUpdate || !autoText.trim())
      return alert("Оберіть вакансію та введіть текст");
    setAutoLoading(true);
    try {
      await aiUpdateVacancy(
        selectedVacancyForUpdate._id,
        autoText,
        sourceMessageId,
      );
      notifyUpdate();
      handleCloseForm();
      setSourceMessageId(null);
      await fetchVacancies();
    } catch (err) {
      alert("Помилка оновлення: " + err.message);
    } finally {
      setAutoLoading(false);
    }
  };
  const handleCloseForm = () => {
    setShowAutoForm(false);
    setAutoText("");
    setSelectedTemplate(null);
    setSelectedVacancyForUpdate(null); // 👈 Дададзена
    setVacancySearch(""); // 👈 Дададзена
    setFormMode("auto");
  };

  const handleSaveEdit = (updated) => {
    setVacancies((prev) =>
      prev.map((v) => (v._id === updated._id ? updated : v)),
    );
  };
const [viewMode, setViewMode] = useState("list"); // Стан для пераключэння Спіс/Мапа

  const setQuickDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    const dateStr = date.toISOString().split('T')[0];
    
    // Абнаўляем і чарнавік, і прымененыя фільтры адразу
    const newFilters = { ...draft, startDate: dateStr, endDate: "" };
    setDraft(newFilters);
    setApplied(newFilters);
  };
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* САЙДБАР З РЭГУЛЯВАННЕМ ШЫРЫНІ */}
      <aside
        style={{ width: `${sidebarWidth}px` }}
        className="hidden lg:flex flex-col shrink-0 border-r border-slate-200 bg-white sticky top-16 h-[calc(100vh-4rem)] group shadow-sm"
      >
        <VacancyFilters
          filters={draft}
          setFilters={setDraft}
          agencies={dynamicData.agencies}
          brands={dynamicData.brands}
          locations={dynamicData.locations}
          voivodeships={dynamicData.voivodeships}
          nuances={dynamicData.nuances}
          vacancies={vacancies}
        />
        {/* Рэйка для перацягвання (Resize Handle) - тонкая лінія справа */}
        <div
          onMouseDown={handleMouseDown}
          className="absolute top-0 -right-1 w-2 h-full cursor-col-resize z-10 hover:bg-emerald-500/40 transition-colors"
          title="Пацягніце, каб змяніць шырыню"
        />
      </aside>

      {/* МАБІЛЬНЫ САЙДБАР */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-80 bg-slate-200 border-r border-slate-500 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <VacancyFilters
                filters={draft}
                setFilters={setDraft}
                agencies={dynamicData.agencies}
                brands={dynamicData.brands}
                locations={dynamicData.locations}
                voivodeships={dynamicData.voivodeships}
                nuances={dynamicData.nuances}
                vacancies={instantFiltered} // 👈 ПЕРАДАЕМ ІМГНЕННЫ КАНТЭКСТ ДЛЯ ЛІЧЫЛЬНІКАЎ
              />
            </div>
            <div className="p-4 border-t border-slate-100">
              <button
                onClick={handleApplyFilters}
                className="w-full py-2.5 bg-emerald-500 text-slate-900 font-bold rounded-lg"
              >
                Показати {previewCount} вакансій
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden px-3 py-2 bg-slate-100 text-slate-500 rounded-lg"
            >
              ⚙️ Фільтри {isDirty && "●"}
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Вакансії</h1>
              <p className="text-sm text-slate-500">
                Знайдено: {filtered.length}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAutoForm(!showAutoForm)}
            className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-md shadow-emerald-100 hover:bg-emerald-700 transition-all"
          >
            ＋ Додати
          </button>
        </div>

        {/* ФОРМА ДАДАВАННЯ */}
        {showAutoForm && (
          <div className="mb-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
            <div className="flex gap-2 mb-4">
              {["auto", "template", "update"].map((m) => (
                <button
                  key={m}
                  onClick={() => setFormMode(m)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${formMode === m ? "bg-emerald-500 text-slate-900" : "bg-slate-100 text-slate-500"}`}
                >
                  {m === "auto"
                    ? "🤖 Авто (AI)"
                    : m === "template"
                      ? "📋 З шаблона"
                      : "🔄 Оновити VAC"}
                </button>
              ))}
            </div>

            {formMode === "template" && (
              <div className="mb-4 space-y-3">
                <input
                  type="text"
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  placeholder="Пошук шаблона (назва, горад)..."
                  className="w-full bg-slate-100 border border-slate-100 rounded-lg px-3 py-2 text-sm text-slate-500"
                />
                <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-lg p-1 bg-white">
                  {filteredTemplates.map((t) => (
                    <button
                      key={t._id}
                      onClick={() => setSelectedTemplate(t)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 ${selectedTemplate?._id === t._id ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-500 hover:bg-slate-100"}`}
                    >
                      <span className="font-bold">{t.templateName}</span>
                      <span className="text-slate-500 ml-2 text-xs">
                        ({t.agencyName})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {formMode === "update" && (
              <div className="mb-4 space-y-3">
                <input
                  type="text"
                  value={vacancySearch}
                  onChange={(e) => setVacancySearch(e.target.value)}
                  placeholder="Пошук вакансії (код, назва, горад)..."
                  className="w-full bg-slate-100 border border-slate-100 rounded-lg px-3 py-2 text-sm text-slate-500"
                />
                <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-lg p-1 bg-white">
                  {filteredVacanciesForUpdate.map((v) => (
                    <button
                      key={v._id}
                      onClick={() => setSelectedVacancyForUpdate(v)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 ${selectedVacancyForUpdate?._id === v._id ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-slate-500 hover:bg-slate-100"}`}
                    >
                      <span className="font-mono text-xs bg-slate-100 px-1 rounded mr-2">
                        {v.vacancyCode}
                      </span>
                      <span className="font-medium">
                        {v.vacancydescription || v.templateName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <textarea
              value={autoText}
              onChange={(e) => setAutoText(e.target.value)}
              placeholder="Вставте текст вакансії..."
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all resize-none"
            />

            <div className="flex gap-3 mt-3">
              <button
                onClick={
                  formMode === "template"
                    ? handleTemplateCreate
                    : formMode === "update"
                      ? handleAIUpdate
                      : handleAutoCreate
                }
                disabled={autoLoading || !autoText.trim()}
                className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-md shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50"
              >
                {autoLoading ? "Обробка..." : "Обробити та додати"}
              </button>
              <button
                onClick={handleCloseForm}
                className="px-4 py-2 bg-slate-100 text-slate-500 rounded-lg"
              >
                Скасувати
              </button>
            </div>
          </div>
        )}
        {/* ХУТКІЯ ФІЛЬТРЫ І ПЕРАКЛЮЧАЛЬНІК ВЫВАДУ */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">ЗА:</span>
            {[
              { label: "Сьогодні", days: 0 },
              { label: "2 дні", days: 1 },
              { label: "Тиждень", days: 6 },
              { label: "2 тижні", days: 13 },
            ].map((tag) => {
              const isActive = draft.startDate === new Date(new Date().setDate(new Date().getDate() - tag.days)).toISOString().split('T')[0];
              return (
                <button
                  key={tag.label}
                  onClick={() => setQuickDate(tag.days)}
                  className={`px-3 py-1.5 border rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm ${
                    isActive 
                      ? "bg-emerald-600 border-emerald-600 text-white" 
                      : "bg-white border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
                  }`}
                >
                  {tag.label}
                </button>
              );
            })}

            {/* ВІЗУАЛЬНЫ ПАДЗЯЛЯЛЬНІК */}
            <div className="w-px h-6 bg-slate-200 mx-2 shrink-0" />

            {/* КНОПКА АБРАНАЕ */}
            <button
              onClick={() => {
                const newVal = !draft.isFavorite;
                setDraft(prev => ({ ...prev, isFavorite: newVal }));
                setApplied(prev => ({ ...prev, isFavorite: newVal }));
              }}
              className={`px-3 py-1.5 border rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm flex items-center gap-1.5 ${
                draft.isFavorite 
                  ? "bg-amber-500 border-amber-500 text-white" 
                  : "bg-white border-slate-200 text-slate-600 hover:border-amber-500 hover:text-amber-600"
              }`}
            >
              <span>{draft.isFavorite ? "★" : "☆"}</span>
              ОБРАНІ
            </button>

            {/* КНОПКА ДЗЁННЫЯ ЗМЕНЫ */}
            <button
              onClick={() => {
                const newVal = !draft.onlyDayShifts;
                setDraft(prev => ({ ...prev, onlyDayShifts: newVal }));
                setApplied(prev => ({ ...prev, onlyDayShifts: newVal }));
              }}
              className={`px-3 py-1.5 border rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm flex items-center gap-1.5 ${
                draft.onlyDayShifts 
                  ? "bg-blue-500 border-blue-500 text-white" 
                  : "bg-white border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600"
              }`}
            >
              <span>☀️</span>
              ДЕННІ ЗМІНИ
            </button>
{/* КНОПКА БЕЗКОШТОВНЕ ЖИТЛО */}
            <button
              onClick={() => {
                const newVal = !draft.freeHousing;
                setDraft(prev => ({ ...prev, freeHousing: newVal }));
                setApplied(prev => ({ ...prev, freeHousing: newVal }));
              }}
              className={`px-3 py-1.5 border rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm flex items-center gap-1.5 ${
                draft.freeHousing 
                  ? "bg-indigo-600 border-indigo-600 text-white" 
                  : "bg-white border-slate-200 text-slate-600 hover:border-indigo-500 hover:text-indigo-600"
              }`}
            >
              <span>🏠</span>
              БЕЗКОШТОВНЕ ЖИТЛО
            </button>
            {(draft.startDate || draft.endDate) && (
              <button 
                onClick={() => {
                  const resetDates = { ...draft, startDate: "", endDate: "" };
                  setDraft(resetDates);
                  setApplied(resetDates);
                }}
                className="text-[10px] font-bold text-red-400 hover:text-red-600 ml-2 uppercase"
              >
                ✕ Скинути час
              </button>
            )}
          </div>

          {/* ПЕРАКЛЮЧАЛЬНІК СПІС / МАПА */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
            <button 
              onClick={() => setViewMode("list")}
              className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${viewMode === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              СПИСОК
            </button>
            <button 
              onClick={() => setViewMode("map")}
              className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${viewMode === "map" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              МАПА
            </button>
          </div>
        </div>
        {/* ПАНЭЛЬ МАСАВЫХ ДЗЕЯННЯЎ */}
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-5 py-4 mb-6 shadow-sm">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={
                filtered.length > 0 && selectedIds.length === filtered.length
              }
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-slate-100 bg-slate-100 text-emerald-500 focus:ring-emerald-500/20"
            />
            <span className="text-sm text-slate-500 font-medium">
              {selectedIds.length > 0
                ? `Выбрана: ${selectedIds.length}`
                : "Выбраць усе адфільтраваныя"}
            </span>
          </div>
{selectedIds.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowBulkModal(true)}
                className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-lg transition-all shadow-md shadow-emerald-100"
              >
                📢 АПУБЛІКАВАЦЬ ({selectedIds.length})
              </button>
              
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-black rounded-lg border border-red-500/20 transition-all"
              >
                🗑️ ВЫДАЛІЦЬ
              </button>
            </div>
          )}
          
        </div>
        {/* ВЫВАД: СПІС АБО МАПА */}
        {viewMode === "list" ? (
          <div className="space-y-3">
            {filtered.map((v) => {
            // Разумная лакацыя: дадаем краіну толькі калі яе яшчэ няма ў назве горада
            const cityOnly = (v.location || "").split("(")[0].trim();
            const locationDisplay =
              v.country && v.country !== "Polska"
                ? `${cityOnly} (${v.country})`
                : cityOnly;
            // Збіраем толькі унікальныя катэгорыі нюансаў для кампактнага вываду
            const uniqueCategories = Array.from(
              new Set(
                (v.conditions?.specificNuances || []).map((n) =>
                  typeof n === "object" && n !== null ? n.category : n,
                ),
              ),
            );
            return (
              <div
                key={v._id}
                className={`bg-white border rounded-2xl p-6 transition-all shadow-sm hover:shadow-md ${
                  selectedIds.includes(v._id)
                    ? "border-emerald-500 ring-2 ring-emerald-500/10"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap border-b border-slate-100/50 pb-2">
                      {/* ЧЭКБОКС ДЛЯ ВЫБАРУ */}
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(v._id)}
                        onChange={() => toggleSelect(v._id)}
                        className="w-5 h-5 rounded-md border-slate-300 bg-white text-emerald-600 focus:ring-emerald-500/20"
                      />

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(v._id);
                          }}
                          className={`text-lg transition-transform active:scale-125 ${
                            v.isFavorite
                              ? "text-amber-400"
                              : "text-slate-600 hover:text-slate-500"
                          }`}
                        >
                          {v.isFavorite ? "★" : "☆"}
                        </button>
                        <span className="text-[11px] font-bold font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-lg flex items-center gap-1 border border-slate-200">
                          {v.vacancyCode}
                          {v.isTruncated && (
                            <span
                              className="text-amber-500"
                              title="Текст обірваний"
                            >
                              ⚠️
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Статус (Украінізаваны) */}
                      <span
                        className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${STATUS_COLORS[v.status]}`}
                      >
                        {STATUS_LABELS[v.status]}
                      </span>
{/* ІНДЫКАТАРЫ ПУБЛІКАЦЫІ */}
<div className="flex items-center gap-1.5 ml-1">
  {v.isPublished ? (
    <span 
      className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold border border-emerald-200"
      title="Апублікавана ў Telegram"
    >
      📢 ТГ
    </span>
  ) : (
    <span 
      className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-md font-bold border border-slate-200"
      title="Яшчэ не публікавалася"
    >
      💤
    </span>
  )}

  {v.postOutdated && (
    <span 
      className="flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md font-bold border border-amber-200 animate-pulse"
      title="Дадзеныя вакансіі змяніліся, трэба абнавіць пост"
    >
      🔄 UPD
    </span>
  )}
</div>
                      {/* Агенція */}
                      <span className="text-[10px] uppercase tracking-wider font-black bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded-md">
                        🏢 {v.agencyName}
                      </span>

                      {/* Брэнд (Завод) */}
                      {v.brand && (
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                          🏭 {v.brand}
                        </span>
                      )}

                      {/* Категорія */}
                      {v.category && (
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                          📁 {v.category}
                        </span>
                      )}

                      {/* Лакацыя + Ваяводства (толькі для Польшчы) */}
                      <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-blue-100 shadow-sm">
                        📍 {locationDisplay}
                        {v.voivodeship &&
                          v.voivodeship !== "Європа (інші країни)" && (
                            <span className="text-slate-500 ml-1 font-medium">
                              ({v.voivodeship})
                            </span>
                          )}
                      </span>

                      {/* Крыніца і Даты (v4.5 - Фікс Invalid Date і іконак) */}
                      <div className="flex items-center gap-3 ml-auto">
                        <span
                          className="text-base"
                          title={`Джерело: ${v.sourceType || "manual"}`}
                        >
                          {v.sourceType === "viber"
                            ? "📱"
                            : v.sourceType === "telegram"
                              ? "✈️"
                              : v.sourceType === "spreadsheet"
                                ? "📊"
                                : v.sourceType === "trello"
                                  ? "🔵"
                                  : v.sourceType === "airtable"
                                    ? "🗄️"
                                    : "📝"}{" "}
                        </span>

                        <div className="flex flex-col items-end leading-none">
                          <span className="text-[10px] text-slate-500 font-mono">
                            {v.createdAt
                              ? new Date(v.createdAt).toLocaleDateString(
                                  "uk-UA",
                                )
                              : "---"}
                          </span>
                          {/* Паказваем UPD толькі калі дата рэальна адрозніваецца больш чым на 5 сек */}
                          {v.updatedAt &&
                            v.createdAt &&
                            new Date(v.updatedAt).getTime() >
                              new Date(v.createdAt).getTime() + 5000 && (
                              <span className="text-[9px] text-emerald-500 font-bold font-mono mt-0.5">
                                (upd:{" "}
                                {new Date(v.updatedAt).toLocaleDateString(
                                  "uk-UA",
                                )}
                                )
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                    {/* ЗАГАЛОВАК */}
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-3">
                      {v.vacancydescription || v.templateName}
                    </h3>

                    {/* РАДОК 2: БАЗАВЫЯ ЎМОВЫ (Гендэр, Вік, Графік, Жытло, Давоз, Мова) + ЗАРПЛАТА */}
                    <div className="flex flex-wrap gap-3 text-xs items-center mb-3">
                      {/* ГЕНДАР / НАБОР */}
                      <div className="flex items-center gap-2 bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-500">
                        <span className="text-slate-500 text-[10px]">👥</span>
                        <span className="text-slate-600 font-bold uppercase tracking-tight text-[10px]">
                          {Array.isArray(v.requirements?.gender)
                            ? v.requirements.gender.join(", ")
                            : v.gender || "Будь-хто"}
                          {v.requirements?.genderDescription && (
                            <span className="text-emerald-500 ml-1">*</span>
                          )}
                        </span>
                      </div>

                      {/* ВІК (Захавана) */}
                      {v.requirements?.age?.max && (
                        <div className="flex items-center gap-2 bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-500">
                          <span className="text-slate-500 text-[10px]">🎂</span>
                          <span className="text-slate-600 font-bold text-[10px]">
                            {v.requirements.age.min || 18}-{v.requirements.age.max} р.
                          </span>
                        </div>
                      )}

                      {/* ЖИТЛО (Захавана логіка "Без житла") */}
                      <div className="flex items-center gap-1.5 text-slate-500 ml-1 bg-orange-200/50 px-3 py-1.5 rounded-xl border border-orange-500">
                        <span>🏠</span>
                        <span className="font-medium">
                          {!v.accommodation?.type || v.accommodation?.type === ""
                            ? "Не вказано"
                            : v.accommodation.type.toLowerCase().includes("власн") || v.accommodation.type.toLowerCase().includes("не надаєт")
                              ? "Без житла"
                              : "Житло є"}
                          {v.accommodation?.forCouples && <span className="text-orange-400 ml-1">👫</span>}
                        </span>
                      </div>

                      {/* ДОВІЗ */}
                      <div className="flex items-center gap-1.5 text-slate-500 bg-green-200/50 px-3 py-1.5 rounded-xl border border-green-500">
                        <span>🚌</span>
                        <span className="font-medium">{v.transport?.provided ? "Є довіз" : "Немає"}</span>
                      </div>

                      {/* МОВА */}
                      <div className="flex items-center gap-1.5 text-slate-500 bg-amber-200/50 px-3 py-1.5 rounded-xl border border-amber-500">
                        <span>🗣️</span>
                        <span className="font-medium">{v.requirements?.polishLanguageLevel || "—"}</span>
                      </div>
{/* ГРАФІК І ГАДЗІНЫ (Новы яркі блок) */}
                      <div className="flex items-center gap-2 bg-blue-200/50 px-3 py-1.5 rounded-xl border border-blue-500">
                        <span className="text-blue-600 text-[10px]">{v.schedule?.onlyDayShifts ? "☀️" : "🔄"}</span>
                        <span className="text-blue-700 font-bold uppercase tracking-tight text-[10px]">
                          {v.schedule?.onlyDayShifts ? "Тільки день" : "Зміни"}
                          {v.salary?.hoursRange && (
                            <span className="ml-1.5 pl-1.5 border-l border-blue-200">
                              ⏱️ {v.salary.hoursRange} год/міс
                            </span>
                          )}
                        </span>
                      </div>
                      {/* ЗАРПЛАТА (Зроблена яркай) */}
                      {(v.salary?.rawSalaryDisplay || v.salary?.baseNetto) && (
                        <div className="flex items-center gap-2 bg-emerald-200/50  px-4 py-2 rounded-2xl ml-auto border border-emerald-500">
                          <span className="text-emerald-700 font-black text-base">
                            💰 {v.salary.rawSalaryDisplay ? v.salary.rawSalaryDisplay.split(";")[0] : `${v.salary.baseNetto} PLN`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ХМАРА ТЕГІВ v2.2 (Спецыфічныя патрабаванні: Нацыі, Дакументы, Нюансы) */}
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100/50">
                      {/* НАЦІОНАЛЬНІСТЬ */}
                      {(v.requirements?.nationalities || []).length > 0 && (
                        <span className="text-[10px] px-2 py-1 rounded-lg bg-blue-200 text-blue-700 border border-blue-500 font-bold uppercase tracking-tight shadow-sm">
                          🌍 {v.requirements.nationalities.join(", ")}
                        </span>
                      )}

                      {/* ДОКУМЕНТИ */}
                      {(v.requirements?.standardDocs || []).length > 0 && (
                        <span className="text-[10px] px-2 py-1 rounded-lg bg-slate-200 text-slate-700  font-bold uppercase tracking-tighter">
                          📄 {v.requirements.standardDocs.join(" / ")}
                        </span>
                      )}

                      {/* ОСОБЛИВОСТІ (Толькі унікальныя катэгорыі з кантэнтам) */}
                      {uniqueCategories.map((category, idx) => {
                        const icons = {
                          "Температурний режим": "🌡️",
                          "Фізично-важка праця": "🏋️",
                          Шум: "📢",
                          Норми: "📈",
                          "Санітарні обмеження": "🚫",
                          "Запахи та алергени": "👃",
                          "Характер праці": "🚶",
                          "Специфічні навички": "🛠️",
                          "Тести пры вступі": "📝",
                        };

                        // Калі тэксту для гэтай катэгорыі няма (схаваны як дубль), не паказваем пусты тэг
                        const hasContent = v.conditions?.specificNuances?.some(
                          (n) =>
                            typeof n === "object"
                              ? n.category === category
                              : n === category,
                        );
                        if (!hasContent) return null;

                        return (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 font-bold uppercase tracking-tight shadow-sm"
                          >
                            {icons[category] || "✨"} {category}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* КНОПКІ ДЗЕЯННЯЎ */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => setViewVacancy(v)}
                      className="w-32 px-3 py-2.5 bg-orange-200 text-orange-700 hover:bg-orange-100 border border-orange-200 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all shadow-sm flex items-center gap-2"
                    >
                      <span className="text-sm">👁️</span> ПЕРЕГЛЯД
                    </button>
                    <button
                      onClick={() => setMatchVacancy(v)}
                      className="w-32 px-3 py-2.5 bg-indigo-200 text-white hover:bg-indigo-700 border border-indigo-200 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all shadow-md shadow-indigo-100 flex items-center gap-2"
                    >
                      <span className="text-sm">🎯</span> КАНДИДАТИ
                    </button>
                    <button
                      onClick={() => setEditVacancy(v)}
                      className="w-32 px-3 py-2.5 bg-emerald-200 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all flex items-center gap-2"
                    >
                      <span className="text-sm">✏️</span> РЕДАГУВАТИ
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        ) : (
          <div className="w-full h-[70vh] min-h-[500px] block relative z-0 animate-in fade-in duration-500">
            <VacancyMap 
              vacancies={filtered} 
              onViewVacancy={(v) => setViewVacancy(v)} 
            />
          </div>
        )}
      </div>

      {/* ПЛАВАЮЧАЯ КНОПКА */}
      {isDirty && (
        <div className="hidden lg:block fixed bottom-6 right-6 z-30">
          <button
            onClick={handleApplyFilters}
            className="px-6 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95"
          >
            Показати {previewCount} вакансій ✓
          </button>
        </div>
      )}

      {/* МАДАЛКІ */}
      {editVacancy && (
        <EditVacancyModal
          vacancy={editVacancy}
          onClose={() => setEditVacancy(null)}
          onSave={handleSaveEdit}
        />
      )}
      {matchVacancy && (
        <VacancyMatchModal
          vacancy={matchVacancy}
          onClose={() => setMatchVacancy(null)}
        />
      )}
      {/* МАДАЛКА ПРАГЛЯДУ З НАВІГАЦЫЯЙ (КАРУСЕЛЬ) */}
      {viewVacancy && (() => {
        // 1. Знаходзім, на якой пазіцыі зараз знаходзіцца адкрытая вакансія ў спісе filtered
        const currentIndex = filtered.findIndex(v => v._id === viewVacancy._id);
        
        // 2. Правяраем, ці ёсць куды гартаць
        const hasNext = currentIndex < filtered.length - 1;
        const hasPrev = currentIndex > 0;

        // 3. Функцыі для пераключэння
        const handleNext = () => {
          if (hasNext) setViewVacancy(filtered[currentIndex + 1]);
        };

        const handlePrev = () => {
          if (hasPrev) setViewVacancy(filtered[currentIndex - 1]);
        };

        return (
          <VacancyViewModal
            vacancy={viewVacancy}
            onClose={() => setViewVacancy(null)}
            onNext={hasNext ? handleNext : null} // Перадаем функцыю, калі ёсць наступная
            onPrev={hasPrev ? handlePrev : null} // Перадаем функцыю, калі ёсць папярэдняя
            currentIndex={currentIndex + 1}      // Нумар для лічыльніка (напр. 5)
            totalCount={filtered.length}         // Агульная колькасць (напр. 120)
            onEdit={(v) => {
              setViewVacancy(null);
              setEditVacancy(v);
            }}
            onDelete={(id) => {
              setViewVacancy(null);
              handleDelete(id);
            }}
            onMatch={(v) => {
              setViewVacancy(null);
              setMatchVacancy(v);
            }}
          />
        );
      })()}
      {showBulkModal && (
        <BulkPublishModal
          selectedIds={selectedIds}
          onClose={() => {
            setShowBulkModal(false);
            setSelectedIds([]); // Скідваем выбар пасля закрыцця
          }}
        />
      )}
    </div>
  );
}
------
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Vacancies from "./pages/Vacancies";
import Candidates from "./pages/Candidates";
import Templates from "./pages/Templates";
import Inbox from "./pages/Inbox"; // Дадалі імпарт

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vacancies" element={<Vacancies />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/inbox" element={<Inbox />} /> {/* Дадалі маршрут */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
------
// frontend/src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
------
