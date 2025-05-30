import React from "react";
import { cn } from "@/lib/utils";

interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function RainbowButton({
  children,
  className,
  onClick,
  ...props
}: RainbowButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Remove stopPropagation to allow event bubbling
    console.log('RainbowButton clicked');
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group relative inline-flex h-11 animate-rainbow cursor-pointer items-center justify-center rounded-xl border-0 bg-[length:200%] px-8 py-2 font-medium text-white transition-colors [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 pointer-events-auto relative z-30",

        // before styles - glow effect
        "before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,#FF5722,#FFA726,#FFB74D)] before:bg-[length:200%] before:[filter:blur(calc(0.8*1rem))] before:pointer-events-none",

        // gradient background
        "bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,#FF5722,#FFA726,#FFB74D)]",

        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}