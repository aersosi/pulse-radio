import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const pulseBG = "bg-green-500/10"
const pulseText = "text-green-600"
const pulseOutline = "border-green-600/30"
const destructiveBG = "bg-red-500/10"
const destructiveText = "text-red-600"
const destructiveOutline = "border-red-600"

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          `bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:text-green-500`,
        destructive:
          `bg-destructive text-white shadow-xs hover:bg-destructive/90 hover:text-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40`,
        outline:
          `border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground`,
        outlinePulse:
          `border border-input bg-background shadow-xs hover:${pulseBG} hover:${pulseText} hover:${pulseOutline}`,
        outlineDestructive:
          `border border-input bg-background shadow-xs hover:${destructiveBG} hover:${destructiveText} hover:${destructiveOutline}`,
        secondary:
          `bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80`,
        transparentPulse: `hover:${pulseText}`,
        transparentDestructive: `hover:${destructiveText}`,
        ghost: `hover:bg-accent hover:text-accent-foreground`,
        ghostPulse: `hover:${pulseBG} hover:${pulseText}`,
        ghostDestructive: `hover:${destructiveBG} hover:${destructiveText}`,
        link: `text-primary underline-offset-4 hover:underline`,
      },
      size: {
        default: `h-9 px-4 py-2 has-[>svg]:px-3`,
        xs: `h-7 rounded-md gap-1.5 px-2 text-xs`,
        sm: `h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5`,
        lg: `h-10 rounded-md px-6 has-[>svg]:px-4`,
        icon: `size-9`,
      },
    },
    defaultVariants: {
      variant: `default`,
      size: `default`,
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
