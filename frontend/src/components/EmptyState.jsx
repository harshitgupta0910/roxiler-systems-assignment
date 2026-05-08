export default function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-card">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}
