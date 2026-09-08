import { assets } from "@/assets/icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export type CustomTooltipProps = {
  tooltipContent: string;
};

function CustomTooltip({ tooltipContent }: CustomTooltipProps) {
  return (
    <Popover>
      <PopoverTrigger
        type="button"
        className="h-5 w-5 flex items-center justify-center cursor-pointer self-center bg-transparent border-none p-0 translate-y-0!"
      >
        <img src={assets.infoIcon} className="w-3.5 aspect-auto" alt="info" />
      </PopoverTrigger>

      <PopoverContent className="dashboard-card-theme ring-0!" side="right">
        <p className="text-sm">{tooltipContent}</p>
      </PopoverContent>
    </Popover>
  );
}

export default CustomTooltip;
