import { useState } from "react";
import { assets } from "../../assets/icons";
import MoreOptionsPopup from "../clients/MoreOptionsPopup";
import useAdminMutation from "@/hooks/apis/admin/useAdminMutation";
import { toast } from "react-toastify";
import { saveToDevice } from "@/lib/utils/helper";
import { showErrorToast } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/constants/endPoints";
import { BASE_URL } from "@/constants/urls";
import useQuotesMutations from "@/hooks/apis/quotes/useQuotesMutations";
import DeleteDialog from "./DeleteDialog";

export type FileConfig = {
  fileName: string;
  moreOptionsAction?: () => void;
  withDelete?: boolean;
  editAction?: () => void;
  deleteAction?: () => void;
  attachmentId?: number;
  quoteId?: number;
  withDownload?: boolean;
  withOpen?: boolean;
  defaultOpenUrl?: string;
};

function StyledAttachments({
  fileName,
  withDelete = true,
  editAction,
  deleteAction,
  attachmentId,
  withDownload,
  withOpen,
  defaultOpenUrl,
  quoteId,
}: FileConfig) {
  const [openMoreAction, toggleOpenMoreAction] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { attachmentDownloadMutation } = useAdminMutation();

  const { attachmentDeleteMutation } = useQuotesMutations();

  const handleAttachmentDelete = () => {
    if (quoteId && attachmentId) {
      attachmentDeleteMutation.mutate(
        {
          quote_id: quoteId,
          attachment_id: attachmentId,
        },
        {
          onSuccess: (response) => {
            toast.success(response.message);
            setDeleteModalOpen(false);
            deleteAction?.();
          },
          onError: (error) => {
            showErrorToast(error);
          },
        },
      );
    } else {
      deleteAction?.();
    }
  };

  const handleAttachmentDownload = () => {
    if (!attachmentId) {
      toast.error(`No attachment id provided for download`);
      return;
    }
    attachmentDownloadMutation.mutate(attachmentId, {
      onSuccess: (blob) => {
        saveToDevice(blob, fileName);
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  const handleAttachmentShow = () => {
    if (!(attachmentId || defaultOpenUrl)) {
      toast.error(`No attachment id provided for download`);
      return;
    }
    window.open(
      attachmentId
        ? BASE_URL + API_ENDPOINTS.admin.attachmentPreview(attachmentId)
        : defaultOpenUrl,
      "_blank",
    );
  };

  return (
    <div className="attachment-box px-2">
      <div className="min-h-8 flex gap-3 items-center">
        <div className="bg-table-head w-8 rounded-xs aspect-square flex items-center justify-center cursor-pointer">
          <img src={assets.attachmentIcon} className="w-4 aspect-square" />
        </div>
        <span className="text-wrap wrap-anywhere"> {`${fileName}`} </span>
      </div>

      <div className="flex w-full h-full justify-end items-center">
        <MoreOptionsPopup
          isPopupOpen={openMoreAction}
          togglePopupOpen={toggleOpenMoreAction}
          editAction={editAction}
          deleteAction={() => setDeleteModalOpen(true)}
          withEdit={false}
          withDownload={withDownload}
          downloadAction={handleAttachmentDownload}
          withOpen={withOpen}
          openFn={handleAttachmentShow}
          withDelete={withDelete}
        >
          <div className="cursor-pointer w-5 h-5 flex">
            <img src={assets.moreIcon} className="w-3.75 h-0.75 self-center" />
          </div>
        </MoreOptionsPopup>
      </div>

      <DeleteDialog
        isOpen={deleteModalOpen}
        toggleOpen={setDeleteModalOpen}
        deleteAction={handleAttachmentDelete}
        isPending={attachmentDeleteMutation.isPending}
      />
    </div>
  );
}

export default StyledAttachments;
