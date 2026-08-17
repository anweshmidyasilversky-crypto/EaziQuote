import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ImageInput } from "../../components/auth/imageInput";
import { assets } from "../../assets/icons";
import { useForm, useWatch } from "react-hook-form";
import { type BusinessProfilePayload } from "../../types/businessProfile.payload.type";
import { yupResolver } from "@hookform/resolvers/yup";
import { BusinessProfilePayloadSchema } from "../../validation/businessProfile.schema";
import {
  CustomInput,
  type SelectOptions,
} from "../../components/common/customInput";
import { CircleAlertIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { BrandColorPreview } from "../../components/auth/brandColor.preview";

export function BusinessProfileForm() {
  const [logo, setLogo] = useState<File | undefined>(undefined);
  const { control, handleSubmit } = useForm<BusinessProfilePayload>({
    defaultValues: {
      brandColor: "#00AAFF",
      businessName: "",
      businessPhoneNo: "",
      trade: "",
      vatRegistered: false,
      vatNumber: "",
    },
    resolver: yupResolver(BusinessProfilePayloadSchema),
  });

  const submitHandler = async (data: BusinessProfilePayload) => {
    console.log(data);
  };

  const [chosenColor, isVatRegistered] = useWatch({
    control,
    name: ["brandColor", "vatRegistered"],
  });

  const tradeSelectOptions: SelectOptions = [
    { value: "", label: "Select an option" },
    { value: "bricklaying_masonry", label: "Bricklaying & Masonry" },
    { value: "carpentry_joinery", label: "Carpentry & Joinery" },
    { value: "general_contracting", label: "General Contracting" },
    { value: "painting_decorating", label: "Painting & Decorating" },
    { value: "plastering_rendering", label: "Plastering & Rendering" },
    { value: "roofing", label: "Roofing" },
    { value: "tiling", label: "Tiling & Flooring" },
  ];

  const [isPopoverOpen, toggleIsPopoverOpen] = useState(false);
  return (
    <>
      <div className="relative w-full flex justify-center -mt-4 z-10">
        <Card className="w-full max-w-112.5 p-8 auth-card ring-0">
          <CardHeader className="w-full flex flex-col gap-8 items-center ">
            <CardTitle>Business Profile Setup</CardTitle>

            <div className="flex flex-col gap-5">
              <ImageInput
                imgFile={logo}
                setImgFile={setLogo}
                alt={assets.cameraIcon}
                altClass="object-center h-10 w-10"
                altText="logo placeHolder"
                alignAltImg="center"
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
                  chosenColor={chosenColor}
                />
              </PopoverContent>
            </Popover>
          </CardHeader>

          <CardContent className="dashed-y-separators">
            <div className="my-5 flex flex-col gap-5">
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
                inptType="text"
              />

              <CustomInput
                control={control}
                name="trade"
                fieldName="What trade do you do?"
                inptType="select"
                selectOptions={tradeSelectOptions}
              />
            </div>
          </CardContent>

          <CardFooter className="ring-0 border-none m-0 pt-0">
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

              <button
                className="btn-auth"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(submitHandler)();
                }}
              >
                Continue
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
