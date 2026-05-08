import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import FormInput from "../../components/FormInput.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required")
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      const data = await login(values, { remember });
      toast.success("Welcome back");
      if (data.user.role === "ADMIN") navigate("/admin");
      if (data.user.role === "OWNER") navigate("/owner");
      if (data.user.role === "USER") navigate("/user");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md rounded-3xl bg-white p-8 shadow-card"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">Welcome back</h2>
        <p className="text-sm text-slate-500">Log in to manage store ratings and insights.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <FormInput label="Email" placeholder="you@company.com" error={errors.email?.message} {...register("email")} />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 ${
                errors.password ? "border-rose-300" : "border-slate-200"
              }`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-rose-500">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between text-sm text-slate-500">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Remember me
          </label>
          <span className="text-slate-400">Secure access</span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-slate-800"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-500">
        New here?{" "}
        <Link to="/signup" className="font-semibold text-slate-900">
          Create an account
        </Link>
      </p>
    </motion.div>
  );
}
