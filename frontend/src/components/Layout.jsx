// frontend/src/components/Layout.jsx
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/vacancies", icon: "💼", label: "Вакансіі" },
  { to: "/candidates", icon: "👥", label: "Кандыдаты" },
  { to: "/templates", icon: "📋", label: "Шаблоны" },
];

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-['IBM_Plex_Sans']">
      {/* Сайдбар */}
      <aside className="w-60 bg-slate-900 border-r border-slate-800 flex flex-col">
        {/* Лагатып */}
        <div className="px-6 py-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-900 font-bold text-sm">
              RC
            </div>
            <div>
              <div className="font-semibold text-sm text-slate-100">
                RecrutCRM
              </div>
              <div className="text-xs text-slate-500">v1.0</div>
            </div>
          </div>
        </div>

        {/* Навігацыя */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 font-medium"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Ніз сайдбара */}
        <div className="px-6 py-4 border-t border-slate-800">
          <div className="text-xs text-slate-600">Рэкрутэр-фрылансер</div>
        </div>
      </aside>

      {/* Галоўная вобласць */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
