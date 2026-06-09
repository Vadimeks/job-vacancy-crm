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
};

export const EMPTY_CANDIDATE_FILTERS = {
  search: "",
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
  source: [],
};
