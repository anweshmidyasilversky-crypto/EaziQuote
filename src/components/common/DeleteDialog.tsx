import React from "react";
import CustomDialog from "./CustomDialog";
import { cn } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";
import { CustomBtn } from "./CustomBtn";

export type DeleteDialogProps = {
  isOpen: boolean;
  toggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteAction?: () => void;
};

function DeleteDialog({ isOpen, toggleOpen, deleteAction }: DeleteDialogProps) {
  return (
    <CustomDialog
      dialogOpen={isOpen}
      toggleDialogOpen={toggleOpen}
      headerCls={cn(`bg-custom-dialog-secondary border-0!`)}
      withXIcon={false}
      withFooter={false}
    >
      <div className="p-5 flex flex-col items-center gap-8 min-w-125">
        <Trash2Icon className="text-danger w-12 h-12" />

        <div className="flex flex-col gap-2 items-center">
          <h4 className="font-semibold text-xl"> {"Are you sure ?"} </h4>
          <span className="text-base">
            {" "}
            {"Are you sure you want to remove this record?"}{" "}
          </span>
        </div>

        <div className="flex gap-4 justify-center items-center">
          <CustomBtn
            buttonLabel="Cancel"
            btncls={cn(
              `bg-custom-dialog-primary text-black-text hover:bg-custom-dialog-primary`,
            )}
            onClick={() => toggleOpen(false)}
          />

          <CustomBtn
            buttonLabel="Yes, delete it!"
            btncls={cn(
              `bg-danger hover:bg-danger text-custom-dialog-secondary`,
            )}
            onClick={() => {
              deleteAction?.();
              toggleOpen(false);
            }}
          />
        </div>
      </div>
    </CustomDialog>
  );
}

export default DeleteDialog;
