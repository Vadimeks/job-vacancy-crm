import { useState, useEffect, useCallback } from "react";
import { NavLink, Link } from "react-router-dom";
import { getInboxStats } from "../services/api";

const NAV_ITEMS = [
  { to: "/", label: "Галоўная", exact: true },
  { to: "/vacancies", label: "Вакансіі" },
  { to: "/candidates", label: "Кандыдаты" },
  { to: "/templates", label: "Шаблоны" },
  { to: "/agencies", label: "Агенцыі" },
  { to: "/inbox", label: "Уваходныя" },
];

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Функцыя загрузкі статыстыкі
  const fetchUnread = useCallback(async () => {
    try {
      const res = await getInboxStats();
      setUnreadCount(res.data.total || 0);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  useEffect(() => {
    // Выкарыстоўваем setTimeout, каб пазбегнуць памылкі "cascading renders"
    // Гэта робіць выклік асінхронным адносна цела эфекту
    const timeoutId = setTimeout(() => {
      fetchUnread();
    }, 0);

    // Слухаем падзею абнаўлення інбокса
    const handleUpdate = () => fetchUnread();
    window.addEventListener("inboxUpdated", handleUpdate);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("inboxUpdated", handleUpdate);
    };
  }, [fetchUnread]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['IBM_Plex_Sans']">
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-900 font-bold text-sm">
                RC
              </div>
              <span className="font-semibold text-slate-100 hidden sm:block">
                RecrutCRM
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-2 ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                    }`
                  }
                >
                  {item.label}
                  {item.to === "/inbox" && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <div className="relative">
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
                    d={
                      menuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
                {!menuOpen && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>
                )}
              </div>
            </button>
          </div>
        </div>

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
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "text-slate-400 hover:bg-slate-800"
                    }`
                  }
                >
                  <span>{item.label}</span>
                  {item.to === "/inbox" && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>
      <main className="pt-16">{children}</main>
    </div>
  );
}
