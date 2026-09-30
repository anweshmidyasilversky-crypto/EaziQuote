import { showErrorToast } from "@/api/axiosInstance";
import { assets } from "@/assets/icons";
import { CustomActionGroup } from "@/components/common/CustomActionGroup";
import { HeaderBreadCrumb } from "@/components/common/CustomBreadCrumb";
import { CustomBtn } from "@/components/common/CustomBtn";
import { CustomDataTable } from "@/components/common/CustomTable";
import DeleteDialog from "@/components/common/DeleteDialog";
import SearchInputGruop from "@/components/common/SearchInputGruop";
import QuoteSectionForm, {
  type QuoteSectionFormProps,
} from "@/components/quotes/QuoteSectionForm";
import useSectionMutations from "@/hooks/apis/quotes/sections/useSectionMutations";
import useSectionsList from "@/hooks/apis/quotes/sections/useSectionsList";
import type {
  QuoteSectionCreatePayload,
  QuoteSectionUpdatePayload,
} from "@/types/api.requests.type";
import { type QuoteSection } from "@/types/api.responses.type";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

function SectionsPage() {
  const { sectionList, searchTerm, setSearchTerm, refetch, isFetching } =
    useSectionsList({});

  const {
    createSectionMutation,
    updateSectionMutation,
    deleteSectionMutation,
  } = useSectionMutations();

  const handleSectionCreate = (data: QuoteSectionCreatePayload) => {
    createSectionMutation.mutateAsync(data, {
      onSuccess: (response) => {
        toast.success(response.message);
        toggleSectionFormOpen(false);
        refetch();
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  const handleSectionUpdate = (data: QuoteSectionUpdatePayload) => {
    updateSectionMutation.mutateAsync(data, {
      onSuccess: (response) => {
        toast.success(response.message);
        toggleSectionFormOpen(false);
        refetch();
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  const handleSectionDelete = () => {
    if (targetSectionId.current) {
      deleteSectionMutation.mutate(String(targetSectionId.current), {
        onSuccess: (response) => {
          toast.success(response.message);
          toggleDelDialogOpen(false);
          refetch();
        },
        onError: (error) => {
          showErrorToast(error);
        },
      });
    }
  };

  const [sectionFormOpen, toggleSectionFormOpen] = useState(false);
  const [delDialogOpen, toggleDelDialogOpen] = useState(false);
  const sectionFormMode = useRef<QuoteSectionFormProps["mode"]>("creation");
  const sectionDefaultValue = useRef<QuoteSection | undefined>(undefined);
  const targetSectionId = useRef<number | string | undefined>(undefined);
  const sectionColumns: ColumnDef<TableFeatures, QuoteSection>[] = [
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
      cell: (info) => {
        const desc = info.getValue<string>();
        return <p className="max-w-125 truncate"> {desc} </p>;
      },
    },
    {
      id: "action",
      header: "ACTION",
      cell: (info) => (
        <CustomActionGroup
          withOpen={false}
          editFn={() => {
            sectionFormMode.current = "updation";
            sectionDefaultValue.current = info.row.original;
            toggleSectionFormOpen((curr) => !curr);
          }}
          deleteFn={() => {
            targetSectionId.current = info.row.original.id;
            toggleDelDialogOpen((curr) => !curr);
          }}
        />
      ),
    },
  ];
  return (
    <>
      <HeaderBreadCrumb pageName="Sections" />
      <div className="flex flex-col py-5.5 gap-5.5 m-6 bg-table rounded-[10px]">
        <CustomDataTable
          columns={sectionColumns}
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
                sectionFormMode.current = "creation";
                sectionDefaultValue.current = undefined;
                toggleSectionFormOpen((curr) => !curr);
              }}
            />
          }
          isFetching={isFetching}
        />
      </div>

      <QuoteSectionForm
        isOpen={sectionFormOpen}
        toggleIsOpen={toggleSectionFormOpen}
        mode={sectionFormMode.current}
        defaultValues={sectionDefaultValue.current}
        createFn={handleSectionCreate}
        editFn={handleSectionUpdate}
        isSubmitting={
          createSectionMutation.isPending || updateSectionMutation.isPending
        }
      />

      <DeleteDialog
        isOpen={delDialogOpen}
        toggleOpen={toggleDelDialogOpen}
        deleteAction={handleSectionDelete}
        isPending={deleteSectionMutation.isPending}
      />
    </>
  );
}

export default SectionsPage;
