// frontend/src/pages/Vacancies.jsx
import { useEffect, useState, useMemo } from "react";
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
  return vacancies.filter((v) => {
    // ПОШУК
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (
        !v.templateName?.toLowerCase().includes(s) &&
        !v.vacancydescription?.toLowerCase().includes(s) &&
        !v.location?.toLowerCase().includes(s) &&
        !v.agencyName?.toLowerCase().includes(s)
      )
        return false;
    }

    // СТАТУС
    if (filters.status && v.status !== filters.status) return false;

    // ГЕНДАР
    if (filters.gender.length > 0) {
      const genderArr = Array.isArray(v.requirements?.gender)
        ? v.requirements.gender.map((g) => g.toLowerCase())
        : [];
      const match = filters.gender.some((fg) =>
        fg === "female"
          ? genderArr.some((g) => g.includes("жінк"))
          : fg === "male"
            ? genderArr.some((g) => g.includes("чолов"))
            : false,
      );
      if (!match) return false;
    }

    // СФЕРА — пакуль па category
    if (filters.sphere.length > 0) {
      const cat = v.category?.toLowerCase() || "";
      const match = filters.sphere.some((s) => cat.includes(s));
      if (!match) return false;
    }

    // ГРАФІК — па schedule.shiftsCount
    if (filters.schedule.length > 0) {
      const shifts = String(v.schedule?.shiftsCount || "");
      if (!filters.schedule.some((s) => shifts.includes(s))) return false;
    }

    // ЖЫТЛО
    if (filters.accommodation.length > 0) {
      const accType = v.accommodation?.type?.toLowerCase() || "";
      const forCouples = !!v.accommodation?.forCouples;
      const match = filters.accommodation.some((a) => {
        if (a === "available") return accType && accType !== "платне";
        if (a === "none") return accType === "платне" || !accType;
        if (a === "couples") return forCouples;
        return false;
      });
      if (!match) return false;
    }

    // ТРАНСПАРТ
    if (filters.transport.length > 0) {
      const match = filters.transport.some((t) => {
        if (t === "provided") return !!v.transport?.provided;
        if (t === "none") return !v.transport?.provided;
        return false;
      });
      if (!match) return false;
    }

    // ГРУПА ПАДАРОЖЖА
    if (filters.travelGroup.length > 0) {
      const forCouples = !!v.accommodation?.forCouples;
      const match = filters.travelGroup.some((tg) => {
        if (tg === "couple") return forCouples;
        if (tg === "alone") return true;
        return false;
      });
      if (!match) return false;
    }

    // МОВА
    if (filters.language.length > 0) {
      const level = v.requirements?.polishLanguageLevel?.toLowerCase() || "";
      const match = filters.language.some((l) => {
        if (l === "none") return level.includes("не вимаг") || level === "";
        return level.includes(l.toLowerCase());
      });
      if (!match) return false;
    }

    // НАЦЫЯНАЛЬНАСЦЬ
    if (filters.nationality.length > 0) {
      const nats = Array.isArray(v.requirements?.nationalities)
        ? v.requirements.nationalities.map((n) => n.toLowerCase())
        : [];
      if (
        nats.length > 0 &&
        !filters.nationality.some((n) => nats.includes(n.toLowerCase()))
      )
        return false;
    }

    // ДАКУМЕНТЫ
    if (filters.docs.length > 0) {
      const docs = Array.isArray(v.requirements?.standardDocs)
        ? v.requirements.standardDocs.map((d) => d.toLowerCase())
        : [];
      const match = filters.docs.some((d) => {
        if (d === "none") return docs.length === 0;
        return docs.some((doc) => doc.includes(d.toLowerCase()));
      });
      if (!match) return false;
    }

    // АГЕНЦЫЯ
    if (filters.agencyName.length > 0) {
      if (!filters.agencyName.includes(v.agencyName)) return false;
    }

    return true;
  });
}

