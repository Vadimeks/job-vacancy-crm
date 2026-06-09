// frontend/src/components/shared/Divider.jsx
export default function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
        {label}
      </span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}
