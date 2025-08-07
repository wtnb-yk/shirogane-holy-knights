import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-shirogane-text-secondary focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-shirogane-surface-secondary text-white shadow hover:bg-shirogane-surface-secondary/80",
        secondary:
          "border-transparent bg-shirogane-bg-accent text-shirogane-text-primary hover:bg-shirogane-bg-accent/80",
        destructive:
          "border-transparent bg-shirogane-error text-white shadow hover:bg-shirogane-error/80",
        outline: "text-shirogane-text-primary border-shirogane-surface-border hover:bg-shirogane-bg-accent",
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