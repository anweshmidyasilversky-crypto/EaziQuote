"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "../../lib/utils";
import { Spinner } from "./spinner";

type SwitchProps = React.ComponentPropsWithoutRef<
  typeof SwitchPrimitives.Root
> & {
  withLabel?: boolean;
  isTansitioning?: boolean;
};

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(
  (
    {
      className,
      checked,
      defaultChecked,
      onCheckedChange,
      isTansitioning,
      ...props
    },
    ref,
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(
      defaultChecked ?? false,
    );

    const isChecked = checked !== undefined ? checked : internalChecked;
    const showLabel = props.withLabel ?? true;

    const handleCheckedChange = (value: boolean) => {
      // Only update internal state when the component is uncontrolled.
      if (checked === undefined) {
        setInternalChecked(value);
      }

      onCheckedChange?.(value);
    };

    return (
      <SwitchPrimitives.Root
        ref={ref}
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
        disabled={isTansitioning}
        className={cn(
          // Track
          "peer relative inline-flex h-5.5 w-full min-w-11 max-w-11 shrink-0",
          "cursor-pointer items-center rounded-3xl border-0",
          "bg-gray-300 transition-colors",
          "select-none",
          "data-[state=checked]:bg-brand-dark",

          // Focus / disabled
          "focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring",
          "focus-visible:ring-offset-2",
          "focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",

          className,
        )}
        {...props}
      >
        {/* Label */}
        {showLabel && (
          <span
            className={cn(
              "absolute top-1/2 -translate-y-1/2",
              "font-sans text-center text-[10px] font-medium leading-3",
              "pointer-events-none",
              "transition-all duration-200",

              isChecked ? "left-1.5 text-white" : "right-1.5 text-gray-600",
            )}
          >
            {isChecked ? "Yes" : "No"}
          </span>
        )}

        {/* Thumb */}
        <SwitchPrimitives.Thumb
          className={cn(
            "absolute top-1/2 h-4 w-4",
            "-translate-y-1/2",
            "rounded-full bg-white shadow-sm",
            "transition-[left,right] duration-200",
            "pointer-events-none",

            isChecked ? "right-1" : "left-1",
          )}
        >
          {isTansitioning && <Spinner className="text-brand-dark " />}
        </SwitchPrimitives.Thumb>
      </SwitchPrimitives.Root>
    );
  },
);

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
