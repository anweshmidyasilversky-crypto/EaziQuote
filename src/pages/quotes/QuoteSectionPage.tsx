import { type TableFeatures, type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { quoteSectionData, type QuoteSection } from "../../constants/dummyData";
import { CustomDataTable } from "../../components/common/CustomTable";

export function QuoteSectionPage() {
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
        data={quoteSectionData}
        tableOptionsLeft={
          <span className="quote-description-header"> Sections </span>
        }
      />
    </div>
  );
}
