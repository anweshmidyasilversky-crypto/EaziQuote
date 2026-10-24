import { useAppSelector } from "@/redux/store";
import { cn } from "@/lib/utils/helper";
import type { SVGProps } from "react";

function ModernHeader({ className, ...props }: SVGProps<SVGSVGElement>) {
  const {
    company: { brand_color },
  } = useAppSelector((state) => state.user);
  return (
    <svg
      className={cn("h-12.25 w-44", className)}
      viewBox="0 0 176 49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      {...props}
    >
      <path
        d="M3.05176e-05 0.000179291L152.113 8.01086e-05L132.313 48.8608H0L3.05176e-05 0.000179291Z"
        fill="url(#paint0_linear_7662_20603)"
      />
      <path
        d="M134.682 48.8608H135.896L155.695 0.473316H154.481L134.682 48.8608Z"
        fill="url(#paint1_linear_7662_20603)"
      />
      <path
        d="M138.265 48.8608H139.479L159.279 0.473316H158.065L138.265 48.8608Z"
        fill="url(#paint2_linear_7662_20603)"
      />
      <path
        d="M141.847 48.8608H143.061L162.861 0.473316H161.647L141.847 48.8608Z"
        fill="url(#paint3_linear_7662_20603)"
      />
      <path
        d="M145.431 48.8608H146.646L166.445 0.473316H165.231L145.431 48.8608Z"
        fill="url(#paint4_linear_7662_20603)"
      />
      <path
        d="M149.013 48.8608H150.227L170.027 0.473316H168.813L149.013 48.8608Z"
        fill="url(#paint5_linear_7662_20603)"
      />
      <path
        d="M175.486 -2.3365e-05V7.97725H25.4925L30.8788 -2.3365e-05H175.486Z"
        fill={brand_color ?? "#F36817"}
      />
      <path
        d="M29.0312 -2.3365e-05L23.6449 7.97725H22.9945L28.3808 -2.3365e-05H29.0312Z"
        fill={brand_color ?? "#F36817"}
      />
      <path
        d="M26.5332 -2.3365e-05L21.1169 7.97725H20.4662L25.8825 -2.3365e-05H26.5332Z"
        fill={brand_color ?? "#F36817"}
      />
      <path
        d="M24.0352 -7.62939e-06L18.6489 7.97725H17.9981L23.3844 -7.62939e-06H24.0352Z"
        fill={brand_color ?? "#F36817"}
      />
      <path
        d="M21.5371 -2.3365e-05L16.1508 7.97725H15.5001L20.8864 -2.3365e-05H21.5371Z"
        fill={brand_color ?? "#F36817"}
      />
      <defs>
        <linearGradient
          id="paint0_linear_7662_20603"
          x1="-7.62883e-06"
          y1="48.8608"
          x2="25.8399"
          y2="-37.6963"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F2EEEC" />
          <stop offset="1" stopColor="#E8E8F2" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_7662_20603"
          x1="134.682"
          y1="48.8608"
          x2="170.488"
          y2="32.1294"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F2EEEC" />
          <stop offset="1" stopColor="#E8E8F2" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_7662_20603"
          x1="138.265"
          y1="48.8608"
          x2="174.072"
          y2="32.129"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F2EEEC" />
          <stop offset="1" stopColor="#E8E8F2" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_7662_20603"
          x1="141.847"
          y1="48.8608"
          x2="177.654"
          y2="32.129"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F2EEEC" />
          <stop offset="1" stopColor="#E8E8F2" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_7662_20603"
          x1="145.431"
          y1="48.8608"
          x2="181.238"
          y2="32.129"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F2EEEC" />
          <stop offset="1" stopColor="#E8E8F2" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_7662_20603"
          x1="149.013"
          y1="48.8608"
          x2="184.82"
          y2="32.129"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F2EEEC" />
          <stop offset="1" stopColor="#E8E8F2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default ModernHeader;
