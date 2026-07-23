import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const PUBLIC_NAV_ITEMS = [
  { to: "/", label: "Головна", exact: true },
  { to: "/jobs", label: "Підібрати вакансію" },
  { to: "/anketa", label: "Заявка на підбір" },
  { to: "/cv", label: "Створити резюме" },
  { to: "/contacts", label: "Контакти" },
];

export default function PublicLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['IBM_Plex_Sans']">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-sm">
                NW
              </div>
              <span className="font-black text-slate-900 tracking-tighter uppercase text-lg">
                Nova Work
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {PUBLIC_NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                      isActive
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-100"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white shadow-xl animate-in slide-in-from-top duration-200">
            <nav className="px-4 py-3 space-y-1">
              {PUBLIC_NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3 rounded-xl text-sm font-bold uppercase tracking-wide transition-colors ${
                      isActive ? "bg-emerald-500 text-white" : "text-slate-600 hover:bg-slate-50"
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
      <main className="pt-16">{children}</main>
      
      {/* Просты футэр */}
      <footer className="bg-white border-t border-slate-200 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            © 2026 Nova Work Agency · Безкоштовне посередництво
          </p>
        </div>
      </footer>
    </div>
  );
}