import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

// Since we didn't install radix-ui, I'll make a simple custom checkbox that mimics the API
const Checkbox = React.forwardRef(
  ({ className, checked, onCheckedChange, ...props }, ref) => (
    <div className="relative flex items-center">
      <input
        type="checkbox"
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
          className
        )}
        ref={ref}
        checked={checked}
        onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
        {...props}
      />
      {/* Custom styling can be added here if needed, but native checkbox with tailwind is often enough for simple cases. 
          However, to match shadcn exactly we usually need radix. 
          Let's stick to a simple native input for now to avoid installing more deps, 
          but styled to look decent.
      */}
    </div>
  )
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
