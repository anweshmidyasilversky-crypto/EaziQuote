import { type TableFeatures, type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { type QuoteSection } from "@/types/api.responses.type";
import { CustomDataTable } from "../../components/common/CustomTable";
import { useParams } from "react-router";
import useSectionListByQuote from "@/hooks/apis/quotes/sections/useSectionListByQuote";

export function QuoteSectionPage() {
  const params = useParams<{ id: string }>();

  const { sectionList, isFetching, paginationMeta, setPageNo } =
    useSectionListByQuote({
      quote_id: params.id ?? "",
      enabled: params?.id ? true : false,
    });

  const quoteSectionColumns = useMemo<ColumnDef<TableFeatures, QuoteSection>[]>(
    () => [
      {
        accessorKey: "sort",
        header: "ORDER",
        enableSorting: false,
      },
      {
        accessorKey: "title",
        header: "SECTION",
        enableSorting: false,
      },
      {
        accessorKey: "content",
        header: "DESCRIPTION",
        enableSorting: false,
      },
    ],
    [],
  );

  return (
    <div className="bg-white rounded-[7px] pt-5">
      <CustomDataTable
        columns={quoteSectionColumns}
        data={sectionList}
        tableOptionsLeft={<span className="header"> Sections </span>}
        isFetching={isFetching}
        showPaginated
        setPageNo={setPageNo}
        paginationMeta={paginationMeta}
        paginationBtns={paginationMeta?.links}
      />
    </div>
  );
}
