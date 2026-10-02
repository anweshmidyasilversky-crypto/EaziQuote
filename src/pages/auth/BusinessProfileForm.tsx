import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { assets } from "../../assets/icons";
import { useForm, useWatch } from "react-hook-form";
import { type BusinessProfilePayload } from "../../types/businessProfile.payload.type";
import { yupResolver } from "@hookform/resolvers/yup";
import { BusinessProfilePayloadSchema } from "../../validation/businessProfile.schema";
import {
  CustomInput,
  type SelectOptions,
} from "../../components/common/CustomInput";
import { CircleAlertIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { BrandColorPreview } from "../../components/auth/brandColor.preview";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { updateUser } from "../../redux/slices/user.slice";
import { toast } from "react-toastify";
import { businessProfileSetup } from "@/api/services/user.api";
import { isAxiosError } from "axios";
import { CustomBtn } from "@/components/common/CustomBtn";
import { useMutation } from "@tanstack/react-query";
import { CustomCombobox } from "@/components/common/CustomCombobox";
import { cn } from "@/lib/utils";

export function BusinessProfileForm() {
  const appConfig = useAppSelector((state) => state.appConfig);
  const dispath = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const [isSubmitting, toggleIsSubmitting] = useState(false);
  const [tradeSearchTerm, setTradeSearchTerm] = useState("");

  const { mutateAsync: createBusinessProfile } = useMutation({
    mutationKey: ["companyProfile"],
    mutationFn: (data: FormData) => businessProfileSetup(data),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
    setValue,
    unregister,
    clearErrors,
  } = useForm<BusinessProfilePayload>({
    defaultValues: {
      brandColor: "#00AAFF",
      businessName: user.company?.name ?? "",
      businessPhoneNo: user.company?.phone_number ?? "",
      trade: "",
      vatRegistered: user.company?.vat_number ? true : false,
      vatNumber: user.company?.vat_number ?? "",
    },
    resolver: yupResolver(BusinessProfilePayloadSchema),
  });

  const submitHandler = async (data: BusinessProfilePayload) => {
    toggleIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.businessName);
      formData.append("phone", `+44${data.businessPhoneNo}`);
      formData.append("address", "dummyAddress");
      formData.append("vertical_market_id", data.trade);
      if (data.vatNumber) {
        formData.append("vat_number", data.vatNumber);
      }
      if (data.brandLogo) {
        formData.append(
          "logo",
          new Blob([data.brandLogo], { type: data.brandLogo.type }),
        );
      }
      const businessProfile = await createBusinessProfile(formData);
      dispath(
        updateUser({
          is_company_profile_setup: true,
          ...businessProfile.payload,
        }),
      );
      toast.success("Business profile complete");
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data.message);
      } else {
        toast.error((err as Error).message);
      }
    } finally {
      toggleIsSubmitting(false);
    }
  };

  const [chosenColor, isVatRegistered] = useWatch({
    control,
    name: ["brandColor", "vatRegistered"],
  });

  const tradeSelectOptions: SelectOptions = appConfig.vertical_markets.map(
    (option) => ({
      value: option.id.toString(),
      label: option.title,
      icon: option.icon,
    }),
  );

  const [isPopoverOpen, toggleIsPopoverOpen] = useState(false);
  return (
    <>
      <div className="auth-card-offset">
        <Card className="auth-card ring-0">
          <CardHeader className="w-full flex flex-col gap-8 items-center ">
            <CardTitle>Business Profile Setup</CardTitle>

            <div className="flex flex-col gap-5 ">
              <CustomInput
                control={control}
                name="brandLogo"
                fieldName="Brand Logo"
                withLabel={false}
                inptType="image"
                imgAlt={user.company?.logo ?? assets.cameraIcon}
                imgAltCls={cn(
                  `object-contain object-center ${user.company?.logo ? `` : `h-10! w-10!`}`,
                )}
                imgAltAlign="center"
              />

              <p className="text-[14px] font-normal text-center">
                {" "}
                Your logo will appear on quotes, invoices, and client
                emails.{" "}
              </p>
            </div>

            <Popover open={isPopoverOpen} onOpenChange={toggleIsPopoverOpen}>
              <PopoverTrigger>
                <></>
              </PopoverTrigger>
              <CustomInput
                control={control}
                name="brandColor"
                fieldName="Brand Color"
                inptType="color"
                FieldBadgeIcon={CircleAlertIcon}
                fieldBadgeAction={() => {
                  toggleIsPopoverOpen((curr) => !curr);
                  console.log("Opening popover");
                }}
              />
              <PopoverContent
                align="center"
                side="bottom"
                className={`w-full border-none shadow-none ring-0`}
              >
                <BrandColorPreview
                  closePreviewFunc={() => toggleIsPopoverOpen((curr) => !curr)}
                  chosenColor={chosenColor as string}
                />
              </PopoverContent>
            </Popover>
          </CardHeader>

          <CardContent className="w-full dashed-y-separators">
            <div className="w-full my-5 flex flex-col gap-5">
              <CustomInput
                control={control}
                name="businessName"
                fieldName="Business Name"
                inptType="text"
                placeholder="Enter business name"
              />

              <CustomInput
                control={control}
                name="businessPhoneNo"
                fieldName="Business Phone Number"
                placeholder="Enter phone number"
                inptType="phone"
              />

              <div className="input-non-oriented flex-col gap-2">
                <label className="input-label">
                  {" "}
                  {"What trade do you do?"}{" "}
                </label>
                <CustomCombobox
                  items={tradeSelectOptions}
                  getItemRender={(tradeConfig) => (
                    <div className="flex gap-2">
                      <img src={tradeConfig.icon} className="w-5 aspect-auto" />
                      <span> {tradeConfig.label} </span>
                    </div>
                  )}
                  getItemId={(tradeConfig) => tradeConfig?.value}
                  getItemLabel={(tradeConfig) => tradeConfig?.label}
                  inptFieldValue={tradeSearchTerm}
                  inptFieldChange={(query) => {
                    if (dirtyFields.trade) {
                      unregister("trade");
                    }
                    setTradeSearchTerm(query);
                  }}
                  onValueChange={(tradeConfig) => {
                    if (tradeConfig) {
                      setTradeSearchTerm(tradeConfig.label);
                      setValue("trade", tradeConfig.value);
                      clearErrors("trade");
                    } else {
                      setTradeSearchTerm("");
                      unregister("trade");
                    }
                  }}
                  filterFn={(tradeConfig, query) => {
                    const { icon, ...rest } = tradeConfig;
                    return Object.values(rest).some((val) =>
                      val
                        .toLocaleLowerCase()
                        .includes(query.toLocaleLowerCase()),
                    );
                  }}
                  className={cn(
                    `${errors.trade ? `input-error!` : `input-field`}`,
                  )}
                  placeholder="Search or select your trade"
                />
                {errors.trade && (
                  <p className="error-text"> {errors.trade.message} </p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="w-full ring-0 border-none m-0 pt-0 bg-transparent">
            <div className="w-full flex flex-col gap-5">
              <div className="flex items-center gap-3 h-5.5">
                <label
                  className="font-sans h-full font-normal text-[16px] cursor-pointer"
                  htmlFor="vat"
                >
                  Are you VAT registered?
                </label>
                <div className="max-w-11 h-5.5">
                  <CustomInput
                    control={control}
                    name="vatRegistered"
                    fieldName="VAT Registered"
                    inptType="switch"
                    withLabel={false}
                  />
                </div>
              </div>

              {isVatRegistered && (
                <CustomInput
                  control={control}
                  name="vatNumber"
                  fieldName="VAT Number"
                  inptType="text"
                  placeholder="Enter VAT Number"
                  disabled={!isVatRegistered}
                />
              )}

              <CustomBtn
                className="w-full"
                onClick={() => {
                  handleSubmit(submitHandler)();
                }}
                buttonLabel="Continue"
                isSubmitting={isSubmitting}
              />
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
