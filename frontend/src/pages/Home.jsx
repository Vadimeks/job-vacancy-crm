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

        // 4 самых свежых актыўных вакансіі
        setVacancies(all.filter((v) => v.status === "active").slice(0, 4));
      } catch {
        console.error("Памылка загрузкі");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-slate-950 to-slate-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium">
                {stats.today > 0
                  ? `+${stats.today} вакансій сёння`
                  : "Сістэма актыўная"}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-100 leading-tight mb-6">
              Работа ў Польшчы
              <span className="block text-emerald-400">для ўкраінцаў</span>
            </h1>

            <p className="text-lg text-slate-400 mb-8 max-w-xl">
              Актуальныя вакансіі ад правераных агенцый. Безкаштоўнае
              пасрэдніцтва, афіцыйнае аформленне, жытло і транспарт.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/vacancies"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-xl transition-colors"
              >
                Усе вакансіі &#8594;
              </Link>

              <a
                href="#vacancies"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium rounded-xl transition-colors"
              >
                Свежыя вакансіі
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* СТАТЫСТЫКА */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Усяго вакансій", value: stats.total },
            { label: "Актыўных", value: stats.active },
            { label: "Дадана сёння", value: stats.today },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center"
            >
              <div className="text-3xl font-bold text-emerald-400">
                {s.value}
              </div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* СВЕЖЫЯ ВАКАНСІІ */}
      <section
        id="vacancies"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">
            Свежыя вакансіі
          </h2>
          <Link
            to="/vacancies"
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Усе вакансіі &#8594;
          </Link>
        </div>

        {loading ? (
          <div className="text-slate-500 text-sm">Загрузка...</div>
        ) : vacancies.length === 0 ? (
          <div className="text-center py-12 text-slate-600">
            <div className="text-3xl mb-2">💼</div>
            <div className="text-sm">Вакансій пакуль няма</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vacancies.map((v) => (
              <div
                key={v._id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
              >
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
                        Актыўная
                      </span>
                    </div>
                    <h3 className="font-medium text-slate-100 truncate">
                      {v.title}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-4">
                  <span>📍 {v.location}</span>
                  {v.agencyName && v.agencyName !== "Manual" && (
                    <span>🏢 {v.agencyName}</span>
                  )}
                  {v.salary?.base && <span>💰 {v.salary.base}</span>}
                  {v.requirements?.gender && (
                    <span>👤 {v.requirements.gender}</span>
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
                    👁 Паглядзець
                  </button>
                  {v.status === "active" && (
                    <button
                      onClick={() => {
                        setApplyVacancy(v);
                        setApplyType("want_work");
                      }}
                      className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs rounded-lg transition-colors"
                    >
                      🟢 Хачу тут працаваць
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ФУТАР */}
      <footer className="border-t border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-900 font-bold text-xs">
                RC
              </div>
              <span className="text-sm text-slate-400">RecrutCRM</span>
            </div>
            <div className="text-xs text-slate-600">
              © 2026 · Безкаштоўнае пасрэдніцтва · Афіцыйнае аформленне
            </div>
          </div>
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
