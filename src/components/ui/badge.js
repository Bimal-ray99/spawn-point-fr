import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
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
  text,
  badgeText,
  textColor,
  backgroundColor,
  badgeBackgroundColor,
  ...props
}) {
  // Custom implementation to match the user's usage:
  // <Badge text={loginPageContent.subtitle} badgeText={loginPageContent.badge} textColor="text-white" backgroundColor="bg-secondary" badgeBackgroundColor="bg-white" />

  if (text && badgeText) {
    return (
      <div
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
          backgroundColor,
          textColor,
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "mr-2 rounded-full px-2 py-0.5 text-xs font-bold text-black",
            badgeBackgroundColor
          )}
        >
          {badgeText}
        </span>
        {text}
      </div>
    );
  }

  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
export default Badge;
