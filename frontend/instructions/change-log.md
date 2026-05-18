import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
getVacancies,
getTemplates,
deleteVacancy,
createVacancyAuto,
createVacancyFromTemplate,
} from "../services/api";
import EditVacancyModal from "../components/vacancies/EditVacancyModal";
import ApplyModal from "../components/vacancies/ApplyModal";
import VacancyMatchModal from "../components/vacancies/VacancyMatchModal";
import VacancyViewModal from "../components/vacancies/VacancyViewModal";
import VacancyFilters from "../components/vacancies/VacancyFilters";
import { EMPTY_FILTERS } from "../constants/filters";

const STATUS_COLORS = {
active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
closed: "bg-red-500/10 text-red-400 border border-red-500/20",
archived: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
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

    // --- 3. Ваяводства / Рэгіён (ФІКС: Еўропа) ---
    if (filters.voivodeship?.length > 0) {
      const vVoiv = v.voivodeship;
      const isEurope =
        (v.country && v.country !== "Polska") ||
        vVoiv === "Європа (інші країни)";
      const currentRegion = isEurope ? "Європа (інші країни)" : vVoiv;

      if (!filters.voivodeship.includes(currentRegion)) return false;
    }

    // --- 4. Лакацыя ---
    if (filters.location?.length > 0) {
      const vLoc =
        v.country && v.country !== "Polska"
          ? `${v.location} (${v.country})`
          : v.location;
      if (!filters.location.includes(vLoc)) return false;
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
      const vGender = v.gender; // Новае поле з v2.2
      if (!filters.gender.includes(vGender)) return false;
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
    if (filters.brand?.length > 0 && !filters.brand.includes(v.brand))
      return false;

    return true;

});
}

