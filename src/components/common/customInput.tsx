import { useState } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

export type CustomInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  fieldName: string;
  inptType?: string;
  placeholder?: string;
  className?: string;
};

function formatLabel(fieldName: string) {
  return fieldName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

export function CustomInput<T extends FieldValues>({
  control,
  name,
  fieldName,
  inptType = "text",
  placeholder,
  className,
}: CustomInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = inptType === "password" || name === "password";
  const isGenderField = name === "gender";
  const labelText = formatLabel(fieldName);

  return (
    <div className="flex flex-col items-start p-0 gap-2 w-full max-w-96.5 min-h-17.25 self-stretch flex-none">
      <label
        htmlFor={fieldName as string}
        className=" h-4.25 font-normal text-[14px] leading-4.25 text-[#2D2D2D] flex-none"
      >
        {labelText}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const fieldValue = value ?? "";

          return (
            <div className="space-y-2">
              {isGenderField ? (
                <select
                  id={fieldName}
                  name={fieldName}
                  value={fieldValue}
                  onChange={(event) => onChange(event.target.value)}
                  className={
                    className ??
                    `flex flex-row items-center p-3 gap-3 w-full max-w-96.5 h-11 bg-white border border-[#CED1DA] rounded-xs self-stretch flex-none transition-all duration-200 ${
                      error
                        ? "border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                        : "border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    }`
                  }
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <div className="relative">
                  <input
                    type={
                      isPasswordField
                        ? showPassword
                          ? "text"
                          : "password"
                        : inptType
                    }
                    id={fieldName}
                    name={fieldName}
                    placeholder={placeholder ?? "......"}
                    value={fieldValue}
                    onChange={onChange}
                    className={
                      className ??
                      `flex flex-row items-center p-3 gap-3 w-50 md:w-96.5 h-11 bg-white border border-[#CED1DA] rounded-[7px] self-stretch flex-none transition-all duration-200 ${
                        error
                          ? "border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                          : "border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      }`
                    }
                  />
                  {isPasswordField ? (
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                    >
                      {showPassword ? (
                        <EyeOff color="gray" />
                      ) : (
                        <Eye color="gray" />
                      )}
                    </button>
                  ) : null}
                </div>
              )}

              {error && (
                <p className="text-sm text-rose-600">{error.message}</p>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
