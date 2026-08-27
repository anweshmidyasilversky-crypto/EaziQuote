import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { quoteSummarySchema } from "../../validation/quote.summary.schema";
import { CustomInput } from "../common/CustomInput";
import { DateRangePicker, type DateRange } from "../common/DateRangePicket";
import { Separator } from "../ui/separator";
import { CustomBtn } from "../common/CustomBtn";
import { assets } from "../../assets/icons";
import { ClientForm } from "../clients/ClientForm";
import { type QuoteSummary } from "../../types/quoteCreation.payload.type";
import StyledAttachments from "../common/StyledAttachments";
import { CustomCombobox } from "../common/CustomCombobox";
import { mockClientData } from "../../constants/dummyData";
import { nanoid } from "@reduxjs/toolkit";

function QuoteSummaryForm() {
  const [clientFormOpen, toggleClientFormOpen] = useState(false);
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoteSummary>({
    defaultValues: {
      quoteTitle: "",
      referenceNumber: nanoid(),
      quoteDate: "",
      expiryDate: "",
      hidePhoneNumber: true,
      clientId: undefined,
      jobDescription: "",
    },
    resolver: yupResolver(quoteSummarySchema),
  });
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  });

  const attachments = watch().attachments;

  const deleteAttachment = (fileName: string) => {
    setValue(
      "attachments",
      attachments?.filter((attachment) => attachment.name !== fileName),
    );
  };

  const submitHandler = (data: QuoteSummary) => {
    console.log(data);
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

        <DateRangePicker
          dateRange={dateRange}
          setDateRange={setDateRange}
          startDateAlias="Quote Date"
          endDateAlias="Expiry Date"
        />

        <CustomInput
          control={control}
          name="hidePhoneNumber"
          fieldName="Hide your Phone Number"
          inptType="switch"
          orientation="horizontal"
          className="max-w-11!"
        />

        <Separator className={`bg-separator`} />

        <div className="input-non-oriented flex-col">
          <label className="input-label"> Client </label>
          <div className="flex gap-2 w-full h-full">
            <CustomBtn
              buttonLabel="New Client"
              leftIcon={assets.plusIconBlack}
              btncls="h-full! py-3 bg-transparent text-black-text border border-black-text hover:bg-transparent"
              onClick={() => toggleClientFormOpen((curr) => !curr)}
            />
            <div className="flex flex-col gap-2 w-full">
              <CustomCombobox
                items={mockClientData}
                getItemLabel={(clientCredential) => clientCredential.client}
                getItemValue={(clientCredential) => clientCredential.id}
                onValueChange={(clientCredential) => {
                  setValue("clientId", clientCredential as string);
                }}
                placeholder="Search or select a client"
                emptyMessage="Consider adding this client"
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
            {attachments.map((attachment) => (
              <StyledAttachments
                fileName={attachment.name}
                deleteAction={() => deleteAttachment(attachment.name)}
              />
            ))}
          </div>
        )}

        <CustomBtn
          buttonLabel="Save"
          onClick={handleSubmit(submitHandler)}
          type="submit"
        />
      </div>

      <ClientForm
        isFormOpen={clientFormOpen}
        toggleFormOpen={toggleClientFormOpen}
        mode="creation"
      />
    </React.Fragment>
  );
}

export default QuoteSummaryForm;
