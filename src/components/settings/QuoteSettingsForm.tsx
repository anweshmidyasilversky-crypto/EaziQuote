import { type QuoteSettings } from "@/types/quoteSettings.payload.type";
import { quoteSettingsSchema } from "@/validation/quoteSettings.payload.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { CustomInput } from "../common/CustomInput";
import CustomTooltip from "../common/CustomTooltip";
import { toast } from "react-toastify";
import { CustomBtn } from "../common/CustomBtn";
import SignatureModal from "../common/SignatureModal";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import useAuthMutation from "@/hooks/apis/auth/useAuthMutation";
import { updateConfig } from "@/redux/slices/settings.slice";
import { showErrorToast } from "@/api/axiosInstance";
import { updateUser } from "@/redux/slices/user.slice";

function QuoteSettingsForm() {
  const { quote_invoice_settings } = useAppSelector((state) => state.appConfig);
  const dispatch = useAppDispatch();
  const [signatureModalOpen, toggleSignatureModalOpen] = useState(false);
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<QuoteSettings>({
    defaultValues: {
      footerMsg: quote_invoice_settings.footer_message,
      terms: quote_invoice_settings.terms_and_conditions,
    },
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

  const { quoteInvoiceSettingsMutation } = useAuthMutation();

  const submitHandler = (data: QuoteSettings) => {
    quoteInvoiceSettingsMutation.mutate(
      {
        footer_message: data.footerMsg,
        terms_and_conditions: data.terms,
        signature: data.signatureBlob ?? null,
      },
      {
        onSuccess: (response) => {
          dispatch(updateConfig(response.payload));
          dispatch(
            updateUser({
              hasSignatureAdded: true,
            }),
          );
          toast.success(response.message);
        },
        onError: (error) => {
          showErrorToast(error);
        },
      },
    );
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
              {
                <img
                  src={
                    signatureBlob
                      ? URL.createObjectURL(signatureBlob)
                      : (quote_invoice_settings.signature ?? "")
                  }
                  className="min-h-11 aspect-auto"
                />
              }
            </div>
            {errors.signatureBlob && (
              <p className="error-text"> {errors.signatureBlob.message} </p>
            )}
          </div>
        </div>

        <CustomBtn
          buttonLabel="Save Changes"
          onClick={handleSubmit(submitHandler)}
          isSubmitting={quoteInvoiceSettingsMutation.isPending}
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
