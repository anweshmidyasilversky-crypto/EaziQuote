import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useForm } from "react-hook-form";
import { CustomInput } from "../../components/common/customInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { userProfileSchema } from "../../validation/userProfile.payload.schema";
import type { UserProfilePayload } from "../../types/userProfile.payload.type";
import { useState } from "react";
import { toast } from "react-toastify";
import { ImageInput } from "../../components/auth/imageInput";
import { assets } from "../../assets/icons";

export function ProfileSetupPage() {
  const { control, handleSubmit } = useForm<UserProfilePayload>({
    defaultValues: {
      name: "",
      phoneNo: "",
    },
    resolver: yupResolver(userProfileSchema),
  });
  const [imgFile, setImgFile] = useState<File | undefined>(undefined);
  const submitHandler = (data: UserProfilePayload) => {
    if (!imgFile) {
      toast("Please select a profile image", { type: "error" });
    } else {
      Object.assign(data, { img: imgFile });
    }
  };
  return (
    <div className="relative flex justify-center z-10 -mt-13">
      <div className="flex justify-center p-8 g-8 ">
        <Card className="max-w-112.5 ring-0 outline-none bg-white rounded-xl shadow-[0px_3px_12px_rgba(47,43,61,0.14)]">
          <CardHeader className="flex justify-center">
            <div className="flex flex-col gap-8">
              <CardTitle className="w-auto font-semibold text-2xl">
                Profile Setup
              </CardTitle>
              <ImageInput
                imgFile={imgFile}
                setImgFile={setImgFile}
                alt={assets.userIcon}
              />
            </div>
          </CardHeader>

          <CardContent className="mt-5">
            <form
              className="flex flex-col gap-5"
              onSubmit={handleSubmit(submitHandler)}
            >
              <CustomInput
                control={control}
                name="name"
                fieldName="Name"
                placeholder="Enter your name"
              />

              <CustomInput
                control={control}
                name="phoneNo"
                fieldName="Phone"
                placeholder="Enter phone number"
              />

              <button type="submit" className="btn-auth">
                Continue
              </button>
            </form>
          </CardContent>

          <CardFooter className="border-t-0 bg-transparent"></CardFooter>
        </Card>
      </div>
    </div>
  );
}
