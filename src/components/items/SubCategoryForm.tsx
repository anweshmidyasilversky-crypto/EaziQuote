import React from "react";
import { useForm } from "react-hook-form";
import { type SubcategoryPayload } from "../../types/subCategory.payload.type";
import { yupResolver } from "@hookform/resolvers/yup";
import { subCategorySchema } from "../../validation/itemCreation.payload.schema";
import { CustomSheet } from "../common/CustomSheet";
import { CustomCombobox } from "../common/CustomCombobox";
import { CustomInput } from "../common/customInput";
import { cn } from "../../lib/utils";
import type { SubCategoryCreateApiPayload } from "@/types/api.requests.type";
import useCategoriesList from "@/hooks/apis/categories/useCategoriesList";

export type SubCategoryFormProps = {
  isOpen: boolean;
  toggleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createFn?: (payload: SubCategoryCreateApiPayload) => void;
  isSubmitting?: boolean;
};

function SubCategoryForm({
  isOpen,
  toggleIsOpen,
  createFn,
  isSubmitting,
}: SubCategoryFormProps) {
  const {
    categoryList: categories,
    searchTerm: catSearchTerm,
    setSearchTerm: setCatSearchTerm,
    isFetching: isCategoryListFetching,
    fetchNextPage: fetchNextCategories,
    isFetchingNextPage: isFetchingNextCategories,
    paginationMeta: categoryPaginationMeta,
  } = useCategoriesList({});

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
    createFn?.({
      category_id: data.catId,
      name: data.subCategory,
    });
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
      closeAction={() => {
        clearErrors();
        reset();
      }}
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
            getItemId={(category) => category.id}
            inptFieldValue={catSearchTerm}
            inptFieldChange={setCatSearchTerm}
            isFetching={isCategoryListFetching}
            paginationMeta={categoryPaginationMeta}
            fetchNextPage={fetchNextCategories}
            isFetchingNextPage={isFetchingNextCategories}
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
