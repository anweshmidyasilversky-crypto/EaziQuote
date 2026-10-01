import {
  PaymentMethods,
  type Category,
  type InvoiceDetails,
  type ItemDetails,
} from "@/types/api.responses.type";
import { itemDetailsListSchema } from "@/validation/createInvoice.payload.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { useForm, useWatch } from "react-hook-form";
import { CustomBtn } from "../common/CustomBtn";
import { assets } from "@/assets/icons";
import { cn, formatCurrency } from "@/lib/utils";
import { CustomActionGroup } from "../common/CustomActionGroup";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { CustomDataTable } from "../common/CustomTable";
import useItemsList from "@/hooks/apis/items/useItemsList";
import SearchInputGruop from "../common/SearchInputGruop";
import type { PageFilters } from "@/types/api.requests.type";
import { SubtotalBreakDown } from "../quotes/SubtotalBreakDown";
import { useAppSelector } from "@/redux/store";
import useInvoiceMutations from "@/hooks/apis/invoices/useInvoiceMutations";
import { useNavigate } from "react-router";
import { showErrorToast } from "@/api/axiosInstance";
import useItemsMutations from "@/hooks/apis/items/useItemsMutations";
import type { ItemEditPayload } from "@/types/itemEdit.payload.type";
import type { ItemCreationPayload } from "@/types/itemCreation.payload.type";
import { CustomSheet } from "../common/CustomSheet";
import { CustomCombobox } from "../common/CustomCombobox";
import useCategoriesList from "@/hooks/apis/categories/useCategoriesList";
import useSubcategoryByCategory from "@/hooks/apis/subcategories/useSubcategoryByCategory";
import { RenderMultiSelectCheckbox } from "../common/RenderMultiSelectCheckbox";
import { Spinner } from "../ui/spinner";
import DeleteDialog from "../common/DeleteDialog";
import ItemForm from "../items/ItemForm";

export type InvoiceItemSelectFormProps = {
  currInvoice?: InvoiceDetails;
};

