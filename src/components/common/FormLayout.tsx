import { XIcon } from "lucide-react";
import React from "react";
import { CustomBtn } from "./CustomBtn";

export interface FormLayoutProps {
  isFormOpen: boolean;
  formHeading: string;
  sumbitBtnLabel: string;
  children: React.ReactNode;
  formCloseAction?: () => void;
  isSubmitting: boolean;
  submitHanlder: () => void;
}

export function FormLayout({
  isFormOpen,
  formHeading,
  sumbitBtnLabel,
  children,
  formCloseAction,
  isSubmitting,
  submitHanlder,
}: FormLayoutProps) {
  return (
    <>
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 animate-in fade-in-10">
          <div className="flex min-h-screen py-8 justify-center">
            <div className="w-[calc(100%-2rem)] max-w-125 h-fit bg-white opacity-100 rounded-[7px] ">
              {/* Modal */}
              <div className="flex flex-col gap-6 w-full ">
                {/* Header */}
                <div className="flex justify-between p-5 min-h-14.75 bg-table-head rounded-[7px] overflow-hidden">
                  <span className="font-medium text-[16px] min-h-4.75">
                    {formHeading}
                  </span>
                  <button
                    className="md:w-4 md:h-4 cursor-pointer"
                    onClick={() => formCloseAction?.()}
                  >
                    <XIcon className="shimmer-color-muted" />
                  </button>
                </div>

                {/* Form fields */}
                <div className="flex flex-col w-full px-5 gap-4 justify-center items-center md:[&_input]:max-w-115">
                  {children}
                </div>
              </div>
              {/* Form footer */}
              <div className="px-5 pb-5 pt-6">
                <div className="w-fit max-w-25">
                  <CustomBtn
                    buttonLabel={sumbitBtnLabel}
                    withSpinner={true}
                    isSubmitting={isSubmitting}
                    onClick={submitHanlder}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
