import {
  type Table,
  type ColumnDef,
  type TableFeatures,
} from "@tanstack/react-table";
import { CustomDataTable } from "../common/CustomTable";
import type { QuoteSection } from "@/types/quoteSection.type";
import { quoteSectionData } from "@/constants/dummyData";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { CustomActionGroup } from "../common/CustomActionGroup";
import SearchInputGruop from "../common/SearchInputGruop";
import { CustomBtn } from "../common/CustomBtn";
import { assets } from "@/assets/icons";
import QuoteSectionForm, {
  type QuoteSectionFormProps,
} from "./QuoteSectionForm";
import { type DefaultValues } from "react-hook-form";
import { useAppDispatch } from "@/redux/store";
import { updateQuoteSections } from "@/redux/slices/quotes.slice";
import { toast } from "react-toastify";

export type SectionSelectFormProps = {
  refNo: string;
  submitAction?: () => void;
  selectedSectionIds?: string[];
};

/**
 * @param refNo refrence no the Quote
 * @param submitAction action upon submit
 * @param selectedSectionIds Optional, ids of sections that are selected prviously, for prefill
 */
function SectionSelectForm({
  refNo,
  selectedSectionIds,
  submitAction,
}: SectionSelectFormProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });
  const [sectionFormOpen, toggleSectionFormOpen] = useState(false);
  const dispatch = useAppDispatch();

  const tableRef = useRef<Table<TableFeatures, QuoteSection> | undefined>(
    undefined,
  );

  const defaultValues = useRef<
    DefaultValues<Partial<QuoteSection>> | undefined
  >(undefined);
  const sectionFormAction = useRef<QuoteSectionFormProps["mode"]>("creation");

  const sectionTableColumns: ColumnDef<TableFeatures, QuoteSection>[] = [
    {
      id: "selectCheckBox",
      header: (info) => {
        tableRef.current = info.table;
        return (
          <input
            type="checkbox"
            className="w-4 aspect-square"
            onChange={info.table.getToggleAllPageRowsSelectedHandler()}
            checked={info.table.getIsAllRowsSelected()}
          />
        );
      },
      cell: (info) => (
        <input
          type="checkbox"
          className="w-4 aspect-square"
          checked={info.row.getIsSelected()}
          onChange={info.row.getToggleSelectedHandler()}
        />
      ),
      enableSorting: false,
      enableGlobalFilter: false,
    },
    {
      id: "order",
      header: "ORDER",
      cell: (info) => info.row.getDisplayIndex() + 1,
    },
    {
      accessorKey: "section",
      header: "SECTION",
      enableSorting: false,
    },
    {
      accessorKey: "description",
      header: "DESCRIPTION",
      cell: (info) => (
        <span className="max-w-138.5 text-wrap wrap-break-word">
          {" "}
          {info.getValue<string>()}{" "}
        </span>
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: "ACTION",
      cell: (info) => (
        <CustomActionGroup
          withOpen={false}
          editFn={() => handleEdit(info.row.original)}
        />
      ),
    },
  ];

  const handleEdit = (data: QuoteSection) => {
    sectionFormAction.current = "updation";
    defaultValues.current = {
      ...data,
    };
    toggleSectionFormOpen(true);
  };

  useEffect(() => {
    selectedSectionIds?.forEach((rowId) =>
      tableRef.current?.getRow(rowId)?.toggleSelected(),
    );
  }, []);

  const handleSubmit = () => {
    const table = tableRef.current;

    dispatch(
      updateQuoteSections({
        quoteId: refNo,
        sections:
          table
            ?.getSelectedRowIds()
            .map((rowId) => table.getRow(rowId).original) ?? [],
      }),
    );

    toast.success(`Sucessfully added sections`);

    submitAction?.();
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        <CustomDataTable
          columns={sectionTableColumns}
          data={quoteSectionData}
          globalFilterTerm={debouncedSearchTerm}
          showPaginated={quoteSectionData.length > 5}
          tableOptionsLeft={
            <SearchInputGruop
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchPlaceHolder="Search section"
            />
          }
          tableOptionsRight={
            <CustomBtn
              buttonLabel="New Section"
              leftIcon={assets.plusIcon}
              onClick={() => {
                sectionFormAction.current = "creation";
                defaultValues.current = undefined;
                toggleSectionFormOpen((curr) => !curr);
              }}
            />
          }
          withSelectionToggle={true}
          rowIdSelector={(row) => row.id}
        />

        <div className="flex px-5">
          <CustomBtn buttonLabel="Finalise Quote" onClick={handleSubmit} />
        </div>
      </div>

      <QuoteSectionForm
        isOpen={sectionFormOpen}
        toggleIsOpen={toggleSectionFormOpen}
        mode={sectionFormAction.current}
        defaultValues={
          sectionFormAction.current === "updation"
            ? defaultValues.current
            : undefined
        }
      />
    </>
  );
}

export default SectionSelectForm;
