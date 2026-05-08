import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_0.9fr] bg-surface">
      <div className="hidden lg:flex flex-col justify-between p-14 bg-white">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Store Rating Platform</p>
          <h1 className="mt-6 text-4xl font-semibold text-slate-900 leading-tight">
            A smarter way to understand storefront experiences.
          </h1>
          <p className="mt-4 text-base text-slate-500 max-w-md">
            Track ratings, understand sentiment, and keep every store aligned with the highest
            expectations. Built for modern teams.
          </p>
        </div>
        <div className="text-sm text-slate-400">
          Designed for high-signal feedback and beautifully organized workflows.
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center px-6 py-12"
      >
        <div className="w-full max-w-md lg:hidden mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Store Rating Platform</p>
          <h1 className="mt-4 text-2xl font-semibold text-slate-900 leading-snug">
            A smarter way to understand storefront experiences.
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Track ratings, understand sentiment, and keep every store aligned with the highest
            expectations.
          </p>
        </div>
        <Outlet />
      </motion.div>
    </div>
  );
}
