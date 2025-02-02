import React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const headingVariants = cva(
  "tracking-tight pb-3 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-t from-neutral-700 to-neutral-800 dark:from-stone-200 dark:to-neutral-200",
        pink: "bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500",
        light: "bg-gradient-to-r from-blue-400 via-teal-400 to-blue-400",
        secondary: "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500",
        rainbow: "bg-gradient-to-r from-[#FF5722] via-[#FFA726] via-[#FFD54F] via-[#4CAF50] to-[#2196F3]",
        sunset: "bg-gradient-to-r from-orange-500 via-rose-500 to-purple-500",
        ocean: "bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500",
      },
      size: {
        default: "text-2xl sm:text-3xl lg:text-4xl",
        xxs: "text-base sm:text-lg lg:text-lg",
        xs: "text-lg sm:text-xl lg:text-2xl",
        sm: "text-xl sm:text-2xl lg:text-3xl",
        md: "text-2xl sm:text-3xl lg:text-4xl",
        lg: "text-3xl sm:text-4xl lg:text-5xl",
        xl: "text-4xl sm:text-5xl lg:text-6xl",
        xll: "text-5xl sm:text-6xl lg:text-[5.4rem] lg:leading-[0.5rem]",
        xxl: "text-5xl sm:text-6xl lg:text-[6rem]",
        xxxl: "text-5xl sm:text-6xl lg:text-[8rem]",
      },
      weight: {
        default: "font-bold",
        thin: "font-thin",
        base: "font-base",
        semi: "font-semibold",
        bold: "font-bold",
        black: "font-black",
      },
    },
    defaultVariants: {
      variant: "rainbow",
      size: "default",
      weight: "bold",
    },
  }
)

export interface HeadingProps extends VariantProps<typeof headingVariants> {
  asChild?: boolean
  children: React.ReactNode
  className?: string
}

const GradientHeading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ asChild, variant, weight, size, className, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "h3"
    return (
      <Comp ref={ref} {...props} className={className}>
        <span className={cn(headingVariants({ variant, size, weight }))}>
          {children}
        </span>
      </Comp>
    )
  }
)

GradientHeading.displayName = "GradientHeading"

export type Variant = "default" | "pink" | "light" | "secondary" | "rainbow" | "sunset" | "ocean"
export type Size = "default" | "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl"
export type Weight = "default" | "thin" | "base" | "semi" | "bold" | "black"

export { GradientHeading, headingVariants }