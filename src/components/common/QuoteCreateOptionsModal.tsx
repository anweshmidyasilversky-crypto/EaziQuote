import type {
  ClientDetails,
  PresetQuoteListing,
} from "@/types/api.responses.type";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import ReadMoreContentBox from "./ReadMoreContentBox";
import usePresetQuotesList from "@/hooks/apis/quotes/usePresetQuotesList";
import CustomDialog from "./CustomDialog";
import type React from "react";
import { cn } from "@/lib/utils/helper";
import { useAppDispatch } from "@/redux/store";
import { removeQuote as removeQuoteRedux } from "@/redux/slices/quotes.slice";
import { useNavigate } from "react-router";
import { assets } from "@/assets/icons";
import { useState } from "react";
import { CustomDataTable } from "./CustomTable";
import SearchInputGruop from "./SearchInputGruop";
import type { CreateQuotePageLocationProps } from "@/pages/quotes/CreateQuotePage";

export type QuoteCreateOptionsModalProps = {
  isOpen: boolean;
  toggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  defaultClient?: ClientDetails;
};

function QuoteCreateOptionsModal({
  isOpen,
  toggleOpen,
  defaultClient,
}: QuoteCreateOptionsModalProps) {
  const {
    presetQuoteList: presetQuotes,
    isFetching: isPresetQuoteFetching,
    setPageNo: setPresetPageNo,
    searchTerm: presetSearchTerm,
    setSearchTerm: setPresetSearchTerm,
    paginationMeta: presetQuotePaginationMeta,
  } = usePresetQuotesList();

  const [selectedPreset, setSelectedPreset] = useState<number | undefined>(
    undefined,
  );

  const presetQuotesColumns = [
    {
      id: "action",
      header: "ACTION",
      cell: (info) => (
        <input
          type="radio"
          multiple
          value={info.row.original.id}
          checked={info.row.original.id === selectedPreset}
          onChange={(e) => {
            setSelectedPreset(Number(e.target.value));
          }}
        />
      ),
      enableSorting: false,
    },

    {
      accessorKey: "name",
      header: "TEMPLATE NAME",
      enableSorting: false,
    },

    {
      accessorKey: "items_count",
      header: "ITEMS",
      enableSorting: false,
    },

    {
      accessorKey: "description",
      header: "Description",
      cell: (info) => {
        const desc = info.getValue<string>();
        return (
          <ReadMoreContentBox lines={4} contentBoxCls="bg-transparent!">
            <span className="text-wrap">{desc}</span>
          </ReadMoreContentBox>
        );
      },
      enableSorting: false,
    },
  ] as ColumnDef<TableFeatures, PresetQuoteListing>[];
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [presetSelectionOpen, togglePresetSelectionOpen] =
    useState<boolean>(false);

  const handlePresetQuoteSelect = () => {
    navigate(`/quotes/manage-quotes/`, {
      state: {
        presetQuoteId: selectedPreset,
        defaultClient,
      } as CreateQuotePageLocationProps,
    });
  };

  return (
    <>
      {/* Dialog to choose between track from scratch or with preset */}
      <CustomDialog
        dialogOpen={isOpen}
        toggleDialogOpen={toggleOpen}
        header="Create a New Quote"
        headerCls={cn(`border-0!`)}
      >
        <div className="flex flex-col gap-6 py-5 mt-6 max-w-125! max-md:min-w-[80vw]">
          <span className="text-sm text-placeholder-text px-5 min-h-8.5">
            {" "}
            {
              "Choose how you'd like to begin. You can start fresh and build your quote step by step, or save time by using one of your preset quote templates."
            }{" "}
          </span>

          <div className="flex gap-4 justify-center px-5">
            <div
              className="bg-custom-dialog-primary flex flex-col items-center min-w-55 gap-4 rounded-lg py-4 cursor-pointer max-md:min-w-[30vw]"
              onClick={() => {
                dispatch(removeQuoteRedux());
                navigate(`/quotes/manage-quotes/`);
              }}
            >
              <img src={assets.pencilFilledIcon} className="w-8 h-8" />
              <span className="max-md:text-[12px]">
                {" "}
                {"Start from Scratch"}{" "}
              </span>
            </div>

            <div
              className="bg-custom-dialog-primary flex flex-col items-center min-w-55 rounded-lg gap-4 py-4 cursor-pointer max-md:min-w-[30vw]"
              onClick={() => togglePresetSelectionOpen((curr) => !curr)}
            >
              <img src={assets.thunderBoltIcon} className="w-8 h-8" />
              <span className="max-md:text-[12px]"> {"Use Preset Quote"} </span>
            </div>
          </div>
        </div>
      </CustomDialog>
      {/* Preset Quote Selection Table */}
      <CustomDialog
        dialogOpen={presetSelectionOpen}
        toggleDialogOpen={togglePresetSelectionOpen}
        header="Select Preset Quote"
        withFooter
        footerBtnLabel="Continue"
        footerBtnAction={() => {
          handlePresetQuoteSelect();
        }}
        closeAction={() => {
          if (selectedPreset) {
            setSelectedPreset(undefined);
          }
        }}
      >
        <div className="lg:min-w-250 flex flex-col gap-4.5 mt-6 max-h-120 overflow-y-auto">
          <div className="px-5">
            <SearchInputGruop
              searchTerm={presetSearchTerm}
              setSearchTerm={setPresetSearchTerm}
              searchPlaceHolder="Search preset quotes"
            />
          </div>
          <CustomDataTable
            columns={presetQuotesColumns}
            data={presetQuotes}
            showPaginated
            paginationMeta={presetQuotePaginationMeta}
            paginationBtns={presetQuotePaginationMeta?.links}
            setPageNo={setPresetPageNo}
            isFetching={isPresetQuoteFetching}
          />
        </div>
      </CustomDialog>
    </>
  );
}

export default QuoteCreateOptionsModal;
