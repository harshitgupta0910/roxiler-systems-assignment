import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <Search size={18} className="text-slate-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
      />
    </div>
  );
}
