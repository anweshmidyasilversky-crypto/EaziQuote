import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { quoteSummarySchema } from "../../validation/quote.summary.schema";
import { CustomInput } from "../common/customInput";
import { DateRangePicker, type DateRange } from "../common/DateRangePicket";
import { Separator } from "../ui/separator";
import { CustomBtn } from "../common/CustomBtn";
import { assets } from "../../assets/icons";
import { ClientForm } from "../clients/ClientForm";
import { type QuoteSummary } from "../../types/quoteCreation.payload.type";
import StyledAttachments from "../common/StyledAttachments";
import { CustomCombobox } from "../common/CustomCombobox";
import { useAppDispatch } from "../../redux/store";
import { cn } from "../../lib/utils";
import { updateQuote as updateQuoteRedux } from "../../redux/slices/quotes.slice";
import { toast } from "react-toastify";
import type { ClientCreationPayload } from "../../types/clientCreation.payload.type";
import { showErrorToast } from "@/api/axiosInstance";
import type { QuoteDetails } from "@/types/api.responses.type";
import { useNavigate } from "react-router";
import useQuotesMutations from "@/hooks/apis/quotes/useQuotesMutations";
import useClientMutations from "@/hooks/apis/clients/useClientMutations";
import useClients from "@/hooks/apis/clients/useClients";

export type QuoteSummaryFormProps = {
  refNo: string;
  submitAction?: () => void;
  currQuote?: QuoteDetails;
  prefillClient: boolean;
};

