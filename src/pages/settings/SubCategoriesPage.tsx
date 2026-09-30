import { showErrorToast } from "@/api/axiosInstance";
import { assets } from "@/assets/icons";
import { CustomActionGroup } from "@/components/common/CustomActionGroup";
import { HeaderBreadCrumb } from "@/components/common/CustomBreadCrumb";
import { CustomBtn } from "@/components/common/CustomBtn";
import { CustomCombobox } from "@/components/common/CustomCombobox";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomDataTable } from "@/components/common/CustomTable";
import DeleteDialog from "@/components/common/DeleteDialog";
import { FormLayout } from "@/components/common/FormLayout";
import SearchInputGruop from "@/components/common/SearchInputGruop";
import useCategoriesList from "@/hooks/apis/categories/useCategoriesList";
import useSubCategoryList from "@/hooks/apis/subcategories/useSubCategoryList";
import useSubCategoryMutations from "@/hooks/apis/subcategories/useSubCategoryMutations";
import type { SubcategoryWithCategory } from "@/types/api.responses.type";
import type { SubcategoryPayload } from "@/types/subCategory.payload.type";
import { subCategorySchema } from "@/validation/itemCreation.payload.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { useForm, type DefaultValues } from "react-hook-form";
import { toast } from "react-toastify";

function SubCategoriesPage() {
  const {
    categoryList,
    isFetching: isCategoryListFetching,
    fetchNextPage: fetchNextCategories,
    isFetchingNextPage: isFetchingNextCategories,
    searchTerm: categorySearchTerm,
    setSearchTerm: setCategorySearchTerm,
  } = useCategoriesList({});
  const {
    subcategories,
    searchTerm,
    setSearchTerm,
    setPageNo,
    paginationMeta,
    isFetching,
    refetch,
    pageNo,
  } = useSubCategoryList({});
  const {
    createSubCategoryMutation,
    updateSubCategoryMutation,
    deleteSubCategoryMutation,
  } = useSubCategoryMutations();
  const [subcategoryFormOpen, toggleSubCategoryFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const subCategoryFormMode = useRef<"creation" | "updation">("creation");
  const defaultvalue = useRef<
    DefaultValues<Omit<SubcategoryWithCategory, "id">> | undefined
  >(undefined);
  const currSubCatId = useRef<number | null>(null);

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<SubcategoryPayload>({
    defaultValues: {
      catId: "",
      subCategory: "",
    },
    resolver: yupResolver(subCategorySchema),
  });

  const subCategoryColumns: ColumnDef<
    TableFeatures,
    SubcategoryWithCategory
  >[] = [
    {
      accessorKey: "name",
      header: "subcategory",
      enableSorting: false,
    },
    {
      id: "category",
      header: "category",
      accessorFn: (subcategory) => subcategory.category.name,
      enableSorting: false,
    },
    {
      accessorKey: "products_count",
      header: "ITEMS",
      enableSorting: false,
    },
    {
      id: "action",
      header: () => <div className="flex w-full justify-end">{"ACTION"}</div>,
      cell: (info) => {
        const { id, ...rest } = info.row.original;
        return (
          <div className="w-full grid grid-cols-2 ml-10 md:ml-20 lg:ml-50">
            <div />
            <div className="flex justify-end">
              <CustomActionGroup
                withOpen={false}
                editFn={() => {
                  currSubCatId.current = id;
                  defaultvalue.current = rest;
                  subCategoryFormMode.current = "updation";
                  toggleSubCategoryFormOpen((curr) => !curr);
                }}
                deleteFn={() => {
                  currSubCatId.current = id;
                  setDeleteDialogOpen(true);
                }}
              />
            </div>
          </div>
        );
      },
    },
  ];

  const submitHandler = (data: SubcategoryPayload) => {
    if (subCategoryFormMode.current === "creation") {
      createSubCategoryMutation.mutate(
        {
          category_id: data.catId,
          name: data.subCategory,
        },
        {
          onSuccess: (response) => {
            toast.success(response.message);
            toggleSubCategoryFormOpen(false);
            reset({
              catId: undefined,
              subCategory: undefined,
            });
            setCategorySearchTerm("");
            pageNo > 1 ? setPageNo(1) : refetch();
          },
          onError: (error) => {
            showErrorToast(error);
          },
        },
      );
    } else {
      if (!currSubCatId.current) {
        toast.error(`No subCategory Selected for updation`);
        return;
      }
      updateSubCategoryMutation.mutate(
        {
          id: currSubCatId.current,
          category_id: data.catId,
          name: data.subCategory,
        },
        {
          onSuccess: (response) => {
            toast.success(response.message);
            toggleSubCategoryFormOpen(false);
            reset({
              catId: undefined,
              subCategory: undefined,
            });
            setCategorySearchTerm("");
            refetch();
          },
          onError: (error) => {
            showErrorToast(error);
          },
        },
      );
    }
  };

  const deleteHandler = () => {
    if (!currSubCatId.current) {
      toast.error(`No subcategory Selected for delete`);
      return;
    }
    deleteSubCategoryMutation.mutate(currSubCatId.current, {
      onSuccess: (response) => {
        toast.success(response.message);
        setDeleteDialogOpen(false);
        refetch();
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  useEffect(() => {
    if (defaultvalue.current) {
      console.log(defaultvalue.current);
      setValue("catId", defaultvalue.current.category?.id?.toString() ?? "");
      setValue("subCategory", defaultvalue.current.name ?? "");
      setCategorySearchTerm(defaultvalue.current.category?.name ?? "");
    }
  }, [defaultvalue.current]);

  return (
    <>
      <HeaderBreadCrumb pageName="Subcategories" />
      <div className="flex flex-col gap-5.5 pt-5 m-6 bg-table rounded-[10px]">
        <CustomDataTable
          columns={subCategoryColumns}
          data={subcategories}
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
          showPaginated
          isFetching={isFetching}
          paginationMeta={paginationMeta}
          paginationBtns={paginationMeta?.links}
          setPageNo={setPageNo}
        />
      </div>

      <FormLayout
        formHeading={`${subCategoryFormMode.current === "creation" ? `Add` : `Edit`} Category`}
        isFormOpen={subcategoryFormOpen}
        submitHanlder={handleSubmit(submitHandler)}
        sumbitBtnLabel={`Save Subcategory`}
        isSubmitting={
          createSubCategoryMutation.isPending ||
          updateSubCategoryMutation.isPending
        }
        formCloseAction={() => {
          clearErrors();
          reset();
          toggleSubCategoryFormOpen(false);
          setSearchTerm("");
        }}
      >
        <div className="flex w-full flex-col gap-2">
          <span> Category </span>
          <CustomCombobox
            items={categoryList}
            getItemLabel={(category) => category?.name}
            getItemId={(category) => category?.id}
            className={errors.catId ? `input-error` : ``}
            onValueChange={(category) => {
              if (category) {
                setValue("catId", category?.id?.toString());
                setCategorySearchTerm(category?.name);
                clearErrors("catId");
              }
            }}
            placeholder="Search or select a category"
            inptFieldValue={categorySearchTerm}
            inptFieldChange={setCategorySearchTerm}
            fetchNextPage={fetchNextCategories}
            isFetching={isCategoryListFetching}
            isFetchingNextPage={isFetchingNextCategories}
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

      <DeleteDialog
        isOpen={deleteDialogOpen}
        toggleOpen={setDeleteDialogOpen}
        deleteAction={deleteHandler}
        isPending={deleteSubCategoryMutation.isPending}
      />
    </>
  );
}

export default SubCategoriesPage;
