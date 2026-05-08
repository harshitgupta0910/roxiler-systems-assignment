import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "../../components/FormInput.jsx";
import toast from "react-hot-toast";
import { createStore } from "../../services/stores.js";
import { fetchUsers } from "../../services/users.js";
import { addressSchema } from "../../utils/validators.js";

const schema = z.object({
  name: z.string().min(2, "Store name is required"),
  email: z.string().email("Enter a valid email"),
  address: addressSchema,
  ownerId: z.string().min(1, "Select an owner")
});

export default function AddStore() {
  const [owners, setOwners] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    const loadOwners = async () => {
      try {
        const data = await fetchUsers();
        setOwners(data.filter((user) => user.role === "OWNER"));
      } catch (error) {
        toast.error("Failed to load owners");
      }
    };
    loadOwners();
  }, []);

  const onSubmit = async (values) => {
    try {
      await createStore(values);
      toast.success("Store created");
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create store");
    }
  };

  return (
    <div className="max-w-2xl rounded-2xl bg-white border border-slate-200 p-6 shadow-card">
      <h3 className="text-lg font-semibold text-slate-900">Add new store</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <FormInput label="Store name" error={errors.name?.message} {...register("name")} />
        <FormInput label="Store email" error={errors.email?.message} {...register("email")} />
        <FormInput label="Address" error={errors.address?.message} {...register("address")} />
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Owner</span>
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
            {...register("ownerId")}
          >
            <option value="">Select owner</option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name} - {owner.email}
              </option>
            ))}
          </select>
          {errors.ownerId && <p className="text-xs text-rose-500">{errors.ownerId.message}</p>}
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-soft hover:bg-slate-800"
        >
          {isSubmitting ? "Creating..." : "Create store"}
        </button>
      </form>
    </div>
  );
}
