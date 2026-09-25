import { assets } from "@/assets/icons";
import { CustomActionGroup } from "@/components/common/CustomActionGroup";
import {
  CustomHeader,
  type CustomHeaderProps,
} from "@/components/common/CustomHeader";
import { CustomDataTable } from "@/components/common/CustomTable";
import SearchInputGruop from "@/components/common/SearchInputGruop";
import usePresetQuotesList from "@/hooks/apis/quotes/usePresetQuotesList";
import type { PresetQuoteListing } from "@/types/api.responses.type";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { useNavigate } from "react-router";

function PresetQuotesIndexPage() {
  const navigate = useNavigate();
  const {
    presetQuoteList,
    isFetching,
    paginationMeta,
    setPageNo,
    searchTerm,
    setSearchTerm,
  } = usePresetQuotesList();

  const presetTableColumns: ColumnDef<TableFeatures, PresetQuoteListing>[] = [
    {
      accessorKey: "name",
      header: "Template Name",
      enableSorting: false,
    },
    {
      accessorKey: "items_count",
      header: "items",
      enableSorting: false,
    },
    {
      accessorKey: "description",
      enableSorting: false,
      cell: (info) => {
        const description = info.getValue<string | null>();
        return (
          <p className="truncate max-w-40 md:max-w-80 lg:max-w-180">
            {" "}
            {description}{" "}
          </p>
        );
      },
    },
    {
      id: "action",
      header: "Action",
      cell: (info) => {
        return (
          <CustomActionGroup
            openFn={() => navigate(`/preset-quotes/${info.row.original.id}`)}
          />
        );
      },
    },
  ];

  const headerBtnConfig: CustomHeaderProps["btnConfigList"] = [
    {
      buttonLabel: "New Preset",
      leftIcon: assets.plusIcon,
    },
  ];

  return (
    <div className="p-6 flex flex-col gap-6">
      <CustomHeader
        header="Preset Quotes"
        headerInfo="Preset Quotes"
        btnConfigList={headerBtnConfig}
      />

      <div className="bg-table py-4.5 rounded-[10px] flex flex-col gap-4.5">
        <CustomDataTable
          columns={presetTableColumns}
          data={presetQuoteList}
          isFetching={isFetching}
          showPaginated
          paginationMeta={paginationMeta}
          paginationBtns={paginationMeta?.links}
          setPageNo={setPageNo}
          tableOptionsLeft={
            <SearchInputGruop
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchPlaceHolder="Search preset quotes"
            />
          }
        />
      </div>
    </div>
  );
}

export default PresetQuotesIndexPage;
