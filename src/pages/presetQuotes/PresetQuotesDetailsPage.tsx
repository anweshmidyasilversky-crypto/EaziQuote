import { showErrorToast } from "@/api/axiosInstance";
import { assets } from "@/assets/icons";
import { HeaderBreadCrumb } from "@/components/common/CustomBreadCrumb";
import {
  CustomHeader,
  type CustomHeaderProps,
} from "@/components/common/CustomHeader";
import { CustomDataTable } from "@/components/common/CustomTable";
import DeleteDialog from "@/components/common/DeleteDialog";
import ReadMoreContentBox from "@/components/common/ReadMoreContentBox";
import SearchInputGruop from "@/components/common/SearchInputGruop";
import { Spinner } from "@/components/ui/spinner";
import usePresetQuoteDetails from "@/hooks/apis/quotes/usePresetQuoteDetails";
import usePresetQuoteMutations from "@/hooks/apis/quotes/usePresetQuoteMutations";
import { useDebounce } from "@/hooks/useDebounce";
import { formatCurrency } from "@/lib/utils";
import type { ItemDetails } from "@/types/api.responses.type";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

function PresetQuotesDetailsPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, toggleDeleteModal] = useState(false);
  const debouncedSearchTerm = useDebounce({ value: searchTerm });
  const { presetQuote, isFetching } = usePresetQuoteDetails({
    templateId: params.id ?? "",
    enabled: params.id !== undefined,
  });

  const { presetQuoteDeleteMutation } = usePresetQuoteMutations();

  const headerBtnConfig: CustomHeaderProps["btnConfigList"] = [
    {
      id: "editBtn",
      buttonLabel: "Edit",
      leftIcon: assets.pencilIconWhite,
      onClick: () =>
        navigate(`/preset-quotes/manage-preset-quotes/${params.id}`),
    },
    {
      id: "deleteBtn",
      buttonLabel: "Delete",
      leftIcon: assets.binIconWhite,
      onClick: () => toggleDeleteModal(true),
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

  const handlePresetQuoteDelete = () => {
    presetQuoteDeleteMutation.mutate(params.id ?? 0, {
      onSuccess: (response) => {
        toast.success(response.message);
        toggleDeleteModal(false);
        navigate(`/preset-quotes`);
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

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

      <DeleteDialog
        isOpen={deleteModalOpen}
        toggleOpen={toggleDeleteModal}
        deleteAction={handlePresetQuoteDelete}
        isPending={presetQuoteDeleteMutation.isPending}
      />
    </>
  );
}

export default PresetQuotesDetailsPage;
