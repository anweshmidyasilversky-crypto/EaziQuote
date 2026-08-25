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
};
function MoreOptionsPopup({
  isPopupOpen,
  togglePopupOpen,
  editAction,
  deleteAction,
  contactInfoAction,
  children,
}: MoreOptionsPopupProps) {
  const closePopup = () => togglePopupOpen(false);
  return (
    <Popover open={isPopupOpen} onOpenChange={togglePopupOpen}>
      <PopoverTrigger> {children} </PopoverTrigger>
      <PopoverContent
        className={`popup-theme flex flex-col gap-1  w-fit ring-0`}
        side="bottom"
        align="start"
      >
        <CustomBtn
          leftIcon={assets.phoneIcon}
          buttonLabel="Contact Info"
          onClick={() => {
            contactInfoAction?.();
            closePopup();
          }}
        />
        <CustomBtn
          leftIcon={assets.pencilIcon}
          buttonLabel="Edit"
          onClick={() => {
            editAction?.();
            closePopup();
          }}
        />
        <CustomBtn leftIcon={assets.binIcon} buttonLabel="Delete" />
      </PopoverContent>
    </Popover>
  );
}

export default MoreOptionsPopup;
