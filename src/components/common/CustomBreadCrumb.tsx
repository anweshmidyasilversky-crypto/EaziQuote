import { ChevronRight } from "lucide-react";
import { useLocation } from "react-router";

export type HeaderBreadCrumbProps = {
  pageName: string;
};

export function HeaderBreadCrumb({ pageName }: HeaderBreadCrumbProps) {
  const location = useLocation();
  const parentPageName = location.pathname.split("/")[1];
  return (
    <div className="min-h-10.75 bg-white w-full flex justify-between dashboard-card-theme py-3 px-6">
      <span className="font-semibold uppercase text-[16px]">{pageName}</span>
      <div className="flex  items-center">
        <span className="text-[14px]">
          {" "}
          {parentPageName[0].toUpperCase() + parentPageName.slice(1)}{" "}
        </span>
        <ChevronRight className="text-breadcrumb-separator h-4" />
        <span className="text-placeholder-text text-[14px]">{pageName}</span>
      </div>
    </div>
  );
}
