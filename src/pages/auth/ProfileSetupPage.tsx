import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useForm } from "react-hook-form";
import { CustomInput } from "../../components/common/CustomInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { userProfileSchema } from "../../validation/userProfile.payload.schema";
import type { UserProfilePayload } from "../../types/userProfile.payload.type";
import { toast } from "react-toastify";
import { assets } from "../../assets/icons";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { updateUser } from "../../redux/slices/user.slice";
import { useNavigate } from "react-router";
import type { UserType } from "../../types/user.type";

export function ProfileSetupPage() {
  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const { control, handleSubmit } = useForm<UserProfilePayload>({
    defaultValues: {
      name: user.name ?? "",
      phoneNo: user.phoneNumber ?? "",
    },
    resolver: yupResolver(userProfileSchema),
  });
  const submitHandler = (data: UserProfilePayload) => {
    const newUser: Partial<UserType> = {
      ...data,
      isUserProfileCreated: true,
      profileImgUrl: URL.createObjectURL(data.profilePic),
    };
    dispath(updateUser(newUser));
    toast.success("User profile is set up");
    navigate("/business-profile");
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
              imgAlt={user.profileImgUrl ?? assets.userIcon}
              imgAltAlign="end"
              imgAltCls={
                user.profileImgUrl
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
