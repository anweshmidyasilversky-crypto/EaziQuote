import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export type CustomAvatarProps = {
  src: string;
  fallback: string;
};
export function CustomAvatar({ src, fallback }: CustomAvatarProps) {
  return (
    <div className="h-8 w-8">
      <Avatar className={"after:border-none"}>
        <AvatarImage src={src} />
        <AvatarFallback> {fallback} </AvatarFallback>
      </Avatar>
    </div>
  );
}
