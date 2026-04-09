// frontend/src/components/vacancies/VacancyFilters.jsx
import { EMPTY_FILTERS } from "../../constants/filters";
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

export default function VacancyFilters({
  draft,
  onChange,
  agencies = [],
  showAgency = false,
}) {
  const toggle = (key, value) => {
    const cur = draft[key];
    const next = cur.includes(value)
      ? cur.filter((v) => v !== value)
      : [...cur, value];
    onChange({ ...draft, [key]: next });
  };

  const activeCount = Object.entries(draft).filter(([k, v]) => {
    if (k === "search") return v.length > 0;
    if (k === "status") return v !== "active";
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
            placeholder="Назва, горад..."
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
            { value: "active", label: "Актыўныя" },
            { value: "closed", label: "Закрытыя" },
            { value: "archived", label: "Архіў" },
            { value: "", label: "Усе" },
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

      {/* Графік */}
      <Section label="Графік">
        <div className="flex flex-wrap">
          {[
            { value: "1", label: "1 змена" },
            { value: "2", label: "2 змены" },
            { value: "3", label: "3 змены" },
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

      {/* Жытло */}
      <Section label="Жытло">
        <div className="flex flex-wrap">
          {[
            { value: "available", label: "🏠 Надаецца" },
            { value: "couples", label: "👫 Для пар" },
            { value: "none", label: "❌ Без жытла" },
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

      {/* Давоз */}
      <Section label="Давоз">
        <div className="flex flex-wrap">
          {[
            { value: "provided", label: "🚌 Ёсць" },
            { value: "none", label: "❌ Няма" },
          ].map((t) => (
            <MultiBtn
              key={t.value}
              value={t.value}
              label={t.label}
              active={draft.transport.includes(t.value)}
              onClick={(v) => toggle("transport", v)}
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

      {/* Мова */}
      <Section label="Мова">
        <div className="flex flex-wrap">
          {[
            { value: "none", label: "Не патрабуецца" },
            { value: "польська", label: "🇵🇱 Польская" },
            { value: "нямецкая", label: "🇩🇪 Нямецкая" },
            { value: "англійская", label: "🇬🇧 Англійская" },
          ].map((l) => (
            <MultiBtn
              key={l.value}
              value={l.value}
              label={l.label}
              active={draft.language.includes(l.value)}
              onClick={(v) => toggle("language", v)}
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
            { value: "Грузія", label: "🇬🇪 Грузія" },
            { value: "Казахстан", label: "🇰🇿 Казахстан" },
            { value: "Азербайджан", label: "🇦🇿 Азербайджан" },
            { value: "Інші", label: "🌍 Іншыя" },
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

      {/* Дакументы */}
      <Section label="Дакументы">
        <div className="flex flex-wrap">
          {[
            { value: "none", label: "Не патрабуюцца" },
            { value: "санепід", label: "Санепід" },
            { value: "udt", label: "UDT" },
            { value: "віза", label: "Віза/Пабыт" },
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

      {/* Агенцыя */}
      {showAgency && agencies.length > 0 && (
        <Section label="Агенцыя">
          <div className="flex flex-wrap">
            {agencies.map((a) => (
              <MultiBtn
                key={a}
                value={a}
                label={a}
                active={draft.agencyName.includes(a)}
                onClick={(v) => toggle("agencyName", v)}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Скінуць */}
      {activeCount > 0 && (
        <button
          onClick={() => onChange(EMPTY_FILTERS)}
          className="w-full mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded-lg transition-colors"
        >
          Скінуць усе фільтры ({activeCount})
        </button>
      )}
    </div>
  );
}
