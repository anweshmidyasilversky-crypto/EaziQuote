import { assets } from "@/assets/icons";
import { CustomActionGroup } from "@/components/common/CustomActionGroup";
import { HeaderBreadCrumb } from "@/components/common/CustomBreadCrumb";
import { CustomBtn } from "@/components/common/CustomBtn";
import { CustomCombobox } from "@/components/common/CustomCombobox";
import { CustomInput } from "@/components/common/customInput";
import { CustomDataTable } from "@/components/common/CustomTable";
import { FormLayout } from "@/components/common/FormLayout";
import SearchInputGruop from "@/components/common/SearchInputGruop";
import { useDebounce } from "@/hooks/useDebounce";
import { getRandomNumber } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import type { SubcategoryPayload } from "@/types/subCategory.payload.type";
import type { SubCategory } from "@/types/subCategory.type";
import { subCategorySchema } from "@/validation/itemCreation.payload.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { useForm, type DefaultValues } from "react-hook-form";
import { toast } from "react-toastify";

function SubCategoriesPage() {
  const categories = useAppSelector((state) => state.categories);
  const subCategories = useAppSelector((state) => state.subCategories);
  const getCategory = (catId: string) => {
    return categories.find((category) => category.id === catId);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });
  const [subcategoryFormOpen, toggleSubCategoryFormOpen] = useState(false);
  const subCategoryFormMode = useRef<"creation" | "updation">("creation");
  const defaultvalue = useRef<
    DefaultValues<Omit<SubCategory, "id">> | undefined
  >(undefined);
  const [isSubmitting, toggleIsSubmitting] = useState(false);
  const currSubCatId = useRef<string | null>(null);

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<SubcategoryPayload | Partial<SubcategoryPayload>>({
    defaultValues: {
      catId: "",
      subCategory: "",
    },
    resolver: yupResolver(
      subCategoryFormMode.current === "creation"
        ? subCategorySchema
        : subCategorySchema.deepPartial(),
    ),
  });

  const subCategoryColumns: ColumnDef<TableFeatures, SubCategory>[] = [
    {
      accessorKey: "name",
      header: "subcategory",
      enableSorting: false,
    },
    {
      id: "category",
      header: "category",
      accessorFn: (row) => getCategory(row.catId)?.name ?? "unknown category",
      enableSorting: false,
    },
    {
      id: "items",
      header: "ITEMS",
      accessorFn: () => getRandomNumber(10, 100),
      enableSorting: false,
    },
    {
      id: "action",
      header: () => <div className="flex w-full justify-end">{"ACTION"}</div>,
      cell: (info) => (
        <div className="min-w-70 flex justify-end pr-1">
          <CustomActionGroup
            withOpen={false}
            editFn={() => {
              currSubCatId.current = info.row.original.id;
              defaultvalue.current = { name: info.row.original.name };
              subCategoryFormMode.current = "updation";
              toggleSubCategoryFormOpen((curr) => !curr);
            }}
          />
        </div>
      ),
    },
  ];

  const submitHandler = (
    data: SubcategoryPayload | Partial<SubcategoryPayload>,
  ) => {
    toggleIsSubmitting(true);
    console.log(data);
    toast.success(
      `Successfully ${subCategoryFormMode.current === "creation" ? `added` : `edited`} category`,
    );
    reset();
    toggleIsSubmitting(false);
    toggleSubCategoryFormOpen(false);
  };

  useEffect(() => {
    if (defaultvalue.current) {
      setValue("catId", defaultvalue.current.catId);
      setValue("subCategory", defaultvalue.current.name);
    }
  }, [defaultvalue.current?.name]);

  return (
    <>
      <HeaderBreadCrumb pageName="Subcategories" />
      <div className="flex flex-col gap-5.5 pt-5 m-6 bg-table rounded-[10px]">
        <CustomDataTable
          columns={subCategoryColumns}
          data={subCategories}
          tableOptionsLeft={
            <SearchInputGruop
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchPlaceHolder="Search subcategory"
            />
          }
          tableOptionsRight={
            <CustomBtn
              buttonLabel="New Subcategory"
              leftIcon={assets.plusIcon}
              onClick={() => {
                subCategoryFormMode.current = "creation";
                defaultvalue.current = undefined;
                toggleSubCategoryFormOpen((curr) => !curr);
              }}
            />
          }
          globalFilterTerm={debouncedSearchTerm}
        />
      </div>

      <FormLayout
        formHeading={`${subCategoryFormMode.current === "creation" ? `Add` : `Edit`} Category`}
        isFormOpen={subcategoryFormOpen}
        submitHanlder={handleSubmit(submitHandler)}
        sumbitBtnLabel={`Save Subcategory`}
        isSubmitting={isSubmitting}
        formCloseAction={() => {
          clearErrors();
          reset();
          toggleSubCategoryFormOpen(false);
        }}
      >
        <div className="flex w-full flex-col gap-2">
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
            selected={getCategory(
              subCategoryFormMode.current === "updation" ? "cat-materials" : "",
            )}
            placeholder="Search or select a category"
          />
          {errors.catId && (
            <span className="error-text"> {errors.catId.message} </span>
          )}
        </div>

        <CustomInput
          control={control}
          name="subCategory"
          fieldName="Subcategory Name"
          placeholder="Subcategory Name"
        />
      </FormLayout>
    </>
  );
}

export default SubCategoriesPage;
