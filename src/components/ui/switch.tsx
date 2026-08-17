"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "../../lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, checked, defaultChecked, onCheckedChange, ...props }, ref) => {
  const [internalChecked, setInternalChecked] = React.useState(
    defaultChecked || false,
  );
  const isChecked = checked !== undefined ? checked : internalChecked;

  const handleCheckedChange = (val: boolean) => {
    console.log(val);
    setInternalChecked(val);
    if (onCheckedChange) onCheckedChange(val);
  };

  return (
    <SwitchPrimitives.Root
      className={cn(
        // 1. BASE TOGGLE TRACK (Matching Figma Dimensions as base)
        "peer inline-flex h-5.5 w-full min-w-11 shrink-0 cursor-pointer items-center rounded-3xl border-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        // 2. TOGGLE STATES & BACKGROUNDS
        "bg-gray-300",
        "data-[state=checked]:bg-brand-dark", // Exact Figma Color
        "relative select-none",
        className,
      )}
      checked={isChecked}
      onCheckedChange={handleCheckedChange}
      {...props}
      ref={ref}
    >
      {/* 3. FLUID AUTO-LAYOUT REPLICATOR */}
      <div
        className={cn(
          "flex w-full items-center h-full transition-all duration-200",
          // Toggles content alignment between left and right side configurations
          isChecked
            ? "flex-row justify-end pl-1.5 pr-0.75 gap-0.75" // Figma Checked Padding
            : "flex-row-reverse justify-end pr-1.5 pl-0.75 gap-0.75", // Unchecked Padding mirror
        )}
      >
        {/* 4. THE WHITE THUMB CIRCLE (Rectangle 19361) */}
        <SwitchPrimitives.Thumb className="block h-4 w-4 shrink-0 rounded-full bg-white shadow-sm transition-all duration-200 order-1" />

        {/* 5. TEXT LAYER (Yes / No) */}
        <span
          className={cn(
            "font-sans font-medium text-[10px] leading-3 text-center shrink-0 order-0 transition-opacity duration-150",
            isChecked ? "text-white opacity-100" : "text-gray-600 opacity-100",
          )}
        >
          {isChecked ? "Yes" : "No"}
        </span>
      </div>
    </SwitchPrimitives.Root>
  );
});
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
