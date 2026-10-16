import { useAppSelector } from "@/redux/store";
import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

function ElegentFooter({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  const {
    company: { brand_color },
  } = useAppSelector((state) => state.user);
  return (
    <svg
      className={cn("h-[2px] w-[160px]", className)}
      viewBox="0 0 160 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      {...props}
    >
      <rect width="159.5" height="2" fill="#EEEEEE" />
      <rect
        x="53.166"
        width="53.1667"
        height="2"
        fill={brand_color ?? "#FF2555"}
      />
    </svg>
  );
}

export default ElegentFooter;
