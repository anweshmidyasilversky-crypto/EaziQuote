import { CustomCombobox } from "@/components/common/CustomCombobox";
import { CustomHeader } from "@/components/common/CustomHeader";
import {
  CustomInput,
  type SelectOptions,
} from "@/components/common/CustomInput";
import {
  CustomToggleGroup,
  type CustomToggleGroupProps,
} from "@/components/common/CustomToggleGroup";
import DatePicker from "@/components/common/DatePicker";
import useClients from "@/hooks/apis/clients/useClients";
import useInvoiceList from "@/hooks/apis/invoices/useInvoiceList";
import useDepositQuotes from "@/hooks/apis/quotes/useDepositQuotes";
import { cn, formatCurrency } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import type {
  CreatePaymentBase,
  CreatePaymentDeposit,
  CreatePaymentInvoice,
  PageFilters,
} from "@/types/api.requests.type";
import {
  PaymentAmountType,
  PaymentMethods,
  PaymentTypes,
  type DepositQuote,
  type Invoice,
} from "@/types/api.responses.type";
import { paymentSchemaBase } from "@/validation/createPaymentApi.payload.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import StripeAdvisoryDialog from "../settings/StripeAdvisoryDialog";
import { Separator } from "@/components/ui/separator";
import WarningDialog from "@/components/common/WarningDialog";
import { CustomBtn } from "@/components/common/CustomBtn";
import usePaymentMutations from "@/hooks/apis/payments/usePaymentMutations";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { showErrorToast } from "@/api/axiosInstance";

function PaymentCreatePage() {
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const { createPaymentMutation } = usePaymentMutations();
  const [clientId, setClientId] = useState<number | undefined>(undefined);
  const [selectedQuote, setSetelectedQuote] = useState<
    DepositQuote | undefined
  >(undefined);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>(
    undefined,
  );
  const [stripDialogOpen, toggleStripDialogOpen] = useState(false);
  const [warningOpen, toggleWarningOpen] = useState(false);
  const [activeToggle, setActiveToggle] = useState<string>(
    PaymentTypes.deposite,
  );
  const toggleConfig: CustomToggleGroupProps["toggleConfig"] = [
    {
      btnId: PaymentTypes.deposite,
      btnLabel: "Deposit",
    },
    {
      btnId: PaymentTypes.invoice,
      btnLabel: "Invoice",
    },
  ];

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<CreatePaymentBase, "amount" | "amount_type">>({
    defaultValues: {
      payment_method: user.stripe_connected
        ? PaymentMethods.stripe
        : PaymentMethods.cash,
      payment_date: new Date().toISOString(),
    },
    resolver: yupResolver(paymentSchemaBase),
  });

  const [paymentDate, paymentMethod] = useWatch({
    control,
    name: ["payment_date", "payment_method"],
  });

  const {
    searchTerm: clientSearchTerm,
    setSearchTerm: setClientSearchTerm,
    fetchNextPage: fetchNextClients,
    clientList,
    clientListMeta,
    isFetching: isClientFetching,
    isFetchingNextPage: isNextClientFetching,
  } = useClients({});

  const depositQuotesFilters = useMemo(
    () =>
      ({
        client_id: clientId,
      }) as PageFilters,
    [clientId],
  );
  const {
    searchTerm: quoteSearchTerm,
    setSearchTerm: setQuoteSearchTerm,
    fetchNextPage: fetchNextQuotes,
    depositQuotes,
    paginationMeta: quoteListMeta,
    isFetching: isQuoteFetching,
    isFetchingNextPage: isFetchingNextQuotes,
  } = useDepositQuotes({
    enabled: clientId !== undefined,
    filters: depositQuotesFilters,
  });

  const invoiceFilters = useMemo(
    () =>
      ({
        is_not_paid: 1,
      }) as PageFilters,
    [],
  );
  const {
    searchTerm: invoiceSearchTerm,
    setSearchTerm: setInvoiceSearchTerm,
    fetchNextPage: fetchNextInvoices,
    invoiceList,
    paginationMeta: invoiceListMeta,
    isFetching: isFetchingInvoices,
    isFetchingNextPage: isFetchingNextInvoices,
  } = useInvoiceList({ filters: invoiceFilters });

  const paymentMethodSelectOptions: SelectOptions = Object.keys(
    PaymentMethods,
  ).map((key) => {
    return {
      value: key,
      label: key[0].toLocaleUpperCase() + key.slice(1),
    };
  });

  useEffect(() => {
    if (paymentMethod === PaymentMethods.stripe && !user.stripe_connected) {
      toggleStripDialogOpen(true);
      setValue("payment_method", PaymentMethods.cash);
    }
  }, [paymentMethod]);

  const submitBtnAction = () => {
    if (paymentMethod === PaymentMethods.cash) {
      toggleWarningOpen(true);
    } else {
      handleSubmit(handlePaymentCreate);
    }
  };

  const handlePaymentCreate = (
    baseDetails: Omit<CreatePaymentBase, "amount" | "amount_type">,
  ) => {
    let payload = { ...baseDetails } as
      | CreatePaymentDeposit
      | CreatePaymentInvoice;
    if (activeToggle === PaymentTypes.deposite) {
      if (!selectedQuote) {
        toast.error(`For Deposit client and quote both must be selected`);
        return;
      } else {
        Object.assign(payload, {
          client_id: clientId ?? 0,
          quote_id: selectedQuote.id,
          amount: selectedQuote.deposit_amount,
          amount_type: PaymentAmountType.deposit,
        } as CreatePaymentDeposit);
      }
    } else {
      if (!selectedInvoice) {
        toast.error(`Please select an invoice`);
        return;
      } else {
        Object.assign(payload, {
          invoice_id: selectedInvoice.id,
          amount_type: PaymentAmountType.invoice,
          amount:
            selectedInvoice.total_due - (selectedInvoice.deposit_amount ?? 0),
        } as CreatePaymentInvoice);
      }
    }

    createPaymentMutation.mutate(payload, {
      onSuccess: (response) => {
        toast.success(response.message);
        navigate(`/payments`);
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <CustomHeader header="Record Payment" btnConfigList={[]} />

      <div className="dashboard-card-theme py-5 rounded-[10px] flex flex-col gap-8">
        <div className="flex flex-col gap-5 px-5">
          <div className="input-non-oriented flex-col gap-2">
            <label className="input-label"> {"Amount"} </label>
            <CustomToggleGroup
              toggleConfig={toggleConfig}
              activeId={activeToggle}
              toggleActive={setActiveToggle}
              containerCls={cn(
                `border border-client-creation-secondary rounded-[7px] p-1.5 max-w-fit`,
              )}
              btnCls={cn(`rounded-[7px]!`)}
            />
          </div>

          {activeToggle === PaymentTypes.deposite && (
            <>
              <div className="input-non-oriented flex-col gap-2">
                <label className="input-label"> Client </label>
                <CustomCombobox
                  items={clientList}
                  inptFieldValue={clientSearchTerm}
                  inptFieldChange={(query) => {
                    if (clientId) {
                      setClientId(undefined);
                      if (selectedQuote) {
                        setSetelectedQuote(undefined);
                        setQuoteSearchTerm("");
                      }
                    }
                    setClientSearchTerm(query);
                  }}
                  getItemLabel={(client) => client.name}
                  getItemId={(client) => client.id}
                  onValueChange={(client) => {
                    if (client) {
                      setClientSearchTerm(client.name);
                      setClientId(client.id);
                    } else {
                      if (selectedQuote) {
                        setSetelectedQuote(undefined);
                      }
                    }
                  }}
                  paginationMeta={clientListMeta}
                  fetchNextPage={fetchNextClients}
                  isFetching={isClientFetching}
                  isFetchingNextPage={isNextClientFetching}
                  placeholder="Search or select a client"
                />
              </div>

              <div className="input-non-oriented flex-col gap-2">
                <label className="input-label"> Select Quote </label>
                <CustomCombobox
                  items={depositQuotes}
                  inptFieldValue={quoteSearchTerm}
                  inptFieldChange={setQuoteSearchTerm}
                  getItemLabel={(quote) => `${quote.id} - ${quote.title}`}
                  getItemId={(quote) => quote.id}
                  onValueChange={(quote) => {
                    if (quote) {
                      setQuoteSearchTerm(`${quote.id} - ${quote.title}`);
                      setSetelectedQuote(quote);
                    } else {
                      if (selectedQuote) {
                        setSetelectedQuote(undefined);
                      }
                    }
                  }}
                  paginationMeta={quoteListMeta}
                  fetchNextPage={fetchNextQuotes}
                  isFetching={isQuoteFetching}
                  isFetchingNextPage={isFetchingNextQuotes}
                  placeholder={
                    clientId
                      ? `Search or select a quote`
                      : `Select a client first`
                  }
                />
              </div>
            </>
          )}

          {activeToggle === PaymentTypes.invoice && (
            <div className="input-non-oriented flex-col gap-2">
              <label className="input-label"> Select Invoice </label>
              <CustomCombobox
                items={invoiceList}
                inptFieldValue={invoiceSearchTerm}
                inptFieldChange={setInvoiceSearchTerm}
                getItemLabel={(invoice) =>
                  `${invoice.reference_number} - ${invoice.title}`
                }
                getItemId={(invoice) => invoice.id}
                onValueChange={(invoice) => {
                  if (invoice) {
                    setInvoiceSearchTerm(
                      `${invoice.reference_number} - ${invoice.title}`,
                    );
                    setSelectedInvoice(invoice);
                  } else {
                    if (selectedInvoice) {
                      setSelectedInvoice(undefined);
                    }
                  }
                }}
                paginationMeta={invoiceListMeta}
                fetchNextPage={fetchNextInvoices}
                isFetching={isFetchingInvoices}
                isFetchingNextPage={isFetchingNextInvoices}
                placeholder="Search or select an invoice"
              />
              {selectedInvoice && (
                <p className="error-text">
                  {" "}
                  {`Amount Due: £ ${
                    selectedInvoice.total_due -
                    (selectedInvoice.deposit_amount ?? 0)
                  }`}{" "}
                </p>
              )}
            </div>
          )}

          {activeToggle === PaymentTypes.deposite && (
            <div className="input-non-oriented flex-col gap-2">
              <label className="input-label"> Amount </label>
              <input
                className="input-field bg-slate-200"
                readOnly
                value={`£ ${selectedQuote?.deposit_amount ?? 0}`}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-5">
            <DatePicker
              dateSetter={(date) => {
                if (date) {
                  console.log(date);
                  setValue("payment_date", date.toISOString());
                } else {
                  if (paymentDate) {
                    setValue("payment_date", "");
                  }
                }
              }}
              errorMsg={errors?.payment_date?.message}
            />

            <div className="flex flex-col gap-2">
              <CustomInput
                control={control}
                name="payment_method"
                fieldName="Method"
                placeholder="Select a input method"
                inptType="select"
                selectOptions={paymentMethodSelectOptions}
              />
              {paymentMethod === PaymentMethods.cash && (
                <p className="text-warning-text text-sm">
                  {" "}
                  You are about to record a cash payment. Please ensure the
                  amount has been physically received before proceeding.{" "}
                </p>
              )}
            </div>
          </div>

          {/* Amount breakdown for invoice */}
          {activeToggle === PaymentTypes.invoice && selectedInvoice && (
            <>
              <Separator className={`bg-separator`} />
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="flex flex-col gap-4 [&_div]:flex [&_div]:items-center [&_div]:gap-4 [&_div]:justify-between">
                  <div>
                    <span className="subtotal-field"> {"Amount Due"} </span>
                    <span className="subtotal-value">
                      {" "}
                      {`${formatCurrency(selectedInvoice.total_due)}`}{" "}
                    </span>
                  </div>

                  <div>
                    <span className="subtotal-field">
                      {" "}
                      {"Deposit Available"}{" "}
                    </span>
                    <span className="subtotal-value">
                      {" "}
                      {`${formatCurrency(selectedInvoice.deposit_amount ?? 0)}`}{" "}
                    </span>
                  </div>

                  <div>
                    <span className="subtotal-field">
                      {" "}
                      {"From This Payment"}{" "}
                    </span>
                    <span className="subtotal-value">
                      {" "}
                      {`${formatCurrency(selectedInvoice.total_due - (selectedInvoice.deposit_amount ?? 0))}`}{" "}
                    </span>
                  </div>

                  <Separator className="bg-transparent border-t border-dashed border-border border-separator" />

                  <div>
                    <span className="subtotal-field">
                      {" "}
                      {"Credit After Payment"}{" "}
                    </span>
                    <span className="subtotal-value">
                      {" "}
                      {`${formatCurrency(0)}`}{" "}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <CustomBtn
          buttonLabel="Create Payment Record"
          btncls="ml-5"
          onClick={submitBtnAction}
          isSubmitting={createPaymentMutation.isPending}
        />
      </div>

      <StripeAdvisoryDialog
        type="connect"
        isOpen={stripDialogOpen}
        toggleIsOpen={toggleStripDialogOpen}
      />

      <WarningDialog
        open={warningOpen}
        toggleOpen={toggleWarningOpen}
        warningHeader="Confirm Cash Payment"
        warningContent="By continuing, you confirm that the payment has already been received. This action will only record the payment in the system. Once recorded, it cannot be reversed or edited."
        acceptAction={handleSubmit(handlePaymentCreate)}
        isAccepting={createPaymentMutation.isPending}
      />
    </div>
  );
}

export default PaymentCreatePage;
