import { type QuoteSettings } from "@/types/quoteSettings.payload.type";
import { quoteSettingsSchema } from "@/validation/quoteSettings.payload.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { CustomInput } from "../common/customInput";
import CustomTooltip from "../common/CustomTooltip";
import { toast } from "react-toastify";
import { CustomBtn } from "../common/CustomBtn";
import SignatureModal from "../common/SignatureModal";

export type QuoteSettingsProps = {
  defaultValues?: QuoteSettings;
};

function QuoteSettingsForm({ defaultValues }: QuoteSettingsProps) {
  const [isSubmitting, toggleIsSubmitting] = useState(false);
  const [signatureModalOpen, toggleSignatureModalOpen] = useState(false);
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<QuoteSettings>({
    resolver: yupResolver(quoteSettingsSchema),
  });

  const [signatureBlob] = useWatch({
    control: control,
    name: ["signatureBlob"],
  });

  const handleSigChange = (signature: Blob) => {
    setValue("signatureBlob", signature);
    clearErrors("signatureBlob");
  };

  useEffect(() => {
    if (defaultValues) {
      Object.keys(defaultValues).forEach((key) => {
        const objKey = key as keyof QuoteSettings;
        setValue(objKey, defaultValues[objKey]);
      });
    }
  }, [defaultValues]);

  const submitHandler = (data: QuoteSettings) => {
    toggleIsSubmitting(true);
    setTimeout(() => {
      toast.success(`Saved Quote Settings`);
      console.log(data);
      toggleIsSubmitting(false);
    }, 500);
  };

  return (
    <>
      <div className="p-5 pt-0! flex flex-col gap-8">
        <div className="flex flex-col gap-5">
          <CustomInput
            control={control}
            name="terms"
            fieldName="Terms & Conditions"
            labelRightNode={
              <CustomTooltip tooltipContent="Add standard terms that will appear at the bottom of every quote and invoice, for example, payment terms, validity period, or service conditions." />
            }
            inptType="textarea"
            placeholder="Enter terms and conditions"
          />
          <CustomInput
            control={control}
            name="footerMsg"
            fieldName="Footer Message"
            labelRightNode={
              <CustomTooltip tooltipContent="Add a short note or thank-you message shown at the bottom of your quotes and invoices," />
            }
            inptType="textarea"
            placeholder="Enter footer message"
          />

          <div className="flex flex-col gap-2">
            <label className="input-label self-start">
              {" "}
              {"Signature"}
              <CustomTooltip tooltipContent="Your signature will appear on all quotes and invoices." />
            </label>

            <div
              className={`min-h-16 max-w-31.25 border border-input-field-border rounded-[7px] cursor-pointer ${errors.signatureBlob ? `input-error` : ``}`}
              onClick={() => toggleSignatureModalOpen((curr) => !curr)}
            >
              {signatureBlob && (
                <img
                  src={URL.createObjectURL(signatureBlob)}
                  className="min-h-11 aspect-auto"
                />
              )}
            </div>
            {errors.signatureBlob && (
              <p className="error-text"> {errors.signatureBlob.message} </p>
            )}
          </div>
        </div>

        <CustomBtn
          buttonLabel="Save Changes"
          onClick={handleSubmit(submitHandler)}
          isSubmitting={isSubmitting}
        />
      </div>

      <SignatureModal
        isOpen={signatureModalOpen}
        toggleIsOpen={toggleSignatureModalOpen}
        onChange={handleSigChange}
      />
    </>
  );
}

export default QuoteSettingsForm;
