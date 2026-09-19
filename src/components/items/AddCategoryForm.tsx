import { useForm } from "react-hook-form";
import { CustomSheet } from "../common/CustomSheet";
import { CustomInput } from "../common/customInput";
import { cn } from "../../lib/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { categorySchema } from "../../validation/itemCreation.payload.schema";

export type AddCategoryFormProps = {
  isOpen: boolean;
  toggleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createFn?: (name: string) => void;
  isSubmitting?: boolean;
};

function AddCategoryForm({
  isOpen,
  toggleIsOpen,
  createFn,
  isSubmitting,
}: AddCategoryFormProps) {
  const { control, handleSubmit, clearErrors, reset } = useForm<{
    category: string;
  }>({
    defaultValues: {
      category: "",
    },
    resolver: yupResolver(categorySchema),
  });

  const submitHandler = async (data: { category: string }) => {
    createFn?.(data.category);
  };
  return (
    <CustomSheet
      isOpen={isOpen}
      toggleIsOpen={toggleIsOpen}
      submitFn={handleSubmit(submitHandler)}
      applyBtnCls={cn(`max-w-full!`)}
      applyBtnLabel="save Category"
      closeOnApply={false}
      closeAction={() => {
        clearErrors();
        reset();
      }}
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
