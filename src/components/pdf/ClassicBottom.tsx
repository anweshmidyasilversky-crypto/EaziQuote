import { useAppSelector } from "@/redux/store";
import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

function ClassicBottom({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  const {
    company: { brand_color },
  } = useAppSelector((state) => state.user);
  return (
    <svg
      className={cn("h-[82px] w-[176px]", className)}
      viewBox="0 0 176 82"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      {...props}
    >
      <mask
        id="mask0_4339_31667"
        className="mask-type:luminance"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="176"
        height="82"
      >
        <path d="M0 81.3954H175.5V0H0V81.3954Z" fill="white" />
      </mask>
      <g mask="url(#mask0_4339_31667)">
        <path
          d="M175.768 7.41711C175.768 34.8339 95.9707 70.584 -3.52344 70.584V73.7585L176.021 74.1193L175.768 7.41711Z"
          fill="#F9F9FA"
        />
        <path
          d="M178.834 20.9812C178.834 48.398 97.2694 70.584 -3.52344 70.584V80.6488L178.401 80.9735L178.834 20.9812Z"
          fill={brand_color || "#0696ea"}
        />
        <path
          d="M187.275 26.7532C187.275 54.17 99.0726 76.3559 -9.94531 76.3559V86.4208L186.806 86.7455L187.275 26.7532Z"
          fill={brand_color || "#0696ea"}
        />
      </g>
    </svg>
  );
}

export default ClassicBottom;
