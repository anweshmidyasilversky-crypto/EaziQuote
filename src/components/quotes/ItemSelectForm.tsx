import { useEffect, useMemo, useRef, useState } from "react";
import { CustomDataTable } from "../common/CustomTable";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { CustomActionGroup } from "../common/CustomActionGroup";
import { cn } from "@/lib/utils/helper";
import { formatCurrency } from "../../lib/utils/helper";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { CustomBtn } from "../common/CustomBtn";
import { assets } from "../../assets/icons";
import SearchInputGruop from "../common/SearchInputGruop";
import { CustomSheet } from "../common/CustomSheet";
import { CustomCombobox } from "../common/CustomCombobox";
import { RenderMultiSelectCheckbox } from "../common/RenderMultiSelectCheckbox";
import ItemForm from "../items/ItemForm";
import type { ItemCreationPayload } from "../../types/itemCreation.payload.type";
import type { ItemEditPayload } from "../../types/itemEdit.payload.type";
import { toast } from "react-toastify";
import {
  PaymentMethods,
  type Category,
  type ItemDetails,
} from "@/types/api.responses.type";
import { showErrorToast } from "@/api/axiosInstance";
import SubtotalBreakDown from "./SubtotalBreakDown";
import {
  type PageFilters,
  type UpdateQuoteApiPayload,
} from "@/types/api.requests.type";
import useItemsList from "@/hooks/apis/items/useItemsList";
import useItemsMutations from "@/hooks/apis/items/useItemsMutations";
import useCategoriesList from "@/hooks/apis/categories/useCategoriesList";
import useSubcategoryByCategory from "@/hooks/apis/subcategories/useSubcategoryByCategory";
import { Spinner } from "../ui/spinner";
import useQuotesMutations from "@/hooks/apis/quotes/useQuotesMutations";
import { updateQuote as updateQuoteRedux } from "@/redux/slices/quotes.slice";
import DeleteDialog from "../common/DeleteDialog";
import { useSubtotalFields } from "@/context/SubtotalFieldsContext";

export type ItemSelectFormProps = {
  submitAction: () => void;
  presetItems?: ItemDetails[];
  setItemPreview?: React.Dispatch<React.SetStateAction<ItemDetails[]>>;
};

