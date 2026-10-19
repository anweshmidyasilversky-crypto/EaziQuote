import { cn } from "@/lib/utils/helper";
import { ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

export type HeaderBreadCrumbProps = {
  pageName: string;
  parentPagePath?: string;
  containerCls?: string;
};

export function HeaderBreadCrumb({
  pageName,
  parentPagePath,
  containerCls,
}: HeaderBreadCrumbProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const parentPageName = location.pathname.split("/")[1];
  const parentPage = location.pathname.split("/").toSpliced(-1, 1).join("/");
  return (
    <div
      className={cn(
        "min-h-10.75 bg-white w-full flex justify-between dashboard-card-theme py-3 px-6",
        containerCls,
      )}
    >
      <span className="font-semibold uppercase text-[16px]">{pageName}</span>
      <div className="flex  items-center">
        <span
          className="text-[14px] cursor-pointer"
          onClick={() => navigate(parentPagePath ?? parentPage)}
        >
          {" "}
          {parentPageName[0].toUpperCase() + parentPageName.slice(1)}{" "}
        </span>
        <ChevronRight className="text-breadcrumb-separator h-4" />
        <span className="text-placeholder-text text-[14px]">{pageName}</span>
      </div>
    </div>
  );
}