export default function Vacancies() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoText, setAutoText] = useState("");
  const [autoLoading, setAutoLoading] = useState(false);
  const [showAutoForm, setShowAutoForm] = useState(false);

  // Рэжым формы: "auto" або "template"
  const [formMode, setFormMode] = useState("auto");

  // Для рэжыму "template"
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState("");
  const [templateSearch, setTemplateSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [editVacancy, setEditVacancy] = useState(null);
  const [applyVacancy, setApplyVacancy] = useState(null);
  const [matchVacancy, setMatchVacancy] = useState(null);
  const [applyType, setApplyType] = useState(null);
  const [viewVacancy, setViewVacancy] = useState(null);

  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [applied, setApplied] = useState(EMPTY_FILTERS);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  useEffect(() => {
    fetchVacancies();
  }, []);

  // Загружаем шаблоны калі адкрываем форму ў рэжыме template
  useEffect(() => {
    if (showAutoForm && formMode === "template" && templates.length === 0) {
      setTemplatesLoading(true);
      getTemplates()
        .then((res) => setTemplates(res.data))
        .catch(() => console.error("Памылка загрузкі шаблонаў"))
        .finally(() => setTemplatesLoading(false));
    }
  }, [showAutoForm, formMode, templates.length]);

  const vacancyAgencies = useMemo(
    () =>
      [...new Set(vacancies.map((v) => v.agencyName).filter(Boolean))].sort(),
    [vacancies],
  );

  // Агенцыі з шаблонаў
  const templateAgencies = useMemo(
    () =>
      [...new Set(templates.map((t) => t.agencyName).filter(Boolean))].sort(),
    [templates],
  );

  // Адфільтраваныя шаблоны па агенцыі і пошуку
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchAgency = !selectedAgency || t.agencyName === selectedAgency;
      const q = templateSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.templateName?.toLowerCase().includes(q) ||
        t.location?.toLowerCase().includes(q) ||
        t.keywords?.some((kw) => kw.toLowerCase().includes(q));
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

  const handleResetFilters = () => {
    setDraft(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
  };

  const handleDelete = async (id) => {
    if (!confirm("Выдаліць вакансію?")) return;
    try {
      await deleteVacancy(id);
      setVacancies((prev) => prev.filter((v) => v._id !== id));
    } catch {
      alert("Памылка выдалення");
    }
  };

  // Рэжым AUTO
  const handleAutoCreate = async () => {
    if (!autoText.trim()) return;
    setAutoLoading(true);
    try {
      await createVacancyAuto(autoText);
      setAutoText("");
      setShowAutoForm(false);
      await fetchVacancies();
    } catch {
      alert("Памылка стварэння вакансіі");
    } finally {
      setAutoLoading(false);
    }
  };

  // Рэжым TEMPLATE
  const handleTemplateCreate = async () => {
    if (!selectedTemplate) return alert("Выберыце шаблон");
    if (!autoText.trim()) return alert("Устаўце тэкст вакансіі");
    setAutoLoading(true);
    try {
      await createVacancyFromTemplate(selectedTemplate._id, autoText);
      setAutoText("");
      setSelectedTemplate(null);
      setSelectedAgency("");
      setTemplateSearch("");
      setShowAutoForm(false);
      await fetchVacancies();
    } catch {
      alert("Памылка стварэння вакансіі");
    } finally {
      setAutoLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowAutoForm(false);
    setAutoText("");
    setSelectedTemplate(null);
    setSelectedAgency("");
    setTemplateSearch("");
    setFormMode("auto");
  };

  const handleSaveEdit = (updated) => {
    setVacancies((prev) =>
      prev.map((v) => (v._id === updated._id ? updated : v)),
    );
  };

  const openApply = (vacancy, type) => {
    setApplyVacancy(vacancy);
    setApplyType(type);
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
        <VacancyFilters
          draft={draft}
          onChange={setDraft}
          agencies={vacancyAgencies}
          showAgency={true}
        />
      </aside>

      {/* САЙДБАР — мабільны оверлей */}
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
              <VacancyFilters
                draft={draft}
                onChange={setDraft}
                agencies={vacancyAgencies}
                showAgency={true}
              />
            </div>
            <div className="p-4 border-t border-slate-800">
              <button
                onClick={handleApplyFilters}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold text-sm rounded-lg transition-colors"
              >
                Паказаць {previewCount} вакансій
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ГАЛОЎНАЯ ВОБЛАСЦЬ */}
      <div className="flex-1 min-w-0 p-6 lg:p-8">
        {/* Загаловак */}
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
                Вакансіі
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {filtered.length} з {vacancies.length} вакансій
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAutoForm(!showAutoForm)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-medium text-sm rounded-lg transition-colors"
          >
            <span>＋</span> Дадаць
          </button>
        </div>

        {/* ФОРМА ДАДАВАННЯ */}
        {showAutoForm && (
          <div className="mb-6 bg-slate-900 border border-slate-800 rounded-xl p-5">
            {/* Перамыкач рэжымаў */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setFormMode("auto")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formMode === "auto"
                    ? "bg-emerald-500 text-slate-900"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                🤖 Аўта (AI)
              </button>
              <button
                onClick={() => {
                  setFormMode("template");
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formMode === "template"
                    ? "bg-emerald-500 text-slate-900"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                📋 З шаблона
              </button>
            </div>

            {/* РЭЖЫМ: З ШАБЛОНА */}
            {formMode === "template" && (
              <div className="mb-4 space-y-3">
                {templatesLoading ? (
                  <div className="text-slate-500 text-sm">
                    Загрузка шаблонаў...
                  </div>
                ) : (
                  <>
                    {/* Выбар агенцыі */}
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          setSelectedAgency("");
                          setSelectedTemplate(null);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          selectedAgency === ""
                            ? "bg-emerald-500 text-slate-900"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        Усе
                      </button>
                      {templateAgencies.map((a) => (
                        <button
                          key={a}
                          onClick={() => {
                            setSelectedAgency(a);
                            setSelectedTemplate(null);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            selectedAgency === a
                              ? "bg-emerald-500 text-slate-900"
                              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                          }`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>

                    {/* Пошук шаблона */}
                    <input
                      type="text"
                      value={templateSearch}
                      onChange={(e) => {
                        setTemplateSearch(e.target.value);
                        setSelectedTemplate(null);
                      }}
                      placeholder="Пошук па назве фірмы або горадзе..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />

                    {/* Спіс шаблонаў */}
                    {(templateSearch || selectedAgency) && (
                      <div className="max-h-48 overflow-y-auto space-y-1 border border-slate-800 rounded-lg p-1">
                        {filteredTemplates.length === 0 ? (
                          <div className="text-slate-500 text-xs px-3 py-2">
                            Нічога не знойдзена
                          </div>
                        ) : (
                          filteredTemplates.map((t) => (
                            <button
                              key={t._id}
                              onClick={() => setSelectedTemplate(t)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                selectedTemplate?._id === t._id
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "text-slate-300 hover:bg-slate-800"
                              }`}
                            >
                              <span className="text-xs text-slate-500 font-mono mr-2">
                                {t.agencyName}
                              </span>
                              {t.templateName}
                            </button>
                          ))
                        )}
                      </div>
                    )}

                    {/* Абраны шаблон */}
                    {selectedTemplate && (
                      <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-2">
                        <span className="text-emerald-400 text-sm">✓</span>
                        <span className="text-sm text-emerald-400 font-medium">
                          {selectedTemplate.templateName}
                        </span>
                        <button
                          onClick={() => setSelectedTemplate(null)}
                          className="ml-auto text-slate-500 hover:text-slate-300 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* TEXTAREA — агульная для абодвух рэжымаў */}
            <textarea
              value={autoText}
              onChange={(e) => setAutoText(e.target.value)}
              placeholder={
                formMode === "template"
                  ? "Устаўце тэкст вакансіі — AI зробіць мерж з абраным шаблонам..."
                  : "Устаўце тэкст вакансіі з чата агенцыі..."
              }
              rows={4}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
            />

            <div className="flex gap-3 mt-3">
              <button
                onClick={
                  formMode === "template"
                    ? handleTemplateCreate
                    : handleAutoCreate
                }
                disabled={
                  autoLoading ||
                  !autoText.trim() ||
                  (formMode === "template" && !selectedTemplate)
                }
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-medium text-sm rounded-lg transition-colors"
              >
                {autoLoading ? "Апрацоўка..." : "Апрацаваць і дадаць"}
              </button>
              <button
                onClick={handleCloseForm}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
              >
                Адмена
              </button>
            </div>
          </div>
        )}

        {/* СПІС ВАКАНСІЙ */}
        {loading ? (
          <div className="text-slate-500 text-sm">Загрузка...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-600">
            <div className="text-4xl mb-3">🔍</div>
            <div className="text-sm">
              Вакансій па гэтых фільтрах не знойдзена
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
            {filtered.map((v) => (
              <div
                key={v._id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      {v.vacancyCode && (
                        <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                          {v.vacancyCode}
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[v.status]}`}
                      >
                        {STATUS_LABELS[v.status]}
                      </span>
                      <span className="text-xs text-slate-600">
                        {new Date(v.createdAt).toLocaleString("uk-UA", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <h3 className="font-medium text-slate-100 truncate">
                      {v.templateName || v.vacancydescription || "Без назвы"}
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                      <span>📍 {v.location}</span>
                      {v.agencyName && v.agencyName !== "Manual" && (
                        <span>🏢 {v.agencyName}</span>
                      )}
                      {v.salary?.baseNetto && (
                        <span>💰 {v.salary.baseNetto}</span>
                      )}
                      {v.requirements?.gender?.length > 0 && (
                        <span>
                          👤{" "}
                          {Array.isArray(v.requirements.gender)
                            ? v.requirements.gender.join(", ")
                            : v.requirements.gender}
                        </span>
                      )}
                      {v.arrivalDate && <span>📅 {v.arrivalDate}</span>}
                    </div>
                    {v.status === "active" && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => openApply(v, "want_work")}
                          className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-medium transition-colors"
                        >
                          🟢 Хачу тут працаваць
                        </button>
                        <button
                          onClick={() => openApply(v, "want_info")}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-xs font-medium transition-colors"
                        >
                          💬 Дазнацца дэталі
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => setViewVacancy(v)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors text-xs"
                    >
                      👁 Паглядзець
                    </button>
                    <button
                      onClick={() => setMatchVacancy(v)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors text-xs"
                    >
                      🎯 Кандыдаты
                    </button>
                    <button
                      onClick={() => setEditVacancy(v)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors text-xs"
                    >
                      ✏️ Рэд.
                    </button>
                    <button
                      onClick={() => handleDelete(v._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-xs"
                    >
                      🗑 Выд.
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
          onApply={openApply}
          onMatch={(v) => {
            setViewVacancy(null);
            setMatchVacancy(v);
          }}
        />
      )}
    </div>
  );
}
