// Layout.jsx
import { useState, useEffect, useCallback } from "react";
import { NavLink, Link } from "react-router-dom";
import { getInboxStats } from "../services/api";

const NAV_ITEMS = [
  { to: "/", label: "Головна", exact: true },
  { to: "/vacancies", label: "Вакансії" },
  { to: "/candidates", label: "Кандидати" },
  { to: "/templates", label: "Шаблони" },
  { to: "/agencies", label: "Агенції" },
  { to: "/inbox", label: "Вхідні" },
];

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = useCallback(async () => {
    try {
      const res = await getInboxStats();
      setUnreadCount(res.data.total || 0);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUnread();
    }, 0);

    const handleUpdate = () => fetchUnread();
    window.addEventListener("inboxUpdated", handleUpdate);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("inboxUpdated", handleUpdate);
    };
  }, [fetchUnread]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-['IBM_Plex_Sans']">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                RC
              </div>
              <span className="font-bold text-slate-900 hidden sm:block tracking-tight">
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
                    `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center gap-2 ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`
                  }
                >
                  {item.label}
                  {item.to === "/inbox" && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center font-bold shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
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
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </div>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white shadow-xl">
            <nav className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-600 hover:bg-white"
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
      <main className="pt-16 min-w-[320px] overflow-x-hidden">{children}</main>
    </div>
  );
}
