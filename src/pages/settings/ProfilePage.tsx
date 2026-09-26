import { assets } from "@/assets/icons";
import { ImageInput } from "@/components/auth/imageInput";
import { HeaderBreadCrumb } from "@/components/common/CustomBreadCrumb";
import { CustomBtn } from "@/components/common/CustomBtn";
import { CustomInput } from "@/components/common/CustomInput";
import {
  CustomToggleGroup,
  type CustomToggleGroupProps,
} from "@/components/common/CustomToggleGroup";
import { cn } from "@/lib/utils";
import { updateUser } from "@/redux/slices/user.slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import type { UserProfilePayload } from "@/types/userProfile.payload.type";
import { userProfileSchema } from "@/validation/userProfile.payload.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import BusinessInfoPage from "./BusinessInfoPage";
import useUserMutations from "@/hooks/apis/user/useUserMutations";
import useUserDetails from "@/hooks/apis/user/useUserDetails";
import { Spinner } from "@/components/ui/spinner";

enum toggle {
  personal = "personal",
  business = "business",
}

function ProfilePage() {
  const { userDetails, isFetching } = useUserDetails();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.user);
  const [activeId, toggleActiveId] = useState<string>(toggle.personal);
  const [userImg, setUserImg] = useState<File | undefined>(undefined);
  const profilePicUrl = useRef<string>(user.avatar ?? assets.userImg);
  const [isSubmitting, toggleIsSubmitting] = useState(false);

  const { profileSetupMutation } = useUserMutations();

  const { control, handleSubmit } = useForm<UserProfilePayload>({
    defaultValues: {
      name: user.name,
      phoneNo: user.phone,
    },
    resolver: yupResolver(userProfileSchema),
  });

  const toggleBtnConfig: CustomToggleGroupProps["toggleConfig"] = [
    {
      btnLabel: "Personal Details",
      btnId: toggle.personal,
    },
    {
      btnLabel: "Business Info",
      btnId: toggle.business,
    },
  ];

  const submitHandler = async (data: UserProfilePayload) => {
    toggleIsSubmitting(true);
    profileSetupMutation.mutateAsync({
      ...data,
      profilePic: userImg,
    });
  };

  useEffect(() => {
    if (userDetails) {
      dispatch(
        updateUser({
          ...userDetails,
          phone: userDetails.phone.slice(5).replaceAll(" ", ""),
        }),
      );
    }
  }, [userDetails]);

  return (
    <>
      {isFetching ? (
        <div className="w-full h-full flex items-center justify-center">
          {" "}
          <Spinner className="text-brand-dark w-1/10 h-1/10" />{" "}
        </div>
      ) : (
        <>
          <HeaderBreadCrumb pageName="profile" />

          <div className="flex flex-col gap-8 p-6 overflow-hidden">
            <div className="pl-1 bg-white rounded-[10px] [&_.btnActive]:border-b-brand-dark [&_.btnActive]:text-brand-dark py-2 [&_.btnActive]:border-b">
              <CustomToggleGroup
                toggleActive={toggleActiveId}
                activeId={activeId}
                toggleConfig={toggleBtnConfig}
                btnCls={cn(
                  `bg-transparent btn-auth text-left text-black-text hover:bg-transparent`,
                )}
                containerCls={cn(`border-b-separator!`)}
              />

              {/* Profile form */}
              {activeId === toggle.personal && (
                <div className="flex flex-col gap-8 p-5">
                  <div className="flex items-start">
                    <ImageInput
                      imgUrl={profilePicUrl.current}
                      setImgFile={(img) => {
                        profilePicUrl.current = URL.createObjectURL(img);
                        setUserImg(img);
                      }}
                      alt={assets.userImg}
                      altClass={cn(`object-contain`)}
                      withEditIcon
                      iconBadgeCls={cn(`h-9 w-9`)}
                    />
                  </div>

                  <CustomInput
                    control={control}
                    name="name"
                    fieldName="Name"
                    inptType="text"
                  />

                  <div className="flex items-center gap-5">
                    <div className="flex flex-col gap-2 items-start w-full">
                      <label className="input-label" htmlFor="email">
                        {" "}
                        {"Email"}{" "}
                      </label>
                      <input
                        className="input-field"
                        readOnly
                        disabled
                        id="email"
                        value={user.email}
                      />
                    </div>

                    <CustomInput
                      control={control}
                      name="phoneNo"
                      fieldName="Phone"
                      inptType="phone"
                      placeholder={`Please enter phone number`}
                    />
                  </div>

                  <CustomBtn
                    buttonLabel="Update Profile"
                    onClick={handleSubmit(submitHandler)}
                    isSubmitting={isSubmitting}
                  />
                </div>
              )}

              {/* Business profile form */}
              {activeId === toggle.business && <BusinessInfoPage />}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProfilePage;
