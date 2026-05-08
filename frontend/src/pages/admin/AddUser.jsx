import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "../../components/FormInput.jsx";
import toast from "react-hot-toast";
import { createUser } from "../../services/users.js";
import { addressSchema, nameSchema, passwordSchema } from "../../utils/validators.js";

const schema = z.object({
  name: nameSchema,
  email: z.string().email("Enter a valid email"),
  address: addressSchema.optional(),
  password: passwordSchema,
  role: z.enum(["ADMIN", "USER", "OWNER"])
});

export default function AddUser() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      await createUser(values);
      toast.success("User created");
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create user");
    }
  };

  return (
    <div className="max-w-2xl rounded-2xl bg-white border border-slate-200 p-6 shadow-card">
      <h3 className="text-lg font-semibold text-slate-900">Add new user</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <FormInput label="Full name" error={errors.name?.message} {...register("name")} />
        <FormInput label="Email" error={errors.email?.message} {...register("email")} />
        <FormInput label="Address" error={errors.address?.message} {...register("address")} />
        <FormInput label="Password" type="password" error={errors.password?.message} {...register("password")} />
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Role</span>
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
            {...register("role")}
          >
            <option value="USER">Normal user</option>
            <option value="OWNER">Store owner</option>
            <option value="ADMIN">System admin</option>
          </select>
          {errors.role && <p className="text-xs text-rose-500">{errors.role.message}</p>}
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-soft hover:bg-slate-800"
        >
          {isSubmitting ? "Creating..." : "Create user"}
        </button>
      </form>
    </div>
  );
}
