import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Store,
  Users,
  PlusCircle,
  LogOut,
  User,
  Star
} from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";

const adminLinks = [
  { label: "Dashboard", to: "/admin", icon: LayoutGrid },
  { label: "Stores", to: "/admin/stores", icon: Store },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Add Store", to: "/admin/add-store", icon: PlusCircle },
  { label: "Add User", to: "/admin/add-user", icon: PlusCircle },
  { label: "Profile", to: "/admin/profile", icon: User }
];

const userLinks = [{ label: "Stores", to: "/user", icon: Store }];

const ownerLinks = [{ label: "Store Ratings", to: "/owner", icon: Star }];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = user?.role === "ADMIN" ? adminLinks : user?.role === "OWNER" ? ownerLinks : userLinks;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 px-6 py-8 flex flex-col gap-8 transform transition-transform duration-200 lg:static lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Platform</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">Store Rating</h1>
      </div>
      <nav className="flex-1 flex flex-col gap-2">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow-soft"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
