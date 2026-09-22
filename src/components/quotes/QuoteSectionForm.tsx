import React, { useEffect, useState } from "react";
import { useForm, type DefaultValues } from "react-hook-form";
import CustomDialog from "../common/CustomDialog";
import { CustomCombobox } from "../common/CustomCombobox";
import { CustomInput } from "../common/customInput";
import { cn } from "@/lib/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import type {
  QuoteSectionCreatePayload,
  QuoteSectionUpdatePayload,
} from "@/types/api.requests.type";
import {
  qouteSectionCreateSchema,
  QuoteSectionUpdateSchema,
} from "@/validation/quoteSection.payload.schema";

export type QuoteSectionFormProps = {
  mode: "creation" | "updation";
  isOpen: boolean;
  toggleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  titleId?: string;
  defaultValues?: DefaultValues<
    QuoteSectionCreatePayload | QuoteSectionUpdatePayload
  >;
  editFn?: (payload: QuoteSectionUpdatePayload) => void;
  createFn?: (payload: QuoteSectionCreatePayload) => void;
  isSubmitting?: boolean;
};

function QuoteSectionForm({
  isOpen,
  toggleIsOpen,
  mode,
  defaultValues,
  editFn,
  createFn,
  isSubmitting,
}: QuoteSectionFormProps) {
  const [comboboxSearchTerm, setComboboxSearchTerm] = useState("");
  const {
    setValue,
    control,
    formState: { errors },
    handleSubmit,
    reset,
    clearErrors,
  } = useForm<QuoteSectionCreatePayload | QuoteSectionUpdatePayload>({
    defaultValues: defaultValues ?? {
      sort: undefined,
      title: "",
      content: "",
    },
    resolver: yupResolver(
      mode === "creation" ? qouteSectionCreateSchema : QuoteSectionUpdateSchema,
    ),
  });

  useEffect(() => {
    if (mode === "updation" && defaultValues) {
      if (defaultValues?.sort) {
        setValue("sort", defaultValues.sort);
        setComboboxSearchTerm(defaultValues.sort.toString());
      }
      setValue("content", defaultValues.content);
      if (defaultValues?.title) {
        setValue("title", defaultValues.title);
      }
      setValue("id", (defaultValues as QuoteSectionUpdatePayload).id);
    }
  }, [defaultValues]);

  const submitHandler = (
    data: QuoteSectionCreatePayload | QuoteSectionUpdatePayload,
  ) => {
    if (mode === "creation") {
      createFn?.(data as QuoteSectionCreatePayload);
    } else {
      editFn?.(data as QuoteSectionUpdatePayload);
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
      isSubmitting={isSubmitting}
    >
      <div className="flex flex-col gap-5 p-5">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 grow">
            <label className="input-label justify-start!"> sort </label>
            <CustomCombobox
              items={Array.from({ length: 10 }, (_, i) => i + 1)}
              onValueChange={(val) => {
                if (val) {
                  setComboboxSearchTerm(val.toString());
                  setValue("sort", val);
                }
              }}
              placeholder="Select sort"
              className={cn(`${errors.sort ? `input-error` : `input-valid`} `)}
              getItemLabel={(sort) => sort.toString()}
              getItemId={(sort) => sort}
              getItemValue={(sort) => sort}
              inptFieldChange={(sort) => {
                if (sort) {
                  setComboboxSearchTerm(sort);
                  clearErrors("sort");
                } else {
                  setComboboxSearchTerm("");
                }
              }}
              inptFieldValue={comboboxSearchTerm}
              filterFn={(sort, query) => sort.toString() === query}
            />
            {errors.sort && (
              <span className="error-text"> {errors.sort.message} </span>
            )}
          </div>

          <CustomInput
            control={control}
            name="title"
            fieldName="title Title"
            placeholder="Introduction"
            className="grow"
          />
        </div>

        <CustomInput
          control={control}
          name="content"
          fieldName="content"
          className="min-h-80"
          inptType="textarea"
          placeholder="Enter content"
        />
      </div>
    </CustomDialog>
  );
}

export default QuoteSectionForm;
