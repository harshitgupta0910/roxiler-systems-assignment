import { forwardRef } from "react";

const FormInput = forwardRef(function FormInput(
  { label, error, type = "text", ...props },
  ref
) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        ref={ref}
        type={type}
        {...props}
        className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 ${
          error ? "border-rose-300" : "border-slate-200"
        }`}
      />
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </label>
  );
});

export default FormInput;
