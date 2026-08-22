import { useState } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { Switch } from "../ui/switch";
import { ImageInput } from "../auth/ImageInput";
import { assets } from "../../assets/icons";

export type SelectOptions = {
  value: string;
  label: string;
}[];

export type CustomInputProps<T extends FieldValues> = {
  control?: Control<T>;
  name?: Path<T>;
  fieldName: string;
  inptType?: string;
  placeholder?: string;
  className?: string;
  selectOptions?: SelectOptions;
  FieldBadgeIcon?: LucideIcon;
  fieldBadgeAction?: () => void;
  withLabel?: boolean;
  disabled?: boolean;
  imgAlt?: string;
  imgAltCls?: string;
  imgAltAlign?: "center" | "end";
  orientation?: "verticle" | "horizontal";
};

function formatLabel(fieldName: string) {
  return fieldName
    .replace(/(?<![A-Z])([A-Z][a-z])/g, " $1")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
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
  selectOptions,
  FieldBadgeIcon,
  fieldBadgeAction,
  imgAlt,
  imgAltCls,
  imgAltAlign,
  withLabel = true,
  disabled = false,
  orientation,
}: CustomInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = inptType === "password" || name === "password";
  const labelText = formatLabel(fieldName);

  const fieldStyle = `flex flex-row items-center p-3 gap-3 w-full max-w-96.5 h-11 bg-white border border-[#CED1DA] rounded-[7px] self-stretch flex-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60`;
  const errorStateStyle =
    "border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-2 focus:ring-rose-100";
  const validStateStyle =
    "border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <div
      className={`flex ${["verticle", undefined].includes(orientation) ? "flex-col" : ""} items-start p-0 gap-2 w-full min-h-17.25 self-stretch flex-none`}
    >
      {withLabel && (
        <label
          htmlFor={fieldName as string}
          className=" h-4.25 font-normal text-[14px] leading-4.25 text-black-text flex justify-center gap-1.5 items-center"
        >
          {labelText}{" "}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              fieldBadgeAction?.();
            }}
          >
            {FieldBadgeIcon && <FieldBadgeIcon className="h-3.5 w-3.5" />}
          </button>
        </label>
      )}
      <Controller
        name={name as Path<T>}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const fieldValue = value ?? "";

          return (
            <div className="w-full space-y-2">
              {inptType === "select" && (
                <select
                  disabled={disabled}
                  id={fieldName}
                  name={fieldName}
                  value={fieldValue}
                  onChange={(event) => onChange(event.target.value)}
                  className={`${className} ${fieldStyle} select-input-style ${error ? errorStateStyle : validStateStyle}  `}
                >
                  {selectOptions?.map((selectOption) => {
                    return (
                      <option
                        value={selectOption.value}
                        key={selectOption.value}
                      >
                        {" "}
                        {selectOption.label}{" "}
                      </option>
                    );
                  })}
                </select>
              )}{" "}
              {["password", "text"].includes(inptType) && (
                <div className="relative">
                  <input
                    type={
                      isPasswordField
                        ? showPassword
                          ? "text"
                          : "password"
                        : inptType
                    }
                    disabled={disabled}
                    id={fieldName}
                    name={fieldName}
                    placeholder={placeholder ?? "......"}
                    value={fieldValue}
                    onChange={onChange}
                    className={` ${fieldStyle} ${
                      error ? errorStateStyle : validStateStyle
                    } ${className}`}
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
              {inptType === "color" && (
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    disabled={disabled}
                    id={fieldName}
                    name={fieldName}
                    value={fieldValue}
                    onChange={onChange}
                    className={
                      className ??
                      `rounded-color-input ${
                        error ? errorStateStyle : validStateStyle
                      }`
                    }
                  />
                </div>
              )}
              {inptType === "switch" && (
                <Switch
                  disabled={disabled}
                  id={fieldName}
                  checked={Boolean(value)}
                  onCheckedChange={onChange}
                  className={className}
                />
              )}
              {inptType === "image" && (
                <ImageInput
                  imgFile={value}
                  setImgFile={onChange}
                  alt={imgAlt ?? assets.cameraIcon}
                  altClass={
                    imgAltCls ?? "object-contain h-21 w-21 object-bottom"
                  }
                  alignAltImg={imgAltAlign}
                />
              )}
              {error && (
                <p
                  className={`text-sm text-rose-600 ${inptType === "image" ? "flex justify-center" : ""} `}
                >
                  {error.message}
                </p>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
