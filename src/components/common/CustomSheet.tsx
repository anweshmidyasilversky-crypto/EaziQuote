import { XIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetFooter } from "../ui/sheet";
import { Separator } from "../ui/separator";
import { CustomBtn } from "./CustomBtn";

export interface CustomSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  toggleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  submitFn?: () => void;
  clearFn?: () => void;
  withClearOption?: boolean;
  applyBtnCls?: string;
  applyBtnLabel?: string;
  closeOnApply?: boolean;
  closeAction?: () => void;
}

export function CustomSheet({
  isOpen,
  toggleIsOpen,
  submitFn,
  clearFn,
  children,
  withClearOption,
  applyBtnCls,
  applyBtnLabel,
  closeAction,
  closeOnApply = true,
}: CustomSheetProps) {
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
                onClick={() => {
                  closeAction?.();
                  toggleIsOpen(false);
                }}
              />
            </span>
          </SheetHeader>

          {/* Content */}
          {children}

          {/* Footer */}
          <SheetFooter className="mt-auto w-full shrink-0 border-none p-0">
            <Separator className="w-full bg-separator" />

            <div className="flex w-full items-center justify-center gap-3 p-5">
              {withClearOption && (
                <CustomBtn
                  buttonLabel="Clear"
                  bgColor="bg-[#E4E6F4]"
                  btncls="text-black-text w-full max-w-[174px] min-h-[38px] hover:bg-filter-sheet-secondary"
                  onClick={() => {
                    toggleIsOpen(false);
                    clearFn?.();
                  }}
                />
              )}

              <CustomBtn
                buttonLabel={applyBtnLabel ?? "Apply"}
                btncls={`w-full max-w-[174px] min-h-[38px] grow ${applyBtnCls}`}
                onClick={() => {
                  if (closeOnApply) {
                    toggleIsOpen(false);
                  }
                  submitFn?.();
                }}
              />
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
