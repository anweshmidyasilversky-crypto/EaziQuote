import { useForm } from "react-hook-form";
import CustomDialog from "./CustomDialog";
import type { SupportTicketCreatePayload } from "@/types/api.requests.type";
import { yupResolver } from "@hookform/resolvers/yup";
import { supportTicketCreateSchema } from "@/validation/supportTicket.create.payload.schema";
import useSupportMutation from "@/hooks/apis/support/useSupportMutation";
import { useState } from "react";
import { toast } from "react-toastify";
import { showErrorToast } from "@/api/axiosInstance";
import { CustomCombobox } from "./CustomCombobox";
import { useAppSelector } from "@/redux/store";
import { cn } from "@/lib/utils";
import { CustomInput } from "./CustomInput";

export type ContactSupportBoxProps = {
  isOpen: boolean;
  toggleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
function ContactSupportBox({ isOpen, toggleIsOpen }: ContactSupportBoxProps) {
  const { ticketCreateMutation } = useSupportMutation();
  const config = useAppSelector((state) => state.appConfig);

  const [ticketAreaSearchTerm, setTicketAreaSearchTerm] = useState("");
  const {
    control,
    reset,
    clearErrors,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<SupportTicketCreatePayload>({
    defaultValues: {
      support_ticket_area_id: undefined,
      description: undefined,
      other_area: undefined,
    },
    resolver: yupResolver(supportTicketCreateSchema),
  });
  const handleTicketCreation = (payload: SupportTicketCreatePayload) => {
    ticketCreateMutation.mutate(payload, {
      onSuccess: (response) => {
        toast.success(response.message);
        toggleIsOpen(false);
        reset();
        setTicketAreaSearchTerm("");
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };
  return (
    <CustomDialog
      dialogOpen={isOpen}
      toggleDialogOpen={toggleIsOpen}
      header="Support"
      withFooter={true}
      showFooterSeparator={false}
      footerBtnLabel="Submit"
      footerBtnAction={handleSubmit(handleTicketCreation)}
      closeOnSubmit={false}
      isSubmitting={ticketCreateMutation.isPending}
      closeAction={() => {
        reset();
        toggleIsOpen(false);
        setTicketAreaSearchTerm("");
      }}
    >
      <div className="min-w-125 flex flex-col gap-6 px-5 py-6">
        <div className="input-non-oriented flex-col gap-2">
          <label className="input-label"> {"Area"} </label>
          <CustomCombobox
            items={config.support_ticket_areas}
            getItemLabel={(ticketConfig) => ticketConfig?.label}
            getItemId={(ticketConfig) => ticketConfig?.id}
            filterFn={(item, query) => {
              return Object.values(item).some((val) =>
                val
                  .toString()
                  .toLocaleLowerCase()
                  .includes(query.toString().toLocaleLowerCase()),
              );
            }}
            onValueChange={(item) => {
              if (item) {
                setTicketAreaSearchTerm(item.label);
                setValue("support_ticket_area_id", item.id);
                clearErrors("support_ticket_area_id");
              }
            }}
            inptFieldValue={ticketAreaSearchTerm}
            inptFieldChange={setTicketAreaSearchTerm}
            className={cn(
              `input-field ${errors.support_ticket_area_id ? `input-error!` : ``}`,
            )}
            placeholder="Select Support area"
          />
          {errors.support_ticket_area_id && (
            <p className="error-text">
              {" "}
              {errors.support_ticket_area_id.message}{" "}
            </p>
          )}
        </div>

        <CustomInput
          control={control}
          name="other_area"
          fieldName="Be Specific"
          placeholder="Enter email"
        />

        <CustomInput
          control={control}
          name="description"
          fieldName="Description"
          inptType="textarea"
          placeholder="Enter support description"
        />
      </div>
    </CustomDialog>
  );
}

export default ContactSupportBox;
