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
        <CustomBtn
          leftIcon={assets.pencilIcon}
          buttonLabel="Edit"
          onClick={() => {
            editAction?.();
            closePopup();
          }}
        />

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

        <CustomBtn
          leftIcon={assets.binIcon}
          buttonLabel="Delete"
          onClick={() => {
            deleteAction?.();
            closePopup();
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export default MoreOptionsPopup;
