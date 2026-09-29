import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { CustomInput } from "../common/CustomInput";
import { DateRangePicker, type DateRange } from "../common/DateRangePicker";
import { Separator } from "../ui/separator";
import { CustomBtn } from "../common/CustomBtn";
import StyledAttachments from "../common/StyledAttachments";
import { CustomCombobox } from "../common/CustomCombobox";
import { cn } from "../../lib/utils";
import { toast } from "react-toastify";
import { showErrorToast } from "@/api/axiosInstance";
import { QuoteStatus, type InvoiceDetails } from "@/types/api.responses.type";
import { useNavigate } from "react-router";
import useQuotesMutations from "@/hooks/apis/quotes/useQuotesMutations";
import { createInvoiceSchema } from "@/validation/createInvoice.payload.schema";
import type { InvoiceCreateApiPayload } from "@/types/api.requests.type";
import useInvoiceMutations from "@/hooks/apis/invoices/useInvoiceMutations";
import useQuoteList from "@/hooks/apis/quotes/useQuoteList";
import useQuoteDetails from "@/hooks/apis/quotes/useQuoteDetails";

export type InvoiceSummaryFormProps = {
  mode: "create" | "edit";
  submitAction?: () => void;
  currInvoice?: InvoiceDetails;
  prefillQuoteId?: number;
};

