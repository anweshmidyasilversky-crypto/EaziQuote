import {
  type Table,
  type ColumnDef,
  type TableFeatures,
} from "@tanstack/react-table";
import { CustomDataTable } from "../common/CustomTable";
import { useEffect, useMemo, useRef, useState } from "react";
import { CustomActionGroup } from "../common/CustomActionGroup";
import SearchInputGruop from "../common/SearchInputGruop";
import { CustomBtn } from "../common/CustomBtn";
import { assets } from "@/assets/icons";
import QuoteSectionForm, {
  type QuoteSectionFormProps,
} from "./QuoteSectionForm";
import type { QuoteSection } from "@/types/api.responses.type";
import { type DefaultValues } from "react-hook-form";
import { useAppSelector } from "@/redux/store";
import { toast } from "react-toastify";
import useSectionsList from "@/hooks/apis/quotes/sections/useSectionsList";
import type {
  QuoteSectionCreatePayload,
  QuoteSectionUpdatePayload,
} from "@/types/api.requests.type";
import useSectionMutations from "@/hooks/apis/quotes/sections/useSectionMutations";
import { showErrorToast } from "@/api/axiosInstance";

export type SectionSelectFormProps = {
  submitAction?: () => void;
};

/**
 * @param submitAction action upon submit
 */
function SectionSelectForm({ submitAction }: SectionSelectFormProps) {
  const currQuote = useAppSelector((state) => state.quote);
  const sectionListFilters = useMemo(
    () => ({ quote_id: currQuote.id }),
    [currQuote],
  );

  const {
    sectionList,
    isFetching,
    searchTerm,
    setSearchTerm,
    refetch: refetchSectionsList,
    setData: setSectionData,
  } = useSectionsList({
    filters: sectionListFilters,
  });
  const [sectionFormOpen, toggleSectionFormOpen] = useState(false);

  const tableRef = useRef<Table<TableFeatures, QuoteSection> | undefined>(
    undefined,
  );

  const selectedRowIds: string[] = [];
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
      cell: (info) => {
        if (info.row.original.is_added) {
          selectedRowIds.push(info.row.id);
        }
        return (
          <input
            type="checkbox"
            className="w-4 aspect-square"
            checked={info.row.getIsSelected() || info.row.original.is_added}
            onChange={info.row.getToggleSelectedHandler()}
          />
        );
      },
      enableSorting: false,
      enableGlobalFilter: false,
    },
    {
      accessorKey: "sort",
      header: "ORDER",
      cell: (info) => info.getValue<number>(),
    },
    {
      accessorKey: "title",
      header: "SECTION",
      enableSorting: false,
    },
    {
      accessorKey: "content",
      header: "DESCRIPTION",
      cell: (info) => {
        const content = info.getValue<string>();
        return (
          <span className="max-w-138.5 text-wrap wrap-break-word">
            {content.trim().length <= 0 ? (
              <div className="w-full justify-center items-center">{"-"}</div>
            ) : (
              content
            )}
          </span>
        );
      },
      enableSorting: false,
    },
    {
      id: "action",
      header: "ACTION",
      cell: (info) => (
        <CustomActionGroup
          withOpen={false}
          withDelete={false}
          editFn={() => openEditForm(info.row.original)}
        />
      ),
    },
  ];

  const openEditForm = (data: QuoteSection) => {
    sectionFormAction.current = "updation";
    defaultValues.current = {
      ...data,
    };
    toggleSectionFormOpen(true);
  };

  const editFn = (data: QuoteSectionUpdatePayload) => {
    const idx = sectionList.findIndex((section) => section.id === data.id);
    if (idx === -1) {
      toast.error(`Something went wrong`);
      return;
    }
    setSectionData([
      ...sectionList.slice(0, idx),
      {
        ...sectionList[idx],
        sort: data.sort ?? sectionList[idx].sort,
        title: data.title,
        content: data.content ?? sectionList[idx].content,
      },
      ...sectionList.slice(idx + 1),
    ]);
    toggleSectionFormOpen(false);
  };

  const { sectionMutationForQuote, createSectionMutation } =
    useSectionMutations();

  const handleSubmit = () => {
    const table = tableRef.current;
    sectionMutationForQuote.mutate(
      {
        quote_id: currQuote.id,
        sections:
          table?.getSelectedRowModel().rows.map((row) => {
            const { id, ...rest } = row.original;
            return rest;
          }) ?? [],
      },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          submitAction?.();
        },
        onError: (error) => {
          showErrorToast(error);
        },
      },
    );
  };

  const handleSectionCreation = (data: QuoteSectionCreatePayload) => {
    createSectionMutation.mutate(data, {
      onSuccess: (response) => {
        toast.success(response.message);
        setSearchTerm("");
        refetchSectionsList();
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  useEffect(() => {
    selectedRowIds.forEach((rowId) => {
      tableRef.current?.getRow(rowId).toggleSelected();
    });
  }, [selectedRowIds]);

  return (
    <>
      <div className="flex flex-col gap-5">
        <CustomDataTable
          columns={sectionTableColumns}
          data={sectionList}
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
          rowIdSelector={(row) => row.id.toString()}
          isFetching={isFetching}
        />

        <div className="flex px-5">
          <CustomBtn
            buttonLabel="Finalise Quote"
            onClick={handleSubmit}
            isSubmitting={sectionMutationForQuote.isPending}
          />
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
        editFn={editFn}
        createFn={handleSectionCreation}
      />
    </>
  );
}

export default SectionSelectForm;
