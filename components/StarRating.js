import { useRef } from "react";
import { useI18n } from "@/lib/i18n/I18nContext";

const STAR_VALUES = [1, 2, 3, 4, 5];

function Star({ filled, size }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`lucide lucide-star ${
        filled ? "text-rating-500" : "text-secondary-500"
      }`}
    >
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </svg>
  );
}

export default function StarRating({
  rating = 0,
  onChange,
  readOnly = false,
  size = 22,
  labelledBy,
}) {
  const { t } = useI18n();
  const buttonRefs = useRef([]);

  if (readOnly) {
    return (
      <div
        role="img"
        className="flex items-center gap-0.5"
        aria-label={t("starRating.ratingValueAria", { rating })}
      >
        {STAR_VALUES.map((value) => (
          <Star key={value} filled={value <= rating} size={size} />
        ))}
      </div>
    );
  }

  // Radio group keyboard pattern: one Tab stop for the whole group, arrow
  // keys change the rating and move the focus along.
  function handleKeyDown(event) {
    const current = rating || 0;
    const next = {
      ArrowRight: Math.min(current + 1, 5),
      ArrowUp: Math.min(current + 1, 5),
      ArrowLeft: Math.max(current - 1, 1),
      ArrowDown: Math.max(current - 1, 1),
      Home: 1,
      End: 5,
    }[event.key];

    if (next) {
      event.preventDefault();
      onChange(next);
      buttonRefs.current[next - 1]?.focus();
    }
  }

  const focusableValue = rating || 1;

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : t("starRating.ratingAria")}
      onKeyDown={handleKeyDown}
      className="flex items-center gap-0.5"
    >
      {STAR_VALUES.map((value) => (
        <button
          key={value}
          ref={(element) => {
            buttonRefs.current[value - 1] = element;
          }}
          type="button"
          role="radio"
          aria-checked={value === rating}
          aria-label={t("starRating.rateValueAria", { value })}
          tabIndex={value === focusableValue ? 0 : -1}
          onClick={() => onChange(value === rating ? 0 : value)}
          className="rounded p-0.5 hover:scale-110 transition"
        >
          <Star filled={value <= rating} size={size} />
        </button>
      ))}
    </div>
  );
}
