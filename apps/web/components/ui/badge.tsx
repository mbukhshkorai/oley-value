import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-700 ring-gray-200",
        new: "bg-info-100 text-info-700 ring-info-200",
        contacted: "bg-warning-100 text-warning-700 ring-warning-200",
        qualified: "bg-success-100 text-success-700 ring-success-200",
        lost: "bg-error-100 text-error-700 ring-error-200",
        viewed: "bg-success-100 text-success-700 ring-success-200",
        sent: "bg-info-100 text-info-700 ring-info-200",
        draft: "bg-gray-100 text-gray-600 ring-gray-200",
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
