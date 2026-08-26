import {
  CustomDataTable,
  type DataTableProps,
} from "@/components/common/CustomTable";
import type { RowData } from "@tanstack/react-table";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { XIcon } from "lucide-react";
import { CustomBtn } from "./CustomBtn";

export interface TableDialog<T extends RowData> extends DataTableProps<T> {
  dialogOpen: boolean;
  toggleDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
  header?: string;
}

function TableDialog<T extends RowData>({
  children,
  dialogOpen,
  toggleDialogOpen,
  header,
  ...props
}: TableDialog<T>) {
  return (
    <Dialog open={dialogOpen} onOpenChange={toggleDialogOpen}>
      <DialogTrigger> {children} </DialogTrigger>
      <DialogContent
        className={`dashboard-card-theme bg-white w-screen! max-w-fit! ring-0 p-0 gap-0`}
        showCloseButton={false}
      >
        <div className="bg-table-head w-full min-h-15 flex justify-between items-center border-b-2 border-b-client-detail-secondary rounded-t-[7px] p-5">
          <span className="font-medium text-base"> {header} </span>
          <XIcon
            className={`text-muted hover:text-black-text`}
            onClick={() => toggleDialogOpen(false)}
          />
        </div>
        <CustomDataTable {...props} withFooterBorder />

        <div className="flex flex-col gap-6 py-5">
          <div className="dashed-y-separators" />
          <div className="px-5">
            <CustomBtn
              buttonLabel="Got it!"
              onClick={() => toggleDialogOpen((curr) => !curr)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TableDialog;
