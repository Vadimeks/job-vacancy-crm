// frontend/src/components/vacancies/VacancyFilters.jsx
import { EMPTY_FILTERS } from "../../constants/filters";
import * as MD from "../../constants/masterData";
import MultiSelect from "../shared/MultiSelect";

function Section({ label, children }) {
  return <div className="mb-5">{children}</div>;
}

export default function VacancyFilters({
  filters = EMPTY_FILTERS,
  setFilters,
  agencies = [],
  brands = [],
  locations = [], // Дадаем новыя пропсы для дынамікі
  voivodeships = [],
}) {
  const draft = filters || EMPTY_FILTERS;

  const updateField = (key, val) => {
    setFilters({ ...draft, [key]: val });
  };

  // Падлік актыўных фільтраў (акрамя пошуку)
  const activeCount = Object.entries(draft).reduce((acc, [key, val]) => {
    if (key === "search") return acc;
    if (Array.isArray(val) && val.length > 0) return acc + 1;
    return acc;
  }, 0);

  return (
    <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 h-full overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-emerald-400 tracking-tight italic">
          ФІЛЬТРЫ
        </h3>
        {activeCount > 0 && (
          <button
            onClick={() => setFilters(EMPTY_FILTERS)}
            className="text-[10px] font-bold text-slate-500 hover:text-red-400 transition-colors uppercase"
          >
            Скінуць ({activeCount})
          </button>
        )}
      </div>

      {/* ПОШУК */}
      <Section>
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
          Пошук
        </label>
        <input
          type="text"
          value={draft.search || ""}
          onChange={(e) => setFilters({ ...draft, search: e.target.value })}
          placeholder="Назва, апісанне..."
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all"
        />
      </Section>

      {/* СТАТУС */}
      <Section>
        <MultiSelect
          label="Статус"
          options={MD.STATUSES}
          selected={draft.status}
          onChange={(v) => updateField("status", v)}
          placeholder="Усе статусы"
        />
      </Section>

      {/* КАТЭГОРЫЯ */}
      <Section>
        <MultiSelect
          label="Катэгорыя"
          options={MD.CATEGORIES}
          selected={draft.category}
          onChange={(v) => updateField("category", v)}
          placeholder="Усе катэгорыі"
        />
      </Section>

      {/* ВАЯВОДСТВА (Дынамічнае) */}
      <Section>
        <MultiSelect
          label="Ваяводства"
          options={voivodeships}
          selected={draft.voivodeship}
          onChange={(v) => updateField("voivodeship", v)}
          placeholder="Усе рэгіёны"
        />
      </Section>

      {/* ЛАКАЦЫЯ (Дынамічная) */}
      <Section>
        <MultiSelect
          label="Горад"
          options={locations}
          selected={draft.location}
          onChange={(v) => updateField("location", v)}
          placeholder="Усе гарады"
        />
      </Section>

      {/* ЖЫТЛО */}
      <Section>
        <MultiSelect
          label="Жыллё"
          options={MD.ACCOMMODATION_OPTIONS}
          selected={draft.accommodation}
          onChange={(v) => updateField("accommodation", v)}
          placeholder="Любыя ўмовы"
        />
      </Section>

      {/* ТРАНСПАРТ */}
      <Section>
        <MultiSelect
          label="Давоз да працы"
          options={MD.TRANSPORT_OPTIONS}
          selected={draft.transport}
          onChange={(v) => updateField("transport", v)}
          placeholder="Не важна"
        />
      </Section>

      {/* ХТО ЕДЗЕ */}
      <Section>
        <MultiSelect
          label="Хто едзе"
          options={MD.TRAVEL_GROUPS}
          selected={draft.travelGroup}
          onChange={(v) => updateField("travelGroup", v)}
          placeholder="Будзь-хто"
        />
      </Section>

      {/* МОВА */}
      <Section>
        <MultiSelect
          label="Узровень польскай"
          options={MD.LANGUAGES}
          selected={draft.language}
          onChange={(v) => updateField("language", v)}
          placeholder="Любы ўзровень"
        />
      </Section>

      {/* НАЦЫЯНАЛЬНАСЦЬ */}
      <Section>
        <MultiSelect
          label="Нацыянальнасць"
          options={MD.NATIONALITIES}
          selected={draft.nationality}
          onChange={(v) => updateField("nationality", v)}
          placeholder="Усе нацыі"
        />
      </Section>

      {/* ДАКУМЕНТЫ */}
      <Section>
        <MultiSelect
          label="Дакументы"
          options={MD.DOCS}
          selected={draft.docs}
          onChange={(v) => updateField("docs", v)}
          placeholder="Любыя дакументы"
        />
      </Section>

      {/* НЮАНСЫ (ЧЭК-ЛІСТ) */}
      <Section>
        <MultiSelect
          label="Асаблівасці (Чэк-ліст)"
          options={MD.CHECKLIST_ITEMS}
          selected={draft.nuances}
          onChange={(v) => updateField("nuances", v)}
          placeholder="Выбраць нюансы..."
        />
      </Section>

      {/* АГЕНЦЫЯ (Дынамічная) */}
      <Section>
        <MultiSelect
          label="Агенцыя"
          options={agencies}
          selected={draft.agencyName}
          onChange={(v) => updateField("agencyName", v)}
          placeholder="Усе агенцыі"
        />
      </Section>

      {/* БРЭНД (Дынамічны) */}
      <Section>
        <MultiSelect
          label="Брэнд / Завод"
          options={brands}
          selected={draft.brand}
          onChange={(v) => updateField("brand", v)}
          placeholder="Усе брэнды"
        />
      </Section>
    </div>
  );
}
