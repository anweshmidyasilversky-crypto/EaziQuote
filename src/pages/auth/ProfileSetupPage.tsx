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
import { toast } from "react-toastify";
import { assets } from "../../assets/icons";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { updateUser } from "../../redux/slices/user.slice";
import { profileSetup } from "@/api/user.api";
import { isAxiosError } from "axios";
import { useState } from "react";
import { CustomBtn } from "@/components/common/CustomBtn";

export function ProfileSetupPage() {
  const dispath = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const [isSubmitting, toggleIsSubmitting] = useState(false);
  const { control, handleSubmit } = useForm<UserProfilePayload>({
    defaultValues: {
      name: user.name ?? "",
      phoneNo: user.phone ?? "",
    },
    resolver: yupResolver(userProfileSchema),
  });
  const submitHandler = async (data: UserProfilePayload) => {
    toggleIsSubmitting(true);
    try {
      const apiRes = await profileSetup({
        _method: "put",
        name: data.name,
        phone: `+44${data.phoneNo}`,
        avatar: data.profilePic ?? null,
      });
      dispath(updateUser(apiRes.payload));
      toast.success("User profile is set up");
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
  return (
    <div className="auth-card-offset">
      <Card className="auth-card ring-0">
        <CardHeader className="w-full flex flex-col gap-8 items-center">
          <CardTitle className="w-full font-semibold text-2xl flex justify-center">
            Profile Setup
          </CardTitle>
          <div className="flex items-end">
            <CustomInput
              inptType="image"
              control={control}
              name="profilePic"
              fieldName="Profile pic"
              withLabel={false}
              imgAlt={user.avatar ?? assets.userIcon}
              imgAltAlign="end"
              imgAltCls={
                user.avatar
                  ? "object-cover object-center h-full w-full"
                  : undefined
              }
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

            <CustomBtn
              buttonLabel="Continue"
              onClick={handleSubmit(submitHandler)}
              isSubmitting={isSubmitting}
              className="w-full"
              btncls="min-h-11"
            />
          </form>
        </CardContent>

        <CardFooter className="border-t-0 bg-transparent"></CardFooter>
      </Card>
    </div>
  );
}
