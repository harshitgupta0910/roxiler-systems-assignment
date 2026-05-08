export default function LoadingSpinner() {
  return (
    <div className="flex items-center gap-2 text-slate-500">
      <span className="h-4 w-4 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin"></span>
      <span className="text-sm">Loading</span>
    </div>
  );
}
