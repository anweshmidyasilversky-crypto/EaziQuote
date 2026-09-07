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
import { quoteSectionData } from "@/constants/dummyData";
import { useDebounce } from "@/hooks/useDebounce";
import type { QuoteSection } from "@/types/quoteSection.type";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { useRef, useState } from "react";

function SectionsPage() {
  const [searchParam, setSearchParam] = useState("");
  const debouncedSearchParam = useDebounce({ value: searchParam, delay: 500 });
  const [sectionFormOpen, toggleSectionFormOpen] = useState(false);
  const [delDialogOpen, toggleDelDialogOpen] = useState(false);
  const sectionFormMode = useRef<QuoteSectionFormProps["mode"]>("creation");
  const sectionDefaultValue = useRef<QuoteSection | undefined>(undefined);
  const sectionColumns: ColumnDef<TableFeatures, QuoteSection>[] = [
    {
      accessorKey: "order",
      header: "ORDER",
      enableSorting: false,
    },
    {
      accessorKey: "section",
      header: "SECTION",
      enableSorting: false,
    },
    {
      accessorKey: "description",
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
          deleteFn={() => toggleDelDialogOpen((curr) => !curr)}
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
          data={quoteSectionData}
          tableOptionsLeft={
            <SearchInputGruop
              searchTerm={searchParam}
              setSearchTerm={setSearchParam}
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
          globalFilterTerm={debouncedSearchParam}
        />
      </div>

      <QuoteSectionForm
        isOpen={sectionFormOpen}
        toggleIsOpen={toggleSectionFormOpen}
        mode={sectionFormMode.current}
        defaultValues={sectionDefaultValue.current}
      />

      <DeleteDialog isOpen={delDialogOpen} toggleOpen={toggleDelDialogOpen} />
    </>
  );
}

export default SectionsPage;
