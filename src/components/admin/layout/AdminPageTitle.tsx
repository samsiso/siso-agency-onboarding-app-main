
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
  // Standard amazing day right slot, overridable
  const defaultRightSlot = (
    <span className="text-base font-semibold text-purple-400 min-w-max select-none">
      ✨ Amazing day to bits
    </span>
  );

  return (
    <div
      className={cn(
        "flex items-center justify-between py-4 mb-8 w-full",
        "border-b border-border",
        "bg-gradient-to-r from-siso-bg/80 to-transparent",
        className
      )}
    >
      <div className="flex items-center gap-5">
        <span className="rounded-full bg-gradient-to-br from-purple-500/30 to-siso-orange/40 p-3 shadow-md flex items-center justify-center">
          <Icon className="w-8 h-8 text-siso-orange drop-shadow" strokeWidth={2.2} />
        </span>
        <h1
          className="text-3xl font-bold tracking-tight text-siso-text leading-snug"
          style={{
            fontFamily: "Inter, sans-serif",
            letterSpacing: "-0.03em",
            lineHeight: "1.15",
          }}
        >
          {title}
        </h1>
        {children}
      </div>
      <div>
        {rightSlot ?? defaultRightSlot}
      </div>
    </div>
  );
}
