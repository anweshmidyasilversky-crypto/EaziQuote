import { assets } from "@/assets/icons";
import { CustomActionGroup } from "@/components/common/CustomActionGroup";
import { HeaderBreadCrumb } from "@/components/common/CustomBreadCrumb";
import { CustomBtn } from "@/components/common/CustomBtn";
import { CustomInput } from "@/components/common/customInput";
import { CustomDataTable } from "@/components/common/CustomTable";
import { FormLayout } from "@/components/common/FormLayout";
import SearchInputGruop from "@/components/common/SearchInputGruop";
import { useDebounce } from "@/hooks/useDebounce";
import { getRandomNumber } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import type { Category } from "@/types/category.types";
import { categorySchema } from "@/validation/itemCreation.payload.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { useForm, type DefaultValues } from "react-hook-form";
import { toast } from "react-toastify";

function CategoriesPage() {
  const categories = useAppSelector((state) => state.categories);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });
  const [categoryFormOpen, toggleCategoryFormOpen] = useState(false);
  const categoryFormMode = useRef<"creation" | "updation">("creation");
  const defaultvalue = useRef<DefaultValues<Omit<Category, "id">> | undefined>(
    undefined,
  );
  const [isSubmitting, toggleIsSubmitting] = useState(false);
  const currCatId = useRef<string | null>(null);

  const { control, setValue, handleSubmit, reset, clearErrors } = useForm<{
    category?: string;
  }>({
    defaultValues: {
      category: "",
    },
    resolver: yupResolver(
      categoryFormMode.current === "creation"
        ? categorySchema
        : categorySchema.deepPartial(),
    ),
  });

  const categoryColumns: ColumnDef<TableFeatures, Category>[] = [
    {
      accessorKey: "name",
      header: "Category",
      enableSorting: false,
    },
    {
      id: "subCat",
      header: "Subcategories",
      accessorFn: () => getRandomNumber(1, 100),
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
              currCatId.current = info.row.original.id;
              defaultvalue.current = { name: info.row.original.name };
              categoryFormMode.current = "updation";
              toggleCategoryFormOpen((curr) => !curr);
            }}
          />
        </div>
      ),
    },
  ];

  const submitHandler = (data: { category?: string }) => {
    toggleIsSubmitting(true);
    console.log(data);
    toast.success(
      `Successfully ${categoryFormMode.current === "creation" ? `added` : `edited`} category`,
    );
    toggleIsSubmitting(false);
  };

  useEffect(() => {
    if (defaultvalue.current) {
      setValue("category", defaultvalue.current.name);
    }
  }, [defaultvalue.current?.name]);

  return (
    <>
      <HeaderBreadCrumb pageName="Categories" />
      <div className="flex flex-col gap-5.5 pt-5 m-6 bg-table rounded-[10px]">
        <CustomDataTable
          columns={categoryColumns}
          data={categories}
          tableOptionsLeft={
            <SearchInputGruop
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchPlaceHolder="Search category"
            />
          }
          tableOptionsRight={
            <CustomBtn
              buttonLabel="New Category"
              leftIcon={assets.plusIcon}
              onClick={() => {
                categoryFormMode.current = "creation";
                defaultvalue.current = undefined;
                toggleCategoryFormOpen((curr) => !curr);
              }}
            />
          }
          globalFilterTerm={debouncedSearchTerm}
        />
      </div>

      <FormLayout
        formHeading={`${categoryFormMode.current === "creation" ? `Add` : `Edit`} Category`}
        isFormOpen={categoryFormOpen}
        submitHanlder={handleSubmit(submitHandler)}
        sumbitBtnLabel={`Save Category`}
        isSubmitting={isSubmitting}
        formCloseAction={() => {
          clearErrors();
          reset();
          toggleCategoryFormOpen(false);
        }}
      >
        <CustomInput
          control={control}
          name="category"
          fieldName="Category Name"
          placeholder="Category name"
        />
      </FormLayout>
    </>
  );
}

export default CategoriesPage;
