import {
  useForm,
  type FieldValues,
  type DefaultValues,
  type Resolver,
} from "react-hook-form";
import { CustomInput, type CustomInputProps } from "../common/customInput";
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
    <div className="relative flex justify-center z-10 -mt-8">
      <div className="flex flex-col items-start p-8 gap-8 isolate relative w-112.5 min-h-112.75 mx-auto mt-0 bg-white rounded-xl shadow-[0px_3px_12px_rgba(47,43,61,0.14)]">
        <div className="flex flex-col items-start p-0 gap-8 w-full max-w-96.5 min-h-96.75 self-stretch flex-none">
          <div className="flex flex-col items-center p-0 gap-2 w-full max-w-96.5 h-13.5 self-stretch flex-none">
            <span className="flex max-h-7.25 justify-center font-semibold text-2xl leading-[100%]">
              {" "}
              {title}{" "}
            </span>
            <span className="flex justify-center max-h-4.25 text-wrap font-normal text-[14px] leading-none tracking-normal text-[#89909D]">
              {" "}
              {description}{" "}
            </span>
          </div>
          <div className="flex flex-col items-center p-0 gap-5 w-full max-w-96.5 min-h-75.25 self-stretch flex-none">
            <form onSubmit={handleSubmit(onsubmit)}>
              <div className="flex flex-col items-center gap-5 w-96.5 flex-none order-1 self-stretch grow-0">
                {fields.map((field) => (
                  <CustomInput key={field.name} {...field} control={control} />
                ))}

                {/** form submit button */}
                <button
                  type="submit"
                  className="flex flex-row justify-center items-center p-3 gap-3 w-96.5 h-11 bg-brand-dark rounded-[7px] flex-none order-2 self-stretch grow-0"
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
