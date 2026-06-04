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
    const vAge = v.requirements?.age?.max; // Можа быць лічбай або null

    if (fMinAge !== null || fMaxAge !== null) {
      // Калі ў вакансіі няма ўзросту, а мы фільтруем — хаваем яе
      if (vAge === null || vAge === undefined || isNaN(vAge)) return false;
      if (fMinAge !== null && vAge < fMinAge) return false;
      if (fMaxAge !== null && vAge > fMaxAge) return false;
    }
    return true;

});
}

export default function Vacancies() {
const location = useLocation(); // Дадалі
const [selectedIds, setSelectedIds] = useState([]);

const toggleSelect = (id) => {
setSelectedIds((prev) =>
prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
);
};
const toggleSelectAll = () => {
if (selectedIds.length === filtered.length && filtered.length > 0) {
setSelectedIds([]);
} else {
setSelectedIds(filtered.map((v) => v.\_id));
}
};
const handleBulkDelete = async () => {
if (!window.confirm(`Видалити ${selectedIds.length} вакансій?`)) return;
try {
await bulkDeleteVacancies(selectedIds);
setVacancies((prev) => prev.filter((v) => !selectedIds.includes(v.\_id)));
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

const fetchVacancies = useCallback(async () => {
try {
const statusParam =
applied.status?.length > 0 ? applied.status.join(",") : "active,closed";

      const res = await getVacancies(statusParam);
      setVacancies(res.data);
    } catch {
      console.error("Памылка загрузкі вакансій");
    } finally {
      setLoading(false);
    }

}, [applied.status]); // Функцыя будзе абнаўляцца толькі пры змене статусаў

useEffect(() => {
// Калі ўсе фільтры пустыя (скінуты), аўтаматычна прымяняем іх
if (JSON.stringify(draft) === JSON.stringify(EMPTY_FILTERS)) {
setApplied(EMPTY_FILTERS);
}
}, [draft]);
useEffect(() => {
fetchVacancies();
}, [fetchVacancies]); // Цяпер залежым ад мемаізаванай функцыі // Перазагружаем дадзеныя з сервера, калі змяніўся набор статусаў

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
v.\_id === id ? { ...v, isFavorite: res.data.isFavorite } : v,
),
);
} catch (err) {
console.error("Памылка пераключэння абранага:", err);
}
};
// Абноўлены dynamicData
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

    vacancies.forEach((v) => {
      if (v.agencyName) agencies.add(v.agencyName);

      // 1. Брэнды
      if (v.brand && v.brand !== "БРЕНДОВИЙ ОДЯГ") {
        brands.add(v.brand.toUpperCase().trim());
      } else {
        brands.add("NO BRAND");
      }

      // 2. Ваяводствы
      // Калі краіна — Польшча, заўсёды дадаем пункт "Польшча" ў фільтр
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

      // 3. Гарады
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
const handleAIUpdate = async () => {
if (!selectedVacancyForUpdate || !autoText.trim())
return alert("Оберіть вакансію та введіть текст");
setAutoLoading(true);
try {
await aiUpdateVacancy(
selectedVacancyForUpdate.\_id,
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
              {["auto", "template", "update"].map((m) => (
                <button
                  key={m}
                  onClick={() => setFormMode(m)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${formMode === m ? "bg-emerald-500 text-slate-900" : "bg-slate-800 text-slate-400"}`}
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
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
                />
                <div className="max-h-48 overflow-y-auto border border-slate-800 rounded-lg p-1 bg-slate-900/50">
                  {filteredTemplates.map((t) => (
                    <button
                      key={t._id}
                      onClick={() => setSelectedTemplate(t)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 ${selectedTemplate?._id === t._id ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-300 hover:bg-slate-800"}`}
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
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
                />
                <div className="max-h-48 overflow-y-auto border border-slate-800 rounded-lg p-1 bg-slate-900/50">
                  {filteredVacanciesForUpdate.map((v) => (
                    <button
                      key={v._id}
                      onClick={() => setSelectedVacancyForUpdate(v)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 ${selectedVacancyForUpdate?._id === v._id ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-slate-300 hover:bg-slate-800"}`}
                    >
                      <span className="font-mono text-xs bg-slate-800 px-1 rounded mr-2">
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
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-100 resize-none"
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
        {/* ПАНЭЛЬ МАСАВЫХ ДЗЕЯННЯЎ */}
        <div className="flex items-center justify-between bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={
                filtered.length > 0 && selectedIds.length === filtered.length
              }
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/20"
            />
            <span className="text-sm text-slate-400 font-medium">
              {selectedIds.length > 0
                ? `Выбрана: ${selectedIds.length}`
                : "Выбраць усе адфільтраваныя"}
            </span>
          </div>

          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-black rounded-lg border border-red-500/20 transition-all"
            >
              🗑️ ВЫДАЛІЦЬ ВЫБРАНЫЯ
            </button>
          )}
        </div>
        {/* СПІС ВАКАНСІЙ */}
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
                className={`bg-slate-900 border rounded-xl p-5 transition-all ${
                  selectedIds.includes(v._id)
                    ? "border-emerald-500/50 ring-1 ring-emerald-500/20"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap border-b border-slate-800/50 pb-2">
                      {/* ЧЭКБОКС ДЛЯ ВЫБАРУ */}
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(v._id)}
                        onChange={() => toggleSelect(v._id)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/20 focus:ring-offset-0"
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
                              : "text-slate-600 hover:text-slate-400"
                          }`}
                        >
                          {v.isFavorite ? "★" : "☆"}
                        </button>
                        <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded flex items-center gap-1 border border-slate-700">
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

                      {/* Агенція */}
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded">
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
                      <span className="text-[10px] font-bold bg-slate-800 text-slate-200 px-2 py-0.5 rounded flex items-center gap-1 border border-slate-700">
                        📍 {locationDisplay}
                        {v.voivodeship &&
                          v.voivodeship !== "Європа (інші країни)" && (
                            <span className="text-slate-500 ml-1 font-medium">
                              ({v.voivodeship})
                            </span>
                          )}
                      </span>

                      {/* Дата стварэння (Справа) */}
                      <span className="text-[10px] text-slate-600 ml-auto font-mono italic">
                        {new Date(v.createdAt).toLocaleDateString("uk-UA")}
                      </span>
                    </div>
                    {/* ЗАГАЛОВАК */}
                    <h3 className="font-semibold text-slate-100 leading-snug mb-2">
                      {v.vacancydescription || v.templateName}
                    </h3>

                    {/* РАДОК 2: БАЗАВЫЯ ЎМОВЫ (Гендэр, Жытло, Давоз, Мова) + ЗАРПЛАТА */}
                    <div className="flex flex-wrap gap-4 text-xs items-center mb-3">
                      {/* ГЕНДАР / НАБОР */}
                      <div className="flex items-center gap-1.5 bg-slate-800/40 px-2 py-1 rounded-lg border border-slate-800">
                        <span className="text-slate-500">👥</span>

                        <span className="text-slate-200 font-bold uppercase tracking-tight text-[10px]">
                          {Array.isArray(v.requirements?.gender)
                            ? v.requirements.gender.join(", ")
                            : v.gender || "Будь-хто"}
                          {v.requirements?.genderDescription && (
                            <span className="text-emerald-500 ml-1">*</span>
                          )}
                        </span>
                      </div>
                      {/* Узрост (Дададзена для зручнасці рэкрутэра) */}
                      {v.requirements?.age?.max && (
                        <div className="flex items-center gap-1.5 bg-slate-800/40 px-2 py-1 rounded-lg border border-slate-800">
                          <span className="text-slate-500 text-[10px]">🎂</span>
                          <span className="text-slate-300 font-bold text-[10px]">
                            {v.requirements.age.min || 18}-
                            {v.requirements.age.max} р.
                          </span>
                        </div>
                      )}
                      {/* ЖИТЛО + ПАРИ */}
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span>🏠</span>
                        <span className="font-medium">
                          {!v.accommodation?.type ||
                          v.accommodation?.type === ""
                            ? "Житло не вказано"
                            : v.accommodation.type
                                  .toLowerCase()
                                  .includes("власн") ||
                                v.accommodation.type
                                  .toLowerCase()
                                  .includes("не надаєт")
                              ? "Без житла"
                              : "Житло надається"}
                          {v.accommodation?.forCouples && (
                            <span className="text-orange-400 ml-1">+ 👫</span>
                          )}
                        </span>
                      </div>

                      {/* ДОВІЗ */}
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span>🚌</span>
                        <span className="font-medium">
                          {v.transport?.provided ? "Є довіз" : "Без довозу"}
                        </span>
                      </div>

                      {/* МОВА */}
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span>🗣️</span>
                        <span className="font-medium">
                          {v.requirements?.polishLanguageLevel ||
                            "Любий рівень"}
                        </span>
                      </div>
                      {/* ЗАРПЛАТА (Кампактны вывад v2.3) */}
                      {(v.salary?.rawSalaryDisplay || v.salary?.baseNetto) && (
                        <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 ml-auto">
                          <span className="text-emerald-400 font-black text-sm">
                            💰{" "}
                            {v.salary.rawSalaryDisplay
                              ? v.salary.rawSalaryDisplay.split(";")[0]
                              : `${v.salary.baseNetto} ${v.salary.currency || "PLN"}`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ХМАРА ТЕГІВ v2.2 (Спецыфічныя патрабаванні: Нацыі, Дакументы, Нюансы) */}
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-800/50">
                      {/* НАЦІОНАЛЬНІСТЬ */}
                      {(v.requirements?.nationalities || []).length > 0 && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase tracking-tighter">
                          🌍 {v.requirements.nationalities.join(", ")}
                        </span>
                      )}

                      {/* ДОКУМЕНТИ */}
                      {(v.requirements?.standardDocs || []).length > 0 && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold uppercase tracking-tighter">
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
                            className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/5 text-amber-500/80 border border-amber-500/10 font-bold uppercase tracking-tighter"
                          >
                            {icons[category] || "✨"} {category}
                          </span>
                        );
                      })}
                    </div>
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

**---**
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
<div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
<div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
<div>
<h2 className="font-semibold text-slate-100">
{applyType === "want_work"
? "🟢 Хочу тут працювати"
: "💬 Дізнатися деталі"}
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
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        (form.jobPreferences.schedule || []).includes(val)
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
                {sending ? "Відправка..." : "Відправити заявку"}
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
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
**---**
import { useState } from "react";
import { updateVacancy } from "../../services/api";
import Field from "../shared/Field";
import Divider from "../shared/Divider";
import \* as MD from "../../constants/masterData";

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

// Dropdown для агенції
const AgencyDropdown = () => (
<div className="mb-0">
<label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
Агенція
</label>
<select
value={form.agencyName || "MANUAL"}
onChange={(e) => setField("agencyName", e.target.value)}
className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500" >
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
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
              Тип договору
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
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
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
              <span className="text-xs text-slate-400">З дітьми</span>
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
              <span className="text-xs text-slate-400">З тваринами</span>
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
              <span className="text-xs text-slate-400">Надається</span>
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
              <span className="text-xs text-slate-400">Одяг безкоштовно</span>
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
              <span className="text-xs text-slate-400">Витрати на старті</span>
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
              <span className="text-xs text-slate-400">
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
              <span className="text-xs text-slate-400">Є компенсації</span>
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
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
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
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        {/* КНОПКИ */}
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
**---**
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
// Мапінг тэхнічных ключоў нюансаў у прыгожыя лэйблы з masterData
const mappedNuances = nuances.map((key) => {
const found = MD.CHECKLIST_ITEMS.find((item) => item.value === key);
return found ? found : { value: key, label: key };
});
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
      {/* АБРАНАЕ */}
      <Section>
        <button
          onClick={() => updateField("isFavorite", !draft.isFavorite)}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl border transition-all font-bold text-xs ${
            draft.isFavorite
              ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
              : "bg-slate-800/30 border-slate-700 text-slate-400 hover:border-slate-600"
          }`}
        >
          {draft.isFavorite ? "★ ТІЛЬКИ ОБРАНІ" : "☆ ПОКАЗАТИ ВСІ"}
        </button>
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
      {/* ВІК */}
      <Section>
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
          Вік (до)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={draft.minAge || ""}
            onChange={(e) => updateField("minAge", e.target.value)}
            placeholder="Від"
            className="w-1/2 bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50"
          />
          <input
            type="number"
            value={draft.maxAge || ""}
            onChange={(e) => updateField("maxAge", e.target.value)}
            placeholder="До"
            className="w-1/2 bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
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
      {/* ЗАРПЛАТА */}
      <Section>
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
          Зарплата (Netto)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={draft.minSalary || ""}
            onChange={(e) => updateField("minSalary", e.target.value)}
            placeholder="Від"
            className="w-1/2 bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50"
          />
          <input
            type="number"
            value={draft.maxSalary || ""}
            onChange={(e) => updateField("maxSalary", e.target.value)}
            placeholder="До"
            className="w-1/2 bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
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
          options={mappedNuances} // Замянілі тут
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
**---**
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
const res = await matchCandidatesForVacancy(vacancy.\_id);
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
<div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
{/_ Заголовок _/}
<div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
<div>
<h2 className="font-semibold text-slate-100">
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
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
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
                          {c.age && <span>🎂 {c.age} р.</span>}
                          {c.gender && (
                            <span>{c.gender === "female" ? "👩" : "👨"}</span>
                          )}
                        </div>

                        {/* Побажання */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {c.jobPreferences?.locationFlexible && (
                            <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded">
                              🗺 Готовий до переїзду
                            </span>
                          )}
                          {c.jobPreferences?.needsAccommodation && (
                            <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded">
                              🏠 Потрібне житло
                            </span>
                          )}
                          {c.jobPreferences?.readyDate && (
                            <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded">
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
                                  : "bg-slate-700 text-slate-600"
                              }`}
                            >
                              {has ? "✅" : "❌"} {label}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Оцінка */}
                      <div className="shrink-0 text-center">
                        <div className="text-lg font-bold text-emerald-400">
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
**---**
import React, { useState } from "react";
import { Copy, Check, X, Factory, Tag } from "lucide-react";
const formatText = (text) => {
if (!text || typeof text !== "string") return "";

// Калі ў тэксце ўжо ёсць пераносы радкоў — значыць, AI ўжо яго аформіў, вяртаем як ёсць
if (text.includes("\n")) return text;

// Разбіваем тэкст па:
// 1. Кропцы з коскай (;)
// 2. Кропцы (.), пасля якой ідзе прабел і ВЯЛІКАЯ літара (каб не зламаць "м. Poznań" ці "25.36")
const parts = text
.split(/[;]\s\*|\.\s+(?=[A-ZА-ЯЁІЎ])/)
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
<p className="text-xs text-slate-400 italic mt-1 leading-relaxed">
{children}
</p>
) : null;

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
<div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
<div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar">
{/_ ШАПКА _/}
<div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
<div className="flex flex-wrap gap-2 items-center">
<span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
{v.vacancyCode}
</span>
<span
className={`text-[10px] px-2 py-0.5 rounded font-bold border uppercase tracking-wider ${
                v.status === "active"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : v.status === "closed"
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : "bg-slate-500/10 text-slate-400 border-slate-500/20"
              }`} >
{STATUS_LABELS[v.status] || v.status}
</span>
{v.category && (
<span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-bold border border-blue-500/20 uppercase tracking-wider">
<Tag size={9} className="inline mr-1" /> {v.category}
</span>
)}
{v.brand && (
<span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/20 uppercase tracking-wider">
<Factory size={9} className="inline mr-1" /> {v.brand}
</span>
)}
</div>
<div className="flex items-center gap-2 shrink-0">
<button
              onClick={handleCopyTelegram}
              className="p-2 text-slate-400 hover:text-emerald-400 transition-all"
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
          {/* ГАЛОЎНЫ ЗАГАЛОВАК І ЛАКАЦЫЯ */}
          <div>
            <h2 className="text-xl font-black text-white leading-tight mb-3">
              {v.vacancydescription}
            </h2>
            <div className="space-y-1">
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
                <span className="text-white font-bold">
                  {v.gender ||
                    (Array.isArray(v.requirements?.gender)
                      ? v.requirements.gender.join(", ")
                      : "Будь-хто")}
                </span>
                {v.requirements?.genderDescription && (
                  <span className="text-slate-400 ml-1 italic">
                    ({v.requirements.genderDescription})
                  </span>
                )}
                {v.arrivalDate && (
                  <span className="text-emerald-400 font-bold">
                    , приїзд {v.arrivalDate}
                  </span>
                )}
              </p>
            </div>
          </div>

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
            <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800/50">
              {v.description ? (
                <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {formatText(v.description)}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">
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
                <p className="text-sm text-slate-200 leading-relaxed bg-slate-800/30 p-3 rounded-xl border border-slate-800 mb-2 whitespace-pre-wrap">
                  {formatText(v.schedule.description)}
                </p>
              )}
              <Row label="Робочі дні" value={v.schedule?.workDaysWeek} />
              <Row label="Перерва" value={v.schedule?.breakDuration} />

              {v.contractType && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
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
                  <p className="text-sm text-slate-200 font-semibold">
                    {v.accommodation.type}
                    {v.accommodation?.forCouples && " (можливо для пар 👫)"}
                  </p>
                ) : (
                  <p className="text-sm text-slate-500 italic">
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
                <div className="text-xs text-slate-400 whitespace-pre-wrap mt-2">
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
                <p className="text-sm text-slate-200 font-semibold">
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
                          className={`px-4 py-3 rounded-xl border flex flex-col gap-1 transition-all hover:bg-slate-800/50 ${
                            isUrgent
                              ? "bg-red-500/5 text-red-400 border-red-500/10"
                              : "bg-slate-800/30 text-slate-300 border-slate-800"
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
            <section className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800 space-y-4">
              {v.startExpenses?.hasStartExpenses &&
                v.startExpenses?.details && (
                  <div>
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1.5">
                      💸 Витрати на старті
                    </p>
                    <p className="text-sm text-slate-300 leading-relaxed">
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
                    <p className="text-sm text-slate-300 leading-relaxed">
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
                    <p className="text-sm text-slate-300 leading-relaxed">
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
              <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
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

            <details className="group">
              <summary className="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-300 transition-colors list-none flex items-center gap-2">
                <span className="group-open:rotate-90 transition-transform inline-block">
                  ▶
                </span>
                Текст повідомлення (Оригінал)
              </summary>
              <div className="mt-4 p-4 bg-black/40 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto">
                {v.rawText || "Текст повідомлення відсутній"}
              </div>
            </details>
          </section>

          {/* МЕТА-ДАНІ */}
          <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[9px] font-mono text-slate-600 uppercase tracking-tighter">
            <span>ID: {v._id}</span>
            <span>
              СТВОРЕНО: {new Date(v.createdAt).toLocaleString("uk-UA")}
            </span>
          </div>
        </div>

        {/* КНОПКИ ДІЙ */}
        <div className="flex flex-wrap gap-3 px-8 py-5 border-t border-slate-800 sticky bottom-0 bg-slate-900 z-10">
          <button
            onClick={() => onMatch(v)}
            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/10"
          >
            🎯 КАНДИДАТИ
          </button>
          <button
            onClick={() => onEdit(v)}
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold rounded-xl border border-slate-700 transition-all"
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
