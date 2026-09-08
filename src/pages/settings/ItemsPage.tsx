import { assets } from "@/assets/icons";
import { CustomActionGroup } from "@/components/common/CustomActionGroup";
import { HeaderBreadCrumb } from "@/components/common/CustomBreadCrumb";
import { CustomBtn } from "@/components/common/CustomBtn";
import { CustomDataTable } from "@/components/common/CustomTable";
import { FormLayout } from "@/components/common/FormLayout";
import SearchInputGruop from "@/components/common/SearchInputGruop";
import type { ItemFormProps } from "@/components/items/ItemForm";
import ItemForm from "@/components/items/ItemForm";
import { useDebounce } from "@/hooks/useDebounce";
import { cn, formatCurrency } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import type { Item } from "@/types/item.type";
import { type ItemEditPayload } from "@/types/itemEdit.payload.type";
import { nanoid } from "@reduxjs/toolkit";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { FileTextIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

function ItemsPage() {
  const items = useAppSelector((state) => state.items);
  const categories = useAppSelector((state) => state.categories);
  const subCategories = useAppSelector((state) => state.subCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });
  const [itemFormOpen, toggleItemFormOpen] = useState(false);
  const itemFormMode = useRef<ItemFormProps["mode"]>("creation");
  const defaultValues = useRef<ItemEditPayload | undefined>(undefined);
  const [csvFormOpen, toggleCsvFormOpen] = useState(false);
  const [csvUploading, toggleCsvUploading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | undefined>(undefined);
  const getCategory = (catId: string) => {
    return categories.find((category) => category.id === catId);
  };
  const getSubCategory = (subCatId: string) => {
    return subCategories.find((subCategory) => subCategory.id === subCatId);
  };
  const itemColumns: ColumnDef<TableFeatures, Item>[] = [
    {
      accessorKey: "name",
      header: "ITEM",
      enableSorting: false,
    },
    {
      id: "categories",
      header: "CATEGORIES",
      accessorFn: (row) => getCategory(row.catId)?.name ?? "Unknown",
      enableSorting: false,
    },
    {
      id: "subCategories",
      header: "SUBCATEGORIES",
      accessorFn: (row) => getSubCategory(row.subCatId)?.name ?? "Unknown",
      enableSorting: false,
    },
    {
      accessorKey: "unit",
      header: "UNIT",
      enableSorting: false,
    },
    {
      accessorKey: "pricePerUnit",
      header: "Price/Unit",
      cell: (info) => formatCurrency(info.getValue<number>()),
      enableSorting: false,
    },
    {
      accessorKey: "unitPrice",
      header: "Unit Cost",
      cell: (info) => formatCurrency(info.getValue<number>()),
      enableSorting: false,
    },
    {
      id: "action",
      header: () => <div className="w-full flex justify-end">{"ACTION"}</div>,
      cell: (info) => (
        <div className="w-full flex min-w-70 justify-end">
          <CustomActionGroup
            withOpen={false}
            editFn={() => {
              ((itemFormMode.current = "updation"),
                (defaultValues.current = info.row.original),
                toggleItemFormOpen((curr) => !curr));
            }}
          />
        </div>
      ),
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
            data={items}
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
                    ((itemFormMode.current = "creation"),
                      (defaultValues.current = undefined),
                      toggleItemFormOpen((curr) => !curr));
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
            globalFilterTerm={debouncedSearchTerm}
          />
        </div>
      </div>

      <ItemForm
        isOpen={itemFormOpen}
        toggleIsOpen={toggleItemFormOpen}
        mode={itemFormMode.current}
        defaultValues={defaultValues.current}
        withAddCategory={false}
        withAddSubCategory={false}
      />

      <FormLayout
        isFormOpen={csvFormOpen}
        formCloseAction={() => toggleCsvFormOpen(false)}
        formHeading="Import Items"
        sumbitBtnLabel="Upload"
        isSubmitting={csvUploading}
        submitHanlder={() => {
          toggleCsvUploading(true);
          if (!csvFile) {
            toast.error(`Please upload a csv file`);
          }
          console.log(csvFile);
          toggleCsvUploading(false);
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

          <a className="flex items-center gap-2">
            <img
              src={assets.downloadIconBlue}
              className="w-4 h-4 aspect-square"
            />
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
    </>
  );
}

export default ItemsPage;
