import { showErrorToast } from "@/api/axiosInstance";
import { assets } from "@/assets/icons";
import { CustomActionGroup } from "@/components/common/CustomActionGroup";
import { HeaderBreadCrumb } from "@/components/common/CustomBreadCrumb";
import { CustomBtn } from "@/components/common/CustomBtn";
import { CustomDataTable } from "@/components/common/CustomTable";
import DeleteDialog from "@/components/common/DeleteDialog";
import { FormLayout } from "@/components/common/FormLayout";
import SearchInputGruop from "@/components/common/SearchInputGruop";
import type { ItemFormProps } from "@/components/items/ItemForm";
import ItemForm from "@/components/items/ItemForm";
import { Spinner } from "@/components/ui/spinner";
import useItemsList from "@/hooks/apis/items/useItemsList";
import useItemsMutations from "@/hooks/apis/items/useItemsMutations";
import { cn, formatCurrency } from "@/lib/utils";
import type { ItemDetails } from "@/types/api.responses.type";
import type { ItemCreationPayload } from "@/types/itemCreation.payload.type";
import { type ItemEditPayload } from "@/types/itemEdit.payload.type";
import { nanoid } from "@reduxjs/toolkit";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { FileTextIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

function ItemsPage() {
  const {
    itemsList,
    searchTerm,
    setSearchTerm,
    setPageNo,
    isFetching,
    refetch: refetchItemsList,
    paginationMeta,
  } = useItemsList({});

  const {
    createItemMutation,
    updateItemMutation,
    deleteItemMutation,
    templateDownloaMutation,
    itemsImportMutation,
  } = useItemsMutations();

  const itemAddHandler = async (data: ItemCreationPayload) => {
    const response = await createItemMutation.mutateAsync({
      name: data.name,
      category_id: Number(data.catId),
      subcategory_id: data.subCatId ? Number(data.subCatId) : undefined,
      unit: data.unit,
      price: data.pricePerUnit,
      cost: data.unitPrice,
      type: "product",
    });
    toast.success(response.message);
    refetchItemsList();
    setPageNo(1);
    toggleItemFormOpen(false);
  };

  const itemEditHandler = async (data: ItemEditPayload) => {
    const response = await updateItemMutation.mutateAsync({
      id: Number(targetItem.current?.id ?? "0"),
      name: data.name,
      category_id: data.catId ? Number(data.catId) : undefined,
      subcategory_id: data.subCatId ? Number(data.subCatId) : undefined,
      cost: data.unitPrice,
      price: data.pricePerUnit,
      unit: data.unit,
      type: "product",
    });

    toast.success(response.message);
    refetchItemsList();
    toggleItemFormOpen(false);
  };

  const itemDeleteHandler = () => {
    if (!targetItem.current?.id) {
      toast.error(`No item selected to delete`);
    } else {
      deleteItemMutation.mutate(targetItem.current.id, {
        onSuccess: (response) => {
          toast.success(response.message);
          setDeleteDialogOpen(false);
          refetchItemsList();
        },
        onError: (error) => {
          showErrorToast(error);
        },
      });
    }
  };

  const handleDownload = () => {
    templateDownloaMutation.mutate(undefined, {
      onSuccess: (response) => {
        const blob = new Blob([response], {
          type: `application/octet-stream`,
        });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `products template.xlsx`;

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  const handleImport = (file: File) => {
    itemsImportMutation.mutate(file, {
      onSuccess: (response) => {
        toast.success(response.message);
        toggleCsvFormOpen(false);
        refetchItemsList();
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  const [itemFormOpen, toggleItemFormOpen] = useState(false);
  const itemFormMode = useRef<ItemFormProps["mode"]>("creation");
  const defaultValues = useRef<ItemCreationPayload>(undefined);
  const targetItem = useRef<ItemDetails | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [csvFormOpen, toggleCsvFormOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | undefined>(undefined);
  const itemColumns: ColumnDef<TableFeatures, ItemDetails>[] = [
    {
      accessorKey: "name",
      header: "ITEM",
      enableSorting: false,
    },
    {
      accessorKey: "category_name",
      header: "CATEGORIES",
      enableSorting: false,
    },
    {
      accessorKey: "subcategory_name",
      header: "SUBCATEGORIES",
      enableSorting: false,
    },
    {
      accessorKey: "unit",
      header: "UNIT",
      enableSorting: false,
    },
    {
      accessorKey: "price",
      header: "Price/Unit",
      cell: (info) => formatCurrency(info.getValue<number>()),
      enableSorting: false,
    },
    {
      accessorKey: "cost",
      header: "Unit Cost",
      cell: (info) => formatCurrency(info.getValue<number>()),
      enableSorting: false,
    },
    {
      id: "action",
      header: () => <div className="w-full flex justify-end">{"ACTION"}</div>,
      cell: (info) => {
        const item = info.row.original;
        return (
          <div className="w-full flex min-w-70 justify-end">
            <CustomActionGroup
              withOpen={false}
              editFn={() => {
                itemFormMode.current = "updation";
                defaultValues.current = {
                  catId: item.category_id,
                  name: item.name,
                  unit: item.unit,
                  unitPrice: item.cost,
                  pricePerUnit: item.price,
                };
                targetItem.current = item;
                toggleItemFormOpen((curr) => !curr);
              }}
              deleteFn={() => {
                targetItem.current = item;
                setDeleteDialogOpen(true);
              }}
            />
          </div>
        );
      },
      enableSorting: false,
    },
  ];
  const csvGuidLines: { id: string; content: string }[] = [
    {
      id: nanoid(),
      content: "Download the sample CSV/XLSX file to see the required format.",
    },
    {
      id: nanoid(),
      content: "Required columns: Categories, Subcategories, Items",
    },
  ];

  return (
    <>
      <HeaderBreadCrumb pageName="Items" />

      <div className="p-6">
        <div className="flex flex-col gap-5 py-4.5 rounded-[10px] bg-table">
          <CustomDataTable
            columns={itemColumns}
            data={itemsList}
            tableOptionsLeft={
              <SearchInputGruop
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchPlaceHolder="Search item"
              />
            }
            tableOptionsRight={
              <div className="flex gap-3">
                <CustomBtn
                  buttonLabel="New Item"
                  leftIcon={assets.plusIcon}
                  onClick={() => {
                    itemFormMode.current = "creation";
                    targetItem.current = undefined;
                    toggleItemFormOpen((curr) => !curr);
                  }}
                />

                <CustomBtn
                  buttonLabel="Import"
                  leftIcon={assets.importIcon}
                  className={cn(
                    `bg-settings-items-secondary hover:bg-settings-items-secondary`,
                  )}
                  onClick={() => toggleCsvFormOpen((curr) => !curr)}
                />
              </div>
            }
            showPaginated
            isFetching={isFetching}
            paginationMeta={paginationMeta}
            paginationBtns={paginationMeta?.links}
            setPageNo={setPageNo}
          />
        </div>
      </div>

      <ItemForm
        isOpen={itemFormOpen}
        toggleIsOpen={toggleItemFormOpen}
        mode={itemFormMode.current}
        currItem={targetItem.current}
        withAddCategory={false}
        withAddSubCategory={false}
        creationFn={itemAddHandler}
        editFn={itemEditHandler}
        isPending={createItemMutation.isPending || updateItemMutation.isPending}
      />

      <FormLayout
        isFormOpen={csvFormOpen}
        formCloseAction={() => toggleCsvFormOpen(false)}
        formHeading="Import Items"
        sumbitBtnLabel="Upload"
        isSubmitting={itemsImportMutation.isPending}
        submitHanlder={() => {
          if (!csvFile) {
            toast.error(`Please upload a csv file`);
            return;
          }
          handleImport(csvFile);
        }}
      >
        <div className="flex w-full flex-col gap-6">
          <ul className="px-5 flex list-disc flex-col gap-2">
            {csvGuidLines.map((guideLine) => (
              <li key={guideLine.id} className="text-sm text-placeholder-text">
                {" "}
                {guideLine.content}{" "}
              </li>
            ))}
          </ul>

          <a className="flex items-center gap-2" onClick={handleDownload}>
            {templateDownloaMutation.isPending ? (
              <Spinner className="text-brand-dark" />
            ) : (
              <img
                src={assets.downloadIconBlue}
                className="w-4 h-4 aspect-square"
              />
            )}
            <span> {"Download Sample File"} </span>
          </a>

          <div className="flex items-center justify-center min-h-25 border border-dashed border-input-field-border rounded-[10px]">
            {csvFile ? (
              <div className="flex flex-col gap-5 text-sm items-center justify-center p-4">
                <FileTextIcon className="text-brand-dark" />
                <span> {csvFile.name} </span>
                <span className="text-placeholder-text">
                  {" "}
                  {`${csvFile.size / 1000} kb`}{" "}
                </span>

                <CustomBtn
                  buttonLabel="Remove"
                  className="bg-transparent hover:bg-transparent error-text w-full!"
                  onClick={() => setCsvFile(undefined)}
                />
              </div>
            ) : (
              <>
                <input
                  type="file"
                  id="csvInpt"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  hidden
                  onChange={(e) => setCsvFile(e.target.files?.[0] as File)}
                />
                <label
                  htmlFor="csvInpt"
                  className="flex flex-col items-center justify-center gap-3 cursor-pointer"
                >
                  <img
                    src={assets.fileImportIcon}
                    className="w-10 aspect-auto"
                  />
                  <span className="text-sm text-muted">
                    {" "}
                    {"Drop files here or click to upload."}{" "}
                  </span>
                </label>
              </>
            )}
          </div>
        </div>
      </FormLayout>

      <DeleteDialog
        isOpen={deleteDialogOpen}
        toggleOpen={setDeleteDialogOpen}
        deleteAction={itemDeleteHandler}
        isPending={deleteItemMutation.isPending}
      />
    </>
  );
}

export default ItemsPage;
