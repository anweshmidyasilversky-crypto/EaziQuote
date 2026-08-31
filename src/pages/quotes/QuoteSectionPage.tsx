import { type TableFeatures, type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { type QuoteSection } from "../../types/quoteSection.type";
import { CustomDataTable } from "../../components/common/CustomTable";
import { useAppSelector } from "../../redux/store";
import { useParams } from "react-router";
import { quotesInitialState } from "../../redux/slices/quotes.slice";

export function QuoteSectionPage() {
  const params = useParams<{ id: string }>();
  const activeQuote = useAppSelector(
    (state) => state.quotes.find((q) => q.id === params.id) ?? state.quotes[0],
  );

  const sections = useMemo(() => {
    return activeQuote?.sections ?? quotesInitialState[0].sections ?? [];
  }, [activeQuote]);

  const quoteSectionColumns = useMemo<ColumnDef<TableFeatures, QuoteSection>[]>(
    () => [
      {
        id: "order",
        accessorKey: "order",
        header: "ORDER",
        enableSorting: false,
      },
      {
        id: "section",
        accessorKey: "section",
        header: "SECTION",
        enableSorting: false,
      },
      {
        id: "description",
        accessorKey: "description",
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
        data={sections}
        tableOptionsLeft={<span className="header"> Sections </span>}
      />
    </div>
  );
}
