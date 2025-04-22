
import React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface AdminPageTitleProps {
  icon: LucideIcon;
  title: string;
  rightSlot?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function AdminPageTitle({
  icon: Icon,
  title,
  rightSlot,
  className,
  children,
}: AdminPageTitleProps) {
  return (
    <div className={cn("flex items-center justify-between py-4 mb-6", className)}>
      <div className="flex items-center gap-4">
        <span className="rounded-full bg-gradient-to-br from-purple-500/20 to-siso-orange/40 p-3 shadow-md flex items-center justify-center">
          <Icon className="w-8 h-8 text-siso-orange" strokeWidth={2.2} />
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-siso-text leading-snug">
          {title}
        </h1>
        {children}
      </div>
      {rightSlot && (
        <div className="text-right text-lg font-semibold text-purple-400 min-w-max">
          {rightSlot}
        </div>
      )}
    </div>
  );
}
