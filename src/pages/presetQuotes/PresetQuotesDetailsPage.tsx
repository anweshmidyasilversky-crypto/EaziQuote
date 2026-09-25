import { assets } from "@/assets/icons";
import { HeaderBreadCrumb } from "@/components/common/CustomBreadCrumb";
import {
  CustomHeader,
  type CustomHeaderProps,
} from "@/components/common/CustomHeader";
import { CustomDataTable } from "@/components/common/CustomTable";
import ReadMoreContentBox from "@/components/common/ReadMoreContentBox";
import SearchInputGruop from "@/components/common/SearchInputGruop";
import { Spinner } from "@/components/ui/spinner";
import usePresetQuoteDetails from "@/hooks/apis/quotes/usePresetQuoteDetails";
import { useDebounce } from "@/hooks/useDebounce";
import { formatCurrency } from "@/lib/utils";
import type { ItemDetails } from "@/types/api.responses.type";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { useState } from "react";
import { useParams } from "react-router";

function PresetQuotesDetailsPage() {
  const params = useParams<{ id: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce({ value: searchTerm });
  const { presetQuote, isFetching } = usePresetQuoteDetails({
    templateId: params.id ?? "",
    enabled: params.id !== undefined,
  });

  const headerBtnConfig: CustomHeaderProps["btnConfigList"] = [
    {
      id: "editBtn",
      buttonLabel: "Edit",
      leftIcon: assets.pencilIconWhite,
    },
    {
      id: "deleteBtn",
      buttonLabel: "Delete",
      leftIcon: assets.binIconWhite,
    },
  ];

  const itemsTableColumns: ColumnDef<TableFeatures, ItemDetails>[] = [
    {
      accessorKey: "name",
      header: "Item Name",
      enableSorting: false,
    },
    {
      accessorKey: "category_name",
      header: "Category",
      enableSorting: false,
    },
    {
      accessorKey: "subcategory_name",
      header: "Subcategory",
      enableSorting: false,
      cell: (info) => {
        const subCatName = info.getValue<string | null>();
        return subCatName ?? "-";
      },
    },
    {
      accessorKey: "quantity",
      enableSorting: false,
    },
    {
      accessorKey: "price",
      header: "Price/unit",
      enableSorting: false,
      cell: (info) => {
        return formatCurrency(info.getValue<number>());
      },
    },
    {
      accessorKey: "cost",
      header: "Unit cost",
      enableSorting: false,
      cell: (info) => {
        return formatCurrency(info.getValue<number>());
      },
    },
    {
      accessorKey: "total_price",
      header: "Total",
      enableSorting: false,
      cell: (info) => {
        return formatCurrency(info.getValue<number>());
      },
    },
  ];
  return isFetching ? (
    <div className="h-full w-full flex items-center justify-center">
      <Spinner className="text-brand-dark h-1/10 w-1/10" />
    </div>
  ) : (
    <>
      <HeaderBreadCrumb pageName="Preset Quote Detail" />

      <div className="flex flex-col gap-6 p-6">
        <CustomHeader
          header="Standard Boiler Install"
          btnConfigList={headerBtnConfig}
        />

        <ReadMoreContentBox lines={9} title="Job Description">
          {presetQuote?.description}
        </ReadMoreContentBox>

        <div className="bg-table rounded-[10px] flex flex-col gap-8 py-5">
          <CustomDataTable
            columns={itemsTableColumns}
            data={presetQuote?.items ?? []}
            globalFilterTerm={debouncedSearchTerm}
            title="Items"
            headerSlot={
              <SearchInputGruop
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchPlaceHolder="Search here"
              />
            }
          />
        </div>
      </div>
    </>
  );
}

export default PresetQuotesDetailsPage;
