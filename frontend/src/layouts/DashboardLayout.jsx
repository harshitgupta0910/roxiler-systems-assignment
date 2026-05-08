import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import { motion } from "framer-motion";
import { useState } from "react";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
          aria-label="Close menu"
        />
      )}
      <div className="flex-1 flex flex-col">
        <Navbar onMenu={() => setSidebarOpen((prev) => !prev)} />
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="px-6 pb-10 lg:px-10"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
