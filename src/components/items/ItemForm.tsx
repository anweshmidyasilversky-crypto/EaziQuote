import { useForm, useWatch, type DefaultValues } from "react-hook-form";
import { type ItemCreationPayload } from "../../types/itemCreation.payload.type";
import { type ItemEditPayload } from "../../types/itemEdit.payload.type";
import { yupResolver } from "@hookform/resolvers/yup";
import { itemCreationSchema } from "../../validation/itemCreation.payload.schema";
import { FormLayout } from "../common/FormLayout";
import { useEffect, useState } from "react";
import { CustomInput } from "../common/CustomInput";
import { CustomCombobox } from "../common/CustomCombobox";
import { useAppSelector } from "../../redux/store";
import { CustomBtn } from "../common/CustomBtn";
import { assets } from "../../assets/icons";
import { cn } from "../../lib/utils";
import AddCategoryForm from "./AddCategoryForm";
import SubCategoryForm from "./SubCategoryForm";
import { showErrorToast } from "@/api/axiosInstance";
import type { ItemDetails } from "@/types/api.responses.type";
import useCategoriesList from "@/hooks/apis/categories/useCategoriesList";
import useCategoryMutations from "@/hooks/apis/categories/useCategoryMutations";
import { toast } from "react-toastify";
import useSubcategoryByCategory from "@/hooks/apis/subcategories/useSubcategoryByCategory";
import useSubCategoryMutations from "@/hooks/apis/subcategories/useSubCategoryMutations";
import type { SubCategoryCreateApiPayload } from "@/types/api.requests.type";

export type ItemFormProps = {
  isOpen: boolean;
  toggleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "creation" | "updation";
  creationFn?: (data: ItemCreationPayload) => void | Promise<void>;
  editFn?: (data: ItemEditPayload) => void | Promise<void>;
  defaultValues?: DefaultValues<ItemEditPayload | ItemCreationPayload>;
  withAddCategory?: boolean;
  withAddSubCategory?: boolean;
  currItem?: ItemDetails;
};

