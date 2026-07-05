// frontend/src/constants/filters.js

export const EMPTY_FILTERS = {
  search: "",
  isFavorite: false, // 👈 Дададзена
  minSalary: "", // 👈 Дададзена
  maxSalary: "", // 👈 Дададзена
  minAge: "", // 👈 Дададзена
  maxAge: "", // 👈 Дададзена
  status: [],
  voivodeship: [],
  location: [],
  category: [],
  gender: [],
  schedule: [],
  accommodation: [],
  transport: [],
  language: [],
  nationality: [],
  docs: [],
  agencyName: [],
  brand: [],
  nuances: [],
  sourceType: [], // Масіў для мульцівыбару крыніц (viber, telegram, spreadsheet)
  startDate: "", // Пачатковая дата фільтра
  endDate: "", // Канчатковая дата фільтра
  contractType: [], // 👈 ДАДАДЗЕНА: Фільтр па тыпу дагавору
  hoursRange: [], // 👈 ДАДАДЗЕНА: Фільтр па гадзінах у месяц
  onlyDayShifts: false,
  freeHousing: false,
};

export const EMPTY_CANDIDATE_FILTERS = {
  search: "",
  status: [],
  voivodeship: [],
  locationNotes: "", // 👈 НОВАЕ: тэкставы пошук-падрадак (замяняе стары citySearch)
  sphere: [],
  gender: [],
  accommodation: [],
  freeHousing: false, // 👈 НОВАЕ: хуткі тумблер "толькі бясплатнае жытло" (сіметрычна EMPTY_FILTERS.freeHousing)
  transport: [],
  language: [], // 👈 ЗМЕНЕНА: было "polishLanguageLevel" — перайменавана для супадзення з ключом фільтра вакансій
  nationality: [],
  docs: [],
  nuances: [], // 👈 НОВАЕ: чэк-ліст нюансаў (MD.CHECKLIST_ITEMS)
  source: [],
  minAge: "",
  maxAge: "",
  contractType: [],
  onlyDayShifts: false,
  hoursRange: [],
};
