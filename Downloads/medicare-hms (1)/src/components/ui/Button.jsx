import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-soft hover:shadow-lifted",
  secondary: "bg-white text-ink-700 border border-ink-200 hover:bg-ink-50",
  accent: "bg-accent-600 text-white hover:bg-accent-700 shadow-soft",
  danger: "bg-danger-500 text-white hover:bg-red-600",
  ghost: "text-ink-600 hover:bg-ink-100",
  outline: "border border-primary-200 text-primary-700 hover:bg-primary-50",
};

const sizes = {
  sm: "text-xs px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2.5 gap-2",
  lg: "text-sm px-6 py-3 gap-2",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-xl font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </motion.button>
  );
}
