import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import {
  itemData as mockItemData,
  type ItemData,
} from "../../constants/dummyData";
import { useMemo, useState } from "react";
import { formatCurrency, getQuoteFromId } from "../../lib/utils";
import { HeaderBreadCrumb } from "../../components/common/CustomBreadCrumb";
import { useParams } from "react-router";
import type { CustomBtnProps } from "../../components/common/CustomBtn";
import { assets } from "../../assets/icons";
import { CustomHeader } from "../../components/common/CustomHeader";
import {
  CustomToggleGroup,
  type CustomToggleGroupProps,
} from "../../components/common/CustomToggleGroup";
import { CustomDataTable } from "@/components/common/CustomTable";
import SearchInputGruop from "../../components/common/SearchInputGruop";
import { useDebounce } from "../../hooks/debounce.hook";
import { SubtotalBreakDown } from "../../components/quotes/SubtotalBreakDown";

export function QuotesDetailsPage() {
  const params = useParams() as { id: string };
  const itemColumns: ColumnDef<TableFeatures, ItemData>[] = useMemo(
    () => [
      {
        accessorKey: "itemName",
        header: "ITEM NAME",
        enableSorting: false,
      },
      {
        accessorKey: "category",
        header: "CATEGORY",
        enableSorting: false,
      },
      {
        accessorKey: "subcategory",
        header: "SUBCATEGORY",
        enableSorting: false,
      },
      {
        accessorKey: "quantity",
        header: "QUANTITY",
        enableSorting: false,
      },
      {
        accessorKey: "pricePerUnit",
        header: "PRICE/UNIT",
        cell: (info) => formatCurrency(info.getValue<number>()),
        enableSorting: true,
      },
      {
        accessorKey: "unitCost",
        header: "UNIT COST",
        cell: (info) => formatCurrency(info.getValue<number>()),
        enableSorting: true,
      },
      {
        accessorKey: "total",
        header: "TOTAL",
        cell: (info) => formatCurrency(info.getValue<number>()),
        enableSorting: true,
      },
    ],
    [],
  );

  const [itemData, setItemData] = useState(mockItemData);
  const [globalFilter, setGlobalFilter] = useState("");
  const deboucedFilter = useDebounce({ value: globalFilter, delay: 500 });
  const [activeTable, toggleActiveTable] = useState("summary");

  const btnConfigList: CustomBtnProps[] = [
    {
      leftIcon: assets.plusIcon,
      buttonLabel: "Invoice",
    },
    {
      leftIcon: assets.previewIcon,
      buttonLabel: "Preview",
    },
    {
      buttonLabel: "More Actions",
    },
    {
      buttonLabel: "Share & Export",
    },
  ];

  const toggleGroupConfig: CustomToggleGroupProps["toggleConfig"] = [
    {
      btnId: "summary",
      btnLabel: "Summary",
    },
    {
      btnId: "description",
      btnLabel: "Description",
    },
    {
      btnId: "section",
      btnLabel: "Section",
    },
  ];

  const quote = getQuoteFromId(params.id);
  return (
    <div>
      <HeaderBreadCrumb pageName="Quote Detail" />
      <div className="flex flex-col gap-6 px-6 pt-6 pb-8.5">
        <CustomHeader
          header={quote.title}
          headerInfo={quote.id}
          btnConfigList={btnConfigList}
        />

        <CustomToggleGroup
          toggleConfig={toggleGroupConfig}
          activeId={activeTable}
          toggleActive={toggleActiveTable}
        />
        <div className="bg-white rounded-[7px]">
          {activeTable === "summary" && (
            <div className="table-theme! overflow-hidden">
              <CustomDataTable
                columns={itemColumns}
                data={itemData}
                globalFilterTerm={deboucedFilter}
                showPaginated
                tableOptionsLeft={
                  <div className="font-medium text-[16px] min-h-4.75 flex items-center">
                    {" "}
                    Items{" "}
                  </div>
                }
                tableOptionsRight={
                  <SearchInputGruop
                    searchTerm={globalFilter}
                    setSearchTerm={setGlobalFilter}
                    searchPlaceHolder="Search here"
                  />
                }
              />
              <div className="px-5">
                <div className="dashed-y-separators" />
              </div>

              <div className="w-full flex justify-end">
                <div className="max-w-75">
                  <SubtotalBreakDown
                    quote={quote}
                    marginPercentage={50}
                    taxPercentage={18}
                    discountPercentage={10}
                    reqDeposite={1500}
                    paymentMethod={quote.paymentMethod}
                    itemDetails={itemData}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
