import {
  PaymentMethods,
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

export type InvoiceItemSelectFormProps = {
  currInvoice?: InvoiceDetails;
};

function InvoiceItemSelectForm({ currInvoice }: InvoiceItemSelectFormProps) {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
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
      }) as PageFilters,
    [currInvoice],
  );
  const {
    itemsList,
    isFetching,
    paginationMeta,
    setPageNo,
    searchTerm,
    setSearchTerm,
  } = useItemsList({
    filters: itemListFilter,
    enabled: currInvoice !== undefined,
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

  const { invoiceUpdateMutation } = useInvoiceMutations();

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
        return <CustomActionGroup withOpen={false} />;
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
    </div>
  );
}

export default InvoiceItemSelectForm;
