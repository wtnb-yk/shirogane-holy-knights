import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-text-secondary focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-surface-secondary text-white shadow hover:bg-surface-secondary/80",
        secondary:
          "border-transparent bg-bg-accent text-text-primary hover:bg-bg-accent/80",
        destructive:
          "border-transparent bg-error text-white shadow hover:bg-error/80",
        outline: "text-text-primary border-surface-border hover:bg-bg-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }