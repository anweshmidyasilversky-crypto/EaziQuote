import { useEffect, useMemo, useState } from "react";
import { CustomDataTable } from "../common/CustomTable";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { CustomActionGroup } from "../common/CustomActionGroup";
import { cn, formatCurrency } from "../../lib/utils";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import type { Item } from "../../types/item.type";
import { CustomBtn } from "../common/CustomBtn";
import { assets } from "../../assets/icons";
import { useDebounce } from "../../hooks/debounce.hook";
import SearchInputGruop from "../common/SearchInputGruop";
import { CustomSheet } from "../common/CustomSheet";
import { CustomCombobox } from "../common/CustomCombobox";
import {
  RenderMultiSelectCheckbox,
  type CheckboxConfig,
} from "../common/RenderMultiSelectCheckbox";
import ItemForm from "../items/ItemForm";
import type { ItemCreationPayload } from "../../types/itemCreation.payload.type";
import { addItem, updateItem } from "../../redux/slices/items.slice";
import type { ItemEditPayload } from "../../types/itemEdit.payload.type";
import { SubtotalBreakDown } from "./SubtotalBreakDown";
import { nanoid } from "@reduxjs/toolkit";
import { PaymentMethods } from "@/types/addDeposite.payload.type";

export type DisplayCatalogItem = {
  id: string;
  itemName: string;
  category: string;
  subcategory: string;
  unit: string;
  pricePerUnit: number;
  unitCost: number;
};

