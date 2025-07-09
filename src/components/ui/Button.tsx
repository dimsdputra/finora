import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import classNames from "classnames";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-normal transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-base-300 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-content shadow-xs hover:bg-opacity-50",
        secondary:
          "bg-secondary text-secondary-content shadow-xs hover:bg-opacity-80",
        accent: "bg-accent text-accent-content shadow-xs hover:bg-opacity-80",
        neutral:
          "bg-neutral text-neutral-content shadow-xs hover:bg-opacity-80",
        info: "bg-info text-info-content shadow-xs hover:bg-opacity-80",
        success:
          "bg-success text-success-content shadow-xs hover:bg-opacity-80",
        warning:
          "bg-warning text-warning-content shadow-xs hover:bg-opacity-80",
        error: "bg-error text-error-content shadow-xs hover:bg-opacity-80",
        transparent: "bg-transparent hover:bg-base-300 text-base-content",
        outline:
          "border-[1.6px] bg-background shadow-xs hover:bg-base-300 text-base-content border-base-300 hover:border-base-300",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={classNames(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
