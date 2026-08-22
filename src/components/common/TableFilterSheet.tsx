import { XIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetFooter } from "../ui/sheet";
import { Separator } from "../ui/separator";
import { CustomBtn } from "./CustomBtn";

export interface TableFilterSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  toggleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  applyFn?: () => void;
  clearFn?: () => void;
}

export function TableFilterSheet({
  isOpen,
  toggleIsOpen,
  applyFn,
  clearFn,
  children,
}: TableFilterSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={toggleIsOpen} modal={false}>
      <SheetContent
        side="right"
        className=" fixed! inset-y-0! right-0! w-full! max-w-100! h-screen! p-0! border-none! flex! flex-col! bg-white dashboard-card-theme [&>button]:hidden"
      >
        <div className="flex h-full w-full flex-col overflow-hidden">
          {/* Header */}
          <SheetHeader className="w-full shrink-0 bg-filter-selection-header p-5 min-h-15">
            <span className="flex w-full items-center justify-between text-[16px] font-medium">
              Filters
              <XIcon
                className="shimmer-color-muted cursor-pointer"
                onClick={() => toggleIsOpen(false)}
              />
            </span>
          </SheetHeader>

          {/* Content */}
          {children}

          {/* Footer */}
          <SheetFooter className="mt-auto w-full shrink-0 border-none p-0">
            <Separator className="w-full bg-separator" />

            <div className="flex w-full items-center justify-center gap-3 p-5">
              <CustomBtn
                buttonLabel="Clear"
                bgColor="bg-[#E4E6F4]"
                btncls="text-black-text w-full max-w-[174px] min-h-[38px] hover:bg-filter-sheet-secondary"
                onClick={() => {
                  toggleIsOpen(false);
                  clearFn?.();
                }}
              />

              <CustomBtn
                buttonLabel="Apply"
                btncls="w-full max-w-[174px] min-h-[38px] grow"
                onClick={() => {
                  toggleIsOpen(false);
                  applyFn?.();
                }}
              />
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
