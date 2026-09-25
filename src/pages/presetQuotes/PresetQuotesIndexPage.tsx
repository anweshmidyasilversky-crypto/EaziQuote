import { showErrorToast } from "@/api/axiosInstance";
import { assets } from "@/assets/icons";
import { CustomActionGroup } from "@/components/common/CustomActionGroup";
import {
  CustomHeader,
  type CustomHeaderProps,
} from "@/components/common/CustomHeader";
import { CustomDataTable } from "@/components/common/CustomTable";
import DeleteDialog from "@/components/common/DeleteDialog";
import SearchInputGruop from "@/components/common/SearchInputGruop";
import usePresetQuoteMutations from "@/hooks/apis/quotes/usePresetQuoteMutations";
import usePresetQuotesList from "@/hooks/apis/quotes/usePresetQuotesList";
import type { PresetQuoteListing } from "@/types/api.responses.type";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

function PresetQuotesIndexPage() {
  const navigate = useNavigate();
  const [deleteModalOpen, toggleDeleteModalOpen] = useState(false);
  const {
    presetQuoteList,
    isFetching,
    paginationMeta,
    setPageNo,
    searchTerm,
    setSearchTerm,
    refetch,
  } = usePresetQuotesList();

  const targetPresetQuoteId = useRef<number | undefined>(undefined);

  const { presetQuoteDeleteMutation } = usePresetQuoteMutations();

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
        const { id } = info.row.original;
        return (
          <CustomActionGroup
            openFn={() => navigate(`/preset-quotes/${id}`)}
            deleteFn={() => {
              targetPresetQuoteId.current = id;
              toggleDeleteModalOpen((curr) => !curr);
            }}
            editFn={() => navigate(`/preset-quotes/manage-preset-quotes/${id}`)}
          />
        );
      },
    },
  ];

  const headerBtnConfig: CustomHeaderProps["btnConfigList"] = [
    {
      buttonLabel: "New Preset",
      leftIcon: assets.plusIcon,
      onClick: () => navigate(`/preset-quotes/manage-preset-quotes`),
    },
  ];

  const handlePresetDelete = () => {
    if (targetPresetQuoteId.current) {
      presetQuoteDeleteMutation.mutate(targetPresetQuoteId.current, {
        onSuccess: (response) => {
          toast.success(response.message);
          toggleDeleteModalOpen(false);
          refetch();
        },
        onError: (error) => {
          showErrorToast(error);
        },
      });
    } else {
      toast.error(`No Preset Selected For deletion`);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <CustomHeader
        header="Preset Quotes"
        headerInfo="Manage all your quotes in one place"
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

      <DeleteDialog
        isOpen={deleteModalOpen}
        toggleOpen={toggleDeleteModalOpen}
        deleteAction={handlePresetDelete}
        isPending={presetQuoteDeleteMutation.isPending}
      />
    </div>
  );
}

export default PresetQuotesIndexPage;
