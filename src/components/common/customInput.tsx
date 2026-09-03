import { useState } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { Switch } from "../ui/switch";
import { ImageInput } from "../auth/imageInput";
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
  leftNode?: React.ReactNode;
  textInputFormatter?: (val: string) => string;
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
  leftNode,
  textInputFormatter,
}: CustomInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = inptType === "password" || name === "password";
  const labelText = formatLabel(fieldName);

  return (
    <div
      className={`input-non-oriented ${["verticle", undefined].includes(orientation) ? "flex-col" : "text-nowrap items-center! justify-center!"}`}
    >
      {withLabel && (
        <label htmlFor={fieldName as string} className="input-label">
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
      <div className="w-full flex gap-2">
        {leftNode}
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
                    className={`${className} input-field select-input-style ${error ? `input-error` : `input-valid`}  `}
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
                {["password", "text", "number"].includes(inptType) && (
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
                      onChange={(event) => {
                        if (textInputFormatter) {
                          onChange(textInputFormatter(event.target.value));
                        } else {
                          onChange(event.target.value);
                        }
                      }}
                      className={` input-field ${
                        error ? `input-error` : `input-valid`
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
                          error ? `input-error` : `input-valid`
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
                    className={`${className}`}
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
                {inptType === "textarea" && (
                  <textarea
                    value={fieldValue}
                    onChange={onChange}
                    className={`input-field min-h-20.25 md:min-w-105 overflow-y-auto ${className} ${error ? `input-error` : ``}`}
                    placeholder={placeholder}
                  />
                )}
                {inptType === "file" && (
                  <>
                    <label
                      htmlFor={fieldName}
                      className={`flex h-11 w-full cursor-pointer items-center overflow-hidden rounded-[7px] border border-input-field-border bg-white text-sm ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
                    >
                      <span className="flex h-full items-center border-r border-input-field-border bg-table-head px-3 text-black-text">
                        Choose File
                      </span>

                      <span className="px-3 text-muted">
                        {Array.isArray(value) && value.length > 0
                          ? `${value.length} ${
                              value.length === 1 ? "file" : "files"
                            } chosen`
                          : "No file chosen"}
                      </span>
                    </label>

                    <input
                      type="file"
                      id={fieldName}
                      name={fieldName}
                      disabled={disabled}
                      multiple
                      className="hidden"
                      onChange={(event) => {
                        const fileList = event.target.files;
                        const prev = (value ? [...value] : []) as File[];
                        let files = Array.from(fileList ?? []);
                        // Filter already added files
                        const uniqueFiles = files.filter((file) =>
                          prev.every((prevFile) => prevFile.name !== file.name),
                        );
                        onChange(prev.concat(uniqueFiles));
                      }}
                    />
                  </>
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
    </div>
  );
}
