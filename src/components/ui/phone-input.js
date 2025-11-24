import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PhoneInput = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium select-none">
        +91
      </div>
      <Input
        type="tel"
        className={cn("pl-10", className)}
        ref={ref}
        {...props}
      />
    </div>
  );
});
PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
