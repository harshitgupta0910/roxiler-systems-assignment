import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import FormInput from "../../components/FormInput.jsx";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth.js";
import { addressSchema, nameSchema, passwordSchema } from "../../utils/validators.js";

const schema = z.object({
  name: nameSchema,
  email: z.string().email("Enter a valid email"),
  address: addressSchema.optional(),
  password: passwordSchema
});

function strengthLabel(score) {
  if (score >= 3) return { label: "Strong", color: "text-emerald-500" };
  if (score === 2) return { label: "Good", color: "text-indigo-500" };
  return { label: "Needs work", color: "text-rose-500" };
}

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema) });

  const passwordValue = watch("password", "");
  const strength = useMemo(() => {
    let score = 0;
    if (passwordValue.length >= 8) score += 1;
    if (/[A-Z]/.test(passwordValue)) score += 1;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score += 1;
    return strengthLabel(score);
  }, [passwordValue]);

  const onSubmit = async (values) => {
    try {
      await register(values);
      toast.success("Account created");
      navigate("/user");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
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
        <h2 className="text-2xl font-semibold text-slate-900">Create your account</h2>
        <p className="text-sm text-slate-500">Join the platform and start rating stores.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <FormInput label="Full name" placeholder="Your full legal name" error={errors.name?.message} {...formRegister("name")} />
        <FormInput label="Email" placeholder="you@company.com" error={errors.email?.message} {...formRegister("email")} />
        <FormInput label="Address" placeholder="Street, City, Country" error={errors.address?.message} {...formRegister("address")} />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 ${
                errors.password ? "border-rose-300" : "border-slate-200"
              }`}
              {...formRegister("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{errors.password?.message || "Use uppercase and a special character"}</span>
            <span className={strength.color}>{strength.label}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-slate-800"
        >
          {isSubmitting ? "Creating..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-slate-900">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
