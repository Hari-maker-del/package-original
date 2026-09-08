import { ArrowRight } from "lucide-react";

function Button({
  children,
  variant = "primary",
  onClick,
  className = "",
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200";

  const variants = {
    primary:
      "bg-teal-700 text-white hover:bg-teal-800 shadow-sm hover:shadow-md",

    secondary:
      "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50",

    ghost:
      "text-slate-700 hover:bg-slate-100",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}

      {variant === "primary" && (
        <ArrowRight size={17} strokeWidth={2} />
      )}
    </button>
  );
}

export default Button;