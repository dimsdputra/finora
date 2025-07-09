import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import classNames from "classnames";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-3 py-1 text-xs w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-base-content focus-visible:ring-base-300/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-base-300 transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-content [a&]:hover:bg-primary/80",
        accent:
          "border-transparent bg-accent text-accent-content [a&]:hover:bg-accent/80",
        secondary:
          "border-transparent bg-secondary text-secondary-content [a&]:hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-base-content [a&]:hover:bg-accent [a&]:hover:text-accent-content",
        success: "border-transparent bg-success text-success-content [a&]:hover:bg-success/80",
        warning: "border-transparent bg-warning text-warning-content [a&]:hover:bg-warning/80",
        info: "border-transparent bg-info text-info-content [a&]:hover:bg-info/80",
        neutral: "border-transparent bg-neutral text-neutral-content [a&]:hover:bg-neutral/80",
        light: "border-transparent bg-base-100 text-base-content [a&]:hover:bg-base-200",
        error: "border-transparent bg-error text-error-content [a&]:hover:bg-error/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      data-slot="badge"
      className={classNames(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}
export { Badge, badgeVariants };
