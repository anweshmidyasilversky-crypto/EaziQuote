import { CustomAvatar } from "./CustomAvatar";
import { colorThemes } from "../../constants/colors";
import { getRandomIndex } from "../../lib/utils";
import { useRender } from "@base-ui/react/use-render";

export type ClientNameBadgeProps = {
  name: string;
  withName?: boolean;
};

export function ClientNameBadge({
  name,
  withName = true,
  className,
}: ClientNameBadgeProps & useRender.ComponentProps<"span">) {
  const randomColConfig = colorThemes[getRandomIndex(colorThemes.length)];
  const [firstName, lastName] = name.split(" ");
  let initials =
    firstName[0].toUpperCase() +
    (lastName ? lastName.at(0)?.toUpperCase() : "");
  return (
    <div className={`flex items-center min-h-8 gap-2 w-fit ${className}`}>
      <CustomAvatar
        src=""
        fallback={initials}
        fallbackCls={` ${randomColConfig.textCol} ${randomColConfig.bgCol}`}
      />
      {withName && <span className="min-h-4.25 text-nowrap"> {name} </span>}
    </div>
  );
}
