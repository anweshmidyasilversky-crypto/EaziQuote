import * as yup from "yup";
import type { ItemCreationPayload } from "../types/itemCreation.payload.type";
import { emptyMsg, notSelectedMsg } from "../constants/messages";
import type { SubcategoryPayload } from "../types/subCategory.payload.type";

export const itemCreationSchema: yup.ObjectSchema<ItemCreationPayload> =
  yup.object({
    catId: yup.string().trim().required(notSelectedMsg("Category")),
    subCatId: yup.string().trim().required(notSelectedMsg("Sub-Category")),
    name: yup.string().trim().required(emptyMsg("Item name")),
    unit: yup.string().trim().required(emptyMsg("unit")),
    pricePerUnit: yup
      .number()
      .required(emptyMsg("Price per unit"))
      .min(0, "Must be greater than 0"),
    unitPrice: yup
      .number()
      .required(emptyMsg("Price per unit"))
      .min(0, "Must be greater than 0"),
  });

export const categorySchema: yup.ObjectSchema<{ category: string }> =
  yup.object({
    category: yup.string().trim().required(emptyMsg("Category")),
  });

export const subCategorySchema: yup.ObjectSchema<SubcategoryPayload> =
  yup.object({
    catId: yup.string().trim().required(notSelectedMsg("Category")),
    subCategory: yup.string().trim().required(emptyMsg("sub-category")),
  });
