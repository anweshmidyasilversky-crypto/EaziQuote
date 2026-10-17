import { formatCurrency } from "@/lib/utils";
import {
  DocumentCategories,
  type ItemDetails,
} from "@/types/api.responses.type";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { CustomDataTable } from "../common/CustomTable";
import { useAppSelector } from "@/redux/store";
import { useEffect } from "react";

export type ItemTableByDocumentCategoryProps = {
  items: ItemDetails[];
  categorizationMethod: keyof typeof DocumentCategories;
};

interface ByItems {
  item: string;
  unit: string;
  qty: number;
  unitPrice: number;
  total: number;
}
interface ByCategory {
  category: string;
  items: number; /* total product count, grouped by category */
  total: number; /* total price grouped by category */
}
interface BySubcategory {
  subcategory: string;
  items: number; /* total Product count, grouped by sub category */
  total: number; /* total price grouped by subcategory */
}
interface ByAllItem {
  subcategory: string;
  item: string;
  unit: string;
  qty: number;
  unitPrice: number;
  total: number;
}

interface ByAll {
  [category: string]: ByAllItem[];
}

function ItemTableByDocumentCategory({
  items,
  categorizationMethod,
}: ItemTableByDocumentCategoryProps) {
  const {
    company: { brand_color },
  } = useAppSelector((state) => state.user);
  const columnHeader = (label: string) => (
    <span style={{ color: brand_color }}>{label}</span>
  );
  const byItemsColumns: ColumnDef<TableFeatures, ByItems>[] = [
    {
      accessorKey: "item",
      header: () => columnHeader("ITEM"),
      enableSorting: false,
    },
    {
      accessorKey: "unit",
      header: () => columnHeader("UNIT"),
      enableSorting: false,
    },
    {
      accessorKey: "qty",
      header: () => columnHeader("QUANTITY"),
      enableSorting: false,
    },
    {
      accessorKey: "unitPrice",
      header: () => columnHeader("PRICE/UNIT"),
      cell: (info) => formatCurrency(info.getValue<number>()),
      enableSorting: false,
    },
    {
      accessorKey: "total",
      header: () => columnHeader("TOTAL"),
      cell: (info) => formatCurrency(info.getValue<number>()),
      enableSorting: false,
    },
  ];
  const byItemsData: ByItems[] = items.map((item) => ({
    item: item.name,
    unit: item.unit,
    qty: item.quantity,
    unitPrice: item.price,
    total: item.total_price,
  }));

  // 2. By Category
  const byCategoryColumns: ColumnDef<TableFeatures, ByCategory>[] = [
    {
      accessorKey: "category",
      header: () => columnHeader("CATEGORY"),
      enableSorting: false,
    },
    {
      accessorKey: "items",
      header: () => columnHeader("TOTAL ITEMS"),
      enableSorting: false,
    },
    {
      accessorKey: "total",
      header: () => columnHeader("TOTAL"),
      cell: (info) => formatCurrency(info.getValue<number>()),
      enableSorting: false,
    },
  ];
  const byCategoryData: ByCategory[] = Object.values(
    items.reduce<Record<string, ByCategory>>((acc, item) => {
      const category = item.category_name || "Uncategorized";

      if (!acc[category]) {
        acc[category] = {
          category,
          items: 0,
          total: 0,
        };
      }

      acc[category].items += 1;
      acc[category].total += item.total_price;

      return acc;
    }, {}),
  );

  // 3. By Subcategory
  const bySubcategoryColumns: ColumnDef<TableFeatures, BySubcategory>[] = [
    {
      accessorKey: "subcategory",
      header: () => columnHeader("SUBCATEGORY"),
      enableSorting: false,
    },
    {
      accessorKey: "items",
      header: () => columnHeader("TOTAL ITEMS"),
      enableSorting: false,
    },
    {
      accessorKey: "total",
      header: () => columnHeader("TOTAL"),
      cell: (info) => formatCurrency(info.getValue<number>()),
      enableSorting: false,
    },
  ];
  const bySubcategoryData: BySubcategory[] = Object.values(
    items.reduce<Record<string, BySubcategory>>((acc, item) => {
      const subcategory = item.subcategory_name || "Uncategorized";

      if (!acc[subcategory]) {
        acc[subcategory] = {
          subcategory,
          items: 0,
          total: 0,
        };
      }

      acc[subcategory].items += 1;
      acc[subcategory].total += item.total_price;

      return acc;
    }, {}),
  );

  // 4. By All
  const byAllColumns: ColumnDef<TableFeatures, ByAllItem>[] = [
    {
      accessorKey: "subcategory",
      header: () => columnHeader("SUBCATEGORY"),
      cell: (info) => info.getValue<string>() || "-",
      enableSorting: false,
    },
    {
      accessorKey: "item",
      header: () => columnHeader("ITEM"),
      enableSorting: false,
    },
    {
      accessorKey: "unit",
      header: () => columnHeader("UNIT"),
      enableSorting: false,
    },
    {
      accessorKey: "qty",
      header: () => columnHeader("QUANTITY"),
      enableSorting: false,
    },
    {
      accessorKey: "unitPrice",
      header: () => columnHeader("PRICE/UNIT"),
      cell: (info) => formatCurrency(info.getValue<number>()),
      enableSorting: false,
    },
    {
      accessorKey: "total",
      header: () => columnHeader("TOTAL"),
      cell: (info) => formatCurrency(info.getValue<number>()),
      enableSorting: false,
    },
  ];
  const byAllData: ByAll = items.reduce<ByAll>((acc, item) => {
    const category = item.category_name || "Uncategorized";

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push({
      subcategory: item.subcategory_name || "-",
      item: item.name,
      unit: item.unit,
      qty: item.quantity,
      unitPrice: item.price,
      total: item.total_price,
    });

    return acc;
  }, {});

  useEffect(() => {
    console.log(categorizationMethod);
    console.log(byItemsData);
    console.log(byCategoryData);
    console.log(bySubcategoryData);
  }, [categorizationMethod]);

  return (
    <div className="rounded-xl overflow-hidden">
      {categorizationMethod === "by-item" && (
        <CustomDataTable columns={byItemsColumns} data={byItemsData} />
      )}

      {categorizationMethod === "by-category" && (
        <CustomDataTable columns={byCategoryColumns} data={byCategoryData} />
      )}

      {categorizationMethod === "by-subcategory" && (
        <CustomDataTable
          columns={bySubcategoryColumns}
          data={bySubcategoryData}
        />
      )}

      {categorizationMethod === "by-category-subcategory-item" && (
        <div className="flex w-full flex-col gap-4">
          {Object.keys(byAllData).map((category) => {
            return (
              <div key={category} className="flex flex-col gap-2">
                <span style={{ color: brand_color }}> {category} </span>
                <CustomDataTable
                  columns={byAllColumns}
                  data={byAllData[category]}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ItemTableByDocumentCategory;
