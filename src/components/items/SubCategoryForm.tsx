import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { type SubcategoryPayload } from "../../types/subCategory.payload.type";
import { yupResolver } from "@hookform/resolvers/yup";
import { subCategorySchema } from "../../validation/itemCreation.payload.schema";
import { CustomSheet } from "../common/CustomSheet";
import { useAppSelector } from "../../redux/store";
import { CustomCombobox } from "../common/CustomCombobox";
import { CustomInput } from "../common/customInput";
import { cn } from "../../lib/utils";
import { useMutation } from "@tanstack/react-query";
import { createSubCategory } from "@/api/subCategories.api";
import type { SubCategoryCreateApiPayload } from "@/types/api.requests.type";
import { toast } from "react-toastify";
import { showErrorToast } from "@/api/axiosInstance";

export type SubCategoryFormProps = {
  isOpen: boolean;
  toggleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function SubCategoryForm({ isOpen, toggleIsOpen }: SubCategoryFormProps) {
  const [isSubmitting, toggleIsSubmitting] = useState(false);
  const { quote_categories: categories } = useAppSelector(
    (state) => state.appConfig,
  );
  const [catSearchTerm, setCatSearchTerm] = useState("");
  const {
    control,
    formState: { errors },
    setValue,
    clearErrors,
    handleSubmit,
    reset,
  } = useForm<SubcategoryPayload>({
    defaultValues: {
      catId: "",
      subCategory: "",
    },
    resolver: yupResolver(subCategorySchema),
  });

  const { mutateAsync: createSubCategoryAsync } = useMutation({
    mutationFn: (payload: SubCategoryCreateApiPayload) =>
      createSubCategory(payload),
  });

  const submitHandler = async (data: SubcategoryPayload) => {
    toggleIsSubmitting(true);
    try {
      const newsubCategory = await createSubCategoryAsync({
        category_id: data.catId,
        name: data.subCategory,
      });
      toast.success(newsubCategory.message);
      reset();
      toggleIsOpen(false);
    } catch (error) {
      showErrorToast(error);
    } finally {
      toggleIsSubmitting(false);
    }
  };

  return (
    <CustomSheet
      isOpen={isOpen}
      toggleIsOpen={toggleIsOpen}
      applyBtnLabel="Save Subcategory"
      submitFn={handleSubmit(submitHandler)}
      closeOnApply={false}
      applyBtnCls={cn(`max-w-full!`)}
      header="Add Subcategory"
      isSubmitting={isSubmitting}
    >
      <div className="p-5 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span> Category </span>
          <CustomCombobox
            items={categories}
            getItemLabel={(category) => category.name}
            className={errors.catId ? `input-error` : ``}
            onValueChange={(category) => {
              if (category) {
                setCatSearchTerm(category.name);
                setValue("catId", category.id.toString());
                clearErrors("catId");
              }
            }}
            placeholder="Search or select a category"
            filterFn={(category, query) =>
              category.name.toLocaleLowerCase().includes(query)
            }
            inptFieldValue={catSearchTerm}
            inptFieldChange={setCatSearchTerm}
          />
          {errors.catId && (
            <span className="error-text"> {errors.catId.message} </span>
          )}
        </div>

        <CustomInput
          control={control}
          name="subCategory"
          fieldName="Sub Category"
          placeholder="Subcategory Name"
        />
      </div>
    </CustomSheet>
  );
}

export default SubCategoryForm;
