import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { FormLayout } from "./FormLayout";
import { CustomBtn } from "./CustomBtn";
import { toast } from "react-toastify";

export type SignatureModalProps = {
  isOpen: boolean;
  toggleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onChange: (signatureBlob: Blob) => void;
};

function SignatureModal({
  onChange,
  isOpen,
  toggleIsOpen,
}: SignatureModalProps) {
  const sigCanvasRef = useRef<SignatureCanvas | null>(null);
  const handleSigClear = () => {
    sigCanvasRef.current?.clear();
  };

  const handleSave = () => {
    if (sigCanvasRef.current?.isEmpty()) {
      toast.error(`Please Provide signature`);
      return;
    }
    sigCanvasRef.current?.getCanvas().toBlob((blob) => {
      if (blob) {
        onChange(blob);
        toast.success(`Sucessfully saved image locally`);
        toggleIsOpen(false);
      } else {
        toast.error(`Please enter your signature`);
      }
    });
  };
  return (
    <FormLayout
      isFormOpen={isOpen}
      formCloseAction={() => toggleIsOpen(false)}
      isSubmitting={false}
      formHeading="Add Signature"
      withSubmitBtn={false}
    >
      <div className="p-5 pt-0! flex flex-col items-center justify-center gap-5">
        <div className="border border-dashed border-input-field-border rounded-[7px]">
          <SignatureCanvas
            ref={sigCanvasRef}
            canvasProps={{
              height: "200px",
              width: "300px",
            }}
          />
        </div>
        <div className="flex justify-items-center gap-5 [&_button]:min-w-30">
          <CustomBtn buttonLabel="Clear" onClick={handleSigClear} />
          <CustomBtn buttonLabel="Save" onClick={handleSave} />
        </div>
      </div>
    </FormLayout>
  );
}

export default SignatureModal;
