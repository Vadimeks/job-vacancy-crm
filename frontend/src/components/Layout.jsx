// frontend/src/components/Layout.jsx
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Галоўная", exact: true },
  { to: "/vacancies", label: "Вакансіі" },
  { to: "/candidates", label: "Кандыдаты" },
  { to: "/templates", label: "Шаблоны" },
  { to: "/agencies", label: "Агенцыі" },
  { to: "/inbox", label: "Уваходныя" }, // Дадалі сюды
];

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['IBM_Plex_Sans']">
      {/* ХЕДАР */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Лагатып */}
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-900 font-bold text-sm">
                RC
              </div>
              <span className="font-semibold text-slate-100 hidden sm:block">
                RecrutCRM
              </span>
            </Link>

            {/* Дэсктопная навігацыя */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Мабільны бургер */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {menuOpen ? (
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Мабільнае меню */}
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
                    `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Кантэнт */}
      <main className="pt-16">{children}</main>
    </div>
  );
}
