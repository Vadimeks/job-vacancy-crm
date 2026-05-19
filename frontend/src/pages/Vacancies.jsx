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

  const handleCloseForm = () => {
    setShowAutoForm(false);
    setAutoText("");
    setSelectedTemplate(null);
    setFormMode("auto");
  };

  const handleSaveEdit = (updated) => {
    setVacancies((prev) =>
      prev.map((v) => (v._id === updated._id ? updated : v)),
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* САЙДБАР */}
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
            // Разумная лакацыя: дадаем краіну толькі калі яе яшчэ няма ў назве горада
            const locationDisplay =
              v.country &&
              v.country !== "Polska" &&
              !v.location.includes(v.country)
                ? `${v.location} (${v.country})`
                : v.location;
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
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* РАДОК 1: ПАШПАРТ ВАКАНСІІ (ID, Статус, Агенцыя, Брэнд, Катэгорыя, Лакацыя) */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap border-b border-slate-800/50 pb-2">
                      {/* ID + Truncated Marker */}
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
                          {v.requirements?.gender &&
                          v.requirements.gender.length > 0
                            ? v.requirements.gender.join(", ")
                            : v.gender || "Будь-хто"}
                          {v.requirements?.genderDescription && (
                            <span className="text-emerald-500 ml-1">*</span>
                          )}
                        </span>
                      </div>

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

                      {/* ЗАРПЛАТА (Выкарыстоўваем rawSalaryDisplay для прыгажосці) */}
                      {(v.salary?.rawSalaryDisplay || v.salary?.baseNetto) && (
                        <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 ml-auto">
                          <span className="text-emerald-400 font-black text-sm">
                            💰{" "}
                            {v.salary.rawSalaryDisplay ||
                              `${v.salary.baseNetto} ${v.salary.currency || "PLN"}`}
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
                          temperature: "🌡️",
                          physical_load: "🏋️",
                          noise: "📢",
                          norms: "📈",
                          sanitary_limits: "🚫",
                          smells_allergens: "👃",
                          work_character: "🚶",
                          skills: "🛠️",
                          entry_tests: "📝",
                        };
                        const labels = {
                          temperature: "Температурний режим",
                          physical_load: "Фізично-важка праця",
                          sanitary_limits: "Санітарні обмеження",
                          smells_allergens: "Запахи та алергени",
                          noise: "Шум",
                          work_character: "Характер праці",
                          skills: "Специфічні навички",
                          norms: "Норми",
                          entry_tests: "Тести при вступі",
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
                            {icons[category] || "✨"}{" "}
                            {labels[category] || category}
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
