import { useEffect, useMemo, useState } from "react";
import { CustomDataTable } from "../common/CustomTable";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { CustomActionGroup } from "../common/CustomActionGroup";
import { cn, formatCurrency } from "../../lib/utils";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import type { Item } from "../../types/item.type";
import { CustomBtn } from "../common/CustomBtn";
import { assets } from "../../assets/icons";
import { useDebounce } from "../../hooks/useDebounce";
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
import { toast } from "react-toastify";
import { updateQuote } from "@/redux/slices/quotes.slice";
import type { QuoteLineItem } from "@/types/quoteLineItem.type";
import type {
  ItemDetails,
  Quote,
  QuoteDetails,
} from "@/types/api.responses.type";
import { useQuery } from "@tanstack/react-query";
import { getItemList } from "@/api/items.api";
import { showErrorToast } from "@/api/axiosInstance";

export type DisplayCatalogItem = {
  id: string;
  itemName: string;
  category: string;
  subcategory: string;
  unit: string;
  pricePerUnit: number;
  unitCost: number;
};

export type ItemSelectFormProps = {
  currQuote?: QuoteDetails;
  submitAction: () => void;
};

function ItemSelectForm({ currQuote, submitAction }: ItemSelectFormProps) {
  const dispatch = useAppDispatch();
  const [pageNo, setPageNo] = useState(1);

  const categories = useAppSelector((state) => state.categories);
  const subCategories = useAppSelector((state) => state.subCategories);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterOpen, toggleFilterOpen] = useState(false);
  const [checkboxConfig, setCheckBoxConfig] = useState<CheckboxConfig>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [createItemModal, toggleCreateItemModal] = useState(false);
  const [editItemModal, toggleEditItemModal] = useState(false);
  const [itemQty, setItemQty] = useState<Record<string, number>>({});
  // useEffect(() => {
  //   const itemsByQuantity: Record<string, number> = {};
  //   currQuote?.items.forEach(item => {
  //     itemsByQuantity[item.id] = item.quantity
  //   });
  //   setItemQty(itemsByQuantity);
  // }, [currQuote]);
  const [state, updateState] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });
  const [editingItem, setEditingItem] = useState<
    ItemEditPayload & Pick<Item, "id">
  >();

  const {
    data: itemsListResponse,
    isFetching: isItemsFetching,
    error: itemsFetchingError,
  } = useQuery({
    queryKey: ["itemSelect", "items", currQuote?.id, debouncedSearchTerm],
    queryFn: () =>
      getItemList({
        quote_id: currQuote?.id,
        page: pageNo,
        search: debouncedSearchTerm,
      }),
  });
  const itemListMeta = itemsListResponse?.payload.meta;

  if (itemsFetchingError) {
    showErrorToast(itemsFetchingError);
  }

  const itemAddHandler = (item: ItemCreationPayload) => {
    dispatch(addItem({ ...item, id: item.name.toLowerCase() }));
  };

  const itemEditHandler = (patch: ItemEditPayload) => {
    dispatch(updateItem(Object.assign(patch, { id: editingItem?.id ?? "" })));
  };

  const addQuoteLineItem = () => {
    if (Object.keys(itemQty).length == 0) {
      toast.error("Please add an item to continue");
      return;
    }
    // dispatch(
    //   updateQuote({
    //     id: refNo,
    //     items: Object.keys(itemQty).map((itemId) =>
    //       convertToQuoteLineItem(itemId, itemQty[itemId]),
    //     ),
    //     isItemsSelected: true,
    //   }),
    // );
    toast.success("Added selected items");
    submitAction();
  };

  const itemSelectColumns = useMemo(
    () =>
      [
        {
          accessorKey: "name",
          header: "ITEM NAME",
          enableSorting: false,
        },
        {
          accessorKey: "category_name",
          header: "CATEGORY",
          enableSorting: false,
        },
        {
          accessorKey: "subcategory_name",
          header: "SUBCATEGORY",
          enableSorting: false,
          cell: (info) => {
            const subCatName = info.getValue<string | null>();
            return subCatName ?? "-";
          },
        },
        {
          accessorKey: "unit",
          enableSorting: false,
        },
        {
          accessorKey: "price",
          header: "PRICE/UNIT",
          cell: (info) => formatCurrency(info.getValue<number>()),
          enableSorting: false,
        },
        {
          accessorKey: "quantity",
          cell: (cell) => {
            const {
              id: itemId,
              is_added: isAdded,
              quantity: qty,
            } = cell.row.original;
            return (
              <CustomBtn
                className="bg-transparent! btn-auth border border-brand-dark text-black-text w-25!"
                buttonLabel={isAdded ? qty.toString() : "0"}
                leftIcon={assets.minusIconBlue}
                leftAction={() => {
                  if (itemQty[itemId] == 1) {
                    cell.row.original.is_added = false;
                    cell.row.original.quantity = 1;
                  } else {
                    cell.row.original.quantity += 1;
                  }
                }}
                leftCls={cn("h-0.5!")}
                rightIcon={assets.plusIconBlue}
                rightAction={() => {
                  cell.row.original.quantity += 1;
                  updateState((curr) => curr ^ 1);
                }}
              />
            );
          },
        },
        {
          id: "total",
          header: "Total",
          cell: (cell) => {
            const item = cell.row.original;
            return (
              <span className="w-25!">
                {item.is_added
                  ? formatCurrency(item.quantity * item.price)
                  : "0"}
              </span>
            );
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
                  // setEditingItem({
                  //   ...item,
                  //   name: item.name,
                  //   unit: item.unit,
                  //   pricePerUnit: item.pricePerUnit,
                  // });
                  toggleEditItemModal((curr) => !curr);
                }}
              />
            );
          },
        },
      ] as ColumnDef<TableFeatures, ItemDetails>[],
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
        data={itemsListResponse?.payload.data ?? []}
        showPaginated
        paginationMeta={itemListMeta}
        setPageNo={setPageNo}
        paginationBtns={itemListMeta?.links}
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
        isFetching={isItemsFetching}
      />
      <div className="dashed-y-separators" />

      <div className="flex w-full px-5 justify-between">
        <CustomBtn buttonLabel="Save Items" onClick={addQuoteLineItem} />
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
