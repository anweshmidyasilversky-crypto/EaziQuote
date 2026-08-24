import { XIcon } from "lucide-react";
import { assets } from "../../assets/icons";
import type { ClientDataWithFilters } from "../../constants/dummyData";
import { getInitials } from "../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";

export type ClientDetailsPopupProps = {
  currClient: ClientDataWithFilters;
  isOpen: boolean;
  toggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ClientDetailsPopup({
  isOpen,
  toggleOpen,
  currClient,
}: ClientDetailsPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={toggleOpen}>
      <DialogTrigger />
      <DialogContent
        className={`bg-white opacity-100 ring-0 p-0 rounded-[7px] sm:min-w-125`}
        showCloseButton={false}
      >
        <DialogHeader className="min-h-15 bg-table-head p-5 rounded-[7px] rounded-b-none flex flex-row justify-between">
          <span className="min-h-4.75 font-medium text-[16px]">
            {" "}
            {" Client Details "}{" "}
          </span>

          <XIcon
            className="cursor-pointer"
            onClick={() => toggleOpen((curr) => !curr)}
          />
        </DialogHeader>

        {/* Client info */}
        <div className="flex gap-4 min-h-12 px-5">
          {/* Client icon */}
          <div className="min-h-12 min-w-12 rounded-[7px] flex items-center justify-center bg-transparent-royal-blue">
            <span className="text-royal-blue">
              {getInitials(currClient.client)}
            </span>
          </div>

          {/* Client & company name */}
          <div className="flex flex-col gap-1">
            <span> {currClient.client} </span>
            <span className="text-nowrap text-placeholder-text">
              {" "}
              {currClient.company}{" "}
            </span>
          </div>
        </div>

        {/* info group */}
        <div className="px-5 flex flex-col gap-6 py-6">
          <span className="flex gap-2">
            <img src={assets.emailIcon} className="h-4 aspect-auto" />
            <p> {currClient.email} </p>
          </span>

          <span className="flex gap-2">
            <img src={assets.phoneIcon} className="h-4 aspect-auto" />
            <p> {currClient.phone} </p>
          </span>

          <span className="flex gap-2">
            <img src={assets.locationIcon} className="h-4 aspect-auto" />
            <p> {"1600 Amphitheatre Driveway Sandra, CA 94043"} </p>
          </span>
        </div>

        <div className="dashed-y-separators" />

        <div className="px-4 py-2 pb-6">
          <button
            className="btn-auth w-fit min-w-17.25 text-[14px] py-2 px-4"
            onClick={() => toggleOpen((curr) => !curr)}
          >
            {" "}
            Got it!{" "}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
