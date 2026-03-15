// frontend/src/components/shared/Divider.jsx
export default function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <div className="flex-1 h-px bg-slate-800" />
    </div>
  );
}
