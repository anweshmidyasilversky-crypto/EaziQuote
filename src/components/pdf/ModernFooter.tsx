import { useAppSelector } from "@/redux/store";
import { cn } from "@/lib/utils/helper";
import type { SVGProps } from "react";

function ModernFooter({ className, ...props }: SVGProps<SVGSVGElement>) {
  const {
    company: { brand_color },
  } = useAppSelector((state) => state.user);
  return (
    <svg
      className={cn("h-[29px] w-[175px]", className)}
      viewBox="0 0 175 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      {...props}
    >
      <path
        d="M175.001 28.4669L88.7891 28.4669L108.515 0H175.001L175.001 28.4669Z"
        fill="url(#paint0_linear_7662_20756)"
      />
      <path
        d="M106.154 0H104.945L85.2188 28.1912H86.4283L106.154 0Z"
        fill="url(#paint1_linear_7662_20756)"
      />
      <path
        d="M102.586 0H101.377L81.6504 28.1912H82.86L102.586 0Z"
        fill="url(#paint2_linear_7662_20756)"
      />
      <path
        d="M99.0158 0H97.8062L78.0801 28.1912H79.2897L99.0158 0Z"
        fill="url(#paint3_linear_7662_20756)"
      />
      <path
        d="M95.4455 0H94.2356L74.5098 28.1912H75.7193L95.4455 0Z"
        fill="url(#paint4_linear_7662_20756)"
      />
      <path
        d="M91.8771 0H90.6675L70.9414 28.1912H72.151L91.8771 0Z"
        fill="url(#paint5_linear_7662_20756)"
      />
      <path
        d="M0 28.4668V20.5334H148.612L143.276 28.4668H0Z"
        fill={brand_color ?? "#F36817"}
      />
      <path
        d="M145.105 28.4668L150.442 20.5334H151.087L145.75 28.4668H145.105Z"
        fill={brand_color ?? "#F36817"}
      />
      <path
        d="M147.58 28.4668L152.946 20.5334H153.591L148.225 28.4668H147.58Z"
        fill={brand_color ?? "#F36817"}
      />
      <path
        d="M150.057 28.4671L155.393 20.5337H156.038L150.701 28.4671H150.057Z"
        fill={brand_color ?? "#F36817"}
      />
      <path
        d="M152.531 28.4668L157.868 20.5334H158.513L153.176 28.4668H152.531Z"
        fill={brand_color ?? "#F36817"}
      />
      <defs>
        <linearGradient
          id="paint0_linear_7662_20756"
          x1="175.001"
          y1="1.32687e-06"
          x2="159.597"
          y2="50.1964"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F2EEEC" />
          <stop offset="1" stopColor="#E8E8F2" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_7662_20756"
          x1="106.154"
          y1="1.31401e-06"
          x2="79.6286"
          y2="21.1952"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F2EEEC" />
          <stop offset="1" stopColor="#E8E8F2" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_7662_20756"
          x1="102.586"
          y1="1.31401e-06"
          x2="76.0605"
          y2="21.1955"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F2EEEC" />
          <stop offset="1" stopColor="#E8E8F2" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_7662_20756"
          x1="99.0158"
          y1="1.31401e-06"
          x2="72.4902"
          y2="21.1956"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F2EEEC" />
          <stop offset="1" stopColor="#E8E8F2" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_7662_20756"
          x1="95.4455"
          y1="1.31401e-06"
          x2="68.9198"
          y2="21.1955"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F2EEEC" />
          <stop offset="1" stopColor="#E8E8F2" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_7662_20756"
          x1="91.8771"
          y1="1.31401e-06"
          x2="65.3515"
          y2="21.1956"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F2EEEC" />
          <stop offset="1" stopColor="#E8E8F2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default ModernFooter;