function QuoteSummaryForm({
  refNo,
  submitAction,
  currQuote,
  prefillClient,
}: QuoteSummaryFormProps) {
  const navigate = useNavigate();
  const [clientFormOpen, toggleClientFormOpen] = useState(false);
  const dispatch = useAppDispatch();

  const { quoteCreateMutation, quoteUpdateMutation, attachmentDeleteMutation } =
    useQuotesMutations();

  const { clientCreatMutation } = useClientMutations();

  const {
    clientList,
    isFetching: isClientFetching,
    searchTerm: clientSearchTerm,
    setSearchTerm: setClientSearchTerm,
    fetchNextPage: fetchNextClients,
    isFetchingNextPage: isFetchingNextClients,
    clientListMeta,
  } = useClients({ initialSearchVal: currQuote?.client.name });

  const initialValue: QuoteSummary = {
    quoteTitle: "",
    referenceNumber: refNo,
    quoteDate: "",
    expiryDate: "",
    hidePhoneNumber: true,
    clientId: "0",
    jobDescription: "",
    attachments: [],
  };

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<QuoteSummary>({
    defaultValues: initialValue,
    resolver: yupResolver(quoteSummarySchema),
  });

  useEffect(() => {
    if (currQuote) {
      setDateRange({
        startDate: new Date(currQuote.quote_date),
        endDate: new Date(currQuote.expiry_date),
      });

      setValue("quoteTitle", currQuote.title);
      setValue("referenceNumber", currQuote.reference_number);
      setValue("quoteDate", currQuote.quote_date);
      setValue("expiryDate", currQuote.expiry_date);
      setValue("hidePhoneNumber", !currQuote.is_company_phone_number_show);

      if (prefillClient) {
        setValue("clientId", currQuote.client.id.toString());
        setClientSearchTerm(currQuote.client.name);
      }
      setValue("jobDescription", currQuote.job_description);
      const attachmentList: File[] = [];
      currQuote.attachments.forEach((attachment) => {
        attachmentList.push(
          new File(
            [],
            `attachment_${attachment.id.toString()}.${attachment.type}`,
            {
              type:
                attachment.type === "pdf"
                  ? `application/pdf`
                  : `image/${attachment.type}`,
            },
          ),
        );
      });
      setValue("attachments", attachmentList);
    } else {
      reset(initialValue);
    }
  }, [currQuote]);

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: currQuote ? new Date(currQuote.quote_date) : undefined,
    endDate: currQuote ? new Date(currQuote.expiry_date) : undefined,
  });

  useEffect(() => {
    setValue("quoteDate", dateRange.startDate?.toDateString() as string);
    clearErrors("quoteDate");
  }, [dateRange.startDate]);
  useEffect(() => {
    setValue("expiryDate", dateRange.endDate?.toDateString() as string);
    clearErrors("expiryDate");
  }, [dateRange.endDate]);

  const attachments = watch().attachments;

  const removeAttachment = (fileName: string) => {
    setValue(
      "attachments",
      attachments?.filter((attachment) => attachment.name !== fileName),
    );
  };
  const clientCreateAction = (data: ClientCreationPayload) => {
    clientCreatMutation.mutate(
      {
        ...data,
        phone: data.phone,
        company_name: data.companyName,
        postcode: data.postCode,
        address: data.street,
      },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          setValue("clientId", response.payload.id.toString());
          setClientSearchTerm(response.payload.name);
          toggleClientFormOpen(false);
        },
        onError: (error) => {
          showErrorToast(error);
        },
      },
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

  const submitHandler = (data: QuoteSummary) => {
    if (currQuote) {
      quoteUpdateMutation.mutate(
        {
          _method: "put",
          quote_id: currQuote.id,
          ...data,
          title: data.quoteTitle,
          description: data.jobDescription,
          quote_date: data.quoteDate,
          expiry_date: data.expiryDate,
          client_id: Number(data.clientId),
          notes: data.notes ?? "",
          attachments: data.attachments?.slice(currQuote?.attachments.length),
        },
        {
          onSuccess: (response) => {
            dispatch(updateQuoteRedux(response.payload));
            submitAction?.();
            toast.success(response.message);
          },
          onError: (error) => {
            showErrorToast(error);
          },
        },
      );
    } else {
      quoteCreateMutation.mutate(
        {
          ...data,
          title: data.quoteTitle,
          description: data.jobDescription,
          quote_date: data.quoteDate,
          expiry_date: data.expiryDate,
          client_id: Number(data.clientId),
          notes: data.notes ?? "",
        },

        {
          onSuccess: (response) => {
            dispatch(updateQuoteRedux(response.payload));
            submitAction?.();
            navigate(`/quotes/manage-quotes/${response.payload.id}`);
            toast.success(response.message);
          },
          onError: (error) => {
            showErrorToast(error);
          },
        },
      );
    }
  };

  return (
    <React.Fragment>
      <div className="px-5 flex flex-col gap-8">
        <div className="w-full flex gap-4">
          <CustomInput
            control={control}
            name="quoteTitle"
            fieldName="Quote Title"
            inptType="text"
            placeholder="e.g. Kitchen Renovation"
          />

          <CustomInput
            control={control}
            name="referenceNumber"
            fieldName="Reference Number"
            inptType="text"
            placeholder="QT-2025-001"
            disabled
            className="bg-input-field-border"
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <DateRangePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
            startDateAlias="Quote Date"
            endDateAlias="Expiry Date"
            startDateStyle={`${errors.quoteDate ? `input-error!` : ``}`}
            endDateStyle={`${errors.expiryDate ? `input-error!` : ``}`}
          />
          <div className="grid grid-cols-2 w-full">
            {errors.quoteDate && (
              <span
                className={cn("error-text input-field border-0! mt-0 pl-0")}
              >
                {" "}
                {errors.quoteDate.message}{" "}
              </span>
            )}
            {errors.expiryDate && (
              <span
                className={cn("input-field error-text col-start-2 border-0!")}
              >
                {" "}
                {errors.expiryDate.message}{" "}
              </span>
            )}
          </div>
        </div>

        <CustomInput
          control={control}
          name="hidePhoneNumber"
          fieldName="Hide your Phone Number"
          inptType="switch"
          orientation="horizontal"
          className={cn("max-w-11! translate-y-0!")}
        />

        <Separator className={`bg-separator`} />

        <div className="input-non-oriented flex-col">
          <label className="input-label"> Client </label>
          <div className="flex gap-2 w-full h-full">
            <CustomBtn
              buttonLabel="New Client"
              leftIcon={assets.plusIconBlack}
              btncls="min-h-11! py-3 bg-transparent text-black-text border border-black-text hover:bg-transparent"
              onClick={() => toggleClientFormOpen((curr) => !curr)}
            />
            <div className="flex flex-col gap-2 w-full h-full">
              <CustomCombobox
                items={clientList ?? []}
                getItemLabel={(client) => client?.name ?? ""}
                onValueChange={(client) => {
                  setValue("clientId", (client?.id ?? 0).toString());
                  setClientSearchTerm(client?.name ?? "");
                  clearErrors("clientId");
                }}
                placeholder="Search or select a client"
                emptyMessage="Consider adding this client"
                className={cn(
                  `min-h-11 ${errors.clientId ? `input-error` : ``}`,
                )}
                inptFieldValue={clientSearchTerm}
                inptFieldChange={(val) => setClientSearchTerm(val)}
                isFetching={isClientFetching}
                paginationMeta={clientListMeta}
                fetchNextPage={fetchNextClients}
                isFetchingNextPage={isFetchingNextClients}
              />
              {errors.clientId && (
                <span className="error-text"> {errors.clientId.message} </span>
              )}
            </div>
          </div>
        </div>

        <CustomInput
          control={control}
          name="jobDescription"
          fieldName="Job Description"
          inptType="textarea"
        />

        <CustomInput
          control={control}
          name="notes"
          fieldName="Notes (Not visible on quote)"
          inptType="textarea"
        />

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
                  if (
                    currQuote &&
                    index < (currQuote.attachments.length ?? 0)
                  ) {
                    handleAttachmentDelete(
                      currQuote.id,
                      currQuote.attachments[index].id,
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
            quoteCreateMutation.isPending || quoteUpdateMutation.isPending
          }
        />
      </div>

      <ClientForm
        isFormOpen={clientFormOpen}
        toggleFormOpen={toggleClientFormOpen}
        mode="creation"
        clientCreatFn={clientCreateAction}
        isSubmitting={clientCreatMutation.isPending}
      />
    </React.Fragment>
  );
}

export default QuoteSummaryForm;
