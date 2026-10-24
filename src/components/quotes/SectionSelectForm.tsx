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
import {
  QuoteStatus,
  type ApiResponse,
  type QuoteSection,
} from "@/types/api.responses.type";
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
import useQuotesMutations from "@/hooks/apis/quotes/useQuotesMutations";
import { useQueryClient } from "@tanstack/react-query";

export type SectionSelectFormProps = {
  submitAction?: () => void;
  setSectionPreview?: React.Dispatch<React.SetStateAction<QuoteSection[]>>;
};

function SectionSelectForm({
  submitAction,
  setSectionPreview,
}: SectionSelectFormProps) {
  const queryClient = useQueryClient();
  const currQuote = useAppSelector((state) => state.quote);
  const sectionListFilters = useMemo(
    () => ({
      quote_id:
        currQuote?.status !== QuoteStatus.draft ? currQuote.id : undefined,
    }),
    [currQuote],
  );

  const {
    sectionList,
    isFetching,
    searchTerm,
    setSearchTerm,
    setData: setSectionData,
    queryKey: sectionListQueryKey,
  } = useSectionsList({
    filters: sectionListFilters,
  });
  const [sectionFormOpen, toggleSectionFormOpen] = useState(false);

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
      cell: (info) => {
        return (
          <input
            type="checkbox"
            className="w-4 aspect-square"
            checked={info.row.getIsSelected()}
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
        const content = info.getValue<string | null>() ?? ``;
        return <div dangerouslySetInnerHTML={{ __html: content }} />;
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

  const { statusUpdateMutation } = useQuotesMutations();

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
          if (currQuote.status === QuoteStatus.draft) {
            statusUpdateMutation.mutate(
              {
                quote_id: currQuote.id,
                status: QuoteStatus.completed,
              },
              {
                onError: (error) => {
                  showErrorToast(error);
                },
                onSettled: () => {
                  submitAction?.();
                },
              },
            );
          } else {
            submitAction?.();
          }
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
        toggleSectionFormOpen(false);
        queryClient.setQueryData(
          sectionListQueryKey,
          (oldData: ApiResponse<{ data: QuoteSection[] }>) => {
            if (!oldData) {
              return oldData;
            }
            return {
              ...oldData,
              payload: {
                data: [
                  ...oldData.payload.data,
                  response.payload,
                  // { ...response.payload, is_added: true }, {/* This will add the section but if we move back and come back on the section select list it would still be selected */}
                ],
              },
            };
          },
        );
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  useEffect(() => {
    sectionList.forEach((section) => {
      if (section.is_added) {
        tableRef.current?.getRow(section.id.toString())?.toggleSelected();
      }
    });
  }, [sectionList]);

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="w-0 min-w-full flex flex-col gap-5">
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
            onSelectionChange={setSectionPreview}
            rowIdSelector={(row) => row.id.toString()}
            isFetching={isFetching}
          />
        </div>

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
        isSubmitting={createSectionMutation.isPending}
      />
    </>
  );
}

export default SectionSelectForm;
