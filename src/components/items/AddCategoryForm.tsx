import { useForm } from "react-hook-form";
import { CustomSheet } from "../common/CustomSheet";
import { useAppDispatch } from "../../redux/store";
import { addCategory } from "../../redux/slices/categories.slice";
import { CustomInput } from "../common/CustomInput";
import { cn } from "../../lib/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { categorySchema } from "../../validation/itemCreation.payload.schema";

export type AddCategoryFormProps = {
  isOpen: boolean;
  toggleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function AddCategoryForm({ isOpen, toggleIsOpen }: AddCategoryFormProps) {
  const dispath = useAppDispatch();
  const { control, handleSubmit, reset, clearErrors } = useForm<{
    category: string;
  }>({
    defaultValues: {
      category: "",
    },
    resolver: yupResolver(categorySchema),
  });
  const submitHandler = (data: { category: string }) => {
    dispath(
      addCategory({
        id: data.category.toLocaleLowerCase(),
        name: data.category,
      }),
    );
    reset();
    toggleIsOpen(false);
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
