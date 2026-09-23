import { useEffect, useMemo, useRef, useState } from "react";
import { CustomDataTable } from "../common/CustomTable";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { CustomActionGroup } from "../common/CustomActionGroup";
import { cn, formatCurrency } from "../../lib/utils";
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
import { SubtotalBreakDown } from "./SubtotalBreakDown";
import {
  DepositeTypes,
  type PageFilters,
  type UpdateQuoteItems,
} from "@/types/api.requests.type";
import useItemsList from "@/hooks/apis/items/useItemsList";
import useItemsMutations from "@/hooks/apis/items/useItemsMutations";
import useCategoriesList from "@/hooks/apis/categories/useCategoriesList";
import useSubcategoryByCategory from "@/hooks/apis/subcategories/useSubcategoryByCategory";
import { Spinner } from "../ui/spinner";
import useQuotesMutations from "@/hooks/apis/quotes/useQuotesMutations";
import { updateQuote as updateQuoteRedux } from "@/redux/slices/quotes.slice";

export type ItemSelectFormProps = {
  submitAction: () => void;
};

function ItemSelectForm({ submitAction }: ItemSelectFormProps) {
  const currQuote = useAppSelector((state) => state.quote);
  const user = useAppSelector((state) => state.user);
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

  const { subCategories, isFetching: isFetchingSubCategories } =
    useSubcategoryByCategory({
      catId: filterCategory,
      enabled: filterCategory !== "",
    });

  const [createItemModal, toggleCreateItemModal] = useState(false);
  const [editItemModal, toggleEditItemModal] = useState(false);

  const [itemQty, setItemQty] = useState<Record<string, UpdateQuoteItems>>({});
  console.log(itemQty);
  console.log(currQuote);
  useEffect(() => {
    currQuote?.items.forEach((item) => {
      setItemQty((curr) => ({
        ...curr,
        [item.id]: item,
      }));
    });
  }, [currQuote]);
  const editingItem = useRef<ItemDetails | undefined>(undefined);

  const vatSettingsId = useRef<number | undefined>(currQuote.vat_setting_id);
  const discount = useRef<number | null>(
    Number(currQuote.discount?.amount ?? "0"),
  );
  const depositePaymentMethod = useRef<PaymentMethods>(PaymentMethods.cash);
  const depositePercentageRef = useRef<number | null>(
    currQuote.deposit_percentage,
  );
  const depositeAmount = useRef<number | null>(currQuote.deposit_amount);
  const depositeTypeRef = useRef<DepositeTypes>(currQuote.deposit_type);

  const itemsFilter = useMemo(
    () =>
      ({
        quote_id: currQuote?.id,
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

  const itemAddHandler = (data: ItemCreationPayload) => {
    createItemMutation.mutate(
      {
        name: data.name,
        category_id: Number(data.catId),
        subcategory_id: Number(data.subCatId),
        unit: data.unit,
        price: data.pricePerUnit,
        cost: data.unitPrice,
        type: "product",
      },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          refetchItemsList();
          setPageNo(1);
          toggleCreateItemModal(false);
        },
        onError: (error) => {
          showErrorToast(error);
        },
      },
    );
  };

  const itemEditHandler = (data: ItemEditPayload) => {
    updateItemMutation.mutate(
      {
        id: Number(editingItem.current?.id ?? "0"),
        name: data.name,
        category_id: data.catId ? Number(data.catId) : undefined,
        subcategory_id: data.subCatId ? Number(data.subCatId) : undefined,
        cost: data.unitPrice,
        price: data.pricePerUnit,
        unit: data.unit,
        type: "product",
      },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          refetchItemsList();
          toggleEditItemModal(false);
        },
        onError: (error) => {
          showErrorToast(error);
        },
      },
    );
  };

  const itemDeleteHandler = (itemId: string | number) => {
    deleteItemMutation.mutate(itemId, {
      onSuccess: (response) => {
        if (Object.hasOwn(itemQty, itemId)) {
          const { [itemId]: _, ...rest } = itemQty;
          setItemQty(rest);
        }
        toast.success(response.message);
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
        const { id: itemId, type, price, cost, name } = cell.row.original;
        return (
          <CustomBtn
            className="bg-transparent! btn-auth border border-brand-dark text-black-text w-25!"
            buttonLabel={(itemQty[itemId]?.quantity ?? 0).toString()}
            leftIcon={assets.minusIconBlue}
            leftAction={() => {
              if (Object.hasOwn(itemQty, itemId)) {
                if (itemQty[itemId].quantity === 1) {
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
              deleteFn={() => {
                itemDeleteHandler(item.id);
              }}
              isDeletePending={deleteItemMutation.isPending}
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
    const amount = Number(depositeAmount.current);
    quoteUpdateMutation.mutate(
      {
        _method: "put",
        quote_id: currQuote.id,
        items: itemPatches,
        vat_setting_id: vatSettingsId.current,
        deposit_required: !Number.isNaN(amount),
        deposit_type: depositeTypeRef.current,
        deposit_amount: Number.isNaN(amount) ? undefined : amount,
        deposit_payment_method: depositePaymentMethod.current,
        discount: discount.current,
      },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          dispatch(updateQuoteRedux(response.payload));
          submitAction();
        },
        onError: (error) => {
          showErrorToast(error);
        },
      },
    );
  };

  return (
    <>
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
              onClick={() => toggleCreateItemModal((curr) => !curr)}
            />
          </div>
        }
        isFetching={isItemsFetching}
      />
      <div className="dashed-y-separators" />

      <div className="flex w-full px-5 justify-between">
        <CustomBtn
          buttonLabel="Save Items"
          onClick={handleSave}
          isSubmitting={quoteUpdateMutation.isPending}
        />
        <div className="max-w-75">
          <SubtotalBreakDown
            items={Object.values(itemQty)}
            paymentMethod={
              user.stripe_connected
                ? PaymentMethods.stripe
                : PaymentMethods.cash
            }
            vatSettings={vat_settings}
            discountPercentage={discount.current ?? 0}
            taxPercentage={currQuote.vat}
            reqDeposite={currQuote?.deposit_amount ?? undefined}
            taxIdRef={vatSettingsId}
            discountRef={discount}
            depositePaymentMethodRef={depositePaymentMethod}
            depositeAmountRef={depositeAmount}
            depositeTypeRef={depositeTypeRef}
            depositePercentageRef={depositePercentageRef}
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
