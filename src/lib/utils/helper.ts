import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (fullName: string) => {
  if (!fullName) {
    return "user";
  }
  const [fname, lname] = fullName.split(" ");
  return fname[0].toUpperCase() + (lname ? lname[0].toUpperCase() : "");
};

export const formatCurrency = (value: number | string) => {
  // If it's already a string, strip any existing '£' and prepend a single '£'
  if (typeof value === "string") {
    const cleanString = value.replace(/£/g, "").trim();
    return `£${cleanString}`;
  }

  // Fallback for raw numeric values
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
};

export function ObjToFormData<T extends Object>(data: T) {
  const formData = new FormData();
  Object.keys(data).forEach((objKey) => {
    const key = objKey as keyof T;
    if (data[key] instanceof File) {
      formData.append(
        key as string,
        new Blob([data[key]], { type: data[key].type }),
      );
    } else if (Array.isArray(data[key])) {
      data[key].forEach((val) => {
        formData.append(`${String(key)}[]`, val);
      });
    } else if (objKey === "deposit_required") {
      formData.append("deposit_required", data[key] ? "1" : "0");
    } else {
      if (["phone", "phone_number"].includes(objKey)) {
        formData.append(key as string, data[key] ? `+44${data[key]}` : "");
      } else {
        formData.append(key as string, (data[key] ?? "") as string);
      }
    }
  });
  console.log([...formData.entries()]);
  return formData;
}

export const saveToDevice = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
