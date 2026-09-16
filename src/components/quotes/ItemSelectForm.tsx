import { useEffect, useMemo, useRef, useState } from "react";
import { CustomDataTable } from "../common/CustomTable";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { CustomActionGroup } from "../common/CustomActionGroup";
import { cn, formatCurrency } from "../../lib/utils";
import { useAppDispatch, useAppSelector } from "../../redux/store";
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
import type { ItemEditPayload } from "../../types/itemEdit.payload.type";
import { toast } from "react-toastify";
import {
  PaymentMethods,
  type ItemDetails,
  type ListResponse,
} from "@/types/api.responses.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createItem, getItemList, updateItem } from "@/api/services/items.api";
import { showErrorToast } from "@/api/axiosInstance";
import {
  getSubCatList,
  subCategoryByCategory,
} from "@/api/services/subCategories.api";
import { SubtotalBreakDown } from "./SubtotalBreakDown";

export type ItemSelectFormProps = {
  submitAction: () => void;
};

function ItemSelectForm({ submitAction }: ItemSelectFormProps) {
  const currQuote = useAppSelector((state) => state.quote);
  const dispatch = useAppDispatch();
  const [pageNo, setPageNo] = useState(1);

  const { quote_categories: categories } = useAppSelector(
    (state) => state.appConfig,
  );
  const [categorySearch, setCategorySearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterOpen, toggleFilterOpen] = useState(false);
  const [filters, setFilters] = useState<string[]>([]);
  const targetSubCategory = useRef<string[] | undefined>(undefined);

  const { data: subCatListResponse, isError: subCatFetchError } = useQuery({
    queryKey: ["itemSelection", "subCategory", filterCategory],
    queryFn: () => subCategoryByCategory(filterCategory),
  });

  if (subCatFetchError) {
    showErrorToast(subCatFetchError);
  }
  const subCategories = subCatListResponse?.payload ?? [];

  const [createItemModal, toggleCreateItemModal] = useState(false);
  const [editItemModal, toggleEditItemModal] = useState(false);
  const [itemQty, setItemQty] = useState<
    Record<
      string,
      {
        id: number;
        quantity: number;
        type: string;
        price: number;
        name: string;
        cost: number;
      }
    >
  >({});
  // console.log(itemQty);
  useEffect(() => {
    currQuote.items.forEach((item) => {
      if (item.is_added) {
        setItemQty((curr) => ({
          ...curr,
          [item.id]: item,
        }));
      }
    });
  }, [currQuote]);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });
  const editingItem = useRef<ItemDetails | undefined>(undefined);
  const [isMutated, toggleIsMutated] = useState<number>(0);

  const {
    data: itemsListResponse,
    isFetching: isItemsFetching,
    error: itemsFetchingError,
  } = useQuery({
    queryKey: [
      "itemSelect",
      "items",
      currQuote?.id,
      debouncedSearchTerm,
      targetSubCategory.current,
      isMutated,
    ],
    queryFn: () =>
      getItemList({
        quote_id: currQuote?.id,
        page: pageNo,
        search: debouncedSearchTerm,
        subcategory_ids: targetSubCategory.current,
      }),
  });
  const itemListMeta = itemsListResponse?.payload.meta;
  // console.log(itemsListResponse?.payload.data);

  if (itemsFetchingError) {
    showErrorToast(itemsFetchingError);
  }

  const { mutateAsync: updateItemAsync } = useMutation({
    mutationFn: (data: ItemEditPayload & { id: number }) =>
      updateItem({
        id: data.id,
        name: data.name,
        category_id: data.catId ? Number(data.catId) : undefined,
        subcategory_id: data.subCatId ? Number(data.subCatId) : undefined,
        cost: data.unitPrice,
        price: data.pricePerUnit,
        unit: data.unit,
        type: "product",
      }),
  });

  const { mutateAsync: createItemAsync } = useMutation({
    mutationFn: (data: ItemCreationPayload) =>
      createItem({
        name: data.name,
        category_id: Number(data.catId),
        subcategory_id: Number(data.subCatId),
        unit: data.unit,
        price: data.pricePerUnit,
        cost: data.unitPrice,
        type: "product",
      }),
  });

  const itemAddHandler = async (item: ItemCreationPayload) => {
    try {
      const newItem = await createItemAsync(item);
      toast.success(newItem.message);
      toggleIsMutated((curr) => curr ^ 1);
    } catch (error) {
      throw error;
    }
  };

  const itemEditHandler = async (patch: ItemEditPayload) => {
    try {
      const updatedItem = await updateItemAsync(
        Object.assign(patch, { id: editingItem.current?.id ?? 0 }),
      );
      toast.success(updatedItem.message);
      toggleIsMutated((curr) => curr ^ 1);
    } catch (error) {
      throw error;
    }
  };

  const itemSelectColumns = [
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
      id: "quantity",
      header: "quantity",
      accessorFn: (item) => {
        return itemQty[item.id]?.quantity ?? 0;
      },
      cell: (cell) => {
        const { id: itemId, type, price, cost, name } = cell.row.original;
        return (
          <CustomBtn
            className="bg-transparent! btn-auth border border-brand-dark text-black-text w-25!"
            buttonLabel={(itemQty[itemId]?.quantity ?? 0).toString()}
            leftIcon={assets.minusIconBlue}
            leftAction={() => {
              if (Object.hasOwn(itemQty, itemId)) {
                if (itemQty[itemId].quantity === 1) {
                  console.log(`removing`);
                  setItemQty((curr) => {
                    const { [itemId]: _, ...rest } = curr;
                    return rest;
                  });
                } else {
                  setItemQty((curr) => ({
                    ...curr,
                    [itemId]: {
                      quantity: itemQty[itemId].quantity - 1,
                      type,
                      price,
                      id: itemId,
                      cost: cost,
                      name: name,
                    },
                  }));
                }
              }
            }}
            leftCls={cn("h-0.5!")}
            rightIcon={assets.plusIconBlue}
            rightAction={() => {
              setItemQty((curr) => ({
                ...curr,
                [itemId]: {
                  quantity: (itemQty[itemId]?.quantity ?? 0) + 1,
                  price,
                  type,
                  id: itemId,
                  cost: cost,
                  name: name,
                },
              }));
            }}
          />
        );
      },
    },
    {
      id: "total",
      header: "Total",
      cell: (cell) => {
        const { id: itemId, price } = cell.row.original;
        return (
          <span className="w-25!">
            {formatCurrency((itemQty[itemId]?.quantity ?? 0) * price)}
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
          <div className="h-full flex items-center">
            <CustomActionGroup
              withOpen={false}
              editFn={() => {
                editingItem.current = item;
                toggleEditItemModal((curr) => !curr);
              }}
            />
          </div>
        );
      },
    },
  ] as ColumnDef<TableFeatures, ItemDetails>[];

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
        <CustomBtn buttonLabel="Save Items" onClick={() => {}} />
        <div className="max-w-75">
          <SubtotalBreakDown
            items={Object.values(itemQty)}
            paymentMethod={PaymentMethods.stripe}
            taxPercentage={currQuote.vat}
          />
        </div>
      </div>

      {/* Filter sheet */}
      <CustomSheet
        isOpen={filterOpen}
        toggleIsOpen={toggleFilterOpen}
        withClearOption
        clearFn={() => {
          setFilters([]);
          targetSubCategory.current = undefined;
        }}
        submitFn={() => (targetSubCategory.current = filters)}
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
                    setCategorySearch(category.name);
                    setFilterCategory(category.id.toString());
                  }
                }}
                getItemLabel={(category) => category.name}
                placeholder="Select category"
                inptFieldValue={categorySearch}
                inptFieldChange={setCategorySearch}
                filterFn={(category, query) =>
                  category.name
                    .toLocaleLowerCase()
                    .includes(query.toLocaleLowerCase())
                }
              />
            </div>
            {/* subcategory selection */}
            <div className="flex flex-col gap-4">
              <span> Subcategory </span>
              <RenderMultiSelectCheckbox
                checkboxconfig={subCategories.map((subCategory) => ({
                  id: subCategory.id.toString(),
                  label: subCategory.name,
                  value: subCategory.id.toString(),
                }))}
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
        currItem={editingItem.current}
        editFn={itemEditHandler}
      />
    </>
  );
}

export default ItemSelectForm;
