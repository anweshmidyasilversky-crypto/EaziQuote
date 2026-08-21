import {
  useForm,
  type FieldValues,
  type DefaultValues,
  type Resolver,
} from "react-hook-form";
import { CustomInput, type CustomInputProps } from "../common/CustomInput";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

export type PasswordFormProps<T extends FieldValues> = {
  title: string;
  description: string;
  fields: Omit<CustomInputProps<T>, "control">[];
  submitHandler: (data: T) => void;
  defaultValues: DefaultValues<T>;
  buttonLabel?: string;
  resolver: Resolver<T, any, T>;
};

export function CustomForm<T extends FieldValues>({
  title,
  description,
  fields,
  submitHandler,
  defaultValues,
  resolver,
  buttonLabel = "Update Password",
}: PasswordFormProps<T>) {
  const { control, handleSubmit } = useForm<T>({ defaultValues, resolver });
  const [isSubmitting, toggleIsSubmitting] = useState(false);

  const onsubmit = async (data: T) => {
    toggleIsSubmitting(true);
    try {
      submitHandler(data);
    } catch (err) {
      throw err;
    } finally {
      toggleIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card-offset">
      <div className="auth-card">
        <div className="flex flex-col items-start p-0 gap-8 w-full max-w-96.5 min-h-96.75 self-stretch flex-none">
          <div className="flex flex-col items-center p-0 gap-5 w-full max-w-96.5 h-13.5 self-stretch flex-none">
            <span className="flex max-h-7.25 justify-center font-semibold text-2xl leading-[100%]">
              {" "}
              {title}{" "}
            </span>
            <span className="flex justify-center text-center max-h-4.25 text-wrap font-normal text-[14px] leading-none tracking-normal text-[#89909D]">
              {" "}
              {description}{" "}
            </span>
          </div>
          <div className="flex flex-col items-center p-0 gap-5 md:w-full md:max-w-96.5 min-h-75.25 self-stretch flex-none">
            <form onSubmit={handleSubmit(onsubmit)} className="w-full">
              <div className="flex flex-col items-center gap-5 md:w-96.5 flex-none order-1 self-stretch grow-0">
                {fields.map((field) => (
                  <CustomInput key={field.name} {...field} control={control} />
                ))}

                {/** form submit button */}
                <button
                  type="submit"
                  className="btn-auth"
                  disabled={isSubmitting}
                >
                  <span className="w-31.25 h-4.75 font-medium text-[16px] leading-4.75 text-white flex-none order-0 grow-0">
                    {isSubmitting ? <Spinner /> : buttonLabel}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
