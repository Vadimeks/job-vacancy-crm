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
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
          {label}
        </label>
      )}

      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`min-h-[38px] w-full bg-slate-800/50 border ${
          isOpen ? "border-emerald-500/50" : "border-slate-700"
        } rounded-xl px-3 py-1.5 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-800`}
      >
        <div className="flex flex-wrap gap-1">
          {selected.length === 0 ? (
            <span className="text-slate-500 text-xs">{placeholder}</span>
          ) : (
            selected.map((val) => {
              // Шукаем аб'ект опцыі або выкарыстоўваем само значэнне
              const opt = options.find((o) => o.value === val || o === val);
              const displayLabel = opt?.label || opt || val;

              return (
                <span
                  key={val}
                  className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1"
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
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-[100] max-h-60 overflow-y-auto custom-scrollbar p-1">
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
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 border rounded flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-slate-600"
                    }`}
                  >
                    {isSelected && (
                      <span className="text-slate-900 text-[10px]">✓</span>
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
