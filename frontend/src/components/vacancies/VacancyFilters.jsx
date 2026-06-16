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
  locations = [],
  voivodeships = [],
  nuances = [],
  vacancies = [], // 👈 Прымаем прамы масіў vacancies з бацькоўскага кампанента
}) {
  const draft = filters || EMPTY_FILTERS;

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
      {/* АБРАНАЕ */}
      <Section>
        <button
          onClick={() => updateField("isFavorite", !draft.isFavorite)}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-bold text-sm ${
            draft.isFavorite
              ? "bg-amber-50 border-amber-200 text-amber-600 shadow-sm"
              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
          }`}
        >
          {draft.isFavorite ? "★ ТІЛЬКИ ОБРАНІ" : "☆ ПОКАЗАТИ ВСІ"}
        </button>
      </Section>
      {/* ПОШУК */}
      <Section>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
          Пошук
        </label>
        <input
          type="text"
          value={draft.search || ""}
          onChange={(e) => setFilters({ ...draft, search: e.target.value })}
          placeholder="Назва, опис..."
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-base text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
        />
      </Section>
      {/* СТАТУС */}
      <Section>
        <MultiSelect
          label="Статус"
          options={getSmartOptions(MD.STATUSES, "status", true)} // 👈 Заменена
          selected={draft.status}
          onChange={(v) => updateField("status", v)}
          placeholder="Будь-який status"
        />
      </Section>
      {/* ДЫЯПАЗОН ДАТ */}
      <Section>
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-1.5 ml-1">
            📆 Період оновлення (З / ПО)
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={draft.startDate || ""}
              onChange={(e) => updateField("startDate", e.target.value)}
              className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:border-emerald-500 transition-all"
              style={{ colorScheme: "dark" }}
            />
            <input
              type="date"
              value={draft.endDate || ""}
              onChange={(e) => updateField("endDate", e.target.value)}
              className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:border-emerald-500 transition-all"
              style={{ colorScheme: "dark" }}
            />
          </div>
        </div>
      </Section>
      {/* КАТЕГОРІЯ */}
      <Section>
        <MultiSelect
          label="Категорія"
          options={getSmartOptions(MD.CATEGORIES, "category", true)} // 👈 Заменена
          selected={draft.category}
          onChange={(v) => updateField("category", v)}
          placeholder="Усі категорії"
        />
      </Section>
      {/* РЕГІОН (Воєводство) */}
      <Section>
        <MultiSelect
          label="Регіон (Воєводство)"
          options={getSmartOptions(voivodeships, "voivodeship")} // 👈 Заменена
          selected={draft.voivodeship}
          onChange={(v) => updateField("voivodeship", v)}
          placeholder="Усі регіони"
        />
      </Section>
      {/* МІСТО */}
      <Section>
        <MultiSelect
          label="Місто"
          options={getSmartOptions(locations, "location")} // 👈 Заменена
          selected={draft.location}
          onChange={(v) => updateField("location", v)}
          placeholder="Усі міста"
        />
      </Section>
      
      {/* ЗАРПЛАТА */}
      <Section>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
          Зарплата (Netto)
        </label>
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
      </Section>
      {/* ТИП ДОГОВОРУ */} 
      <Section>
        <MultiSelect
          label="Тип договору"
          options={getSmartOptions(MD.CONTRACT_TYPES, "contractType", true)}
          selected={draft.contractType}
          onChange={(v) => updateField("contractType", v)}
          placeholder="Будь-який договір"
        />
      </Section>
      {/* ГОДИНИ НА МІСЯЦЬ */} 
      <Section>
        <MultiSelect
          label="Години на місяць"
          options={getSmartOptions(MD.HOURS_RANGE_OPTIONS, "hoursRange", true)}
          selected={draft.hoursRange}
          onChange={(v) => updateField("hoursRange", v)}
          placeholder="Будь-яка кількість"
        />
      </Section>
      {/* ЖИТЛО */}
      <Section>
        <MultiSelect
          label="Житло"
          options={getSmartOptions(
            MD.ACCOMMODATION_OPTIONS,
            "accommodation",
            true,
          )} // 👈 Оновлено
          selected={draft.accommodation}
          onChange={(v) => updateField("accommodation", v)}
          placeholder="Будь-які умови"
        />
      </Section>
      {/* ДОВІЗ */}
      <Section>
        <MultiSelect
          label="Довіз до роботи"
          options={getSmartOptions(MD.TRANSPORT_OPTIONS, "transport", true)} // 👈 Оновлено
          selected={draft.transport}
          onChange={(v) => updateField("transport", v)}
          placeholder="Не важливо"
        />
      </Section>
      {/* ХТО ЇДЕ */}
      <Section>
        <MultiSelect
          label="Хто їде"
          options={getSmartOptions(MD.GENDERS, "gender", true)} // 👈 Оновлено
          selected={draft.gender}
          onChange={(v) => updateField("gender", v)}
          placeholder="Будь-хто"
        />
      </Section>
      {/* ВІК */}
      <Section>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
          Вік (до)
        </label>
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
      </Section>
      {/* МОВА */}
      <Section>
        <MultiSelect
          label="Рівень польської"
          options={getSmartOptions(MD.LANGUAGES, "language", true)} // 👈 Оновлено
          selected={draft.language}
          onChange={(v) => updateField("language", v)}
          placeholder="Будь-який рівень"
        />
      </Section>
      {/* НАЦІОНАЛЬНІСТЬ */}
      <Section>
        <MultiSelect
          label="Національність"
          options={getSmartOptions(MD.NATIONALITIES, "nationality", true)} // 👈 Оновлено
          selected={draft.nationality}
          onChange={(v) => updateField("nationality", v)}
          placeholder="Усі нації"
        />
      </Section>
      {/* ДОКУМЕНТИ */}
      <Section>
        <MultiSelect
          label="Документи"
          options={getSmartOptions(MD.DOCS, "docs", true)} // 👈 Оновлено (масив рядків/об'єктів у базі перевіряється як елемент)
          selected={draft.docs}
          onChange={(v) => updateField("docs", v)}
          placeholder="Будь-які документи"
        />
      </Section>
      {/* ОСОБЛИВОСТІ (ЧЕК-ЛИСТ) */}
      <Section>
        <MultiSelect
          label="Особливості (Чек-лист)"
          options={getSmartOptions(mappedNuances, "nuances", true)} // 👈 Заменена
          selected={draft.nuances}
          onChange={(v) => updateField("nuances", v)}
          placeholder="Вибрати нюанси..."
        />
      </Section>
      {/* АГЕНЦІЯ */}
      <Section>
        <MultiSelect
          label="Агенція"
          options={getSmartOptions(agencies, "agencyName")} // 👈 Заменена
          selected={draft.agencyName}
          onChange={(v) => updateField("agencyName", v)}
          placeholder="Усі агенції"
        />
      </Section>
      {/* БРЕНД */}
      <Section>
        <MultiSelect
          label="Бренд"
          options={getSmartOptions(brands, "brand")} // 👈 Заменена
          selected={draft.brand}
          onChange={(v) => updateField("brand", v)}
          placeholder="Усі бренди"
        />
      </Section>
      {/* КРЫНІЦЫ (v4.5 - 4 кнопкі ў 2 калонкі) */}
      <Section>
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-1.5 ml-1">
            🌐 Джерело вакансії
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "viber", label: "📱 Viber" },
              { id: "telegram", label: "✈️ Telegram" },
              { id: "spreadsheet", label: "📊 Таблиця" },
              { id: "trello", label: "🔵 Trello" }, // 👈 ДАДАДЗЕНА
              { id: "airtable", label: "🗄️ Airtable" }, // 👈 ДАДАДЗЕНА
              { id: "manual", label: "📝 Ручне" },
            ].map((src) => {
              const isSelected = draft.sourceType?.includes(src.id);
              // Падлік: калі sourceType няма, лічым як manual
              const count = vacancies.filter(
                (v) => (v.sourceType || "manual") === src.id,
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
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md ${isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"}`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </Section>
      
    </div>
  );
}
