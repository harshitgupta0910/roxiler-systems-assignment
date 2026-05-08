import { Star } from "lucide-react";
import { useState } from "react";

export default function RatingStars({ value = 0, onChange, disabled }) {
  const [hovered, setHovered] = useState(null);
  const displayValue = hovered ?? value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((score) => (
        <button
          key={score}
          type="button"
          disabled={disabled}
          onMouseEnter={() => setHovered(score)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange?.(score)}
          className="transition"
        >
          <Star
            size={18}
            className={
              score <= displayValue
                ? "fill-emerald-400 text-emerald-400"
                : "text-slate-300"
            }
          />
        </button>
      ))}
    </div>
  );
}
