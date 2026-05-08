export default function DashboardCard({ label, value, helper }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-card">
      <p className="text-sm text-slate-500">{label}</p>
      <div className="mt-4 text-3xl font-semibold text-slate-900">{value}</div>
      {helper && <p className="mt-2 text-xs text-slate-400">{helper}</p>}
    </div>
  );
}
