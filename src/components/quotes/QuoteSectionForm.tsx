import { type QuoteSection } from "@/types/quoteSection.type";
import React, { useEffect } from "react";
import { useForm, type DefaultValues } from "react-hook-form";
import CustomDialog from "../common/CustomDialog";
import { CustomCombobox } from "../common/CustomCombobox";
import { CustomInput } from "../common/customInput";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { qouteSectionSchema } from "@/validation/quoteSectionCreation.payload.schema";

export type QuoteSectionFormProps = {
  mode: "creation" | "updation";
  isOpen: boolean;
  toggleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sectionId?: string;
  defaultValues?: DefaultValues<QuoteSection | Partial<QuoteSection>>;
};

function QuoteSectionForm({
  isOpen,
  toggleIsOpen,
  mode,
  defaultValues,
}: QuoteSectionFormProps) {
  const {
    setValue,
    control,
    formState: { errors },
    clearErrors,
    handleSubmit,
    reset,
  } = useForm<QuoteSection | Partial<QuoteSection>>({
    defaultValues: defaultValues ?? {
      order: undefined,
      section: "",
      description: "",
    },
    resolver: yupResolver(
      mode === "creation"
        ? qouteSectionSchema
        : qouteSectionSchema.deepPartial(),
    ),
  });

  useEffect(() => {
    if (mode === "updation" && defaultValues) {
      setValue("order", defaultValues.order);
      setValue("description", defaultValues.description);
      setValue("section", defaultValues.section);
    }
  }, [defaultValues]);

  const submitHandler = (data: QuoteSection | Partial<QuoteSection>) => {
    console.log(data);
    if (mode === "creation") {
      toast.success("Sucessfully added section");
    } else {
      toast.success("Sucessfully updated section");
    }
    toggleIsOpen(false);
    reset();
  };

  return (
    <CustomDialog
      dialogOpen={isOpen}
      toggleDialogOpen={toggleIsOpen}
      header={mode === "creation" ? "Add Section" : "Edit Section"}
      closeOnSubmit={false}
      withFooter
      footerBtnLabel={mode === "creation" ? "Add Section" : "Save Changes"}
      footerBtnAction={handleSubmit(submitHandler)}
      showFooterSeparator={false}
      xIconAction={reset}
    >
      <div className="flex flex-col gap-5 p-5">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 grow">
            <label className="input-label justify-start!"> Order </label>
            <CustomCombobox
              items={Array.from({ length: 10 }, (_, i) => i + 1)}
              onValueChange={(val) => {
                if (val) {
                  setValue("order", val);
                  clearErrors("order");
                }
              }}
              selected={defaultValues?.order}
              placeholder="Select order"
              className={cn(`${errors.order ? `input-error` : ``} `)}
            />
            {errors.order && (
              <span className="error-text"> {errors.order.message} </span>
            )}
          </div>

          <CustomInput
            control={control}
            name="section"
            fieldName="Section Title"
            placeholder="Introduction"
            className="grow"
          />
        </div>

        <CustomInput
          control={control}
          name="description"
          fieldName="Description"
          className="min-h-80"
          inptType="textarea"
          placeholder="Enter Description"
        />
      </div>
    </CustomDialog>
  );
}

export default QuoteSectionForm;
