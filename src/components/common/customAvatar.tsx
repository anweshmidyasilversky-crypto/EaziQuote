import type { useRender } from "@base-ui/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export type CustomAvatarProps = {
  src: string;
  fallback: string;
  fallbackCls?: string;
};
export function CustomAvatar({
  src,
  fallback,
  fallbackCls,
  className,
}: CustomAvatarProps & useRender.ComponentProps<"div">) {
  return (
    <div className={`h-8 w-8 ${className}`}>
      <Avatar className={"after:border-none"}>
        <AvatarImage src={src} />
        <AvatarFallback className={fallbackCls}> {fallback} </AvatarFallback>
      </Avatar>
    </div>
  );
}
