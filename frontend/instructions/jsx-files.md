--Vacancies.jsx--
import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom"; // Дадалі гэты радок
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
active: "Актыўная",
closed: "Закрыта",
archived: "Архіў",
};

function applyFilters(vacancies, filters) {
if (!vacancies) return [];

return vacancies.filter((v) => {
// 1. Пошук (пакідаем як ёсць, працуе добра)
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

    // 2. Статус і Катэгорыя
    if (filters.status?.length > 0 && !filters.status.includes(v.status))
      return false;
    if (filters.category?.length > 0 && !filters.category.includes(v.category))
      return false;

    // 3. Лакацыя (ФІКС: улічваем краіну для Еўропы)
    if (filters.location?.length > 0) {
      const vLoc =
        v.country && v.country !== "Polska"
          ? `${v.location} (${v.country})`
          : v.location;
      if (!filters.location.includes(vLoc)) return false;
    }

    // 4. Жытло
    if (filters.accommodation?.length > 0) {
      const accType = (v.accommodation?.type || "").toLowerCase();
      const isCouples = !!v.accommodation?.forCouples;
      const match = filters.accommodation.some((fa) => {
        if (fa === "provided")
          return (
            accType.includes("безкоштовн") || accType.includes("надається")
          );
        if (fa === "couples") return isCouples;
        if (fa === "none")
          return accType.includes("власн") || accType.includes("платн");
        return false;
      });
      if (!match) return false;
    }

    // 5. Хто едзе (ФІКС: калі няма дадзеных — гэта "Адзін")
    if (filters.travelGroup?.length > 0) {
      const vGenders = Array.isArray(v.requirements?.gender)
        ? v.requirements.gender
        : [];
      const isCouples =
        !!v.accommodation?.forCouples || vGenders.includes("Пари");
      const isFamily = !!v.accommodation?.withChildren;
      // Калі масіў пусты або ёсць М/Ж — гэта "Адзін"
      const isAlone =
        vGenders.length === 0 ||
        vGenders.includes("Чоловіки") ||
        vGenders.includes("Жінки");

      const match = filters.travelGroup.some((fg) => {
        if (fg === "alone") return isAlone;
        if (fg === "couple") return isCouples;
        if (fg === "family") return isFamily;
        return false;
      });
      if (!match) return false;
    }

    // 6. Нацыянальнасць (ФІКС: па змаўчанні Україна)
    if (filters.nationality?.length > 0) {
      const vNats =
        Array.isArray(v.requirements?.nationalities) &&
        v.requirements.nationalities.length > 0
          ? v.requirements.nationalities
          : ["Україна"];

      const hasMatch = filters.nationality.some((fn) =>
        vNats.some((vn) => vn.trim().toLowerCase() === fn.trim().toLowerCase()),
      );
      if (!hasMatch) return false;
    }

    if (filters.language?.length > 0) {
      const vLang = v.requirements?.polishLanguageLevel || "Не вимагається";
      if (!filters.language.includes(vLang)) return false;
    }

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

    vacancies.forEach((v) => {
      if (v.agencyName) agencies.add(v.agencyName);
      if (v.brand) brands.add(v.brand);
      if (v.location) {
        // Калі не Польшча — дадаем краіну ў дужках
        const locName =
          v.country && v.country !== "Polska"
            ? `${v.location} (${v.country})`
            : v.location;
        locations.add(locName);
      }
    });

    return {
      agencies: Array.from(agencies).sort(),
      brands: Array.from(brands).sort(),
      locations: Array.from(locations).sort(),
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
if (!confirm("Выдаліць вакансію?")) return;
try {
await deleteVacancy(id);
setVacancies((prev) => prev.filter((v) => v.\_id !== id));
} catch {
alert("Памылка выдалення");
}
};

const handleAutoCreate = async () => {
if (!autoText.trim()) return;
setAutoLoading(true);
try {
await createVacancyAuto(autoText, sourceMessageId);
notifyUpdate(); // <--- ДАДАЛІ
handleCloseForm();
await fetchVacancies();
} catch {
alert("Памылка стварэння");
} finally {
setAutoLoading(false);
}
};

const handleTemplateCreate = async () => {
if (!selectedTemplate || !autoText.trim())
return alert("Запоўніце ўсе палі");
setAutoLoading(true);
try {
await createVacancyFromTemplate(
selectedTemplate.\_id,
autoText,
sourceMessageId,
);
notifyUpdate(); // <--- ДАДАЛІ
handleCloseForm();
setSourceMessageId(null);
await fetchVacancies();
} catch {
alert("Памылка стварэння");
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
              />
            </div>
            <div className="p-4 border-t border-slate-800">
              <button
                onClick={handleApplyFilters}
                className="w-full py-2.5 bg-emerald-500 text-slate-900 font-bold rounded-lg"
              >
                Паказаць {previewCount} вакансій
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
              ⚙️ Фільтры {isDirty && "●"}
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-slate-100">
                Вакансіі
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
            ＋ Дадаць
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
                  {m === "auto" ? "🤖 Аўта (AI)" : "📋 З шаблона"}
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
              placeholder="Устаўце тэкст вакансіі..."
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
                {autoLoading ? "Апрацоўка..." : "Апрацаваць і дадаць"}
              </button>
              <button
                onClick={handleCloseForm}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
              >
                Адмена
              </button>
            </div>
          </div>
        )}

        {/* СПІС ВАКАНСІЙ */}
        <div className="space-y-3">
          {filtered.map((v) => (
            // Знайдзі ў Vacancies.jsx блок, дзе адлюстроўваецца спіс (filtered.map)
            // І замяні змесціва карткі на гэта:

            <div
              key={v._id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      {v.vacancyCode}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[v.status]}`}
                    >
                      {STATUS_LABELS[v.status]}
                    </span>
                    {/* ДАДАЕМ ТЭГ КАТЭГОРЫІ */}
                    {v.category && (
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                        📁 {v.category}
                      </span>
                    )}
                  </div>

                  <h3 className="font-medium text-slate-100">
                    {v.vacancydescription}
                  </h3>

                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
                    {v.brand && (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        🏭 {v.brand}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      📍 {v.location}
                    </span>
                    <span className="flex items-center gap-1">
                      🏢 {v.agencyName}
                    </span>
                    <span className="flex items-center gap-1">
                      🏠 {v.accommodation?.type || "Не вказано"}
                    </span>
                    <span className="text-slate-300 font-medium">
                      💰 {v.salary?.baseNetto}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => setViewVacancy(v)}
                    className="px-3 py-1.5 text-slate-400 hover:bg-slate-800 rounded-lg text-xs transition-colors"
                  >
                    👁 Паглядзець
                  </button>
                  <button
                    onClick={() => setMatchVacancy(v)}
                    className="px-3 py-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg text-xs transition-colors"
                  >
                    🎯 Кандыдаты
                  </button>
                  <button
                    onClick={() => setEditVacancy(v)}
                    className="px-3 py-1.5 text-slate-400 hover:bg-slate-800 rounded-lg text-xs transition-colors"
                  >
                    ✏️ Рэд.
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ПЛАВАЮЧАЯ КНОПКА */}
      {isDirty && (
        <div className="hidden lg:block fixed bottom-6 right-6 z-30">
          <button
            onClick={handleApplyFilters}
            className="px-5 py-3 bg-emerald-500 text-slate-900 font-bold rounded-xl shadow-lg"
          >
            Паказаць {previewCount} вакансій ✓
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
//Layout.jsx
import { useState, useEffect, useCallback } from "react";
import { NavLink, Link } from "react-router-dom";
import { getInboxStats } from "../services/api";

const NAV_ITEMS = [
{ to: "/", label: "Галоўная", exact: true },
{ to: "/vacancies", label: "Вакансіі" },
{ to: "/candidates", label: "Кандыдаты" },
{ to: "/templates", label: "Шаблоны" },
{ to: "/agencies", label: "Агенцыі" },
{ to: "/inbox", label: "Уваходныя" },
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
//EditVacancyModal.jsx
import { useState } from "react";
import { updateVacancy } from "../../services/api";
import Field from "../shared/Field";
import Divider from "../shared/Divider";
import \* as MD from "../../constants/masterData";

export default function EditVacancyModal({ vacancy, onClose, onSave }) {
const [form, setForm] = useState({
...vacancy,
brand: vacancy.brand || "",
voivodeship: Array.isArray(vacancy.voivodeship) ? vacancy.voivodeship : [],
category: Array.isArray(vacancy.category) ? vacancy.category : [],
keywords: Array.isArray(vacancy.keywords)
? vacancy.keywords.join(", ")
: vacancy.keywords || "",
requirements: {
...vacancy.requirements,
gender: vacancy.requirements?.gender || "",
standardDocs: Array.isArray(vacancy.requirements?.standardDocs)
? vacancy.requirements.standardDocs
: [],
nationalities: Array.isArray(vacancy.requirements?.nationalities)
? vacancy.requirements.nationalities
: [],
languages: Array.isArray(vacancy.requirements?.languages)
? vacancy.requirements.languages
: [],
},
conditions: {
...vacancy.conditions,
specificNuances: Array.isArray(vacancy.conditions?.specificNuances)
? vacancy.conditions.specificNuances.join(", ")
: vacancy.conditions?.specificNuances || "",
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
let currentArr;

      if (parts.length === 1) {
        currentArr = Array.isArray(next[parts[0]]) ? next[parts[0]] : [];
        next[parts[0]] = currentArr.includes(value)
          ? currentArr.filter((v) => v !== value)
          : [...currentArr, value];
      } else {
        const parent = { ...next[parts[0]] };
        currentArr = Array.isArray(parent[parts[1]]) ? parent[parts[1]] : [];
        parent[parts[1]] = currentArr.includes(value)
          ? currentArr.filter((v) => v !== value)
          : [...currentArr, value];
        next[parts[0]] = parent;
      }
      return next;
    });

};

const handleSave = async () => {
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

      const res = await updateVacancy(vacancy._id, data);
      onSave(res.data);
      onClose();
    } catch {
      alert("Памылка захавання");
    } finally {
      setSaving(false);
    }

};

const MultiBtnGroup = ({ label, options, selectedValues, onToggle }) => (

<div className="mb-4">
<label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
{label}
</label>
<div className="flex flex-wrap gap-2 p-2 bg-slate-800/30 rounded-xl border border-slate-800">
{options.map((opt) => {
const val = opt.value || opt;
const lbl = opt.label || opt;
const isActive = selectedValues?.includes(val);
return (
<button
key={val}
type="button"
onClick={() => onToggle(val)}
className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                isActive
                  ? "bg-emerald-500 border-emerald-500 text-slate-900 shadow-md shadow-emerald-500/20"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
              }`} >
{lbl}
</button>
);
})}
</div>
</div>
);

