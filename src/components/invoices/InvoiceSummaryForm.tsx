import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { CustomInput } from "../common/CustomInput";
import { DateRangePicker, type DateRange } from "../common/DateRangePicker";
import { Separator } from "../ui/separator";
import { CustomBtn } from "../common/CustomBtn";
import StyledAttachments from "../common/StyledAttachments";
import { CustomCombobox } from "../common/CustomCombobox";
import { cn } from "@/lib/utils/helper";
import { toast } from "react-toastify";
import { showErrorToast } from "@/api/axiosInstance";
import {
  QuoteStatus,
  type ApiResponse,
  type InvoiceDetails,
  type QuoteDetails,
} from "@/types/api.responses.type";
import { useNavigate } from "react-router";
import { createInvoiceSchema } from "@/validation/createInvoice.payload.schema";
import type { InvoiceCreateApiPayload } from "@/types/api.requests.type";
import useInvoiceMutations from "@/hooks/apis/invoices/useInvoiceMutations";
import useQuoteList from "@/hooks/apis/quotes/useQuoteList";
import useQuoteDetails from "@/hooks/apis/quotes/useQuoteDetails";
import { ALLOWED_ATTACHMENT_TYPES } from "@/constants/types";
import { useQueryClient } from "@tanstack/react-query";

export type InvoiceSummaryFormProps = {
  mode: "create" | "edit";
  submitAction?: () => void;
  currInvoice?: InvoiceDetails;
  prefillQuoteId?: number;
  setSummaryPreview?: React.Dispatch<
    React.SetStateAction<Partial<InvoiceCreateApiPayload>>
  >;
  setJobDescriptionPreview?: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  setRefNoPreview?: React.Dispatch<React.SetStateAction<string | undefined>>;
};

function InvoiceSummaryForm({
  mode,
  currInvoice,
  submitAction,
  prefillQuoteId,
  setSummaryPreview,
  setJobDescriptionPreview,
  setRefNoPreview,
}: InvoiceSummaryFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

  const initialValue: InvoiceCreateApiPayload = {
    quote_id: prefillQuoteId ?? "",
    invoice_date: new Date().toISOString(),
    due_date: new Date().toISOString(),
    attachments: [],
  };

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<InvoiceCreateApiPayload | Partial<InvoiceCreateApiPayload>>({
    defaultValues: initialValue,
    resolver: yupResolver(
      mode === "create" ? createInvoiceSchema : createInvoiceSchema.partial(),
    ),
  });

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: currInvoice ? new Date(currInvoice.invoice_date) : new Date(),
    endDate: currInvoice
      ? new Date(currInvoice.due_date)
      : new Date(new Date().getTime() + 860000),
  });

  const [quoteId, attachments] = useWatch({
    control,
    name: ["quote_id", "attachments"],
  });
  const watcher = useWatch({ control });

  const { quote, queryKey } = useQuoteDetails({
    quote_id: quoteId?.toString() ?? "",
    enabled: quoteId !== undefined && quoteId.toString().length >= 1,
    refetchOnFocus: false,
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

  const handleAttachmentDelete = (attachment_id?: number) => {
    queryClient.setQueryData(queryKey, (oldData: ApiResponse<QuoteDetails>) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        payload: {
          ...oldData.payload,
          attachments: oldData.payload.attachments.filter(
            (attachment) => attachment.id !== attachment_id,
          ),
        },
      };
    });
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
          attachments: data.attachments ?? [],
        },
        {
          onSuccess: (response) => {
            submitAction?.();
            toast.success(response.message);
            reset({
              attachments: [],
            });
          },
          onError: (error) => {
            showErrorToast(error);
          },
        },
      );
    } else {
      invoiceCreateMutation.mutate(
        {
          ...data,
          attachments:
            data.attachments?.slice(quote?.attachments.length ?? 0) ?? [],
        } as InvoiceCreateApiPayload,
        {
          onSuccess: (response) => {
            submitAction?.();
            navigate(`/invoices/manage-invoice/${response.payload.id}`);
            toast.success(response.message);
            reset({
              attachments: [],
            });
          },
          onError: (error) => {
            showErrorToast(error);
          },
        },
      );
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
    if (!quote) {
      return;
    }
    setJobDescriptionPreview?.(quote.job_description);
    setRefNoPreview?.(quote.reference_number);
  }, [quote]);

  useEffect(() => {
    if (quote) {
      setQuoteSearchTerm(quote.reference_number);
    }
  }, [prefillQuoteId]);

  useEffect(() => {
    if (!attachments) {
      return;
    }
    if (attachments.length + (quote?.attachments.length ?? 0) > 5) {
      toast.error(
        `Only 5 attachments can be added including the quote attachments`,
      );
      setValue("attachments", []);
    }
  }, [attachments]);

  useEffect(() => {
    setSummaryPreview?.(watcher);
  }, [currInvoice, watcher]);
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
                inptDisabled={currInvoice !== undefined}
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

        <div className="flex flex-col gap-2">
          <CustomInput
            control={control}
            name="attachments"
            fieldName="Attachments"
            inptType="file"
            allowedFileTypes={ALLOWED_ATTACHMENT_TYPES}
          />
          {(attachments || quote?.attachments) && (
            <div className="attachment-layout">
              {quote?.attachments?.map((attachment) => {
                const fileName = `attachment_${attachment.id}.${attachment.type}`;
                return (
                  <StyledAttachments
                    key={attachment.id}
                    quoteId={quote?.id}
                    attachmentId={attachment.id}
                    fileName={fileName}
                    deleteAction={() => handleAttachmentDelete(attachment.id)}
                    withDownload
                    withOpen
                  />
                );
              })}
              {attachments?.map((attachment) => {
                return (
                  <StyledAttachments
                    key={attachment.name}
                    fileName={attachment.name}
                    deleteAction={() => {
                      removeAttachment(attachment.name);
                    }}
                    defaultOpenUrl={window.URL.createObjectURL(attachment)}
                    withOpen
                  />
                );
              })}
            </div>
          )}
        </div>

        <CustomBtn
          buttonLabel="Save"
          onClick={() => {
            handleSubmit(submitHandler)();
          }}
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
