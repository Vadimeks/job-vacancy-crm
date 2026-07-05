// frontend/src/components/candidates/CandidateFilters.jsx
import { EMPTY_CANDIDATE_FILTERS } from "../../constants/filters";
import * as MD from "../../constants/masterData";


function Section({ label, children }) {
  return (
    <div className="mb-5">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
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
          ? "bg-emerald-500 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
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
    <div className="h-full overflow-y-auto px-4 py-5 bg-white">
      {/* Пошук */}
      <Section label="Пошук">
    <div className="relative">
      <input
        type="text"
        value={draft.search}
        onChange={(e) => onChange({ ...draft, search: e.target.value })}
        placeholder="Ім'я, телефон, місто..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
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
    {MD.STATUSES.map((s) => (
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
      <Section label="Хто їде">
        <div className="flex flex-wrap">
          {MD.GENDERS.map((g) => (
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

      {/* Національність */}
      <Section label="Національність">
    <div className="flex flex-wrap">
      {MD.NATIONALITIES.map((n) => (
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
{/* 👈 НОВАЕ: секцыя Вік, ідэнтычна вакансіям (лічбавы дыяпазон) */}
<Section label="Вік">
  <div className="flex gap-2">
    <input
      type="number"
      value={draft.minAge || ""}
      onChange={(e) => onChange({ ...draft, minAge: e.target.value })}
      placeholder="Від"
      className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
    />
    <input
      type="number"
      value={draft.maxAge || ""}
      onChange={(e) => onChange({ ...draft, maxAge: e.target.value })}
      placeholder="До"
      className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
    />
  </div>
</Section>
      {/* Сфера */}
      <Section label="Сфера">
        <div className="flex flex-wrap">
          {MD.CATEGORIES.map((s) => (
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
      <Section label="Регіон (Воєводство)">
  <div className="flex flex-wrap">
    <MultiBtn
      value="any"
      label="✈️ Без різниці"
      active={draft.voivodeship.includes("any")} 
      onClick={(v) => toggle("voivodeship", v)} 
    />
    {MD.VOIVODESHIPS.map((vov) => (
      <MultiBtn
        key={vov.value}
        value={vov.value}
        label={vov.label}
        active={draft.voivodeship.includes(vov.value)} 
        onClick={(v) => toggle("voivodeship", v)}
      />
    ))}
  </div>
</Section>
{/* 👈 ЗМЕНЕНА: было "Місто" (citySearch) — цяпер тэкставае ўдакладненне лакацыі для AI-матчынгу */}
<Section label="Уточнення локації">
  <input
    type="text"
    value={draft.locationNotes || ""}
    onChange={(e) => onChange({ ...draft, locationNotes: e.target.value })}
    placeholder="Наприклад: Wrocław, конкретний район..."
    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
  />
</Section>
      {/* 👈 ЗМЕНЕНА: было true/false — цяпер мульты-выбар флагаў + асобны тумблер бясплатнага жытла */}
<Section label="Житло">
  <div className="flex flex-wrap">
    <button
      onClick={() => onChange({ ...draft, freeHousing: !draft.freeHousing })}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors mb-1 mr-1 flex items-center gap-1 ${
        draft.freeHousing ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-600 border border-slate-200"
      }`}
    >
      <span>🆓</span> Тільки безкоштовне
    </button>
    {[
      { value: "needed", label: "🏠 Потрібне житло" },
      { value: "forCouples", label: "👫 Для пар" },
      { value: "withChildren", label: "👨‍👩‍👧 З дітьми" },
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
{/* 👈 НОВАЕ: секцыя Транспорт, ідэнтычна вакансіям (MD.TRANSPORT_OPTIONS) */}
<Section label="Транспорт">
  <div className="flex flex-wrap">
    {MD.TRANSPORT_OPTIONS.map((t) => (
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
      {/* Графік */}
      <Section label="Графік">
  <div className="flex flex-wrap">
    <button
      onClick={() => onChange({ ...draft, onlyDayShifts: !draft.onlyDayShifts })}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors mb-1 mr-1 flex items-center gap-1 ${
        draft.onlyDayShifts ? "bg-blue-500 text-white" : "bg-slate-50 text-slate-600 border border-slate-200"
      }`}
    >
      <span>☀️</span> Тільки день
    </button>
    {MD.HOURS_RANGE_OPTIONS.map((h) => (
      <MultiBtn
        key={h.value}
        value={h.value}
        label={h.label}
        active={draft.hoursRange.includes(h.value)} 
        onClick={(v) => toggle("hoursRange", v)} 
      />
    ))}
  </div>
</Section>
{/* 👈 НОВАЕ: секцыя Мова, ідэнтычна вакансіям (MD.LANGUAGES) */}
<Section label="Рівень польської">
  <div className="flex flex-wrap">
    {MD.LANGUAGES.map((l) => (
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
{/* 👈 НОВАЕ: секцыя Нюанси (чек-ліст), ідэнтычна вакансіям (MD.CHECKLIST_ITEMS) */}
<Section label="Нюанси (Чек-лист)">
  <div className="flex flex-wrap">
    {MD.CHECKLIST_ITEMS.map((n) => (
      <MultiBtn
        key={n.value}
        value={n.value}
        label={n.label}
        active={draft.nuances.includes(n.value)}
        onClick={(v) => toggle("nuances", v)}
      />
    ))}
  </div>
</Section>
      {/* Документи */}
      <Section label="Документи">
    <div className="flex flex-wrap">
      {MD.DOCS.map((d) => (
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

      {/* Джерело */}
      <Section label="Джерело">
        <div className="flex flex-wrap">
          {[
            { value: "site", label: "🌐 Тікток" },
            { value: "telegram_bot", label: "✈️ Telegram" },
            { value: "manual", label: "✋ Ручний" },
            { value: "referral", label: "🤝 Рекомендація" },
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
          className="w-full mt-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold rounded-lg border border-slate-200 transition-colors"
        >
          Скинути всі фільтри ({activeCount})
        </button>
      )}
    </div>
  );
}