function InvoiceSummaryForm({
  mode,
  currInvoice,
  submitAction,
  prefillQuoteId,
}: InvoiceSummaryFormProps) {
  const navigate = useNavigate();

  const {
    quoteList,
    isFetching: isQuoteListFetching,
    isFetchingNextPage: isNextQuoteFetching,
    fetchNextPage: fetchNextQuotes,
    searchTerm: quoteSearchTerm,
    setSearchTerm: setQuoteSearchTerm,
  } = useQuoteList({
    filters: {
      status: [QuoteStatus.approved],
    },
  });

  const { invoiceCreateMutation, invoiceUpdateMutation } =
    useInvoiceMutations();

  const { attachmentDeleteMutation } = useQuotesMutations();

  const initialValue: InvoiceCreateApiPayload = {
    quote_id: prefillQuoteId ?? "",
    invoice_date: new Date().toISOString(),
    due_date: new Date().toISOString(),
    attachments:
      mode === "edit"
        ? currInvoice?.attachments.map((attachment) => {
            return new File(
              [],
              `attachment_${attachment.id.toString()}.${attachment.type}`,
              {
                type:
                  attachment.type === "pdf"
                    ? `application/pdf`
                    : `image/${attachment.type}`,
              },
            );
          })
        : [],
  };

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<InvoiceCreateApiPayload | Partial<InvoiceCreateApiPayload>>({
    defaultValues: initialValue,
    resolver: yupResolver(
      mode === "create" ? createInvoiceSchema : createInvoiceSchema.partial(),
    ),
  });

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: currInvoice ? new Date(currInvoice.invoice_date) : undefined,
    endDate: currInvoice ? new Date(currInvoice.due_date) : undefined,
  });

  const [quoteId, attachments] = useWatch({
    control,
    name: ["quote_id", "attachments"],
  });

  const { quote } = useQuoteDetails({
    quote_id: quoteId?.toString() ?? "",
    enabled: quoteId !== undefined && quoteId.toString().length >= 1,
  });

  useEffect(() => {
    setValue("invoice_date", dateRange.startDate?.toDateString() as string);
    clearErrors("invoice_date");
  }, [dateRange.startDate]);
  useEffect(() => {
    setValue("due_date", dateRange.endDate?.toDateString() as string);
    clearErrors("due_date");
  }, [dateRange.endDate]);

  const removeAttachment = (fileName: string) => {
    setValue(
      "attachments",
      attachments?.filter((attachment) => attachment.name !== fileName),
    );
  };

  const handleAttachmentDelete = (
    quote_id: string | number,
    attachment_id: string | number,
    fileName: string,
  ) => {
    attachmentDeleteMutation.mutate(
      {
        quote_id,
        attachment_id,
      },
      {
        onSuccess: (response) => {
          removeAttachment(fileName);
          toast.success(response.message);
        },
        onError: (error) => {
          showErrorToast(error);
        },
      },
    );
  };

  const submitHandler = (
    data: InvoiceCreateApiPayload | Partial<InvoiceCreateApiPayload>,
  ) => {
    if (mode === "edit") {
      invoiceUpdateMutation.mutate(
        {
          _method: "put",
          invoice_id: currInvoice?.id ?? "",
          ...data,
          attachments:
            data.attachments?.slice(currInvoice?.attachments.length ?? 0) ?? [],
        },
        {
          onSuccess: (response) => {
            submitAction?.();
            toast.success(response.message);
          },
          onError: (error) => {
            showErrorToast(error);
          },
        },
      );
    } else {
      invoiceCreateMutation.mutate(data as InvoiceCreateApiPayload, {
        onSuccess: (response) => {
          submitAction?.();
          navigate(`/invoices/manage-invoice/${response.payload.id}`);
          toast.success(response.message);
        },
        onError: (error) => {
          showErrorToast(error);
        },
      });
    }
  };

  useEffect(() => {
    if (currInvoice && mode === "edit") {
      setValue("quote_id", currInvoice.quote.id);
      setQuoteSearchTerm(currInvoice.quote.reference_number);
      setValue(
        "is_company_phone_number_show",
        currInvoice.is_company_phone_number_show ? true : false,
      );
    }
  }, [currInvoice]);

  useEffect(() => {
    if (quote) {
      setQuoteSearchTerm(quote.reference_number);
    }
  }, [prefillQuoteId]);

  return (
    <React.Fragment>
      <div className="px-5 flex flex-col gap-8">
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="input-label self-start">
                {" "}
                {"Linked Quote"}{" "}
              </label>
              <CustomCombobox
                items={quoteList}
                inptFieldValue={quoteSearchTerm}
                inptFieldChange={(query) => {
                  if (quoteId) {
                    setValue("quote_id", undefined);
                  }
                  setQuoteSearchTerm(query);
                }}
                onValueChange={(quote) => {
                  if (quote) {
                    setValue("quote_id", quote.id);
                    setQuoteSearchTerm(quote.reference_number);
                    clearErrors("quote_id");
                  }
                }}
                getItemLabel={(quote) =>
                  `${quote.title} - ${quote.reference_number}`
                }
                className={`${errors?.quote_id ? `input-error!` : ``}`}
                placeholder="search or select a quote"
                isFetching={isQuoteListFetching}
                fetchNextPage={fetchNextQuotes}
                isFetchingNextPage={isNextQuoteFetching}
              />
              {errors.quote_id && (
                <p className="error-text"> {errors.quote_id.message} </p>
              )}
            </div>

            <div className="input-non-oriented flex-col gap-2">
              <label className="input-label"> {"Quote"} </label>
              <input
                placeholder={quote?.title ?? "Quote Title"}
                disabled
                className={cn(
                  "input-field grow-0!",
                  quote &&
                    "placeholder:text-black-text! opacity-100 disabled:opacity-100",
                )}
              />
            </div>
          </div>

          <div className="input-non-oriented flex-col gap-2">
            <label className="input-label"> {"Client"} </label>
            <input
              placeholder={quote?.client.name ?? "Client name"}
              disabled
              className={cn(
                "input-field",
                quote &&
                  "placeholder:text-black-text! opacity-100 disabled:opacity-100",
              )}
            />
          </div>

          <CustomInput
            control={control}
            name="is_company_phone_number_show"
            fieldName="Hide your Phone Number"
            inptType="switch"
            orientation="horizontal"
            className={cn("max-w-11!")}
            containerCls={cn(`min-h-0! h-fit!`)}
          />
          <Separator className={`bg-separator`} />
        </div>

        <div className="flex flex-col gap-5">
          <div className="input-non-oriented flex-col gap-2">
            <label className="input-label"> {"Invoice Number"} </label>
            <input
              placeholder={currInvoice?.invoice_number ?? "IN"}
              disabled
              className={cn(
                "input-field",
                currInvoice &&
                  "placeholder:text-black-text! opacity-100 disabled:opacity-100",
              )}
            />
          </div>

          <div className="flex flex-col gap-0.5">
            <DateRangePicker
              dateRange={dateRange}
              setDateRange={setDateRange}
              startDateAlias="Invoice Date"
              endDateAlias="Expiry Date"
              startDateStyle={`${errors.invoice_date ? `input-error!` : ``}`}
              endDateStyle={`${errors.due_date ? `input-error!` : ``}`}
            />
            <div className="grid grid-cols-2 w-full">
              {errors.invoice_date && (
                <span
                  className={cn("error-text input-field border-0! mt-0 pl-0")}
                >
                  {" "}
                  {errors.invoice_date.message}{" "}
                </span>
              )}
              {errors.due_date && (
                <span
                  className={cn("input-field error-text col-start-2 border-0!")}
                >
                  {" "}
                  {errors.due_date.message}{" "}
                </span>
              )}
            </div>
          </div>

          <CustomInput
            control={control}
            name="message"
            fieldName="Project / Services Notes"
            inptType="textarea"
          />

          <CustomInput
            control={control}
            name="notes"
            fieldName="Notes (Not visible on quote)"
            inptType="textarea"
          />
        </div>

        <Separator className={`bg-separator`} />

        <CustomInput
          control={control}
          name="attachments"
          fieldName="Attachments"
          inptType="file"
        />
        {attachments && (
          <div className="attachment-layout">
            {attachments.map((attachment, index) => (
              <StyledAttachments
                key={attachment.name}
                fileName={attachment.name}
                deleteAction={() => {
                  if (quote && index < (quote.attachments.length ?? 0)) {
                    handleAttachmentDelete(
                      quote.id,
                      quote.attachments[index].id,
                      attachment.name,
                    );
                  } else {
                    removeAttachment(attachment.name);
                  }
                }}
              />
            ))}
          </div>
        )}

        <CustomBtn
          buttonLabel="Save"
          onClick={handleSubmit(submitHandler)}
          type="submit"
          isSubmitting={
            invoiceCreateMutation.isPending || invoiceUpdateMutation.isPending
          }
        />
      </div>
    </React.Fragment>
  );
}

export default InvoiceSummaryForm;