return (

<div className="fixed inset-0 z-50 flex items-center justify-center">
<div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
<div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4 custom-scrollbar">
<div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
<div>
<h2 className="font-semibold text-slate-100">
Рэдагаванне вакансіі
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
          <MultiBtnGroup
            label="Статус"
            options={MD.STATUSES}
            selectedValues={[form.status]}
            onToggle={(v) => setField("status", v)}
          />

          <Divider label="⚙️ Сістэмныя палі" />
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field
                label="Назва для адмінкі (templateName)"
                value={form.templateName}
                onChange={(v) => setField("templateName", v)}
              />
            </div>
            <div className="col-span-2">
              <Field
                label="Публічны загаловак"
                value={form.vacancydescription}
                onChange={(v) => setField("vacancydescription", v)}
              />
            </div>
            <Field
              label="Агенцыя"
              value={form.agencyName}
              onChange={(v) => setField("agencyName", v)}
            />
            <Field
              label="Брэнд / Завод"
              value={form.brand}
              onChange={(v) => setField("brand", v)}
            />
            <Field
              label="Тып дагавора"
              value={form.contractType}
              onChange={(v) => setField("contractType", v)}
            />
            <Field
              label="Дата прыезду"
              value={form.arrivalDate}
              onChange={(v) => setField("arrivalDate", v)}
              placeholder="напр. 20.04"
            />
            <Field
              label="Колькасць (count)"
              value={form.count}
              onChange={(v) => setField("count", v)}
            />
            <Field
              label="Ключавыя словы"
              value={form.keywords}
              onChange={(v) => setField("keywords", v)}
            />
          </div>

          <MultiBtnGroup
            label="Катэгорыя"
            options={MD.CATEGORIES}
            selectedValues={[form.category]}
            onToggle={(v) => setField("category", v)}
          />

          <Divider label="📍 Лакацыя" />
          <MultiBtnGroup
            label="Ваяводствы"
            options={MD.VOIVODESHIPS}
            selectedValues={form.voivodeship}
            onToggle={(v) => toggleArrayItem("voivodeship", v)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Горад (location)"
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
                label="Поўны адрас (locationDescription)"
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

          <Divider label="💰 Аплата" />
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
            <Field
              label="Апісанне графіка"
              value={form.schedule?.description}
              onChange={(v) => setField("schedule.description", v)}
            />
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

          <Divider label="🛠 Абавязкі" />
          <textarea
            value={form.description || ""}
            onChange={(e) => setField("description", e.target.value)}
            rows={4}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
          />

          <Divider label="📋 Патрабаванні" />
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
          <MultiBtnGroup
            label="Веданне моў"
            options={MD.LANGUAGES}
            selectedValues={form.requirements.languages}
            onToggle={(v) => toggleArrayItem("requirements.languages", v)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Гендар"
              value={form.requirements?.gender}
              onChange={(v) => setField("requirements.gender", v)}
            />
            <Field
              label="Макс. узрост"
              value={form.requirements?.ageMax || ""}
              onChange={(v) =>
                setField("requirements.ageMax", v === "" ? null : Number(v))
              }
              type="number"
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
                label="Дадатковыя дакументы"
                value={form.requirements?.additionalDocsDetails}
                onChange={(v) =>
                  setField("requirements.additionalDocsDetails", v)
                }
              />
            </div>
          </div>

          <Divider label="🏠 Жытло" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Тып жытла"
              value={form.accommodation?.type}
              onChange={(v) => setField("accommodation.type", v)}
            />
            <Field
              label="Кошт"
              value={form.accommodation?.costRaw}
              onChange={(v) => setField("accommodation.costRaw", v)}
            />
            <div className="col-span-2">
              <Field
                label="Дэталі жытла"
                value={form.accommodation?.details}
                onChange={(v) => setField("accommodation.details", v)}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="forCouples"
                checked={!!form.accommodation?.forCouples}
                onChange={(e) =>
                  setField("accommodation.forCouples", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <label htmlFor="forCouples" className="text-xs text-slate-400">
                Для пар
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="withChildren"
                checked={!!form.accommodation?.withChildren}
                onChange={(e) =>
                  setField("accommodation.withChildren", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <label htmlFor="withChildren" className="text-xs text-slate-400">
                З дзецьмі
              </label>
            </div>
          </div>

          <Divider label="🚌 Транспарт" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="transportProvided"
                checked={!!form.transport?.provided}
                onChange={(e) =>
                  setField("transport.provided", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <label
                htmlFor="transportProvided"
                className="text-xs text-slate-400"
              >
                Прадастаўляецца
              </label>
            </div>
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

          <Divider label="💸 Выдаткі і адказнасць" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="hasStartExpenses"
                checked={!!form.startExpenses?.hasStartExpenses}
                onChange={(e) =>
                  setField("startExpenses.hasStartExpenses", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <label
                htmlFor="hasStartExpenses"
                className="text-xs text-slate-400"
              >
                Выдаткі на старце
              </label>
            </div>
            <div className="col-span-2">
              <Field
                label="Дэталі выдаткаў"
                value={form.startExpenses?.details}
                onChange={(v) => setField("startExpenses.details", v)}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="hasLiability"
                checked={!!form.earlyTerminationLiability?.hasLiability}
                onChange={(e) =>
                  setField(
                    "earlyTerminationLiability.hasLiability",
                    e.target.checked,
                  )
                }
                className="accent-emerald-500"
              />
              <label htmlFor="hasLiability" className="text-xs text-slate-400">
                Штраф за звальненне
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

          <Divider label="🌡 Умовы працы" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="workwearFree"
                checked={!!form.conditions?.workwearFree}
                onChange={(e) =>
                  setField("conditions.workwearFree", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <label htmlFor="workwearFree" className="text-xs text-slate-400">
                Вопратка бясплатна
              </label>
            </div>
            <Field
              label="Тып харчавання"
              value={form.conditions?.foodType}
              onChange={(v) => setField("conditions.foodType", v)}
            />
            <div className="col-span-2">
              <Field
                label="Дэталі харчавання"
                value={form.conditions?.foodDetails}
                onChange={(v) => setField("conditions.foodDetails", v)}
              />
            </div>
            <div className="col-span-2">
              <Field
                label="Спецыфічныя нюансы"
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

          <Divider label="🎁 Кампенсацыі" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="hasCompensations"
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
                htmlFor="hasCompensations"
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

          <Divider label="📝 Дадаткова" />
          <textarea
            value={form.additionalNotes || ""}
            onChange={(e) => setField("additionalNotes", e.target.value)}
            rows={3}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
            placeholder="Дадатковыя нататкі..."
          />

          <Divider label="🔒 Для рэкрутэра" />
          <textarea
            value={form.forRecruiter?.internalNotes || ""}
            onChange={(e) =>
              setField("forRecruiter.internalNotes", e.target.value)
            }
            rows={2}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900 z-10">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-bold text-sm rounded-lg transition-colors"
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
//VacancyViewModal.jsx
import React, { useState } from "react";
import Divider from "../shared/Divider";
import { Copy, Check, X, Factory, Tag } from "lucide-react";

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

return (

<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
<div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar">
        {/* ВЕРХНЯЯ ПАНЭЛЬ (СІСТЭМНАЯ) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
              {v.vacancyCode}
            </span>
            {v.category && (
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-bold border border-blue-500/20 uppercase tracking-wider">
                <Tag size={10} className="inline mr-1" /> {v.category}
              </span>
            )}
            {v.brand && (
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/20 uppercase tracking-wider">
                <Factory size={10} className="inline mr-1" /> {v.brand}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
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

        <div className="px-8 py-6 space-y-8">
          {/* ГАЛОЎНЫ ЗАГАЛОВАК */}
          <div>
            <h2 className="text-2xl font-black text-white leading-tight mb-2">
              {v.vacancydescription}
            </h2>
            <div className="space-y-1 text-slate-300">
              <p>
                📍 <span className="font-semibold">Місто:</span> {v.location}
              </p>
              {v.checkInCity && (
                <p>
                  🏢 <span className="font-semibold">Оформлення:</span> м.{" "}
                  {v.checkInCity}
                </p>
              )}
              <p>
                👥 <span className="font-semibold">Набір:</span>{" "}
                {Array.isArray(v.requirements?.gender)
                  ? v.requirements.gender.join(", ")
                  : v.requirements?.gender}
                {v.arrivalDate && (
                  <span className="text-emerald-400">
                    , приїзд {v.arrivalDate}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* АПЛАТА */}
          <section>
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-3 border-b border-emerald-500/20 pb-1">
              💰 Оплата праці
            </h3>
            <div className="space-y-1.5 text-slate-200">
              <p>
                • <span className="font-semibold">Ставка:</span>{" "}
                {v.salary?.baseNetto}
              </p>
              {v.salary?.studentNetto && (
                <p>
                  •{" "}
                  <span className="font-semibold text-emerald-400">
                    Студенти:
                  </span>{" "}
                  {v.salary.studentNetto}
                </p>
              )}
              {v.salary?.hoursRange && (
                <p>
                  • <span className="font-semibold">Годин на місяць:</span>{" "}
                  {v.salary.hoursRange}
                </p>
              )}
              {v.salary?.payoutDates && (
                <p>
                  • <span className="font-semibold">Виплати:</span>{" "}
                  {v.salary.payoutDates}
                </p>
              )}
              {v.salary?.bonusDetails && (
                <p className="text-emerald-400 mt-2 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                  🎁 {v.salary.bonusDetails}
                </p>
              )}
              {v.salary?.salaryNotes && (
                <p className="text-xs text-slate-400 italic mt-1">
                  {v.salary.salaryNotes}
                </p>
              )}
            </div>
          </section>

          {/* АБАВЯЗКІ */}
          <section>
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-3 border-b border-blue-500/20 pb-1">
              🛠 Характер роботи
            </h3>
            <div className="space-y-2">
              {v.description?.split(/[.;]/).map(
                (item, i) =>
                  item.trim() && (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-slate-300"
                    >
                      <span className="text-blue-500 mt-1.5">•</span>
                      <span>{item.trim()}</span>
                    </div>
                  ),
              )}
            </div>
          </section>

          {/* ПАТРАБАВАННІ */}
          <section>
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-3 border-b border-amber-500/20 pb-1">
              📋 Вимоги
            </h3>
            <div className="space-y-1.5 text-slate-200">
              {v.requirements?.ageMax && v.requirements.ageMax < 65 && (
                <p>
                  • <span className="font-semibold">Вік:</span> до{" "}
                  {v.requirements.ageMax} років
                </p>
              )}
              <p>
                • <span className="font-semibold">Документи:</span>{" "}
                {v.requirements?.standardDocs?.join(", ")}
              </p>
              <p>
                • <span className="font-semibold">Мова:</span>{" "}
                {v.requirements?.polishLanguageLevel}
              </p>
              {v.requirements?.physicalLoad && (
                <p>
                  • <span className="font-semibold">Навантаження:</span>{" "}
                  {v.requirements.physicalLoad}
                </p>
              )}
            </div>
          </section>

          {/* ГРАФІК І ДАГАВОР */}
          <section>
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-3 border-b border-purple-500/20 pb-1">
              🕒 Графік та договір
            </h3>
            <div className="space-y-1.5 text-slate-200">
              <p>
                • <span className="font-semibold">Зміни:</span>{" "}
                {v.schedule?.description}
              </p>
              <p>
                • <span className="font-semibold">Робочі дні:</span>{" "}
                {v.schedule?.workDaysWeek}
              </p>
              {v.schedule?.breakDuration && (
                <p>
                  • <span className="font-semibold">Перерва:</span>{" "}
                  {v.schedule.breakDuration}
                </p>
              )}
              <p className="mt-3 text-blue-400 font-bold">
                📄 Тип договору: {v.contractType}
              </p>
            </div>
          </section>

          {/* ЖЫТЛО І ТРАНСПАРТ */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-3 border-b border-orange-500/20 pb-1">
                🏠 Проживання
              </h3>
              <div className="space-y-1 text-slate-300">
                <p>
                  <span className="font-semibold">Тип:</span>{" "}
                  {v.accommodation?.type}
                </p>
                {v.accommodation?.costRaw && (
                  <p className="text-orange-400">{v.accommodation.costRaw}</p>
                )}
                {v.accommodation?.details && (
                  <p className="text-xs text-slate-500 mt-1">
                    {v.accommodation.details}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-3 border-b border-cyan-500/20 pb-1">
                🚌 Транспорт
              </h3>
              <div className="space-y-1 text-slate-300">
                <p>
                  <span className="font-semibold">Давіз:</span>{" "}
                  {v.transport?.provided ? "Надається" : "Власний"}
                </p>
                {v.transport?.costRaw && (
                  <p className="text-cyan-400">{v.transport.costRaw}</p>
                )}
                {v.transport?.details && (
                  <p className="text-xs text-slate-500 mt-1">
                    {v.transport.details}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* УМОВЫ ПРАЦЫ */}
          <section>
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-3 border-b border-rose-500/20 pb-1">
              🌡 Умови праці
            </h3>
            <div className="space-y-1.5 text-slate-200">
              <p>
                • <span className="font-semibold">Робочий одяг:</span>{" "}
                {v.conditions?.workwearFree
                  ? "Безкоштовно"
                  : "За рахунок працівника"}
              </p>
              <p>
                • <span className="font-semibold">Харчування:</span>{" "}
                {v.conditions?.foodType}
              </p>
              {v.conditions?.specificNuances?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {v.conditions.specificNuances.map((n) => (
                    <span
                      key={n}
                      className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              )}
              {v.conditions?.foodDetails && (
                <p className="text-xs text-slate-500 italic mt-1">
                  {v.conditions.foodDetails}
                </p>
              )}
            </div>
          </section>

          {/* ВЫДАТКІ І КАМПЕНСАЦЫІ */}
          {(v.startExpenses?.hasStartExpenses ||
            v.employerCompensations?.hasCompensations) && (
            <section className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
              {v.startExpenses?.hasStartExpenses && (
                <div className="mb-3">
                  <p className="text-xs font-bold text-orange-400 uppercase mb-1">
                    💸 Витрати на старті
                  </p>
                  <p className="text-sm text-slate-300">
                    {v.startExpenses.details}
                  </p>
                </div>
              )}
              {v.employerCompensations?.hasCompensations && (
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
          {/* КРЫНІЦА (РАБОЧЫ ТЭКСТ) */}
          <section className="mt-8 pt-6 border-t border-slate-800 space-y-4">
            {v.isTruncated && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400 text-xs font-bold flex items-center gap-2">
                ⚠️ Увага: Гэтая вакансія створана з абрэзанага паведамлення.
              </div>
            )}
            <details className="group">
              <summary className="text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-300 transition-colors list-none flex items-center gap-2">
                <span className="group-open:rotate-90 transition-transform">
                  ▶
                </span>
                Тэкст паведамлення (Пераклад)
              </summary>
              <div className="mt-4 p-4 bg-black/40 rounded-xl border border-slate-800 text-[12px] text-slate-400 font-mono leading-relaxed whitespace-pre-wrap">
                {v.rawText || "Тэкст адсутнічае"}
              </div>
            </details>
          </section>
          {/* МЕТА-ДАНЫ */}
          <div className="pt-6 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-600">
            <span>ID: {v._id?.toUpperCase()}</span>
            <span>СТВОРАНА: {new Date(v.createdAt).toLocaleString()}</span>
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
className="text-[10px] font-bold text-slate-500 hover:text-red-400 transition-colors uppercase" >
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