function ItemSelectForm({
  submitAction,
  presetItems,
  setItemPreview,
}: ItemSelectFormProps) {
  const {
    depositAmount,
    setDepositPercentage,
    setDepositAmount,
    depositType,
    depositPercentage,
    paymentMethod,
    setDepositType,
    discount,
    vat,
    setPaymentMethod,
    setVat,
    setDiscount,
  } = useSubtotalFields();
  const currQuote = useAppSelector((state) => state.quote);
  const dispatch = useAppDispatch();
  const {
    searchTerm: categorySearch,
    setSearchTerm: setCategorySearch,
    categoryList: categories,
    isFetching: isCategoryListFetching,
    isFetchingNextPage: isFetchingNextCategories,
    fetchNextPage: fetchNextCategories,
    paginationMeta: categoryPaginationMeta,
  } = useCategoriesList({});
  const { vat_settings } = useAppSelector((state) => state.appConfig);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterOpen, toggleFilterOpen] = useState(false);
  const [filters, setFilters] = useState<string[]>([]);
  const targetSubCategory = useRef<string[] | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { subCategories, isFetching: isFetchingSubCategories } =
    useSubcategoryByCategory({
      catId: filterCategory,
      enabled: filterCategory !== "",
    });

  const [createItemModal, toggleCreateItemModal] = useState(false);
  const [editItemModal, toggleEditItemModal] = useState(false);

  const [itemQty, setItemQty] = useState<Record<number, ItemDetails>>({});
  useEffect(() => {
    currQuote?.items.forEach((item) => {
      setItemQty((curr) => ({
        ...curr,
        [item.id]: item,
      }));
    });
    presetItems?.forEach((item) => {
      setItemQty((curr) => ({
        ...curr,
        [item.id]: item,
      }));
    });
  }, [currQuote, presetItems]);

  const editingItem = useRef<ItemDetails | undefined>(undefined);

  const itemsFilter = useMemo(
    () =>
      ({
        quote_id: currQuote?.id,
        category_id: filterCategory,
        subcategory_ids: targetSubCategory.current,
      }) as PageFilters,
    [currQuote, targetSubCategory.current],
  );
  const {
    itemsList,
    isFetching: isItemsFetching,
    searchTerm,
    setSearchTerm,
    setPageNo,
    paginationMeta: itemListMeta,
    refetch: refetchItemsList,
  } = useItemsList({
    filters: itemsFilter,
  });

  const { createItemMutation, updateItemMutation, deleteItemMutation } =
    useItemsMutations();

  const itemAddHandler = async (data: ItemCreationPayload) => {
    const response = await createItemMutation.mutateAsync({
      name: data.name,
      category_id: Number(data.catId),
      subcategory_id: Number(data.subCatId),
      unit: data.unit,
      price: data.pricePerUnit,
      cost: data.unitPrice,
      type: "product",
    });
    toast.success(response.message);
    refetchItemsList();
    setPageNo(1);
    toggleCreateItemModal(false);
  };

  const itemEditHandler = async (data: ItemEditPayload) => {
    const response = await updateItemMutation.mutateAsync({
      id: Number(editingItem.current?.id ?? "0"),
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
    toggleEditItemModal(false);
  };

  const itemDeleteHandler = () => {
    if (!editingItem.current) {
      toast.error(`No item Selected to delete`);
      return;
    }
    const itemId = editingItem.current.id;
    deleteItemMutation.mutate(itemId, {
      onSuccess: (response) => {
        if (Object.hasOwn(itemQty, itemId)) {
          const { [itemId]: _, ...rest } = itemQty;
          setItemQty(rest);
        }
        toast.success(response.message);
        setDeleteDialogOpen(false);
        refetchItemsList();
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
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
        const item = cell.row.original;
        const { id: itemId } = item;
        return (
          <CustomBtn
            className="bg-transparent! btn-auth border border-brand-dark text-black-text w-25!"
            buttonLabel={(itemQty[itemId]?.quantity ?? 0).toString()}
            leftIcon={assets.minusIconBlue}
            leftAction={() => {
              setItemQty((curr) => {
                const selectedItem = curr[itemId];
                if (!selectedItem) {
                  return curr;
                }

                if (selectedItem.quantity === 1) {
                  const { [itemId]: _, ...rest } = curr;
                  return rest;
                }

                return {
                  ...curr,
                  [itemId]: {
                    ...selectedItem,
                    quantity: selectedItem.quantity - 1,
                  },
                };
              });
            }}
            leftCls={cn("h-0.5!")}
            rightIcon={assets.plusIconBlue}
            rightAction={() => {
              setItemQty((curr) => ({
                ...curr,
                [itemId]: {
                  ...(curr[itemId] ?? item),
                  quantity: (curr[itemId]?.quantity ?? 0) + 1,
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
              deleteFn={() => {
                editingItem.current = item;
                setDeleteDialogOpen(true);
              }}
            />
          </div>
        );
      },
    },
  ] as ColumnDef<TableFeatures, ItemDetails>[];

  const { quoteUpdateMutation } = useQuotesMutations();

  const handleSave = () => {
    const itemPatches = Object.values(itemQty);
    if (itemPatches.length <= 0) {
      toast.error(`Select at least one item to continue`);
      return;
    }
    let payload: UpdateQuoteApiPayload = {
      _method: "put",
      quote_id: currQuote.id,
      items: itemPatches,
      vat_setting_id: vat?.id,
      deposit_payment_method: paymentMethod,
      discount,
    };
    if (depositAmount && depositAmount > 0) {
      payload["deposit_amount"] = depositAmount;
      payload["deposit_type"] = depositType;
      payload["deposit_required"] = 1;
    }
    if (depositPercentage) {
      payload["deposit_percentage"] = depositPercentage;
    }
    quoteUpdateMutation.mutate(payload, {
      onSuccess: (response) => {
        toast.success(response.message);
        dispatch(updateQuoteRedux(response.payload));
        submitAction();
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  {
    /* Setting all required subtotal breakdown fields */
  }
  useEffect(() => {
    setDepositType(currQuote.deposit_type ?? undefined);
    if (currQuote.deposit_percentage) {
      setDepositPercentage(currQuote.deposit_percentage);
    }
    if (currQuote.deposit_amount) {
      setDepositAmount(currQuote.deposit_amount);
    } else {
      setDepositAmount(undefined);
      setDepositPercentage(undefined);
    }
    setDiscount(Number(currQuote.discount?.amount ?? "0"));
    setVat(
      vat_settings.find(
        (vatConfig) => vatConfig.id === Number(currQuote.vat_setting_id),
      ),
    );
    setPaymentMethod(
      currQuote.deposit_payment?.payment_method ?? PaymentMethods.cash,
    );
  }, [currQuote]);

  useEffect(() => {
    setItemPreview?.(Object.values(itemQty));
  }, [itemQty]);

  return (
    <>
      <div className="w-0 min-w-full flex flex-col gap-5">
        <CustomDataTable
          columns={itemSelectColumns}
          data={itemsList}
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
                onClick={() => {
                  editingItem.current = undefined;
                  toggleCreateItemModal((curr) => !curr);
                }}
              />
            </div>
          }
          isFetching={isItemsFetching}
        />
      </div>
      <div className="dashed-y-separators" />

      <div className="flex w-full px-5 justify-between">
        <CustomBtn
          buttonLabel="Save Items"
          onClick={handleSave}
          isSubmitting={quoteUpdateMutation.isPending}
        />
        <div className="max-w-75">
          <SubtotalBreakDown items={Object.values(itemQty)} />
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
          setFilterCategory("");
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
                  } else {
                    setFilterCategory("");
                  }
                }}
                getItemLabel={(category: Category | null) =>
                  category?.name ?? ""
                }
                placeholder="Select category"
                inptFieldValue={categorySearch}
                inptFieldChange={setCategorySearch}
                filterFn={(category, query) =>
                  category.name
                    .toLocaleLowerCase()
                    .includes(query.toLocaleLowerCase())
                }
                isFetching={isCategoryListFetching}
                isFetchingNextPage={isFetchingNextCategories}
                fetchNextPage={fetchNextCategories}
                getItemId={(category) => category.id}
                paginationMeta={categoryPaginationMeta}
              />
            </div>
            {/* subcategory selection */}
            <div className="flex flex-col w-full">
              <span> Subcategory </span>
              {subCategories &&
                !isFetchingSubCategories &&
                subCategories.length > 0 && (
                  <RenderMultiSelectCheckbox
                    checkboxconfig={subCategories.map((subCategory) => ({
                      id: subCategory.id.toString(),
                      label: subCategory.name,
                      value: subCategory.id.toString(),
                    }))}
                    selectedFilters={filters}
                    toggleSelectedFilters={setFilters}
                  />
                )}
              {isFetchingSubCategories && (
                <Spinner className="mt-4 text-brand-dark h-1/20 w-1/20 self-center" />
              )}
              {filterCategory !== "" &&
                !isFetchingSubCategories &&
                subCategories.length === 0 && (
                  <span className="text-placeholder-text">
                    {" "}
                    No Results Found{" "}
                  </span>
                )}
              {filterCategory === "" && !isFetchingSubCategories && (
                <span className="text-placeholder-text">
                  {" "}
                  Please select a category{" "}
                </span>
              )}
            </div>
          </div>
        </div>
      </CustomSheet>

      <ItemForm
        mode="creation"
        isOpen={createItemModal}
        toggleIsOpen={toggleCreateItemModal}
        creationFn={itemAddHandler}
        isPending={createItemMutation.isPending}
      />

      <ItemForm
        mode="updation"
        isOpen={editItemModal}
        toggleIsOpen={toggleEditItemModal}
        currItem={editingItem.current}
        editFn={itemEditHandler}
        categorySelectDisabled
        subcategorySelectDisabled
        isPending={updateItemMutation.isPending}
      />

      <DeleteDialog
        isOpen={deleteDialogOpen}
        toggleOpen={setDeleteDialogOpen}
        deleteAction={itemDeleteHandler}
        isPending={deleteItemMutation.isPending}
      />
    </>
  );
}

export default ItemSelectForm;