function ItemSelectForm() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.items);
  const categories = useAppSelector((state) => state.categories);
  const subCategories = useAppSelector((state) => state.subCategories);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterOpen, toggleFilterOpen] = useState(false);
  const [checkboxConfig, setCheckBoxConfig] = useState<CheckboxConfig>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [createItemModal, toggleCreateItemModal] = useState(false);
  const [editItemModal, toggleEditItemModal] = useState(false);

  const getCategory = (catId: string) => {
    console.log(catId);
    return categories.find((category) => category.id === catId);
  };
  const getSubCategory = (subCatId: string) => {
    return subCategories.find((subCategory) => subCategory.id === subCatId);
  };
  const getItem = (itemId: string) => {
    return items.find((item) => item.id === itemId);
  };
  const [itemQty, setItemQty] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });
  const [editingItem, setEditingItem] = useState<
    ItemEditPayload & Pick<Item, "id">
  >();

  const itemAddHandler = (item: ItemCreationPayload) => {
    dispatch(addItem({ ...item, id: item.name.toLowerCase() }));
  };

  const itemEditHandler = (patch: ItemEditPayload) => {
    dispatch(updateItem(Object.assign(patch, { id: editingItem?.id ?? "" })));
  };

  const itemSelectColumns = useMemo(
    () =>
      [
        {
          id: "itemName",
          accessorFn: (item) => item.name,
          header: "ITEM NAME",
          enableSorting: false,
        },
        {
          id: "category",
          accessorFn: (item) => getCategory(item.catId)?.name ?? "category",
          header: "CATEGORY",
          enableSorting: false,
        },
        {
          id: "subcategory",
          accessorFn: (item) =>
            getSubCategory(item.subCatId)?.name ?? "sub category",
          header: "SUBCATEGORY",
          enableSorting: false,
        },
        {
          accessorKey: "unit",
          header: "UNIT",
          enableSorting: false,
        },
        {
          accessorKey: "pricePerUnit",
          header: "PRICE/UNIT",
          cell: (info) => formatCurrency(info.getValue<number>()),
          enableSorting: false,
        },
        {
          id: "qty",
          header: "QUANTITY",
          cell: (cell) => {
            const itemId = cell.row.original.id;
            const qty = itemQty[itemId] ?? 0;
            return (
              <CustomBtn
                className="bg-transparent! btn-auth border border-brand-dark text-black-text"
                buttonLabel={qty.toString()}
                leftIcon={assets.minusIconBlue}
                leftAction={() => {
                  qty > 0
                    ? setItemQty((curr) => ({
                        ...curr,
                        [itemId]: qty - 1,
                      }))
                    : 0;
                }}
                leftCls={cn("h-0.5!")}
                rightIcon={assets.plusIconBlue}
                rightAction={() =>
                  setItemQty((curr) => ({
                    ...curr,
                    [itemId]: qty + 1,
                  }))
                }
              />
            );
          },
        },
        {
          id: "total",
          header: "TOTAL",
          cell: (cell) => {
            const item = cell.row.original;
            return formatCurrency((itemQty[item.id] ?? 0) * item.pricePerUnit);
          },
          enableSorting: false,
        },
        {
          id: "action",
          header: "ACTION",
          cell: (cell) => {
            const item = cell.row.original;
            return (
              <CustomActionGroup
                withOpen={false}
                editFn={() => {
                  setEditingItem({
                    ...item,
                    name: item.name,
                    unit: item.unit,
                    pricePerUnit: item.pricePerUnit,
                  });
                  toggleEditItemModal((curr) => !curr);
                }}
              />
            );
          },
        },
      ] as ColumnDef<TableFeatures, Item>[],
    [itemQty],
  );

  useEffect(() => {
    const checkBoxConfig: CheckboxConfig = subCategories
      .filter((subCategory) => subCategory.catId === filterCategory)
      .map((subCategory) => ({
        id: subCategory.id,
        label: subCategory.name,
        value: subCategory.id,
      }));
    setCheckBoxConfig(checkBoxConfig);
  }, [filterCategory]);

  return (
    <>
      <CustomDataTable
        columns={itemSelectColumns}
        data={items}
        showPaginated
        tableOptionsLeft={
          <SearchInputGruop
            searchTerm={searchTerm}
            searchPlaceHolder="Search items"
            setSearchTerm={setSearchTerm}
          />
        }
        tableOptionsRight={
          <div className="flex gap-3">
            <CustomBtn
              leftIcon={assets.filterIcon}
              buttonLabel="Filter"
              btncls={cn(
                `bg-manage-quote-secondary hover:bg-manage-quote-secondary`,
              )}
              onClick={() => toggleFilterOpen((curr) => !curr)}
            />

            <CustomBtn
              leftIcon={assets.plusIcon}
              buttonLabel="New Item"
              onClick={() => toggleCreateItemModal((curr) => !curr)}
            />
          </div>
        }
        globalFilterTerm={debouncedSearchTerm}
      />
      <div className="dashed-y-separators" />

      <div className="flex w-full mr-auto justify-end">
        <div className="max-w-75">
          <SubtotalBreakDown
            items={Object.keys(itemQty).map((itemId) => {
              const { id, ...item } = getItem(itemId) as Item;
              return {
                ...item,
                itemId: itemId,
                id: nanoid(),
                unitCost: item.unitPrice,
                quantity: itemQty[itemId],
                total: itemQty[itemId] * item.pricePerUnit,
              };
            })}
            paymentMethod={PaymentMethods.stripe}
            taxPercentage={18}
          />
        </div>
      </div>

      {/* Filter sheet */}
      <CustomSheet
        isOpen={filterOpen}
        toggleIsOpen={toggleFilterOpen}
        withClearOption
        clearFn={() => setFilters([])}
      >
        <div className="mt-6 px-5">
          <div className="flex flex-col gap-4">
            {/* Category Selection */}
            <div className="flex flex-col gap-2">
              <span> Category </span>
              <CustomCombobox
                items={categories}
                onValueChange={(category) => {
                  if (category) {
                    setFilterCategory(category.id);
                  }
                }}
                getItemLabel={(category) => category.name}
                placeholder="Select category"
              />
            </div>
            {/* subcategory selection */}
            <div className="flex flex-col gap-4">
              <span> Subcategory </span>
              <RenderMultiSelectCheckbox
                checkboxconfig={checkboxConfig}
                selectedFilters={filters}
                toggleSelectedFilters={setFilters}
              />
            </div>
          </div>
        </div>
      </CustomSheet>

      <ItemForm
        mode="creation"
        isOpen={createItemModal}
        toggleIsOpen={toggleCreateItemModal}
        creationFn={itemAddHandler}
      />

      <ItemForm
        mode="updation"
        isOpen={editItemModal}
        toggleIsOpen={toggleEditItemModal}
        defaultValues={editingItem}
        editFn={itemEditHandler}
      />
    </>
  );
}

export default ItemSelectForm;
