import { Menu, UserCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";

export default function Navbar({ onMenu }) {
  const { user } = useAuth();

  return (
    <header className="px-6 lg:px-10 py-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          className="lg:hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-600 shadow-sm"
        >
          <Menu size={18} />
        </button>
        <div>
          <p className="text-sm text-slate-500">Welcome back</p>
          <h2 className="text-xl font-semibold text-slate-900">{user?.name || "Dashboard"}</h2>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
        <UserCircle size={20} className="text-slate-500" />
        <div className="text-sm">
          <p className="font-medium text-slate-800">{user?.email || ""}</p>
          <p className="text-slate-400 uppercase tracking-wide text-xs">{user?.role || ""}</p>
        </div>
      </div>
    </header>
  );
}
