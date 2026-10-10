import React, { useEffect, useState } from "react";
import { HeaderBreadCrumb } from "../../components/common/CustomBreadCrumb";
import { CustomHeader } from "../../components/common/CustomHeader";
import type { CustomBtnProps } from "../../components/common/CustomBtn";
import { assets } from "../../assets/icons";
import {
  CustomToggleGroup,
  type CustomToggleGroupProps,
} from "../../components/common/CustomToggleGroup";
import QuoteSummaryForm from "../../components/quotes/QuoteSummaryForm";
import ItemSelectForm from "../../components/quotes/ItemSelectForm";
import { useLocation, useNavigate, useParams } from "react-router";
import SectionSelectForm from "@/components/quotes/SectionSelectForm";
import useQuoteDetails from "@/hooks/apis/quotes/useQuoteDetails";
import { Spinner } from "@/components/ui/spinner";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { updateQuote as updateQuoteRedux } from "@/redux/slices/quotes.slice";
import type { ClientDetails } from "@/types/api.responses.type";
import usePresetQuoteDetails from "@/hooks/apis/quotes/usePresetQuoteDetails";
import useQuotesMutations from "@/hooks/apis/quotes/useQuotesMutations";
import { saveToDevice } from "@/lib/utils";
import { showErrorToast } from "@/api/axiosInstance";
import { toast } from "react-toastify";
import { ShareOptions } from "@/components/common/ShareOptions";

enum toggleId {
  Summary = "summary",
  Items = "items",
  Sections = "sections",
}

export type CreateQuotePageLocationProps = {
  defaultClient?: ClientDetails;
  presetQuoteId?: number;
};

export function CreateQuotePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const { defaultClient, presetQuoteId } = (location.state ??
    {}) as CreateQuotePageLocationProps;

  const [formCurrSection, changeFormCurrSection] = useState<string>(
    toggleId.Summary,
  );
  const params = useParams<{ id: string | undefined }>();

  const {
    quote,
    isFetching: isQuoteFetching,
    isFetched: isClientFetched,
  } = useQuoteDetails({
    quote_id: params.id as string,
    enabled: params.id ? true : false,
    refetchOnFocus: false,
  });

  useEffect(() => {
    if (quote) {
      dispatch(updateQuoteRedux(quote));
    }
  }, [quote]);

  const { downloadQuoteMutation, sendEmailMutation } = useQuotesMutations();

  const { presetQuote, isFetching: isPresetQuoteDetailsFetching } =
    usePresetQuoteDetails({
      templateId: presetQuoteId ?? "",
      enabled: presetQuoteId !== undefined,
      refetchOnFocus: false,
    });

  const quoteRedux = useAppSelector((state) => state.quote);

  const dummyRefNo = `QT-${new Date().getFullYear()}-1`;
  const refNo =
    (quote?.reference_number ?? "").trim().length > 0
      ? (quote?.reference_number as string)
      : dummyRefNo;

  const handleDownload = () => {
    if (!quote) {
      return;
    }
    downloadQuoteMutation.mutate(quote.id, {
      onSuccess: (blob) => {
        saveToDevice(blob, `proposal - ${quote.reference_number}.pdf`);
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };
  const handleEmailSend = () => {
    if (!quote) {
      return;
    }
    sendEmailMutation.mutate(quote.id, {
      onSuccess: (response) => {
        toast.success(response.message);
        setShareModalOpen(false);
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };
  const btnConfigList: CustomBtnProps[] = [
    {
      buttonLabel: "Download",
      leftIcon: downloadQuoteMutation.isPending ? "" : assets.downloadIconWhite,
      disabled: downloadQuoteMutation.isPending,
      onClick: handleDownload,
      isSubmitting: downloadQuoteMutation.isPending,
    },
    {
      buttonLabel: "share",
      leftIcon: assets.shareIconWhite,
      className: `bg-manage-quote-secondary hover:bg-manage-quote-secondary`,
      onClick: () => setShareModalOpen(true),
    },
  ];

  const toggleConfig: CustomToggleGroupProps["toggleConfig"] = [
    {
      btnId: toggleId.Summary,
      btnLabel: "Summary",
    },
    {
      btnId: toggleId.Items,
      btnLabel: "Items",
      disabled: dummyRefNo === refNo,
    },
    {
      btnId: toggleId.Sections,
      btnLabel: "Sections",
      disabled: (quote?.items.length ?? 0) <= 0,
    },
  ];

  return (
    <React.Fragment>
      <HeaderBreadCrumb
        pageName={`${params.id ? `Edit` : `New`} Quote`}
        parentPagePath={location.pathname.split("/").toSpliced(-2).join("/")}
      />

      {isQuoteFetching || isPresetQuoteDetailsFetching ? (
        <div className="flex w-full h-full items-center justify-center">
          <Spinner className="text-brand-dark w-1/10 h-1/10" />
        </div>
      ) : (
        <div className="p-5 flex flex-col gap-6">
          <CustomHeader
            header={`${params.id ? `Edit` : `New`} Quote`}
            btnConfigList={quote ? btnConfigList : []}
          />

          <div className="flex gap-6 overflow-x-auto rounded-[7px]">
            <div className="bg-white rounded-[7px] grow">
              <div className="flex flex-col gap-5 py-5">
                <CustomToggleGroup
                  toggleConfig={toggleConfig}
                  activeId={formCurrSection}
                  toggleActive={changeFormCurrSection}
                  className={`bg-transparent! text-black-text [&_button]:disabled:text-muted create-quote-toggle [&_.btnActive]:border-b [&_.btnActive]:border-brand-dark [&_.btnActive]:text-brand-dark [&_.btnActive]:bg-transparent [&_button]:max-w-22.75! px-2`}
                />
                {formCurrSection === toggleId.Summary && (
                  <QuoteSummaryForm
                    refNo={refNo}
                    currQuote={params.id ? quoteRedux : undefined}
                    submitAction={() => changeFormCurrSection(toggleId.Items)}
                    prefillClient={isClientFetched}
                    defaultClient={defaultClient}
                    presetQuote={presetQuoteId ? presetQuote : undefined}
                  />
                )}
                {formCurrSection === toggleId.Items && (
                  <ItemSelectForm
                    submitAction={() =>
                      changeFormCurrSection(toggleId.Sections)
                    }
                    presetItems={presetQuote?.items}
                  />
                )}

                {formCurrSection === toggleId.Sections && (
                  <SectionSelectForm
                    submitAction={() =>
                      navigate(`/quotes/${quote?.id}`, { replace: true })
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ShareOptions
        isOpen={shareModalOpen}
        toggleIsOpen={setShareModalOpen}
        sendEmailAction={handleEmailSend}
        isEmailSending={sendEmailMutation.isPending}
        clientEmail={quote?.client.email ?? ""}
        downloadLink={`${quote?.url}?download=1`}
        shareLink={quote?.route_url}
        title={`${quote?.reference_number} - ${quote?.id}`}
      />
    </React.Fragment>
  );
}
