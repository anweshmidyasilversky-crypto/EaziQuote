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
import { useAppDispatch } from "../../redux/store";
import { updateUser } from "../../redux/slices/user.slice";
import { useNavigate } from "react-router";
import type { UserType } from "../../types/user.type";

export function ProfileSetupPage() {
  const { control, handleSubmit } = useForm<UserProfilePayload>({
    defaultValues: {
      name: "",
      phoneNo: "",
    },
    resolver: yupResolver(userProfileSchema),
  });
  const [imgFile, setImgFile] = useState<File | undefined>(undefined);
  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const submitHandler = (data: UserProfilePayload) => {
    if (!imgFile) {
      toast.error("Please select a profile image");
    } else {
      const newUser: Partial<UserType> = {
        ...data,
        isUserProfileCreated: true,
      };
      dispath(updateUser(newUser));
      toast.success("User profile is set up");
      navigate("/business-profile");
    }
  };
  return (
    <div className="auth-card-offset">
      <Card className="auth-card ring-0">
        <CardHeader className="w-full flex flex-col gap-8 items-center">
          <CardTitle className="w-full font-semibold text-2xl flex justify-center">
            Profile Setup
          </CardTitle>
          <div className="flex items-end">
            <ImageInput
              imgFile={imgFile}
              setImgFile={setImgFile}
              alt={assets.userIcon}
              alignAltImg="end"
            />
          </div>
        </CardHeader>

        <CardContent className="w-full mt-5">
          <form
            className="w-full flex flex-col gap-5"
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
  );
}
