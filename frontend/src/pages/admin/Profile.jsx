import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import FormInput from "../../components/FormInput.jsx";
import { passwordSchema } from "../../utils/validators.js";
import api from "../../services/api.js";
import { useAuth } from "../../hooks/useAuth.js";

const schema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema
});

export default function Profile() {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      await api.put("/users/password", values);
      toast.success("Password updated");
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update password");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-card">
        <h3 className="text-lg font-semibold text-slate-900">Profile</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Name</p>
            <p className="text-sm text-slate-700">{user?.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Email</p>
            <p className="text-sm text-slate-700">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Role</p>
            <p className="text-sm text-slate-700">{user?.role}</p>
          </div>
        </div>
      </div>

      <div className="max-w-xl rounded-2xl bg-white border border-slate-200 p-6 shadow-card">
        <h3 className="text-lg font-semibold text-slate-900">Update password</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          <FormInput label="Current password" type="password" error={errors.currentPassword?.message} {...register("currentPassword")} />
          <FormInput label="New password" type="password" error={errors.newPassword?.message} {...register("newPassword")} />
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-soft hover:bg-slate-800"
          >
            {isSubmitting ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
