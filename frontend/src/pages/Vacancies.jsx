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
import VacancyMap from "../components/vacancies/VacancyMap";
const STATUS_COLORS = {
  active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  closed: "bg-red-500/10 text-red-400 border border-red-500/20",
  archived: "bg-slate-500/10 text-slate-500 border border-slate-100/20",
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
// --- 5.0. Бяскоштаўнае жытло (Quick Toggle) ---
    if (filters.freeHousing && !v.accommodation?.isFree) {
      return false;
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
    // 🆕 КРОПКАВАЕ ДАДАННЕ (v4.1): Фільтр па крыніцах (sourceType)
    if (
      filters.sourceType?.length &&
      !filters.sourceType.includes(v.sourceType || "manual")
    )
      return false;
    // 👈 ДАДАДЗЕНА: Фільтр па тыпу дагавору (case-insensitive)
    if (filters.contractType?.length > 0) {
      const ct = (v.contractType || "").toLowerCase();
      const match = filters.contractType.some((fc) => {
        if (fc === "zlecenie") return ct.includes("zlecenie");
        if (fc === "oprace") return ct.includes("o prac");
        if (fc === "null") return !v.contractType;
        return false;
      });
      if (!match) return false;
    }
  if (filters.onlyDayShifts && !v.schedule?.onlyDayShifts) {
      return false;
    }
    // 👈 ДАДАДЗЕНА: Фільтр па гадзінах у месяц (парсінг hoursRange)
    if (filters.hoursRange?.length > 0) {
      // Парсім першую лічбу з радка: "210-270"→210, "240+"→240, "170–220"→170
      const raw = v.salary?.hoursRange || "";
      const parsed = raw.replace("–", "-").match(/(\d+)/);
      const minH = parsed ? parseInt(parsed[1]) : null;

      const match = filters.hoursRange.some((fh) => {
        if (fh === "low") return minH !== null && minH < 170;
        if (fh === "mid") return minH !== null && minH >= 170 && minH <= 220;
        if (fh === "high") return minH !== null && minH > 220;
        if (fh === "unknown") return minH === null;
        return false;
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
    // 🆕 КРОПКАВАЕ ДАДАННЕ (v4.6): Строгая фільтрацыя па updatedAt
    if (filters.startDate) {
      const start = new Date(filters.startDate);
      start.setHours(0, 0, 0, 0);
      const vDate = new Date(v.updatedAt || v.createdAt).getTime();
      if (vDate < start.getTime()) return false;
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      const vDate = new Date(v.updatedAt || v.createdAt).getTime();
      if (vDate > end.getTime()) return false;
    }
    const vAge = v.requirements?.age?.max; // Можа быць лічбай або null

    if (fMinAge !== null || fMaxAge !== null) {
      // Калі ў вакансіі няма ўзросту, а мы фільтруем — хаваем яе
      if (vAge === null || vAge === undefined || isNaN(vAge)) return false;
      if (fMinAge !== null && vAge < fMinAge) return false;
      if (fMaxAge !== null && vAge > fMaxAge) return false;
    }
    // --- 15. Крыніца (Source Type) ---
    if (
      filters.sourceType?.length > 0 &&
      !filters.sourceType.includes(v.sourceType)
    ) {
      return false;
    }
    return true;
  });
}

export default function Vacancies() {
  const location = useLocation(); // Дадалі
  const [selectedIds, setSelectedIds] = useState([]);
  // --- Рэгуляваны сайдбар (v4.5) ---
  const [sidebarWidth, setSidebarWidth] = useState(320); // Пачатковая шырыня 320px (w-80)
  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const onMouseMove = (moveEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      // Абмежаванні: мінімум 280px, максімум 450px
      if (newWidth >= 280 && newWidth <= 450) {
        setSidebarWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };
  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length && filtered.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((v) => v._id));
    }
  };
  const handleBulkDelete = async () => {
    if (!window.confirm(`Видалити ${selectedIds.length} вакансій?`)) return;
    try {
      await bulkDeleteVacancies(selectedIds);
      setVacancies((prev) => prev.filter((v) => !selectedIds.includes(v._id)));
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

  const fetchVacancies = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const res = await getVacancies(params);
      setVacancies(res.data || []);
    } catch (err) {
      console.error("Помилка при завантаженні вакансій:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Калі ўсе фільтры пустыя (скінуты), аўтаматычна прымяняем іх
    if (JSON.stringify(draft) === JSON.stringify(EMPTY_FILTERS)) {
      setApplied(EMPTY_FILTERS);
    }
  }, [draft]);
  // Калі змяняюцца актыўныя зафіксаваныя фільтры — адпраўляем даты на сервер для аптымізацыі
  useEffect(() => {
    const params = {
      // Бярэм даты з draft, каб previewCount заўсёды меў свежыя дадзеныя з сервера
      startDate: draft.startDate || undefined,
      endDate: draft.endDate || undefined,
     onlyDayShifts: draft.onlyDayShifts || undefined,
      status: applied.status?.join(","),
      agency: applied.agencyName?.join(","),
      category: applied.category?.join(","),
    };
    fetchVacancies(params);
  }, [
    fetchVacancies,
    applied.status,
    applied.agencyName,
    applied.category,
    draft.startDate,
    draft.endDate,
    draft.onlyDayShifts,
  ]);

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
          v._id === id ? { ...v, isFavorite: res.data.isFavorite } : v,
        ),
      );
    } catch (err) {
      console.error("Памылка пераключэння абранага:", err);
    }
  };
  // 1. Вакансіі, адфільтраваныя ТОЛЬКІ па датах і пошуку (Кантэкст для фільтраў)
  const instantFiltered = useMemo(() => {
    return vacancies.filter((v) => {
      // Пошук
      if (draft.search) {
        const s = draft.search.toLowerCase();
        const match =
          v.templateName?.toLowerCase().includes(s) ||
          v.vacancydescription?.toLowerCase().includes(s) ||
          v.vacancyCode?.toLowerCase().includes(s);
        if (!match) return false;
      }
      // Даты
      const vDate = new Date(v.updatedAt || v.createdAt).getTime();
      if (draft.startDate) {
        const start = new Date(draft.startDate).setHours(0, 0, 0, 0);
        if (vDate < start) return false;
      }
      if (draft.endDate) {
        const end = new Date(draft.endDate).setHours(23, 59, 59, 999);
        if (vDate > end) return false;
      }
      return true;
    });
  }, [vacancies, draft.startDate, draft.endDate, draft.search]);
  // 2. Абнаўляем dynamicData: цяпер яно глядзіць толькі на instantFiltered
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
    const sourceTypes = new Set(); // 👈 Дададзена
    // ВАЖНА: Цяпер бярэм дадзеныя з instantFiltered замест vacancies
    instantFiltered.forEach((v) => {
      if (v.agencyName) agencies.add(v.agencyName);
      if (v.sourceType) sourceTypes.add(v.sourceType);

      if (v.brand && v.brand !== "БРЕНДОВИЙ ОДЯГ") {
        brands.add(v.brand.toUpperCase().trim());
      } else {
        brands.add("NO BRAND");
      }

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
      voivodeships: Array.from(voivodeships).sort((a, b) => {
        if (a === "Польща") return -1;
        if (b === "Польща") return 1;
        if (a === "Інші країни Європи") return 1;
        if (b === "Інші країни Європи") return -1;
        return a.localeCompare(b, 'uk-UA');
      }),
      nuances: Array.from(nuances).sort(),
      sourceTypes: Array.from(sourceTypes).sort(),
    };
  }, [instantFiltered]); // 👈 Залежым ад instantFiltered

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
  // 3. Фінальны спіс: прымяняем "цяжкія" фільтры (агенцыя, статус і г.д.) да ўжо адфільтраваных па даце вакансій
  const filtered = useMemo(() => {
    // Мы перадаем applied, але даты і пошук у ім цяпер не важныя,
    // бо яны ўжо апрацаваны ў instantFiltered
    return applyFilters(instantFiltered, applied);
  }, [instantFiltered, applied]);
  const isDirty = useMemo(() => {
    const { search, startDate, endDate, ...restDraft } = draft;
    const { search: s, startDate: sd, endDate: ed, ...restApplied } = applied;
    return JSON.stringify(restDraft) !== JSON.stringify(restApplied);
  }, [draft, applied]);

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
  const handleAIUpdate = async () => {
    if (!selectedVacancyForUpdate || !autoText.trim())
      return alert("Оберіть вакансію та введіть текст");
    setAutoLoading(true);
    try {
      await aiUpdateVacancy(
        selectedVacancyForUpdate._id,
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
      prev.map((v) => (v._id === updated._id ? updated : v)),
    );
  };
const [viewMode, setViewMode] = useState("list"); // Стан для пераключэння Спіс/Мапа

  const setQuickDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    const dateStr = date.toISOString().split('T')[0];
    
    // Абнаўляем і чарнавік, і прымененыя фільтры адразу
    const newFilters = { ...draft, startDate: dateStr, endDate: "" };
    setDraft(newFilters);
    setApplied(newFilters);
  };
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* САЙДБАР З РЭГУЛЯВАННЕМ ШЫРЫНІ */}
      <aside
        style={{ width: `${sidebarWidth}px` }}
        className="hidden lg:flex flex-col shrink-0 border-r border-slate-200 bg-white sticky top-16 h-[calc(100vh-4rem)] group shadow-sm"
      >
        <VacancyFilters
          filters={draft}
          setFilters={setDraft}
          agencies={dynamicData.agencies}
          brands={dynamicData.brands}
          locations={dynamicData.locations}
          voivodeships={dynamicData.voivodeships}
          nuances={dynamicData.nuances}
          vacancies={vacancies}
        />
        {/* Рэйка для перацягвання (Resize Handle) - тонкая лінія справа */}
        <div
          onMouseDown={handleMouseDown}
          className="absolute top-0 -right-1 w-2 h-full cursor-col-resize z-10 hover:bg-emerald-500/40 transition-colors"
          title="Пацягніце, каб змяніць шырыню"
        />
      </aside>

      {/* МАБІЛЬНЫ САЙДБАР */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-80 bg-slate-200 border-r border-slate-500 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <VacancyFilters
                filters={draft}
                setFilters={setDraft}
                agencies={dynamicData.agencies}
                brands={dynamicData.brands}
                locations={dynamicData.locations}
                voivodeships={dynamicData.voivodeships}
                nuances={dynamicData.nuances}
                vacancies={instantFiltered} // 👈 ПЕРАДАЕМ ІМГНЕННЫ КАНТЭКСТ ДЛЯ ЛІЧЫЛЬНІКАЎ
              />
            </div>
            <div className="p-4 border-t border-slate-100">
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
              className="lg:hidden px-3 py-2 bg-slate-100 text-slate-500 rounded-lg"
            >
              ⚙️ Фільтри {isDirty && "●"}
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Вакансії</h1>
              <p className="text-sm text-slate-500">
                Знайдено: {filtered.length}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAutoForm(!showAutoForm)}
            className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-md shadow-emerald-100 hover:bg-emerald-700 transition-all"
          >
            ＋ Додати
          </button>
        </div>

        {/* ФОРМА ДАДАВАННЯ */}
        {showAutoForm && (
          <div className="mb-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
            <div className="flex gap-2 mb-4">
              {["auto", "template", "update"].map((m) => (
                <button
                  key={m}
                  onClick={() => setFormMode(m)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${formMode === m ? "bg-emerald-500 text-slate-900" : "bg-slate-100 text-slate-500"}`}
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
                  className="w-full bg-slate-100 border border-slate-100 rounded-lg px-3 py-2 text-sm text-slate-500"
                />
                <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-lg p-1 bg-white">
                  {filteredTemplates.map((t) => (
                    <button
                      key={t._id}
                      onClick={() => setSelectedTemplate(t)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 ${selectedTemplate?._id === t._id ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-500 hover:bg-slate-100"}`}
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
                  className="w-full bg-slate-100 border border-slate-100 rounded-lg px-3 py-2 text-sm text-slate-500"
                />
                <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-lg p-1 bg-white">
                  {filteredVacanciesForUpdate.map((v) => (
                    <button
                      key={v._id}
                      onClick={() => setSelectedVacancyForUpdate(v)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 ${selectedVacancyForUpdate?._id === v._id ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-slate-500 hover:bg-slate-100"}`}
                    >
                      <span className="font-mono text-xs bg-slate-100 px-1 rounded mr-2">
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
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all resize-none"
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
                className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-md shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50"
              >
                {autoLoading ? "Обробка..." : "Обробити та додати"}
              </button>
              <button
                onClick={handleCloseForm}
                className="px-4 py-2 bg-slate-100 text-slate-500 rounded-lg"
              >
                Скасувати
              </button>
            </div>
          </div>
        )}
        {/* ХУТКІЯ ФІЛЬТРЫ І ПЕРАКЛЮЧАЛЬНІК ВЫВАДУ */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">ЗА:</span>
            {[
              { label: "Сьогодні", days: 0 },
              { label: "2 дні", days: 1 },
              { label: "Тиждень", days: 6 },
              { label: "2 тижні", days: 13 },
            ].map((tag) => {
              const isActive = draft.startDate === new Date(new Date().setDate(new Date().getDate() - tag.days)).toISOString().split('T')[0];
              return (
                <button
                  key={tag.label}
                  onClick={() => setQuickDate(tag.days)}
                  className={`px-3 py-1.5 border rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm ${
                    isActive 
                      ? "bg-emerald-600 border-emerald-600 text-white" 
                      : "bg-white border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
                  }`}
                >
                  {tag.label}
                </button>
              );
            })}

            {/* ВІЗУАЛЬНЫ ПАДЗЯЛЯЛЬНІК */}
            <div className="w-px h-6 bg-slate-200 mx-2 shrink-0" />

            {/* КНОПКА АБРАНАЕ */}
            <button
              onClick={() => {
                const newVal = !draft.isFavorite;
                setDraft(prev => ({ ...prev, isFavorite: newVal }));
                setApplied(prev => ({ ...prev, isFavorite: newVal }));
              }}
              className={`px-3 py-1.5 border rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm flex items-center gap-1.5 ${
                draft.isFavorite 
                  ? "bg-amber-500 border-amber-500 text-white" 
                  : "bg-white border-slate-200 text-slate-600 hover:border-amber-500 hover:text-amber-600"
              }`}
            >
              <span>{draft.isFavorite ? "★" : "☆"}</span>
              ОБРАНІ
            </button>

            {/* КНОПКА ДЗЁННЫЯ ЗМЕНЫ */}
            <button
              onClick={() => {
                const newVal = !draft.onlyDayShifts;
                setDraft(prev => ({ ...prev, onlyDayShifts: newVal }));
                setApplied(prev => ({ ...prev, onlyDayShifts: newVal }));
              }}
              className={`px-3 py-1.5 border rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm flex items-center gap-1.5 ${
                draft.onlyDayShifts 
                  ? "bg-blue-500 border-blue-500 text-white" 
                  : "bg-white border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600"
              }`}
            >
              <span>☀️</span>
              ДЕННІ ЗМІНИ
            </button>
{/* КНОПКА БЕЗКОШТОВНЕ ЖИТЛО */}
            <button
              onClick={() => {
                const newVal = !draft.freeHousing;
                setDraft(prev => ({ ...prev, freeHousing: newVal }));
                setApplied(prev => ({ ...prev, freeHousing: newVal }));
              }}
              className={`px-3 py-1.5 border rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm flex items-center gap-1.5 ${
                draft.freeHousing 
                  ? "bg-indigo-600 border-indigo-600 text-white" 
                  : "bg-white border-slate-200 text-slate-600 hover:border-indigo-500 hover:text-indigo-600"
              }`}
            >
              <span>🏠</span>
              БЕЗКОШТОВНЕ ЖИТЛО
            </button>
            {(draft.startDate || draft.endDate) && (
              <button 
                onClick={() => {
                  const resetDates = { ...draft, startDate: "", endDate: "" };
                  setDraft(resetDates);
                  setApplied(resetDates);
                }}
                className="text-[10px] font-bold text-red-400 hover:text-red-600 ml-2 uppercase"
              >
                ✕ Скинути час
              </button>
            )}
          </div>

          {/* ПЕРАКЛЮЧАЛЬНІК СПІС / МАПА */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
            <button 
              onClick={() => setViewMode("list")}
              className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${viewMode === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              СПИСОК
            </button>
            <button 
              onClick={() => setViewMode("map")}
              className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${viewMode === "map" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              МАПА
            </button>
          </div>
        </div>
        {/* ПАНЭЛЬ МАСАВЫХ ДЗЕЯННЯЎ */}
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-5 py-4 mb-6 shadow-sm">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={
                filtered.length > 0 && selectedIds.length === filtered.length
              }
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-slate-100 bg-slate-100 text-emerald-500 focus:ring-emerald-500/20"
            />
            <span className="text-sm text-slate-500 font-medium">
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
        {/* ВЫВАД: СПІС АБО МАПА */}
        {viewMode === "list" ? (
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
                className={`bg-white border rounded-2xl p-6 transition-all shadow-sm hover:shadow-md ${
                  selectedIds.includes(v._id)
                    ? "border-emerald-500 ring-2 ring-emerald-500/10"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap border-b border-slate-100/50 pb-2">
                      {/* ЧЭКБОКС ДЛЯ ВЫБАРУ */}
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(v._id)}
                        onChange={() => toggleSelect(v._id)}
                        className="w-5 h-5 rounded-md border-slate-300 bg-white text-emerald-600 focus:ring-emerald-500/20"
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
                              : "text-slate-600 hover:text-slate-500"
                          }`}
                        >
                          {v.isFavorite ? "★" : "☆"}
                        </button>
                        <span className="text-[11px] font-bold font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-lg flex items-center gap-1 border border-slate-200">
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
                      <span className="text-[10px] uppercase tracking-wider font-black bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded-md">
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
                      <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-blue-100 shadow-sm">
                        📍 {locationDisplay}
                        {v.voivodeship &&
                          v.voivodeship !== "Європа (інші країни)" && (
                            <span className="text-slate-500 ml-1 font-medium">
                              ({v.voivodeship})
                            </span>
                          )}
                      </span>

                      {/* Крыніца і Даты (v4.5 - Фікс Invalid Date і іконак) */}
                      <div className="flex items-center gap-3 ml-auto">
                        <span
                          className="text-base"
                          title={`Джерело: ${v.sourceType || "manual"}`}
                        >
                          {v.sourceType === "viber"
                            ? "📱"
                            : v.sourceType === "telegram"
                              ? "✈️"
                              : v.sourceType === "spreadsheet"
                                ? "📊"
                                : v.sourceType === "trello"
                                  ? "🔵"
                                  : v.sourceType === "airtable"
                                    ? "🗄️"
                                    : "📝"}{" "}
                        </span>

                        <div className="flex flex-col items-end leading-none">
                          <span className="text-[10px] text-slate-500 font-mono">
                            {v.createdAt
                              ? new Date(v.createdAt).toLocaleDateString(
                                  "uk-UA",
                                )
                              : "---"}
                          </span>
                          {/* Паказваем UPD толькі калі дата рэальна адрозніваецца больш чым на 5 сек */}
                          {v.updatedAt &&
                            v.createdAt &&
                            new Date(v.updatedAt).getTime() >
                              new Date(v.createdAt).getTime() + 5000 && (
                              <span className="text-[9px] text-emerald-500 font-bold font-mono mt-0.5">
                                (upd:{" "}
                                {new Date(v.updatedAt).toLocaleDateString(
                                  "uk-UA",
                                )}
                                )
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                    {/* ЗАГАЛОВАК */}
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-3">
                      {v.vacancydescription || v.templateName}
                    </h3>

                    {/* РАДОК 2: БАЗАВЫЯ ЎМОВЫ (Гендэр, Вік, Графік, Жытло, Давоз, Мова) + ЗАРПЛАТА */}
                    <div className="flex flex-wrap gap-3 text-xs items-center mb-3">
                      {/* ГЕНДАР / НАБОР */}
                      <div className="flex items-center gap-2 bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-500">
                        <span className="text-slate-500 text-[10px]">👥</span>
                        <span className="text-slate-600 font-bold uppercase tracking-tight text-[10px]">
                          {Array.isArray(v.requirements?.gender)
                            ? v.requirements.gender.join(", ")
                            : v.gender || "Будь-хто"}
                          {v.requirements?.genderDescription && (
                            <span className="text-emerald-500 ml-1">*</span>
                          )}
                        </span>
                      </div>

                      {/* ВІК (Захавана) */}
                      {v.requirements?.age?.max && (
                        <div className="flex items-center gap-2 bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-500">
                          <span className="text-slate-500 text-[10px]">🎂</span>
                          <span className="text-slate-600 font-bold text-[10px]">
                            {v.requirements.age.min || 18}-{v.requirements.age.max} р.
                          </span>
                        </div>
                      )}

                      {/* ЖИТЛО (Захавана логіка "Без житла") */}
                      <div className="flex items-center gap-1.5 text-slate-500 ml-1 bg-orange-200/50 px-3 py-1.5 rounded-xl border border-orange-500">
                        <span>🏠</span>
                        <span className="font-medium">
                          {!v.accommodation?.type || v.accommodation?.type === ""
                            ? "Не вказано"
                            : v.accommodation.type.toLowerCase().includes("власн") || v.accommodation.type.toLowerCase().includes("не надаєт")
                              ? "Без житла"
                              : "Житло є"}
                          {v.accommodation?.forCouples && <span className="text-orange-400 ml-1">👫</span>}
                        </span>
                      </div>

                      {/* ДОВІЗ */}
                      <div className="flex items-center gap-1.5 text-slate-500 bg-green-200/50 px-3 py-1.5 rounded-xl border border-green-500">
                        <span>🚌</span>
                        <span className="font-medium">{v.transport?.provided ? "Є довіз" : "Немає"}</span>
                      </div>

                      {/* МОВА */}
                      <div className="flex items-center gap-1.5 text-slate-500 bg-amber-200/50 px-3 py-1.5 rounded-xl border border-amber-500">
                        <span>🗣️</span>
                        <span className="font-medium">{v.requirements?.polishLanguageLevel || "—"}</span>
                      </div>
{/* ГРАФІК І ГАДЗІНЫ (Новы яркі блок) */}
                      <div className="flex items-center gap-2 bg-blue-200/50 px-3 py-1.5 rounded-xl border border-blue-500">
                        <span className="text-blue-600 text-[10px]">{v.schedule?.onlyDayShifts ? "☀️" : "🔄"}</span>
                        <span className="text-blue-700 font-bold uppercase tracking-tight text-[10px]">
                          {v.schedule?.onlyDayShifts ? "Тільки день" : "Зміни"}
                          {v.salary?.hoursRange && (
                            <span className="ml-1.5 pl-1.5 border-l border-blue-200">
                              ⏱️ {v.salary.hoursRange} год/міс
                            </span>
                          )}
                        </span>
                      </div>
                      {/* ЗАРПЛАТА (Зроблена яркай) */}
                      {(v.salary?.rawSalaryDisplay || v.salary?.baseNetto) && (
                        <div className="flex items-center gap-2 bg-emerald-200/50  px-4 py-2 rounded-2xl ml-auto border border-emerald-500">
                          <span className="text-emerald-700 font-black text-base">
                            💰 {v.salary.rawSalaryDisplay ? v.salary.rawSalaryDisplay.split(";")[0] : `${v.salary.baseNetto} PLN`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ХМАРА ТЕГІВ v2.2 (Спецыфічныя патрабаванні: Нацыі, Дакументы, Нюансы) */}
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100/50">
                      {/* НАЦІОНАЛЬНІСТЬ */}
                      {(v.requirements?.nationalities || []).length > 0 && (
                        <span className="text-[10px] px-2 py-1 rounded-lg bg-blue-200 text-blue-700 border border-blue-500 font-bold uppercase tracking-tight shadow-sm">
                          🌍 {v.requirements.nationalities.join(", ")}
                        </span>
                      )}

                      {/* ДОКУМЕНТИ */}
                      {(v.requirements?.standardDocs || []).length > 0 && (
                        <span className="text-[10px] px-2 py-1 rounded-lg bg-slate-200 text-slate-700  font-bold uppercase tracking-tighter">
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
                            className="text-[10px] px-2 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 font-bold uppercase tracking-tight shadow-sm"
                          >
                            {icons[category] || "✨"} {category}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* КНОПКІ ДЗЕЯННЯЎ */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => setViewVacancy(v)}
                      className="w-32 px-3 py-2.5 bg-orange-200 text-orange-700 hover:bg-orange-100 border border-orange-200 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all shadow-sm flex items-center gap-2"
                    >
                      <span className="text-sm">👁️</span> ПЕРЕГЛЯД
                    </button>
                    <button
                      onClick={() => setMatchVacancy(v)}
                      className="w-32 px-3 py-2.5 bg-indigo-200 text-white hover:bg-indigo-700 border border-indigo-200 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all shadow-md shadow-indigo-100 flex items-center gap-2"
                    >
                      <span className="text-sm">🎯</span> КАНДИДАТИ
                    </button>
                    <button
                      onClick={() => setEditVacancy(v)}
                      className="w-32 px-3 py-2.5 bg-emerald-200 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all flex items-center gap-2"
                    >
                      <span className="text-sm">✏️</span> РЕДАГУВАТИ
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        ) : (
          <div className="w-full h-[70vh] min-h-[500px] block relative z-0 animate-in fade-in duration-500">
            <VacancyMap 
              vacancies={filtered} 
              onViewVacancy={(v) => setViewVacancy(v)} 
            />
          </div>
        )}
      </div>

      {/* ПЛАВАЮЧАЯ КНОПКА */}
      {isDirty && (
        <div className="hidden lg:block fixed bottom-6 right-6 z-30">
          <button
            onClick={handleApplyFilters}
            className="px-6 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95"
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
