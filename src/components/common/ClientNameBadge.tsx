import { CustomAvatar } from "./customAvatar";
import { colorThemes } from "../../constants/colors";
import { getRandomIndex } from "../../lib/utils";

export type ClientNameBadgeProps = {
  name: string;
};

export function ClientNameBadge({ name }: ClientNameBadgeProps) {
  const randomColConfig = colorThemes[getRandomIndex(colorThemes.length)];
  const [firstName, lastName] = name.split(" ");
  let initials = firstName[0].toUpperCase() + lastName?.at(0)?.toUpperCase();
  return (
    <div className="flex items-center min-h-8 gap-2 w-fit">
      <CustomAvatar
        src=""
        fallback={initials}
        fallbackCls={` ${randomColConfig.textCol} ${randomColConfig.bgCol} `}
      />
      <span className="min-h-4.25 text-nowrap"> {name} </span>
    </div>
  );
}
