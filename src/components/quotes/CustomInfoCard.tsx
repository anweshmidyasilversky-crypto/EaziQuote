import { ChevronRight, XIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";

export type CustomInfoCardProps = {
  header: string;
  headerLink?: string;
  children: React.ReactNode;
  linkAction?: () => void;
  withXIcon?: boolean;
  xIconAction?: () => void;
};
export function CustomInfoCard({
  header,
  headerLink,
  linkAction,
  children,
  withXIcon,
  xIconAction,
}: CustomInfoCardProps) {
  return (
    <Card className="bg-white dashboard-card-theme ring-0 flex flex-col gap-5 md:min-w-85">
      <CardHeader className="border-b border-separator!">
        <div className="flex justify-between">
          <span className="font-medium text-base"> {header} </span>
          {headerLink && (
            <div className="flex gap-1.5 items-center">
              <a onClick={() => linkAction?.()} className="flex gap-1.5 ">
                {" "}
                {headerLink}{" "}
                <ChevronRight className="text-brand-dark w-4 aspect-square" />{" "}
              </a>
            </div>
          )}
          {withXIcon && (
            <XIcon
              className="text-muted hover:text-black-text"
              onClick={() => xIconAction?.()}
            />
          )}
        </div>
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  );
}
