import { useForm } from "react-hook-form";
import { CustomSheet } from "../common/CustomSheet";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { CustomInput } from "../common/customInput";
import { cn } from "../../lib/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { categorySchema } from "../../validation/itemCreation.payload.schema";
import { useMutation } from "@tanstack/react-query";
import { createCategory } from "@/api/services/categories.api";
import { showErrorToast } from "@/api/axiosInstance";
import { toast } from "react-toastify";
import { updateConfig } from "@/redux/slices/settings.slice";
import { useState } from "react";

export type AddCategoryFormProps = {
  isOpen: boolean;
  toggleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function AddCategoryForm({ isOpen, toggleIsOpen }: AddCategoryFormProps) {
  const dispath = useAppDispatch();
  const appConfig = useAppSelector((state) => state.appConfig);
  const [isSubmitting, toggleIsSubmitting] = useState(false);
  const { control, handleSubmit, reset, clearErrors } = useForm<{
    category: string;
  }>({
    defaultValues: {
      category: "",
    },
    resolver: yupResolver(categorySchema),
  });

  const { mutateAsync: createCategoryAsync } = useMutation({
    mutationFn: (name: string) => createCategory(name),
  });

  const submitHandler = async (data: { category: string }) => {
    toggleIsSubmitting(true);
    try {
      const newCategory = await createCategoryAsync(data.category);
      toast.success(newCategory.message);
      dispath(
        updateConfig({
          quote_categories: [
            ...(appConfig?.quote_categories ?? []),
            newCategory.payload,
          ],
        }),
      );
      reset();
      toggleIsOpen(false);
    } catch (error) {
      showErrorToast(error);
    } finally {
      toggleIsSubmitting(false);
    }
  };
  return (
    <CustomSheet
      isOpen={isOpen}
      toggleIsOpen={toggleIsOpen}
      submitFn={handleSubmit(submitHandler)}
      applyBtnCls={cn(`max-w-full!`)}
      applyBtnLabel="save Category"
      closeOnApply={false}
      closeAction={() => clearErrors()}
      header="Add Category"
      isSubmitting={isSubmitting}
    >
      <div className="p-5">
        <CustomInput
          control={control}
          name="category"
          fieldName="Category"
          placeholder="Category Name"
        />
      </div>
    </CustomSheet>
  );
}

export default AddCategoryForm;
