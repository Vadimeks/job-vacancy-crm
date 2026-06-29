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
    if (typeof v === "boolean") return v === true;
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
      { value: "new", label: "Новы" },
      { value: "active", label: "Актыўны" },
      { value: "waiting", label: "Чакае" },
      { value: "employed", label: "Працуе" },
      { value: "left", label: "Сышоў" },
      { value: "blacklist", label: "Блэкліст" },
    ].map((s) => (
      <MultiBtn
        key={s.value}
        value={s.value}
        label={s.label}
        active={draft.status.includes(s.value)}
        onClick={(v) => toggle("status", v)}
      />
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
