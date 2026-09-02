import React from "react";
import { useForm } from "react-hook-form";
import { type SubcategoryPayload } from "../../types/subCategory.payload.type";
import { yupResolver } from "@hookform/resolvers/yup";
import { subCategorySchema } from "../../validation/itemCreation.payload.schema";
import { CustomSheet } from "../common/CustomSheet";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { CustomCombobox } from "../common/CustomCombobox";
import { CustomInput } from "../common/customInput";
import { addSubCategory } from "../../redux/slices/subCategories.slice";
import { cn } from "../../lib/utils";

export type SubCategoryFormProps = {
  isOpen: boolean;
  toggleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function SubCategoryForm({ isOpen, toggleIsOpen }: SubCategoryFormProps) {
  const dispath = useAppDispatch();
  const categories = useAppSelector((state) => state.categories);
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

  const submitHandler = (data: SubcategoryPayload) => {
    dispath(
      addSubCategory({
        id: data.subCategory.toLocaleLowerCase(),
        catId: data.catId,
        name: data.subCategory,
      }),
    );
    reset();
    toggleIsOpen(false);
  };

  return (
    <CustomSheet
      isOpen={isOpen}
      toggleIsOpen={toggleIsOpen}
      applyBtnLabel="Save Subcategory"
      submitFn={handleSubmit(submitHandler)}
      closeOnApply={false}
      applyBtnCls={cn(`max-w-full!`)}
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
                setValue("catId", category?.id);
                clearErrors("catId");
              }
            }}
            placeholder="Search or select a category"
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
