import { useForm, type DefaultValues } from "react-hook-form";
import { type ItemCreationPayload } from "../../types/itemCreation.payload.type";
import { type ItemEditPayload } from "../../types/itemEdit.payload.type";
import { yupResolver } from "@hookform/resolvers/yup";
import { itemCreationSchema } from "../../validation/itemCreation.payload.schema";
import { FormLayout } from "../common/FormLayout";
import { useState } from "react";
import { CustomInput } from "../common/CustomInput";
import { CustomCombobox } from "../common/CustomCombobox";
import { useAppSelector } from "../../redux/store";
import { CustomBtn } from "../common/CustomBtn";
import { assets } from "../../assets/icons";
import { cn } from "../../lib/utils";
import AddCategoryForm from "./AddCategoryForm";
import SubCategoryForm from "./SubCategoryForm";

export type ItemFormProps = {
  isOpen: boolean;
  toggleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "creation" | "updation";
  creationFn?: (data: ItemCreationPayload) => void;
  editFn?: (data: ItemEditPayload) => void;
  defaultValues?: DefaultValues<ItemEditPayload | ItemCreationPayload>;
};

function ItemForm({
  mode,
  defaultValues,
  isOpen,
  toggleIsOpen,
  creationFn,
  editFn,
}: ItemFormProps) {
  const [categoryForm, toggleCategoryForm] = useState(false);
  const [subCategoryForm, toggleSubCategoryForm] = useState(false);
  const [isSubmitting, toggleIsSubmitting] = useState(false);
  const categories = useAppSelector((state) => state.categories);
  const subCategories = useAppSelector((state) => state.subCategories);

  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm<ItemCreationPayload | ItemEditPayload>({
    defaultValues: defaultValues ?? {
      catId: "",
      subCatId: "",
      name: "",
      unit: "",
    },
    resolver: yupResolver(
      mode === "creation"
        ? itemCreationSchema
        : itemCreationSchema.deepPartial(),
    ),
  });
  const submitHandler = (data: ItemCreationPayload | ItemEditPayload) => {
    toggleIsSubmitting(true);
    if (mode === "creation") {
      creationFn?.(data as ItemCreationPayload);
    } else {
      editFn?.(data);
    }
    toggleIsSubmitting(false);
    toggleIsOpen(false);
  };

  return (
    <>
      <FormLayout
        isFormOpen={isOpen}
        formCloseAction={() => {
          toggleIsOpen((curr) => !curr);
          clearErrors();
        }}
        formHeading={mode === "creation" ? "Add Item" : "Edit Item"}
        sumbitBtnLabel="Save Item"
        submitHanlder={handleSubmit(submitHandler)}
        isSubmitting={isSubmitting}
      >
        <div className="input-non-oriented flex-col gap-2">
          <span> Category </span>
          <CustomCombobox
            items={categories}
            getItemLabel={(category) => category.name}
            onValueChange={(category) => {
              category ? setValue("catId", category.id) : undefined;
              clearErrors("catId");
            }}
            placeholder="Search or select a category"
            className={errors.catId ? `input-error` : ``}
            inputRightNode={
              <CustomBtn
                buttonLabel="Category"
                leftIcon={assets.plusIconBlack}
                btncls={cn(
                  `input-field h-full! grow-0 py-3 bg-transparent text-black-text hover:bg-transparent`,
                )}
                onClick={() => toggleCategoryForm((curr) => !curr)}
              />
            }
          />
          {errors.catId && (
            <span className="error-text"> {errors.catId.message} </span>
          )}
        </div>

        <div className="input-non-oriented flex-col gap-2">
          <span> Subcategory </span>
          <CustomCombobox
            items={subCategories.filter(
              (subCategory) => subCategory.catId === watch().catId,
            )}
            getItemLabel={(subCategory) => subCategory.name}
            onValueChange={(subCategory) => {
              subCategory ? setValue("subCatId", subCategory.id) : undefined;
              clearErrors("subCatId");
            }}
            className={errors.subCatId ? `input-error` : ``}
            placeholder="Search or select a subcategory"
            inputRightNode={
              <CustomBtn
                buttonLabel="Subcategory"
                leftIcon={assets.plusIconBlack}
                btncls={cn(
                  `input-field h-full! grow-0 py-3 bg-transparent text-black-text hover:bg-transparent`,
                )}
                onClick={() => toggleSubCategoryForm((curr) => !curr)}
              />
            }
          />
          {errors.subCatId && (
            <span className="error-text"> {errors.subCatId.message} </span>
          )}
        </div>

        <CustomInput
          control={control}
          name="name"
          fieldName="Item Name"
          placeholder="Item name"
        />

        <CustomInput
          control={control}
          name="unit"
          fieldName="Unit"
          placeholder="Unit"
        />

        <CustomInput
          control={control}
          name="pricePerUnit"
          fieldName="Price per Unit"
          placeholder="e.g. 10"
        />

        <CustomInput
          control={control}
          name="unitPrice"
          fieldName="Unit Cost"
          placeholder="e.g. 5"
        />
      </FormLayout>

      <AddCategoryForm
        isOpen={categoryForm}
        toggleIsOpen={toggleCategoryForm}
      />

      <SubCategoryForm
        isOpen={subCategoryForm}
        toggleIsOpen={toggleSubCategoryForm}
      />
    </>
  );
}

export default ItemForm;
