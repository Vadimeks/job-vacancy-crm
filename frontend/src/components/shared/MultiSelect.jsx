import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

export default function MultiSelect({
  label,
  options = [],
  selected = [],
  onChange,
  placeholder = "Выбраць...",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (val) => {
    const next = selected.includes(val)
      ? selected.filter((s) => s !== val)
      : [...selected, val];
    onChange(next);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
          {label}
        </label>
      )}

      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`min-h-[44px] w-full bg-white border ${
          isOpen
            ? "border-emerald-500/50 ring-4 ring-emerald-500/5"
            : "border-slate-200"
        } rounded-xl px-4 py-2 flex items-center justify-between cursor-pointer transition-all shadow-sm hover:border-slate-300`}
      >
        <div className="flex flex-wrap gap-1">
          {selected.length === 0 ? (
            <span className="text-slate-400 text-sm">{placeholder}</span>
          ) : (
            selected.map((val) => {
              // Шукаем аб'ект опцыі або выкарыстоўваем само значэнне
              const opt = options.find((o) => o.value === val || o === val);
              const displayLabel = opt?.label || opt || val;

              return (
                <span
                  key={val}
                  className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1.5 shadow-sm"
                >
                  {displayLabel}
                  <X
                    size={10}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(val);
                    }}
                    className="hover:text-emerald-200 transition-colors"
                  />
                </span>
              );
            })
          )}
        </div>
        <ChevronDown
          size={14}
          className={`text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[100] max-h-72 overflow-y-auto custom-scrollbar p-1.5">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-xs text-slate-500 italic">
              Няма варыянтаў
            </div>
          ) : (
            options.map((opt) => {
              const val = opt.value || opt;
              const lbl = opt.label || opt;
              const isSelected = selected.includes(val);

              return (
                <div
                  key={val}
                  onClick={() => toggleOption(val)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-4 h-4 border rounded-md flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-slate-300"
                    }`}
                  >
                    {isSelected && (
                      <span className="text-white text-[10px]">✓</span>
                    )}
                  </div>
                  <span className="truncate">{lbl}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
