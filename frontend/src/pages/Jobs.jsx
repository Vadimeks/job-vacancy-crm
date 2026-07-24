import { useEffect, useState, useMemo } from "react";
import { getVacancies } from "../services/api";
import PublicVacancyFilters from "../components/vacancies/PublicVacancyFilters";
import VacancyViewModal from "../components/vacancies/VacancyViewModal";
import ApplyModal from "../components/vacancies/ApplyModal";
import { EMPTY_FILTERS } from "../constants/filters";
import * as MD from "../constants/masterData";

export default function Jobs() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [limit, setLimit] = useState(4);
  const [viewVacancy, setViewVacancy] = useState(null);
  const [applyVacancy, setApplyVacancy] = useState(null);
  const [applyType, setApplyType] = useState(null);

  useEffect(() => {
    getVacancies({ status: "active" }).then(res => {
      setVacancies(res.data);
      setLoading(false);
    });
  }, []);

  // Логіка фільтрацыі (спрошчаная версія)
  const filtered = useMemo(() => {
    return vacancies.filter(v => {
      if (appliedFilters.category?.length > 0 && !appliedFilters.category.includes(v.category)) return false;
      if (appliedFilters.gender?.length > 0 && !appliedFilters.gender.some(g => v.requirements?.gender?.includes(g))) return false;
      if (appliedFilters.minSalary && v.salary?.baseNetto < Number(appliedFilters.minSalary)) return false;
      if (appliedFilters.search) {
        const s = appliedFilters.search.toLowerCase();
        return v.vacancydescription?.toLowerCase().includes(s) || v.location?.toLowerCase().includes(s);
      }
      return true;
    });
  }, [vacancies, appliedFilters]);

  const handleSearch = () => {
    setAppliedFilters(filters);
    setLimit(10); // Павялічваем ліміт пасля пошуку
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* САЙДБАР З ФІЛЬТРАМІ */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm sticky top-24">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">Пошук роботи</h3>
            <PublicVacancyFilters 
              filters={filters} 
              setFilters={setFilters} 
              voivodeships={MD.VOIVODESHIPS}
            />
            <button
              onClick={handleSearch}
              className="w-full mt-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-100 transition-all uppercase tracking-widest text-xs"
            >
              Знайти вакансії
            </button>
          </div>
        </aside>

        {/* СПІС ВАКАНСІЙ */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-900 uppercase">
              {filtered.length > 0 ? `Знайдено варіантів: ${filtered.length}` : "Вакансії для вас"}
            </h2>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">Завантаження...</div>
          ) : filtered.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-[3rem] p-12 text-center">
              <p className="text-slate-500 font-medium mb-6">На жаль, за вашими параметрами нічого не знайдено.</p>
              <a href="tel:+48780770745" className="inline-block px-8 py-4 bg-slate-900 text-white font-black rounded-2xl uppercase tracking-widest text-xs">
                Зв'язатися з рекрутером
              </a>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.slice(0, limit).map(v => (
                  <div key={v._id} className="bg-white border border-slate-200 rounded-[2.5rem] p-6 hover:shadow-xl transition-all group">
                    <h3 className="text-lg font-black text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">{v.vacancydescription}</h3>
                    <div className="flex flex-wrap gap-3 text-xs font-bold text-slate-500 mb-6">
                      <span className="bg-slate-50 px-3 py-1 rounded-full">📍 {v.location.split(',')[0]}</span>
                      <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">💰 {v.salary?.baseNetto || "Ставка"} PLN</span>
                    </div>
                    <button 
                      onClick={() => setViewVacancy(v)}
                      className="w-full py-3 bg-slate-100 hover:bg-emerald-500 hover:text-white text-slate-600 font-black rounded-xl uppercase tracking-widest text-[10px] transition-all"
                    >
                      Переглянути деталі
                    </button>
                  </div>
                ))}
              </div>

              {filtered.length > limit && (
                <div className="pt-10 text-center">
                  <p className="text-slate-400 text-sm mb-4">Знайдено ще {filtered.length - limit} вакансій</p>
                  <button 
                    onClick={() => window.location.href = "https://t.me/InnaNovaWork"}
                    className="px-10 py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 uppercase tracking-widest text-xs"
                  >
                    Отримати повний список у рекрутера
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* МАДАЛКІ */}
      {viewVacancy && (
        <VacancyViewModal
          mode="public"
          vacancy={viewVacancy}
          onClose={() => setViewVacancy(null)}
          onApply={(v, type) => {
            setViewVacancy(null);
            setApplyVacancy(v);
            setApplyType(type);
          }}
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
    </div>
  );
}