function InvoiceItemSelectForm({ currInvoice }: InvoiceItemSelectFormProps) {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const { invoiceUpdateMutation } = useInvoiceMutations();
  const { createItemMutation, updateItemMutation, deleteItemMutation } =
    useItemsMutations();
  const [editItemModal, toggleEditItemModal] = useState(false);
  const [createItemModal, toggleCreateItemModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filterOpen, toggleFilterOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const targetItem = useRef<ItemDetails | undefined>(undefined);
  const [filters, setFilters] = useState<string[]>([]);
  const targetSubCategory = useRef<string[] | undefined>(undefined);
  const discountRef = useRef<number | null>(
    currInvoice?.quote ? Number(currInvoice.quote.discount?.amount ?? "0") : 0,
  );
  const [paymentMethod, setPaymentMethod] = useState<string | undefined | null>(
    currInvoice?.payment_method,
  );
  const itemListFilter = useMemo(
    () =>
      ({
        invoice_id: currInvoice?.id,
        category_id: filterCategory,
        subcategory_ids: targetSubCategory.current,
      }) as PageFilters,
    [currInvoice, targetSubCategory.current],
  );
  const {
    itemsList,
    isFetching,
    paginationMeta,
    setPageNo,
    searchTerm,
    setSearchTerm,
    refetch: refetchItemsList,
  } = useItemsList({
    filters: itemListFilter,
    enabled: currInvoice !== undefined,
  });

  const {
    searchTerm: categorySearch,
    setSearchTerm: setCategorySearch,
    categoryList: categories,
    isFetching: isCategoryListFetching,
    isFetchingNextPage: isFetchingNextCategories,
    fetchNextPage: fetchNextCategories,
    paginationMeta: categoryPaginationMeta,
  } = useCategoriesList({});

  const { subCategories, isFetching: isFetchingSubCategories } =
    useSubcategoryByCategory({
      catId: filterCategory,
      enabled: filterCategory !== "",
    });

  const initialItems: ItemDetails[] = currInvoice?.items ?? [];
  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<{ items: ItemDetails[] }>({
    defaultValues: {
      items: initialItems,
    },
    resolver: yupResolver(itemDetailsListSchema),
  });

  const [addedItems] = useWatch({
    control,
    name: ["items"],
  });

  const getItemIdx = (itemId: number) => {
    return addedItems.findIndex((item) => item.id === itemId);
  };

  const getQty = (itemId: number) => {
    const idx = getItemIdx(itemId);
    if (idx === -1) {
      return 0;
    }
    return addedItems[idx].quantity;
  };

  const handleDecrement = (itemId: number) => {
    const idx = getItemIdx(itemId);
    if (idx === -1) {
      return;
    }
    if (addedItems[idx].quantity === 1) {
      setValue("items", addedItems.toSpliced(idx, 1));
      return;
    }
    setValue("items", [
      ...addedItems.slice(0, idx),
      {
        ...addedItems[idx],
        quantity: addedItems[idx].quantity - 1,
      },
      ...addedItems.slice(idx + 1),
    ]);
  };

  const handleIncrement = (item: ItemDetails) => {
    const idx = getItemIdx(item.id);
    if (idx === -1) {
      setValue(
        "items",
        addedItems.concat(
          Object.assign(item, {
            quantity: 1,
          }),
        ),
      );
      return;
    }
    setValue("items", [
      ...addedItems.slice(0, idx),
      {
        ...addedItems[idx],
        quantity: addedItems[idx].quantity + 1,
      },
      ...addedItems.slice(idx + 1),
    ]);
  };

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
    toggleEditItemModal(false);
  };

  const itemDeleteHandler = () => {
    if (!targetItem.current) {
      toast.error(`No item Selected to delete`);
      return;
    }
    const itemId = targetItem.current.id;
    deleteItemMutation.mutate(itemId, {
      onSuccess: (response) => {
        const idx = getItemIdx(itemId);
        if (idx !== -1) {
          setValue("items", addedItems.toSpliced(idx, 1));
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

  const itemColumns: ColumnDef<TableFeatures, ItemDetails>[] = [
    {
      accessorKey: "name",
      header: "Item name",
      enableSorting: false,
    },
    {
      accessorKey: "category_name",
      header: "Category",
      enableSorting: false,
    },
    {
      accessorKey: "subcategory_name",
      header: "Subcategory",
      enableSorting: false,
      cell: (info) => {
        const subCatName = info.getValue<string | null>() ?? "";
        if (subCatName.trim() === "") {
          return "-";
        }
        return subCatName;
      },
    },
    {
      id: "qty",
      header: "Qty",
      accessorFn: (item) => {
        return `${item.quantity} ${item.unit[0].toUpperCase() + item.unit.slice(1).replace("_", "^")}`;
      },
      enableSorting: false,
    },
    {
      accessorKey: "price",
      header: "Price/unit",
      enableSorting: false,
      cell: (info) => formatCurrency(info.getValue<number>()),
    },
    {
      id: "remQty",
      header: "Remaining QTY",
      cell: (info) => {
        const item = info.row.original;
        return (
          <CustomBtn
            buttonLabel={`${getQty(item.id)}`}
            leftIcon={assets.minusIconBlue}
            leftAction={() => handleDecrement(item.id)}
            rightIcon={assets.plusIconBlue}
            rightAction={() => handleIncrement(item)}
            btncls={cn(
              `bg-transparent hover:bg-transparent text-black-text border border-brand-dark`,
            )}
          />
        );
      },
    },
    {
      id: "Total",
      header: "Total",
      accessorFn: (item) => {
        return formatCurrency(getQty(item.id) * item.price);
      },
      enableSorting: false,
    },
    {
      id: "action",
      header: "Action",
      cell: (info) => {
        const item = info.row.original;
        return (
          <CustomActionGroup
            withOpen={false}
            editFn={() => {
              targetItem.current = item;
              toggleEditItemModal(true);
            }}
            deleteFn={() => {
              targetItem.current = item;
              setDeleteDialogOpen(true);
            }}
          />
        );
      },
    },
  ];

  const submitHandler = ({ items }: { items: ItemDetails[] }) => {
    console.log(items);
    invoiceUpdateMutation.mutate(
      {
        invoice_id: currInvoice?.id ?? "",
        _method: "put",
        items: items,
        payment_method: (paymentMethod as PaymentMethods) ?? undefined,
        discount: discountRef.current ?? 0,
      },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          navigate(`/invoices/${response.payload.id}`);
        },
        onError: (error) => {
          showErrorToast(error);
        },
      },
    );
  };

  useEffect(() => {
    if (errors.items) {
      toast.error(errors.items.message);
    }
  }, [errors.items]);

  return (
    <div className="bg-table flex flex-col gap-5">
      <CustomDataTable
        columns={itemColumns}
        data={itemsList}
        showPaginated
        isFetching={isFetching}
        setPageNo={setPageNo}
        paginationMeta={paginationMeta}
        paginationBtns={paginationMeta?.links}
        tableOptionsLeft={
          <SearchInputGruop
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchPlaceHolder="Search items"
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
                targetItem.current = undefined;
                toggleCreateItemModal((curr) => !curr);
              }}
            />
          </div>
        }
      />

      <div className="flex justify-between pl-5">
        <CustomBtn
          buttonLabel="Finalise Invoice"
          onClick={handleSubmit(submitHandler)}
          isSubmitting={invoiceUpdateMutation.isPending}
        />
        <div className="max-w-75">
          <SubtotalBreakDown
            paymentMethod={
              (currInvoice?.payment_method ?? user.stripe_connected)
                ? PaymentMethods.stripe
                : PaymentMethods.cash
            }
            items={addedItems}
            taxEditabled={false}
            taxPercentage={currInvoice?.quote.vat}
            discountPercentage={
              currInvoice?.quote
                ? Number(currInvoice.quote.discount?.amount ?? "0")
                : 0
            }
            discountRef={discountRef}
            toggleSelectedPaymentMethod={(paymentMethod) => {
              setPaymentMethod(paymentMethod);
            }}
            creditAmount={currInvoice?.payments.reduce(
              (acc, currPayment) => acc + currPayment.allocated,
              0,
            )}
          />
        </div>
      </div>

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
        currItem={targetItem.current}
        editFn={itemEditHandler}
        isPending={updateItemMutation.isPending}
      />

      <DeleteDialog
        isOpen={deleteDialogOpen}
        toggleOpen={setDeleteDialogOpen}
        deleteAction={itemDeleteHandler}
        isPending={deleteItemMutation.isPending}
      />
    </div>
  );
}

export default InvoiceItemSelectForm;
