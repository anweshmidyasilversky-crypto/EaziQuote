import type {
  Align,
  Side,
} from "@base-ui/react/internals/useAnchorPositioning";
import { assets } from "../../assets/icons";
import { CustomBtn } from "../common/CustomBtn";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export type MoreOptionsPopupProps = {
  isPopupOpen: boolean;
  togglePopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editAction?: () => void;
  deleteAction?: () => void;
  contactInfoAction?: () => void;
  children?: React.ReactNode;
  withContactInfo?: boolean;
  withCopyOption?: boolean;
  copyAction?: () => void;
  align?: Align;
  side?: Side;
  popoverTarget?: string;
  withEdit?: boolean;
  withDownload?: boolean;
  downloadAction?: () => void;
  withShare?: boolean;
  shareAction?: () => void;
  withDelete?: boolean;
};

function MoreOptionsPopup({
  isPopupOpen,
  togglePopupOpen,
  editAction,
  deleteAction,
  contactInfoAction,
  children,
  withContactInfo,
  withCopyOption = false,
  copyAction,
  align,
  side,
  popoverTarget,
  withEdit = true,
  withDownload,
  downloadAction,
  withShare,
  shareAction,
  withDelete = true,
}: MoreOptionsPopupProps) {
  const closePopup = () => togglePopupOpen(false);
  return (
    <Popover open={isPopupOpen} onOpenChange={togglePopupOpen}>
      <PopoverTrigger> {children} </PopoverTrigger>
      <PopoverContent
        className={`popup-theme flex flex-col gap-1  w-fit ring-0`}
        side={side ?? "bottom"}
        align={align ?? "start"}
        popoverTarget={popoverTarget}
      >
        {withContactInfo && (
          <CustomBtn
            leftIcon={assets.phoneIcon}
            buttonLabel="Contact Info"
            onClick={() => {
              contactInfoAction?.();
              closePopup();
            }}
          />
        )}
        {withEdit && (
          <CustomBtn
            leftIcon={assets.pencilIcon}
            buttonLabel="Edit"
            onClick={() => {
              editAction?.();
              closePopup();
            }}
          />
        )}

        {withCopyOption && (
          <CustomBtn
            leftIcon={assets.copyIcon}
            buttonLabel="Duplicate"
            onClick={() => {
              copyAction?.();
              closePopup();
            }}
          />
        )}

        {withDownload && (
          <CustomBtn
            buttonLabel="Download"
            leftIcon={assets.downloadIconBlack}
            onClick={() => {
              closePopup();
              downloadAction?.();
            }}
          />
        )}

        {withShare && (
          <CustomBtn
            buttonLabel="Share"
            leftIcon={assets.shareIconBlack}
            onClick={() => {
              closePopup();
              shareAction?.();
            }}
          />
        )}

        {withDelete && (
          <CustomBtn
            leftIcon={assets.binIcon}
            buttonLabel="Delete"
            onClick={() => {
              deleteAction?.();
              closePopup();
            }}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

export default MoreOptionsPopup;
