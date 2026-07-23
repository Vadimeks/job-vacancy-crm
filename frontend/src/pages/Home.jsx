// frontend/src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getVacancies } from "../services/api";
import VacancyViewModal from "../components/vacancies/VacancyViewModal";
import ApplyModal from "../components/vacancies/ApplyModal";

const STATUS_COLORS = {
  active: "bg-emerald-500/10 text-emerald-400",
  closed: "bg-red-500/10 text-red-400",
  archived: "bg-slate-500/10 text-slate-400",
};

export default function Home() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, today: 0 });
  const [viewVacancy, setViewVacancy] = useState(null);
  const [applyVacancy, setApplyVacancy] = useState(null);
  const [applyType, setApplyType] = useState(null);
 useEffect(() => {
    const load = async () => {
      try {
        const res = await getVacancies();
        const all = res.data;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        setStats({
          total: all.length,
          active: all.filter((v) => v.status === "active").length,
          today: all.filter((v) => new Date(v.createdAt) >= today).length,
        });

        // 👈 ЗМЕНЕНА: Паказваем толькі "Featured" вакансіі (адзначаныя рэкрутэрам)
        const featured = all.filter((v) => v.isFeaturedForCandidates && v.status === "active");
        // Калі такіх няма, паказваем 4 апошнія актыўныя (фолбэк)
        setVacancies(featured.length > 0 ? featured.slice(0, 4) : all.filter(v => v.status === "active").slice(0, 4));
      } catch {
        console.error("Памылка загрузкі");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
  {/* HERO SECTION */}
  <section className="relative pt-10 pb-20 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            {/* ЛЕВЫ СЛУПОК: Тэкст і Кнопка */}
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 rounded-full px-4 py-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-emerald-700 text-xs font-black uppercase tracking-widest">
                  {stats.today > 0 ? `+${stats.today} вакансій сьогодні` : "Система активна"}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter">
                РОБОТА В ПОЛЬЩІ <br />
                <span className="text-emerald-500">ДЛЯ УКРАЇНЦІВ</span>
              </h1>

              <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto lg:mx-0">
                Актуальні вакансії від перевірених агенцій. Безкоштовне посередництво, офіційне оформлення, житло та транспорт.
              </p>

              <div className="pt-4">
                <Link
                  to="/jobs"
                  className="inline-block px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 transition-all hover:-translate-y-1 uppercase tracking-widest text-sm"
                >
                  Підібрати вакансію →
                </Link>
              </div>
            </div>

            {/* ПРАВЫ СЛУПОК: Статыстыка (Вертыкальна) */}
            <div className="w-full lg:w-72 space-y-4">
              {[
                { label: "Всього вакансій", value: stats.total, icon: "💼" },
                { label: "Активних зараз", value: stats.active, icon: "🔥" },
                { label: "Додано сьогодні", value: stats.today, icon: "✨" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center gap-5"
                >
                  <div className="text-3xl">{s.icon}</div>
                  <div>
                    <div className="text-2xl font-black text-slate-900 leading-none">{s.value}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>


      {/* СВЕЖЫЯ ВАКАНСІІ */}
      <section
        id="vacancies"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Популярні вакансії</h2>
          <Link
            to="/vacancies"
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Усі вакансії &#8594;
          </Link>
        </div>

        {loading ? (
          <div className="text-slate-500 text-sm">Завантаження...</div>
        ) : vacancies.length === 0 ? (
          <div className="text-center py-12 text-slate-600">
            <div className="text-3xl mb-2">💼</div>
            <div className="text-sm">Вакансій поки немає</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vacancies.map((v) => (
              <div key={v._id} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-emerald-100 transition-all group border-b-4 border-b-slate-200 hover:border-b-emerald-500">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {v.vacancyCode && (
                        <span className="text-xs font-mono text-slate-600">
                          {v.vacancyCode}
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[v.status]}`}
                      >
                        Активна
                      </span>
                    </div>
                    <h3 className="font-medium text-slate-900 truncate">
                      {v.vacancydescription || v.templateName}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-4">
                  <span>📍 {v.location}</span>
                  {v.agencyName && v.agencyName !== "Manual" && (
                    <span>🏢 {v.agencyName}</span>
                  )}
                  {v.salary?.baseNetto && <span>💰 {v.salary.baseNetto}</span>}
                  {v.requirements?.gender && (
                    <span>
                      👤{" "}
                      {Array.isArray(v.requirements.gender)
                        ? v.requirements.gender.join(", ")
                        : v.requirements.gender}
                    </span>
                  )}
                  {v.arrivalDate && <span>📅 {v.arrivalDate}</span>}
                </div>

                <div className="text-xs text-slate-600">
                  {new Date(v.createdAt).toLocaleString("uk-UA", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                {/* Кнопкі */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setViewVacancy(v)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors"
                  >
                    👁 Переглянути
                  </button>
                  {v.status === "active" && (
                    <button
                      onClick={() => {
                        setApplyVacancy(v);
                        setApplyType("want_work");
                      }}
                      className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs rounded-lg transition-colors"
                    >
                      🟢 Хочу тут працювати
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ФУТАР */}
      <footer className="bg-white border-t border-slate-200 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            © 2026 Nova Work Agency · Безкоштовне посередництво
          </p>
        </div>
      </footer>
      {viewVacancy && (
        <VacancyViewModal
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
