import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const badgeVariants = {
  default: "bg-gray-800 text-gray-300 border-gray-700",
  success: "bg-green-400/10 text-green-400 border-green-500/20",
  warning: "bg-yellow-400/10 text-yellow-400 border-yellow-500/20",
  danger: "bg-red-400/10 text-red-400 border-red-500/20",
  info: "bg-blue-400/10 text-blue-400 border-blue-500/20",
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
