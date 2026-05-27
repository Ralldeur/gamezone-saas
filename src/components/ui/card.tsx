"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "blue" | "purple" | "green" | "red" | "yellow";
  hover?: boolean;
}

const glowColors = {
  blue: "hover:shadow-blue-500/10 hover:border-blue-500/30",
  purple: "hover:shadow-purple-500/10 hover:border-purple-500/30",
  green: "hover:shadow-green-500/10 hover:border-green-500/30",
  red: "hover:shadow-red-500/10 hover:border-red-500/30",
  yellow: "hover:shadow-yellow-500/10 hover:border-yellow-500/30",
};

export function Card({
  children,
  className,
  glow,
  hover = false,
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 transition-all duration-300",
        hover && "hover:shadow-xl cursor-pointer",
        glow && glowColors[glow],
        className
      )}
    >
      {children}
    </motion.div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
  glow?: "blue" | "purple" | "green" | "red" | "yellow";
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  glow = "blue",
}: StatCardProps) {
  return (
    <Card glow={glow} className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="p-3 bg-gray-800/50 rounded-xl">{icon}</div>
      </div>
      <div
        className={cn(
          "absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-5",
          glow === "blue" && "bg-blue-500",
          glow === "purple" && "bg-purple-500",
          glow === "green" && "bg-green-500",
          glow === "red" && "bg-red-500",
          glow === "yellow" && "bg-yellow-500"
        )}
      />
    </Card>
  );
}
