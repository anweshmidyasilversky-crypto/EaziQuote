import { showErrorToast } from "@/api/axiosInstance";
import { assets } from "@/assets/icons";
import { CustomActionGroup } from "@/components/common/CustomActionGroup";
import { HeaderBreadCrumb } from "@/components/common/CustomBreadCrumb";
import { CustomBtn } from "@/components/common/CustomBtn";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomDataTable } from "@/components/common/CustomTable";
import DeleteDialog from "@/components/common/DeleteDialog";
import { FormLayout } from "@/components/common/FormLayout";
import SearchInputGruop from "@/components/common/SearchInputGruop";
import useCategoriesList from "@/hooks/apis/categories/useCategoriesList";
import useCategoryMutations from "@/hooks/apis/categories/useCategoryMutations";
import { type Category } from "@/types/api.responses.type";
import { categorySchema } from "@/validation/itemCreation.payload.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { useForm, type DefaultValues } from "react-hook-form";
import { toast } from "react-toastify";

function CategoriesPage() {
  const {
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  } = useCategoryMutations();
  const {
    categoryList,
    setPageNo,
    searchTerm,
    setSearchTerm,
    isFetching,
    paginationMeta,
    refetch,
    pageNo,
  } = useCategoriesList({});
  const [categoryFormOpen, toggleCategoryFormOpen] = useState(false);
  const categoryFormMode = useRef<"creation" | "updation">("creation");
  const defaultvalue = useRef<DefaultValues<Omit<Category, "id">> | undefined>(
    undefined,
  );
  const currCatId = useRef<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { control, setValue, handleSubmit, reset, clearErrors } = useForm<{
    category: string;
  }>({
    defaultValues: {
      category: "",
    },
    resolver: yupResolver(categorySchema),
  });

  const categoryColumns: ColumnDef<TableFeatures, Category>[] = [
    {
      accessorKey: "name",
      header: "Category",
      enableSorting: false,
    },
    {
      accessorKey: "subcategories_count",
      header: "Subcategories",
      enableSorting: false,
    },
    {
      accessorKey: "items_count",
      header: "ITEMS",
      enableSorting: false,
    },
    {
      id: "action",
      header: () => <div className="flex w-full justify-end">{"ACTION"}</div>,
      cell: (info) => (
        <div className="w-full flex justify-end pr-1">
          <CustomActionGroup
            withOpen={false}
            editFn={() => {
              currCatId.current = info.row.original.id;
              defaultvalue.current = { name: info.row.original.name };
              categoryFormMode.current = "updation";
              toggleCategoryFormOpen((curr) => !curr);
            }}
            deleteFn={() => {
              currCatId.current = info.row.original.id;
              setDeleteModalOpen(true);
            }}
          />
        </div>
      ),
    },
  ];

  const submitHandler = async (data: { category: string }) => {
    if (categoryFormMode.current === "creation") {
      await createCategoryMutation.mutateAsync(data.category, {
        onSuccess: (response) => {
          toast.success(response.message);
          toggleCategoryFormOpen(false);
          pageNo > 1 ? setPageNo(1) : refetch();
        },
        onError: (error) => {
          showErrorToast(error);
        },
      });
    } else {
      await updateCategoryMutation.mutateAsync(
        {
          id: currCatId.current ?? 0,
          name: data.category,
        },
        {
          onSuccess: (response) => {
            toast.success(response.message);
            toggleCategoryFormOpen(false);
            refetch();
          },
        },
      );
    }
  };

  const deleteHandler = () => {
    if (currCatId.current) {
      deleteCategoryMutation.mutate(currCatId.current, {
        onSuccess: (response) => {
          toast.success(response.message);
          setDeleteModalOpen(false);
          refetch();
        },
        onError: (error) => {
          showErrorToast(error);
        },
      });
    } else {
      toast.error(`No Category selected for delete`);
    }
  };

  useEffect(() => {
    if (categoryFormMode.current === "updation" && defaultvalue.current) {
      setValue("category", defaultvalue.current.name ?? "");
    } else {
      setValue("category", "");
    }
  }, [defaultvalue?.current]);

  return (
    <>
      <HeaderBreadCrumb pageName="Categories" />
      <div className="flex flex-col gap-5.5 pt-5 m-6 bg-table rounded-[10px]">
        <CustomDataTable
          columns={categoryColumns}
          data={categoryList}
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
                reset({
                  category: "",
                });
                toggleCategoryFormOpen((curr) => !curr);
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
        formHeading={`${categoryFormMode.current === "creation" ? `Add` : `Edit`} Category`}
        isFormOpen={categoryFormOpen}
        submitHanlder={handleSubmit(submitHandler)}
        sumbitBtnLabel={`Save Category`}
        isSubmitting={
          createCategoryMutation.isPending || updateCategoryMutation.isPending
        }
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

      <DeleteDialog
        isOpen={deleteModalOpen}
        toggleOpen={setDeleteModalOpen}
        deleteAction={deleteHandler}
        isPending={deleteCategoryMutation.isPending}
      />
    </>
  );
}

export default CategoriesPage;