function ItemForm({
  mode,
  defaultValues,
  isOpen,
  toggleIsOpen,
  creationFn,
  editFn,
  withAddCategory = true,
  withAddSubCategory = true,
  currItem,
}: ItemFormProps) {
  const [categoryForm, toggleCategoryForm] = useState(false);
  const [subCategoryForm, toggleSubCategoryForm] = useState(false);
  const [isSubmitting, toggleIsSubmitting] = useState(false);
  const appConfig = useAppSelector((state) => state.appConfig);
  const [unitSearchTerm, setUnitSearchTerm] = useState("");

  const {
    categoryList: categories,
    fetchNextPage: fetchNextCategories,
    paginationMeta: categoriesPaginationMeta,
    isFetchingNextPage: fetchingNextCategories,
    searchTerm: catSearchTerm,
    setSearchTerm: setCatSearchTerm,
    isFetching: isFetchingCategories,
    refetch: refetchCategories,
  } = useCategoriesList({});

  const { createCategoryMutation } = useCategoryMutations();

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
    clearErrors,
  } = useForm<ItemCreationPayload | ItemEditPayload>({
    defaultValues: {
      name: "",
      unit: "",
      pricePerUnit: undefined,
      unitPrice: undefined,
    },
    resolver: yupResolver(
      mode === "creation"
        ? itemCreationSchema
        : itemCreationSchema.deepPartial(),
    ),
  });

  const [catId] = useWatch({
    control,
    name: ["catId"],
  });

  const {
    subCategories,
    isFetching: isSubcatFetching,
    searchTerm: subCatSearchTerm,
    setSearchTerm: setSubcatSearchTerm,
    refetch: refetchSubCategories,
  } = useSubcategoryByCategory({
    catId: catId ?? "",
    enabled: catId !== undefined,
  });

  const { createSubCategoryMutation } = useSubCategoryMutations();

  useEffect(() => {
    if (currItem) {
      setValue("catId", currItem.category_id);
      setValue("subCatId", currItem.subcategory_id?.toString());
      setValue("name", currItem.name);
      setValue("unit", currItem.unit);
      setValue("unitPrice", currItem.cost);
      setValue("pricePerUnit", currItem.price);

      setCatSearchTerm(currItem.category_name);
      setSubcatSearchTerm(currItem.subcategory_name ?? "");
      setUnitSearchTerm(currItem.unit ?? "");
    }
  }, [currItem]);

  const submitHandler = async (data: ItemCreationPayload | ItemEditPayload) => {
    toggleIsSubmitting(true);
    try {
      if (mode === "creation") {
        await creationFn?.(data as ItemCreationPayload);
      } else {
        await editFn?.(data);
      }
      reset();
      toggleIsOpen(false);
    } catch (error) {
      showErrorToast(error);
    } finally {
      toggleIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (defaultValues) {
      Object.keys(defaultValues).map((key) => {
        const defKey = key as keyof DefaultValues<
          ItemEditPayload | ItemCreationPayload
        >;
        setValue(
          key as keyof ItemCreationPayload,
          defaultValues?.[defKey] ?? "",
        );
      });
    }
  }, [defaultValues]);

  const handleCategoryCreation = (name: string) => {
    createCategoryMutation.mutate(name, {
      onSuccess: (response) => {
        toast.success(response.message);
        refetchCategories();
        setValue("catId", response.payload.id);
        setCatSearchTerm(response.payload.name);
        toggleCategoryForm(false);
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  const handleSubCategoryCreation = (payload: SubCategoryCreateApiPayload) => {
    createSubCategoryMutation.mutate(payload, {
      onSuccess: (response) => {
        toast.success(response.message);
        setValue("subCatId", response.payload.id);
        setSubcatSearchTerm(response.payload.name);
        toggleSubCategoryForm(false);
        refetchSubCategories();
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  return (
    <>
      <FormLayout
        isFormOpen={isOpen}
        formCloseAction={() => {
          toggleIsOpen((curr) => !curr);
          clearErrors();
          reset();
        }}
        formHeading={mode === "creation" ? "Add Item" : "Edit Item"}
        sumbitBtnLabel="Save Item"
        submitHanlder={handleSubmit(submitHandler)}
        isSubmitting={isSubmitting}
      >
        <div className="input-non-oriented flex-col gap-2">
          <span> Category </span>
          <CustomCombobox
            items={categories ?? []}
            getItemLabel={(category) => category?.name ?? ""}
            onValueChange={(category) => {
              if (category) {
                setCatSearchTerm(category.name);
                setValue("catId", category.id);

                setValue("subCatId", undefined);
                setSubcatSearchTerm("");
                clearErrors("catId");
              }
            }}
            placeholder="Search or select a category"
            className={errors.catId ? `input-error` : ``}
            inputRightNode={
              withAddCategory ? (
                <CustomBtn
                  buttonLabel="Category"
                  leftIcon={assets.plusIconBlack}
                  btncls={cn(
                    `input-field h-full! grow-0 py-3 bg-transparent text-black-text hover:bg-transparent`,
                  )}
                  onClick={() => toggleCategoryForm((curr) => !curr)}
                />
              ) : undefined
            }
            inptFieldValue={catSearchTerm}
            inptFieldChange={setCatSearchTerm}
            filterFn={(category, query) =>
              category.name.toLocaleLowerCase().includes(query)
            }
            getItemId={(category) => category.id}
            paginationMeta={categoriesPaginationMeta}
            isFetchingNextPage={fetchingNextCategories}
            fetchNextPage={fetchNextCategories}
            isFetching={isFetchingCategories}
          />
          {errors.catId && (
            <span className="error-text"> {errors.catId.message} </span>
          )}
        </div>

        <div className="input-non-oriented flex-col gap-2">
          <span> Subcategory </span>
          <CustomCombobox
            items={subCategories ?? []}
            getItemLabel={(subCategory) => subCategory?.name ?? ""}
            onValueChange={(subCategory) => {
              if (subCategory) {
                setValue("subCatId", subCategory.id);
                setSubcatSearchTerm(subCategory.name);
                clearErrors("subCatId");
              }
            }}
            className={errors.subCatId ? `input-error` : ``}
            placeholder="Search or select a subcategory"
            inputRightNode={
              withAddSubCategory ? (
                <CustomBtn
                  buttonLabel="Subcategory"
                  leftIcon={assets.plusIconBlack}
                  btncls={cn(
                    `input-field h-full! grow-0 py-3 bg-transparent text-black-text hover:bg-transparent`,
                  )}
                  onClick={() => toggleSubCategoryForm((curr) => !curr)}
                />
              ) : undefined
            }
            inptFieldValue={subCatSearchTerm}
            inptFieldChange={setSubcatSearchTerm}
            isFetching={isSubcatFetching}
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

        <div className="flex flex-col gap-2 w-full">
          <span className="input-label self-start"> {"Unit"} </span>
          <CustomCombobox
            items={appConfig.measurement_units}
            getItemLabel={(unit) => unit.description}
            placeholder="Select a Unit"
            filterFn={(item, query) => {
              return item.description.toLocaleLowerCase().includes(query);
            }}
            onValueChange={(unit) => {
              if (unit) {
                setValue("unit", unit.id);
                setUnitSearchTerm(unit.description);
              }
            }}
            inptFieldValue={unitSearchTerm}
            inptFieldChange={(unit) => setUnitSearchTerm(unit)}
          />
        </div>

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
        createFn={handleCategoryCreation}
        isSubmitting={createCategoryMutation.isPending}
      />

      <SubCategoryForm
        isOpen={subCategoryForm}
        toggleIsOpen={toggleSubCategoryForm}
        createFn={handleSubCategoryCreation}
        isSubmitting={createSubCategoryMutation.isPending}
      />
    </>
  );
}

export default ItemForm;
