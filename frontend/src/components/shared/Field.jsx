// frontend/src/components/shared/Field.jsx
export default function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-base text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
      />
    </div>
  );
}