export default function Vacancies() {
const location = useLocation(); // Дадалі
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

const [draft, setDraft] = useState(EMPTY_FILTERS);
const [applied, setApplied] = useState(EMPTY_FILTERS);
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

const fetchVacancies = async () => {
try {
const res = await getVacancies();
setVacancies(res.data);
} catch {
console.error("Памылка загрузкі вакансій");
} finally {
setLoading(false);
}
};
// Дадай гэта пасля fetchVacancies
useEffect(() => {
// Калі ўсе фільтры пустыя (скінуты), аўтаматычна прымяняем іх
if (JSON.stringify(draft) === JSON.stringify(EMPTY_FILTERS)) {
setApplied(EMPTY_FILTERS);
}
}, [draft]);
useEffect(() => {
fetchVacancies();
}, []);

useEffect(() => {
if (showAutoForm && formMode === "template" && templates.length === 0) {
setTemplatesLoading(true);
getTemplates()
.then((res) => setTemplates(res.data))
.catch(() => console.error("Памылка загрузкі шаблонаў"))
.finally(() => setTemplatesLoading(false));
}
}, [showAutoForm, formMode, templates.length]);

// Абноўлены dynamicData
const dynamicData = useMemo(() => {
const agencies = new Set();
const brands = new Set();
const locations = new Set();
const voivodeships = new Set();
const nuances = new Set();

    vacancies.forEach((v) => {
      if (v.agencyName) agencies.add(v.agencyName);
      if (v.brand) brands.add(v.brand);

      // Геаграфія (Разумны збор)
      const isEurope =
        (v.country && v.country !== "Polska") ||
        v.voivodeship === "Європа (інші країни)";

      if (isEurope) {
        voivodeships.add("Європа (інші країни)");
        const locName =
          v.country && v.country !== "Polska"
            ? `${v.location} (${v.country})`
            : v.location;
        locations.add(locName);
      } else {
        if (v.voivodeship) voivodeships.add(v.voivodeship);
        if (v.location) locations.add(v.location);
      }

      // Нюанси (Збираємо категорії для фільтра v2.2)
      if (v.conditions?.specificNuances) {
        v.conditions.specificNuances.forEach((n) => {
          // Бярэм катэгорыю з аб'екта (v2.2) або выкарыстоўваем радок (legacy)
          const category = typeof n === "object" && n !== null ? n.category : n;
          if (category) nuances.add(category);
        });
      }
    });

    return {
      agencies: Array.from(agencies).sort(),
      brands: Array.from(brands).sort(),
      locations: Array.from(locations).sort(),
      voivodeships: Array.from(voivodeships).sort(),
      nuances: Array.from(nuances).sort(),
    };

}, [vacancies]);

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

const previewCount = useMemo(
() => applyFilters(vacancies, draft).length,
[vacancies, draft],
);
const filtered = useMemo(
() => applyFilters(vacancies, applied),
[vacancies, applied],
);
const isDirty = JSON.stringify(draft) !== JSON.stringify(applied);

const handleApplyFilters = () => {
setApplied(draft);
setSidebarOpen(false);
};

const handleDelete = async (id) => {
if (!confirm("Видалити вакансію?")) return;
try {
await deleteVacancy(id);
setVacancies((prev) => prev.filter((v) => v.\_id !== id));
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
selectedTemplate.\_id,
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

const handleCloseForm = () => {
setShowAutoForm(false);
setAutoText("");
setSelectedTemplate(null);
setFormMode("auto");
};

const handleSaveEdit = (updated) => {
setVacancies((prev) =>
prev.map((v) => (v.\_id === updated.\_id ? updated : v)),
);
};

return (

<div className="flex min-h-screen bg-slate-950">
{/_ САЙДБАР _/}
<aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-slate-800 bg-slate-900/50 sticky top-16 h-[calc(100vh-4rem)]">
<VacancyFilters
          filters={draft}
          setFilters={setDraft}
          agencies={dynamicData.agencies}
          brands={dynamicData.brands}
          locations={dynamicData.locations}
          voivodeships={dynamicData.voivodeships}
          nuances={dynamicData.nuances}
        />
</aside>

      {/* МАБІЛЬНЫ САЙДБАР */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <VacancyFilters
                filters={draft}
                setFilters={setDraft}
                agencies={dynamicData.agencies}
                brands={dynamicData.brands}
                locations={dynamicData.locations}
                voivodeships={dynamicData.voivodeships}
                nuances={dynamicData.nuances}
              />
            </div>
            <div className="p-4 border-t border-slate-800">
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
              className="lg:hidden px-3 py-2 bg-slate-800 text-slate-300 rounded-lg"
            >
              ⚙️ Фільтри {isDirty && "●"}
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-slate-100">
                Вакансії
              </h1>
              <p className="text-sm text-slate-500">
                {filtered.length} з {vacancies.length}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAutoForm(!showAutoForm)}
            className="px-4 py-2 bg-emerald-500 text-slate-900 font-medium rounded-lg"
          >
            ＋ Додати
          </button>
        </div>

        {/* ФОРМА ДАДАВАННЯ */}
        {showAutoForm && (
          <div className="mb-6 bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex gap-2 mb-4">
              {["auto", "template"].map((m) => (
                <button
                  key={m}
                  onClick={() => setFormMode(m)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${formMode === m ? "bg-emerald-500 text-slate-900" : "bg-slate-800 text-slate-400"}`}
                >
                  {m === "auto" ? "🤖 Авто (AI)" : "📋 З шаблона"}
                </button>
              ))}
            </div>

            {formMode === "template" && (
              <div className="mb-4 space-y-3">
                <input
                  type="text"
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  placeholder="Пошук шаблона..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
                />
                {templateSearch && (
                  <div className="max-h-48 overflow-y-auto border border-slate-800 rounded-lg p-1">
                    {filteredTemplates.map((t) => (
                      <button
                        key={t._id}
                        onClick={() => setSelectedTemplate(t)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${selectedTemplate?._id === t._id ? "bg-emerald-500/10 text-emerald-400" : "text-slate-300 hover:bg-slate-800"}`}
                      >
                        {t.templateName} ({t.agencyName})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <textarea
              value={autoText}
              onChange={(e) => setAutoText(e.target.value)}
              placeholder="Вставте текст вакансії..."
              rows={4}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-100 resize-none"
            />

            <div className="flex gap-3 mt-3">
              <button
                onClick={
                  formMode === "template"
                    ? handleTemplateCreate
                    : handleAutoCreate
                }
                disabled={autoLoading || !autoText.trim()}
                className="px-4 py-2 bg-emerald-500 text-slate-900 font-medium rounded-lg disabled:opacity-50"
              >
                {autoLoading ? "Обробка..." : "Обробити та додати"}
              </button>
              <button
                onClick={handleCloseForm}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
              >
                Скасувати
              </button>
            </div>
          </div>
        )}

        {/* СПІС ВАКАНСІЙ */}
        <div className="space-y-3">
          {filtered.map((v) => {
            // Лакацыя заўжды з краінай калі не Польшча
            const locationDisplay =
              v.country && v.country !== "Polska"
                ? `${v.location} (${v.country})`
                : v.location;

            return (
              <div
                key={v._id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* РАДОК 1: код + статус + катэгорыя */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {/* ID + Truncated */}
                      <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded flex items-center gap-1">
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

                      {/* Статус */}
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[v.status]}`}
                      >
                        {STATUS_LABELS[v.status]}
                      </span>

                      {/* Агенція (Перанесены знізу) */}
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded">
                        🏢 {v.agencyName}
                      </span>

                      {/* Брэнд */}
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

                      {/* Локація + Воєводство (Перанесены знізу) */}
                      <span className="text-[10px] font-bold bg-slate-800 text-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
                        📍 {locationDisplay}{" "}
                        {v.voivodeship && (
                          <span className="text-slate-500 ml-1">
                            ({v.voivodeship})
                          </span>
                        )}
                      </span>

                      {/* Дата створення */}
                      <span className="text-[10px] text-slate-600 ml-auto font-mono">
                        {new Date(v.createdAt).toLocaleDateString("uk-UA")}
                      </span>
                    </div>

                    {/* ЗАГАЛОВАК */}
                    <h3 className="font-semibold text-slate-100 leading-snug mb-2">
                      {v.vacancydescription || v.templateName}
                    </h3>

                    {/* РАДОК 2: ГЕНДАР + жытло + зарплата */}
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500 items-center">
                      {/* ГЕНДАР / НАБОР */}
                      <span className="flex items-center gap-1 text-slate-300">
                        👥{" "}
                        {v.requirements?.genderDescription ||
                          (Array.isArray(v.requirements?.gender)
                            ? v.requirements.gender.join(", ")
                            : v.requirements?.gender)}
                      </span>

                      {/* ЖЫТЛО */}
                      <span className="flex items-center gap-1">
                        🏠 {v.accommodation?.type || "—"}
                      </span>

                      {/* ЗАРПЛАТА */}
                      {v.salary?.baseNetto && (
                        <span className="text-slate-200 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          💰 {v.salary.baseNetto}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* ХМАРА ТЕГІВ v2.2 */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-800/50">
                    {/* ЖИТЛО */}
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-tighter ${v.accommodation?.type?.includes("власн") || v.accommodation?.type?.includes("не надаєт") ? "bg-red-500/5 text-red-400/70 border-red-500/10" : "bg-orange-500/10 text-orange-400 border-orange-500/20"}`}
                    >
                      🏠 {v.accommodation?.type || "Житло не вказано"}
                      {v.accommodation?.forCouples && " + 👫"}
                    </span>

                    {/* ДОВІЗ */}
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-tighter ${v.transport?.provided ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : "bg-slate-800 text-slate-500 border-slate-700"}`}
                    >
                      🚌 {v.transport?.provided ? "Є довіз" : "Немає довозу"}
                    </span>

                    {/* МОВА */}
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold uppercase tracking-tighter">
                      🗣️ {v.requirements?.polishLanguageLevel || "Любий рівень"}
                    </span>

                    {/* НАЦІОНАЛЬНІСТЬ */}
                    {v.requirements?.nationalities?.length > 0 && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase tracking-tighter">
                        🌍 {v.requirements.nationalities.join("/")}
                      </span>
                    )}

                    {/* ДОКУМЕНТИ */}
                    {v.requirements?.standardDocs?.length > 0 && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold uppercase tracking-tighter">
                        📄 {v.requirements.standardDocs.join(" / ")}
                      </span>
                    )}

                    {/* ОСОБЛИВОСТІ (Тільки категорії нюансів) */}
                    {v.conditions?.specificNuances?.map((n, idx) => {
                      const category =
                        typeof n === "object" && n !== null ? n.category : n;
                      // Вызначаем іконку для папулярных катэгорый
                      const icons = {
                        temperature: "🌡️",
                        physical_load: "🏋️",
                        noise: "📢",
                        norms: "📈",
                      };
                      const icon = icons[category] || "✨";

                      return (
                        <span
                          key={idx}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/5 text-amber-500/80 border border-amber-500/10 font-bold uppercase tracking-tighter"
                        >
                          {icon} {category}
                        </span>
                      );
                    })}
                  </div>
                  {/* КНОПКІ */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => setViewVacancy(v)}
                      className="px-3 py-1.5 text-slate-400 hover:bg-slate-800 rounded-lg text-xs transition-colors"
                    >
                      👁 Переглянути
                    </button>
                    <button
                      onClick={() => setMatchVacancy(v)}
                      className="px-3 py-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg text-xs transition-colors"
                    >
                      🎯 Кандидати
                    </button>
                    <button
                      onClick={() => setEditVacancy(v)}
                      className="px-3 py-1.5 text-slate-400 hover:bg-slate-800 rounded-lg text-xs transition-colors"
                    >
                      ✏️ Ред.
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ПЛАВАЮЧАЯ КНОПКА */}
      {isDirty && (
        <div className="hidden lg:block fixed bottom-6 right-6 z-30">
          <button
            onClick={handleApplyFilters}
            className="px-5 py-3 bg-emerald-500 text-slate-900 font-bold rounded-xl shadow-lg"
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
      {viewVacancy && (
        <VacancyViewModal
          vacancy={viewVacancy}
          onClose={() => setViewVacancy(null)}
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
      )}
    </div>

);
}

---

//Layout.jsx
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

// Функцыя загрузкі статыстыкі
const fetchUnread = useCallback(async () => {
try {
const res = await getInboxStats();
setUnreadCount(res.data.total || 0);
} catch (err) {
console.error("Error fetching stats:", err);
}
}, []);

useEffect(() => {
// Выкарыстоўваем setTimeout, каб пазбегнуць памылкі "cascading renders"
// Гэта робіць выклік асінхронным адносна цела эфекту
const timeoutId = setTimeout(() => {
fetchUnread();
}, 0);

    // Слухаем падзею абнаўлення інбокса
    const handleUpdate = () => fetchUnread();
    window.addEventListener("inboxUpdated", handleUpdate);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("inboxUpdated", handleUpdate);
    };

}, [fetchUnread]);

return (

<div className="min-h-screen bg-slate-950 text-slate-100 font-['IBM_Plex_Sans']">
<header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex items-center justify-between h-16">
<Link to="/" className="flex items-center gap-3 shrink-0">
<div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-900 font-bold text-sm">
RC
</div>
<span className="font-semibold text-slate-100 hidden sm:block">
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
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-2 ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                    }`
                  }
                >
                  {item.label}
                  {item.to === "/inbox" && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
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
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>
                )}
              </div>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900">
            <nav className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "text-slate-400 hover:bg-slate-800"
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

---

import React, { useState } from "react";
import { Copy, Check, X, Factory, Tag } from "lucide-react";

// Два памеры: загалоўкі (SectionTitle) і апісальны тэкст (Note)
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

// Апісальны радок — курсіў, меньшы
const Note = ({ children }) =>
children ? (

<p className="text-xs text-slate-400 italic mt-1 leading-relaxed">
{children}
</p>
) : null;

// Звычайны радок значэння
const Row = ({ label, value }) =>
value ? (

<p className="text-sm text-slate-200 leading-snug">
• <span className="font-semibold text-slate-300">{label}:</span>{" "}
<span>{value}</span>
</p>
) : null;

export default function VacancyViewModal({
vacancy,
onClose,
onEdit,
onDelete,
onMatch,
}) {
const [copied, setCopied] = useState(false);
if (!vacancy) return null;
const v = vacancy;

const handleCopyTelegram = () => {
navigator.clipboard.writeText(v.telegramPost || "");
setCopied(true);
setTimeout(() => setCopied(false), 2000);
};

// Лакацыя з краінай (калі не Польшча)
const locationDisplay =
v.country && v.country !== "Polska"
? `${v.location} (${v.country})`
: v.location;

return (

<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
<div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar">
        {/* ШАПКА */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
              {v.vacancyCode}
            </span>
            {v.status && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold border uppercase tracking-wider ${
                  v.status === "active"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : v.status === "closed"
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                }`}
              >
                {v.status === "active"
                  ? "Активна"
                  : v.status === "closed"
                    ? "Закрита"
                    : "Архів"}
              </span>
            )}
            {/* КАТЭГОРЫЯ */}
            {v.category && (
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-bold border border-blue-500/20 uppercase tracking-wider">
                <Tag size={9} className="inline mr-1" />
                {v.category}
              </span>
            )}
            {/* БРЭНД — зверху, побач з катэгорыяй */}
            {v.brand && (
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/20 uppercase tracking-wider">
                <Factory size={9} className="inline mr-1" />
                {v.brand}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyTelegram}
              className="p-2 text-slate-400 hover:text-emerald-400 transition-all"
              title="Капіяваць пост"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="px-8 py-6 space-y-7">
          {/* ГАЛОЎНЫ ЗАГАЛОВАК */}
          <div>
            <h2 className="text-xl font-black text-white leading-tight mb-3">
              {v.vacancydescription}
            </h2>
            <div className="space-y-1">
              {/* ЛАКАЦЫЯ ЗАЎЖДЫ З КРАІНАЙ (калі не Польшча) */}
              <p className="text-base text-slate-200">
                📍 <span className="font-semibold">Місто:</span>{" "}
                <span className="text-white font-bold">{locationDisplay}</span>
              </p>
              {v.checkInCity && (
                <p className="text-sm text-slate-300">
                  🏢 <span className="font-semibold">Оформлення:</span> м.{" "}
                  {v.checkInCity}
                </p>
              )}
              <p className="text-sm text-slate-300">
                👥 <span className="font-semibold">Набір:</span>{" "}
                <span className="text-white">
                  {v.gender ||
                    (Array.isArray(v.requirements?.gender)
                      ? v.requirements.gender.join(", ")
                      : v.requirements?.gender)}
                </span>
                {v.requirements?.genderDescription && (
                  <span className="text-slate-400 ml-1 italic">
                    ({v.requirements.genderDescription})
                  </span>
                )}
                {v.arrivalDate && (
                  <span className="text-emerald-400">
                    , приїзд {v.arrivalDate}
                  </span>
                )}
              </p>
              {v.count && (
                <p className="text-sm text-slate-300">
                  🔢 <span className="font-semibold">Кількість:</span> {v.count}
                </p>
              )}
            </div>
          </div>

          {/* АПЛАТА */}
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
                <p className="text-sm text-emerald-400 mt-2 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                  🎁 {v.salary.bonusDetails}
                </p>
              )}
              <Note>{v.salary?.salaryNotes}</Note>
            </div>
          </section>

          {/* АБАВЯЗКІ */}
          <section>
            <SectionTitle
              icon="🛠"
              label="Характер роботи"
              color="text-blue-400"
              border="border-blue-500/20"
            />
            <div className="space-y-1.5">
              {v.description?.split(/[;]/).map(
                (item, i) =>
                  item.trim() && (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5 shrink-0">•</span>
                      <span className="text-sm text-slate-200 leading-snug">
                        {item.trim()}
                      </span>
                    </div>
                  ),
              )}
            </div>
          </section>

          {/* ПАТРАБАВАННІ */}
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
              {v.requirements?.nationalities?.length > 0 && (
                <Row
                  label="Національність"
                  value={v.requirements.nationalities.join(", ")}
                />
              )}
              <Row
                label="Документи"
                value={v.requirements?.standardDocs?.join(", ")}
              />
              {v.requirements?.additionalDocsDetails && (
                <Note>Додатково: {v.requirements.additionalDocsDetails}</Note>
              )}
              <Row label="Мова" value={v.requirements?.polishLanguageLevel} />
              {v.requirements?.physicalLoad === true && (
                <p className="text-sm text-red-400 font-bold flex items-center gap-2">
                  ⚡ Фізично важка праця
                </p>
              )}
            </div>
          </section>

          {/* ГРАФІК І ДАГАВОР */}
          <section>
            <SectionTitle
              icon="🕒"
              label="Графік та договір"
              color="text-purple-400"
              border="border-purple-500/20"
            />
            <div className="space-y-1.5">
              {v.schedule?.description && (
                <p className="text-sm text-slate-200 leading-relaxed">
                  {v.schedule.description}
                </p>
              )}
              <Row label="Робочі дні" value={v.schedule?.workDaysWeek} />
              <Row label="Перерва" value={v.schedule?.breakDuration} />
              {v.contractType && (
                <p className="mt-2 text-sm text-blue-400 font-bold">
                  📄 Тип договору: {v.contractType}
                </p>
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
                  <p className="text-sm text-slate-200 font-semibold">
                    {v.accommodation.type}
                  </p>
                ) : (
                  <p className="text-sm text-slate-500 italic">Не вказано</p>
                )}
                {v.accommodation?.withChildren && (
                  <p className="text-xs text-emerald-400">✓ Можна з дітьми</p>
                )}
                {v.accommodation?.withPets && (
                  <p className="text-xs text-emerald-400">
                    ✓ Можна з тваринами
                  </p>
                )}
                <Note>{v.accommodation?.details}</Note>
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
                <p className="text-sm text-slate-200 font-semibold">
                  {v.transport?.provided ? "Надається" : "Власний"}
                </p>
                {v.transport?.costRaw && (
                  <p className="text-sm text-cyan-300">{v.transport.costRaw}</p>
                )}
                <Note>{v.transport?.details}</Note>
              </div>
            </div>
          </section>

          {/* УМОВЫ ПРАЦЫ */}
          <section>
            <SectionTitle
              icon="🌡"
              label="Умови праці"
              color="text-rose-400"
              border="border-rose-500/20"
            />
            <div className="space-y-1.5">
              <Row
                label="Робочий одяг"
                value={
                  v.conditions?.workwearFree
                    ? "Безкоштовно"
                    : "За рахунок працівника"
                }
              />
              <Row label="Харчування" value={v.conditions?.foodType} />
              <Note>{v.conditions?.foodDetails}</Note>

              {/* НЮАНСЫ — каляровыя тэгі v2.1 */}
              {v.conditions?.specificNuances?.length > 0 && (
                <div className="flex flex-col gap-2 mt-3">
                  {v.conditions.specificNuances.map((n, idx) => {
                    const text = typeof n === "object" ? n.text : n;
                    const category =
                      typeof n === "object" ? n.category : "Інше";
                    const isUrgent =
                      category === "temperature" ||
                      category === "physical_load";

                    return (
                      <div
                        key={idx}
                        className={`px-3 py-2 rounded-lg text-xs border flex flex-col gap-0.5 ${isUrgent ? "bg-red-500/5 text-red-400 border-red-500/10" : "bg-slate-800/50 text-slate-300 border-slate-700"}`}
                      >
                        <span className="text-[10px] font-bold uppercase opacity-50 tracking-wider">
                          {category}
                        </span>
                        <span className="font-medium">{text}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              <Note>{v.conditions?.specificConditionsDetails}</Note>
            </div>
          </section>

          {/* ВЫДАТКІ І КАМПЕНСАЦЫІ */}
          {(v.startExpenses?.hasStartExpenses ||
            v.earlyTerminationLiability?.hasLiability ||
            v.employerCompensations?.hasCompensations) && (
            <section className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 space-y-3">
              {v.startExpenses?.hasStartExpenses && v.startExpenses.details && (
                <div>
                  <p className="text-xs font-bold text-orange-400 uppercase mb-1">
                    💸 Витрати на старті
                  </p>
                  <p className="text-sm text-slate-300">
                    {v.startExpenses.details}
                  </p>
                </div>
              )}
              {v.earlyTerminationLiability?.hasLiability &&
                v.earlyTerminationLiability.details && (
                  <div>
                    <p className="text-xs font-bold text-red-400 uppercase mb-1">
                      ⚠️ При достроковому звільненні
                    </p>
                    <p className="text-sm text-slate-300">
                      {v.earlyTerminationLiability.details}
                    </p>
                  </div>
                )}
              {v.employerCompensations?.hasCompensations &&
                v.employerCompensations.details && (
                  <div>
                    <p className="text-xs font-bold text-emerald-400 uppercase mb-1">
                      🎁 Компенсації
                    </p>
                    <p className="text-sm text-slate-300">
                      {v.employerCompensations.details}
                    </p>
                  </div>
                )}
            </section>
          )}

          {/* ДАДАТКОВАЯ ІНФАРМАЦЫЯ */}
          {v.additionalNotes && (
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-2">
                📝 Додаткова інформація
              </p>
              <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {v.additionalNotes}
              </p>
            </div>
          )}

          {/* КРЫНІЦА */}
          <section className="mt-6 pt-6 border-t border-slate-800 space-y-4">
            {v.isTruncated && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400 text-xs font-bold flex items-center gap-2">
                ⚠️ Увага: Гэтая вакансія створана з абрэзанага паведамлення.
              </div>
            )}
            <details className="group">
              <summary className="text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-300 transition-colors list-none flex items-center gap-2">
                <span className="group-open:rotate-90 transition-transform inline-block">
                  ▶
                </span>
                Тэкст паведамлення (Пераклад)
              </summary>
              <div className="mt-4 p-4 bg-black/40 rounded-xl border border-slate-800 text-[12px] text-slate-400 font-mono leading-relaxed whitespace-pre-wrap">
                {v.rawText || "Тэкст адсутнічае"}
              </div>
            </details>
          </section>

          {/* МЕТА */}
          <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-600">
            <span>ID: {v._id}</span>
            <span>
              СТВОРЕНО: {new Date(v.createdAt).toLocaleString("uk-UA")}
            </span>
          </div>
        </div>

        {/* КНОПКІ ДЗЕЯННЯЎ */}
        <div className="flex flex-wrap gap-3 px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900 z-10">
          <button
            onClick={() => onMatch(v)}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-sm rounded-xl transition-all"
          >
            🎯 Кандыдаты
          </button>
          <button
            onClick={() => onEdit(v)}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl border border-slate-700 transition-all"
          >
            ✏️ Рэдагаваць
          </button>
          <button
            onClick={() => onDelete(v._id)}
            className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-semibold rounded-xl border border-red-500/20 ml-auto transition-all"
          >
            🗑 Выдаліць
          </button>
        </div>
      </div>
    </div>

);
}

---

// frontend/src/components/vacancies/VacancyMatchModal.jsx
import { useEffect, useState } from "react";
import { matchCandidatesForVacancy } from "../../services/api";

const STATUS_COLORS = {
new: "bg-blue-500/10 text-blue-400",
active: "bg-emerald-500/10 text-emerald-400",
waiting: "bg-yellow-500/10 text-yellow-400",
employed: "bg-purple-500/10 text-purple-400",
left: "bg-slate-500/10 text-slate-400",
blacklist: "bg-red-500/10 text-red-400",
};

const STATUS_LABELS = {
new: "Новы",
active: "Актыўны",
waiting: "Чакае",
employed: "Працуе",
left: "Сышоў",
blacklist: "Блэкліст",
};

export default function VacancyMatchModal({ vacancy, onClose }) {
const [candidates, setCandidates] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
const load = async () => {
try {
const res = await matchCandidatesForVacancy(vacancy.\_id);
setCandidates(res.data);
} catch {
console.error("Памылка матчынгу");
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
<div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
{/_ Загаловак _/}
<div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
<div>
<h2 className="font-semibold text-slate-100">
🎯 Падыходзячыя кандыдаты
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
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
✕
</button>
</div>

        {/* Змест */}
        <div className="px-6 py-5">
          {loading ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              Пошук кандыдатаў...
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-8 text-slate-600">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-sm">Падыходзячых кандыдатаў не знойдзена</p>
              <p className="text-xs text-slate-700 mt-1">
                Упэўніцеся што ў базе ёсць кандыдаты са статусамі
                new/active/waiting
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-500 mb-4">
                Знойдзена {candidates.length} кандыдатаў
              </p>
              <div className="space-y-3">
                {candidates.map((c) => (
                  <div
                    key={c._id}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-100 text-sm">
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
                          {c.age && <span>🎂 {c.age} г.</span>}
                          {c.gender && (
                            <span>{c.gender === "female" ? "👩" : "👨"}</span>
                          )}
                        </div>

                        {/* Пажаданні */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {c.jobPreferences?.locationFlexible && (
                            <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded">
                              🗺 Гатовы да пераезду
                            </span>
                          )}
                          {c.jobPreferences?.needsAccommodation && (
                            <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded">
                              🏠 Патрэбна жытло
                            </span>
                          )}
                          {c.jobPreferences?.readyDate && (
                            <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded">
                              📅 Гатовы з: {c.jobPreferences.readyDate}
                            </span>
                          )}
                        </div>

                        {/* Дакументы */}
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
                                  : "bg-slate-700 text-slate-600"
                              }`}
                            >
                              {has ? "✅" : "❌"} {label}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Score */}
                      <div className="shrink-0 text-center">
                        <div className="text-lg font-bold text-emerald-400">
                          {c.matchScore}
                        </div>
                        <div className="text-xs text-slate-600">балаў</div>
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

---

// frontend/src/components/vacancies/VacancyFilters.jsx
import { EMPTY_FILTERS } from "../../constants/filters";
import \* as MD from "../../constants/masterData";
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
}) {
const draft = filters || EMPTY_FILTERS;

const updateField = (key, val) => {
setFilters({ ...draft, [key]: val });
};

// Підрахунок активних фільтрів (крім пошуку)
const activeCount = Object.entries(draft).reduce((acc, [key, val]) => {
if (key === "search") return acc;
if (Array.isArray(val) && val.length > 0) return acc + 1;
return acc;
}, 0);

return (

<div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 h-full overflow-y-auto custom-scrollbar">
<div className="flex items-center justify-between mb-6">
<h3 className="text-lg font-black text-emerald-400 tracking-tight italic">
ФІЛЬТРИ
</h3>
{activeCount > 0 && (
<button
onClick={() => setFilters(EMPTY_FILTERS)}
className="text-[10px] font-bold text-slate-500 hover:text-red-400 transition-colors uppercase" >
Скинути ({activeCount})
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
          placeholder="Назва, опис..."
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
          placeholder="Усі статуси"
        />
      </Section>

      {/* КАТЕГОРІЯ */}
      <Section>
        <MultiSelect
          label="Категорія"
          options={MD.CATEGORIES}
          selected={draft.category}
          onChange={(v) => updateField("category", v)}
          placeholder="Усі категорії"
        />
      </Section>

      {/* РЕГІОН (Воєводство) */}
      <Section>
        <MultiSelect
          label="Регіон (Воєводство)"
          options={voivodeships}
          selected={draft.voivodeship}
          onChange={(v) => updateField("voivodeship", v)}
          placeholder="Усі регіони"
        />
      </Section>

      {/* МІСТО */}
      <Section>
        <MultiSelect
          label="Місто"
          options={locations}
          selected={draft.location}
          onChange={(v) => updateField("location", v)}
          placeholder="Усі міста"
        />
      </Section>

      {/* ЖИТЛО */}
      <Section>
        <MultiSelect
          label="Житло"
          options={MD.ACCOMMODATION_OPTIONS}
          selected={draft.accommodation}
          onChange={(v) => updateField("accommodation", v)}
          placeholder="Будь-які умови"
        />
      </Section>

      {/* ДОВІЗ */}
      <Section>
        <MultiSelect
          label="Довіз до роботи"
          options={MD.TRANSPORT_OPTIONS}
          selected={draft.transport}
          onChange={(v) => updateField("transport", v)}
          placeholder="Не важливо"
        />
      </Section>

      {/* ХТО ЇДЕ (Замість travelGroup выкарыстоўваем gender) */}
      <Section>
        <MultiSelect
          label="Хто їде"
          options={MD.GENDERS}
          selected={draft.gender}
          onChange={(v) => updateField("gender", v)}
          placeholder="Будь-хто"
        />
      </Section>

      {/* МОВА */}
      <Section>
        <MultiSelect
          label="Рівень польської"
          options={MD.LANGUAGES}
          selected={draft.language}
          onChange={(v) => updateField("language", v)}
          placeholder="Будь-який рівень"
        />
      </Section>

      {/* НАЦІОНАЛЬНІСТЬ */}
      <Section>
        <MultiSelect
          label="Національність"
          options={MD.NATIONALITIES}
          selected={draft.nationality}
          onChange={(v) => updateField("nationality", v)}
          placeholder="Усі нації"
        />
      </Section>

      {/* ДОКУМЕНТИ */}
      <Section>
        <MultiSelect
          label="Документи"
          options={MD.DOCS}
          selected={draft.docs}
          onChange={(v) => updateField("docs", v)}
          placeholder="Будь-які документи"
        />
      </Section>

      {/* ОСОБЛИВОСТІ (ЧЕК-ЛИСТ) */}
      <Section>
        <MultiSelect
          label="Особливості (Чек-лист)"
          options={nuances}
          selected={draft.nuances}
          onChange={(v) => updateField("nuances", v)}
          placeholder="Вибрати нюанси..."
        />
      </Section>

      {/* АГЕНЦІЯ */}
      <Section>
        <MultiSelect
          label="Агенція"
          options={agencies}
          selected={draft.agencyName}
          onChange={(v) => updateField("agencyName", v)}
          placeholder="Усі агенції"
        />
      </Section>

      {/* БРЕНД */}
      <Section>
        <MultiSelect
          label="Бренд / Завод"
          options={brands}
          selected={draft.brand}
          onChange={(v) => updateField("brand", v)}
          placeholder="Усі бренди"
        />
      </Section>
    </div>

);
}

---

import { useState } from "react";
import { updateVacancy } from "../../services/api";
import Field from "../shared/Field";
import Divider from "../shared/Divider";
import \* as MD from "../../constants/masterData";

// Эталонныя спісы — павінны супадаць з KNOWN_AGENCIES у ai.service.js
const AGENCY_OPTIONS = [
"APOLO",
"BISAR",
"EST",
"FWS",
"GLOBAL",
"INTRASERVICE",
"MANPOWER",
"MANUAL",
"MRÓWKI",
"NIDEN",
"OTTO",
"PROGRES",
"SG",
"SOLANO",
];

const CONTRACT_OPTIONS = [
{ value: "Umowa zlecenie", label: "Umowa zlecenie" },
{ value: "Umowa o pracę", label: "Umowa o pracę" },
{ value: "other", label: "Іншае (увесці ўручную)" },
];

const COUNT_OPTIONS = [
{ value: "1", label: "1 особа" },
{ value: "2", label: "Пара (2)" },
{ value: "сім'я", label: "Сім'я" },
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
ageMax: vacancy.requirements?.ageMax || "", // 🆕 Цяпер гэта радок
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

// Для поля contractType: калі значэнне не з спіса — рэжым "other"
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
// ageMax застаецца радком з стану form
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
// Шукаем, ці быў гэты тэкст у арыгінальных нюансах, каб захаваць катэгорыю
const original = vacancy.conditions?.specificNuances?.find(
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
const res = await updateVacancy(vacancy.\_id, data);
onSave(res.data);
onClose();
} catch (err) {
console.error("Save Error:", err.response?.data || err.message);
alert(
"Памылка захавання: " +
(err.response?.data?.message || "праверце палі"),
);
} finally {
setSaving(false);
}
};

// --- UI КАМПАНЕНТЫ ---

const SingleBtnGroup = ({
label,
options,
selectedValue,
onSelect,
small,
}) => (

<div className="mb-4">
{label && (
<label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
{label}
</label>
)}
<div
className={`flex flex-wrap gap-2 p-2 bg-slate-800/30 rounded-xl border border-slate-800`} >
{options.map((opt) => {
const val = opt.value ?? opt;
const lbl = opt.label ?? opt;
const isActive = selectedValue === val;
return (
<button
key={val}
type="button"
onClick={() => onSelect(val)}
className={`px-3 py-1.5 rounded-lg transition-all border font-medium ${
                small ? "text-[10px]" : "text-[11px]"
              } ${
                isActive
                  ? "bg-emerald-500 border-emerald-500 text-slate-900"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
              }`} >
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
<label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
{label}
</label>
)}
<div className="flex flex-wrap gap-2 p-2 bg-slate-800/30 rounded-xl border border-slate-800">
{options.map((opt) => {
const val = opt.value ?? opt;
const lbl = opt.label ?? opt;
const isActive = selectedValues?.includes(val);
return (
<button
key={val}
type="button"
onClick={() => onToggle(val)}
className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                isActive
                  ? "bg-emerald-500 border-emerald-500 text-slate-900"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
              }`} >
{lbl}
</button>
);
})}
</div>
</div>
);

// Dropdown для агенцыі
const AgencyDropdown = () => (

<div className="mb-0">
<label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
Агенція
</label>
<select
value={form.agencyName || "MANUAL"}
onChange={(e) => setField("agencyName", e.target.value)}
className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500" >
{AGENCY_OPTIONS.map((a) => (
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
<div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4 custom-scrollbar">
{/_ ШАПКА _/}
<div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
<div>
<h2 className="font-semibold text-slate-100">
Редагування вакансії
</h2>
<div className="flex items-center gap-3 mt-1 text-xs font-mono">
<span className="text-slate-500">{vacancy.vacancyCode}</span>
<span className="bg-slate-800 text-emerald-400 px-2 py-0.5 rounded">
{vacancy.agencyName}
</span>
</div>
</div>
<button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
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

          <Divider label="⚙️ Сістэмныя палі" />
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field
                label="Назва для адмінки"
                value={form.templateName}
                onChange={(v) => setField("templateName", v)}
              />
            </div>
            <div className="col-span-2">
              <Field
                label="Публічний заголовок"
                value={form.vacancydescription}
                onChange={(v) => setField("vacancydescription", v)}
              />
            </div>
            {/* Агенція— dropdown */}
            <AgencyDropdown />
            <div className="col-span-2">
              <Field
                label="Коментар по набору (напр. 2 пари + 1 жінка)"
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

          {/* КОЛЬКАСЦЬ — кнопкі */}
          <SingleBtnGroup
            label="Кількість / Хто їде"
            options={COUNT_OPTIONS}
            selectedValue={form.count}
            onSelect={(v) => setField("count", v)}
          />

          {/* ТЫП ДАГАВОРА — кнопкі + поле для custom */}
          <div className="mb-4">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
              Тып дагавора
            </label>
            <div className="flex flex-wrap gap-2 p-2 bg-slate-800/30 rounded-xl border border-slate-800 mb-2">
              {CONTRACT_OPTIONS.map((opt) => {
                const isActive = contractMode === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleContractSelect(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                      isActive
                        ? "bg-emerald-500 border-emerald-500 text-slate-900"
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {contractMode === "other" && (
              <Field
                label="Увядзіце тып дагавора"
                value={form.contractType || ""}
                onChange={(v) => setField("contractType", v)}
              />
            )}
          </div>

          {/* КАТЭГОРЫЯ */}
          <SingleBtnGroup
            label="Катэгорыя"
            options={MD.CATEGORIES}
            selectedValue={form.category}
            onSelect={(v) => setField("category", v)}
            small
          />

          <Divider label="📍 Локація" />
          <SingleBtnGroup
            label="Ваяводства / Рэгіён"
            options={MD.VOIVODESHIPS}
            selectedValue={form.voivodeship}
            onSelect={(v) => setField("voivodeship", v)}
            small
          />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Горад (па-польску)"
              value={form.location}
              onChange={(v) => setField("location", v)}
            />
            <Field
              label="Горад аформлення"
              value={form.checkInCity}
              onChange={(v) => setField("checkInCity", v)}
            />
            <div className="col-span-2">
              <Field
                label="Поўны адрас"
                value={form.locationDescription}
                onChange={(v) => setField("locationDescription", v)}
              />
            </div>
            <Field
              label="Краіна"
              value={form.country}
              onChange={(v) => setField("country", v)}
            />
          </div>

          <Divider label="💰 Оплата" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Базавая стаўка"
              value={form.salary?.baseNetto}
              onChange={(v) => setField("salary.baseNetto", v)}
            />
            <Field
              label="Студэнцкая стаўка"
              value={form.salary?.studentNetto}
              onChange={(v) => setField("salary.studentNetto", v)}
            />
            <Field
              label="Гадзін у месяц"
              value={form.salary?.hoursRange}
              onChange={(v) => setField("salary.hoursRange", v)}
            />
            <Field
              label="Даты выплат"
              value={form.salary?.payoutDates}
              onChange={(v) => setField("salary.payoutDates", v)}
            />
            <div className="col-span-2">
              <Field
                label="Бонусы"
                value={form.salary?.bonusDetails}
                onChange={(v) => setField("salary.bonusDetails", v)}
              />
            </div>
            <div className="col-span-2">
              <Field
                label="Нататкі па аплаце"
                value={form.salary?.salaryNotes}
                onChange={(v) => setField("salary.salaryNotes", v)}
              />
            </div>
          </div>

          <Divider label="🕒 Графік" />
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field
                label="Апісанне графіка"
                value={form.schedule?.description}
                onChange={(v) => setField("schedule.description", v)}
              />
            </div>
            <Field
              label="Колькасць змен"
              value={form.schedule?.shiftsCount}
              onChange={(v) => setField("schedule.shiftsCount", v)}
            />
            <Field
              label="Гадзін за змену"
              value={form.schedule?.hoursPerShift}
              onChange={(v) => setField("schedule.hoursPerShift", v)}
            />
            <Field
              label="Дні тыдня"
              value={form.schedule?.workDaysWeek}
              onChange={(v) => setField("schedule.workDaysWeek", v)}
            />
            <Field
              label="Перапынак"
              value={form.schedule?.breakDuration}
              onChange={(v) => setField("schedule.breakDuration", v)}
            />
          </div>

          <Divider label="🛠 Обов'язки" />
          <textarea
            value={form.description || ""}
            onChange={(e) => setField("description", e.target.value)}
            rows={4}
            placeholder="Обов'язки праз кропку з коскай (;)"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
          />

          <Divider label="📋 Вимоги" />
          <MultiBtnGroup
            label="Набір (Гендер)"
            options={MD.GENDERS}
            selectedValues={form.requirements.gender}
            onToggle={(v) => toggleArrayItem("requirements.gender", v)}
          />
          <MultiBtnGroup
            label="Нацыянальнасці"
            options={MD.NATIONALITIES}
            selectedValues={form.requirements.nationalities}
            onToggle={(v) => toggleArrayItem("requirements.nationalities", v)}
          />
          <MultiBtnGroup
            label="Дакументы"
            options={MD.DOCS}
            selectedValues={form.requirements.standardDocs}
            onToggle={(v) => toggleArrayItem("requirements.standardDocs", v)}
          />

          {/* УЗРОВЕНЬ ПОЛЬСКАЙ — кнопкі */}
          <SingleBtnGroup
            label="Узровень польскай"
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

            <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-800/50 rounded-xl border border-slate-700">
              <input
                type="checkbox"
                checked={!!form.requirements?.physicalLoad}
                onChange={(e) =>
                  setField("requirements.physicalLoad", e.target.checked)
                }
                className="w-4 h-4 accent-emerald-500"
              />
              <span className="text-xs text-slate-300 font-medium">
                Фізічна важкая праця (Так/Не)
              </span>
            </label>
            <div className="col-span-2">
              <Field
                label="Дадатковыя дакументы (тэкст)"
                value={form.requirements?.additionalDocsDetails}
                onChange={(v) =>
                  setField("requirements.additionalDocsDetails", v)
                }
              />
            </div>
          </div>

          <Divider label="🏠 Житло" />

          {/* ТЫП ЖЫТЛА — кнопкі */}
          <SingleBtnGroup
            label="Тып жытла"
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
                label="Дэталі жытла"
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
              <span className="text-xs text-slate-400">З дзецьмі</span>
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
              <span className="text-xs text-slate-400">З жывёламі</span>
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
              <span className="text-xs text-slate-400">Прадастаўляецца</span>
            </label>
            <Field
              label="Кошт транспарту"
              value={form.transport?.costRaw}
              onChange={(v) => setField("transport.costRaw", v)}
            />
            <div className="col-span-2">
              <Field
                label="Дэталі транспарту"
                value={form.transport?.details}
                onChange={(v) => setField("transport.details", v)}
              />
            </div>
          </div>

          <Divider label="🌡 Умови праці" />

          {/* ХАРЧАВАННЕ — кнопкі */}
          <SingleBtnGroup
            label="Тып харчавання"
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
              <span className="text-xs text-slate-400">Вопратка бясплатна</span>
            </label>
            <div className="col-span-2">
              <Field
                label="Дэталі харчавання"
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
                label="Дэталі ўмоў"
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
              <span className="text-xs text-slate-400">Выдаткі на старце</span>
            </label>
            <div className="col-span-2">
              <Field
                label="Дэталі выдаткаў"
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
              <span className="text-xs text-slate-400">
                Штраф за звальненне
              </span>
            </label>
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
              <span className="text-xs text-slate-400">Ёсць кампенсацыі</span>
            </label>
            <div className="col-span-2">
              <Field
                label="Дэталі кампенсацый"
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
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
            placeholder="Дадатковыя нататкі..."
          />

          <Divider label="🔒 Для рекрутера" />
          <textarea
            value={form.forRecruiter?.internalNotes || ""}
            onChange={(e) =>
              setField("forRecruiter.internalNotes", e.target.value)
            }
            rows={2}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        {/* КНОПКІ */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900 z-10">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-bold text-sm rounded-lg transition-colors"
          >
            {saving ? "Збереження..." : "Зберегти зміни"}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
          >
            Скасувати
          </button>
        </div>
      </div>
    </div>

);
}

---

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

---

// frontend/src/components/shared/Divider.jsx
export default function Divider({ label }) {
return (
<div className="flex items-center gap-3 my-4">
<span className="text-xs font-medium text-slate-500">{label}</span>
<div className="flex-1 h-px bg-slate-800" />
</div>
);
}

---

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
<label className="block text-xs text-slate-500 mb-1">{label}</label>
<input
type={type}
value={value || ""}
onChange={(e) => onChange(e.target.value)}
placeholder={placeholder}
className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
/>
</div>
);
}

---

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
<label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
{label}
</label>
)}

      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`min-h-[38px] w-full bg-slate-800/50 border ${
          isOpen ? "border-emerald-500/50" : "border-slate-700"
        } rounded-xl px-3 py-1.5 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-800`}
      >
        <div className="flex flex-wrap gap-1">
          {selected.length === 0 ? (
            <span className="text-slate-500 text-xs">{placeholder}</span>
          ) : (
            selected.map((val) => {
              // Шукаем аб'ект опцыі або выкарыстоўваем само значэнне
              const opt = options.find((o) => o.value === val || o === val);
              const displayLabel = opt?.label || opt || val;

              return (
                <span
                  key={val}
                  className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1"
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
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-[100] max-h-60 overflow-y-auto custom-scrollbar p-1">
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
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 border rounded flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-slate-600"
                    }`}
                  >
                    {isSelected && (
                      <span className="text-slate-900 text-[10px]">✓</span>
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
