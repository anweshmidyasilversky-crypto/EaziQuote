import { useState } from "react";
import { assets } from "../../assets/icons";
import MoreOptionsPopup from "../clients/MoreOptionsPopup";

export type FileConfig = {
  fileName: string;
  moreOptionsAction?: () => void;
  editAction?: () => void;
  deleteAction?: () => void;
};

function StyledAttachments({ fileName, editAction, deleteAction }: FileConfig) {
  const [openMoreAction, toggleOpenMoreAction] = useState(false);
  return (
    <div className="attachment-box">
      <div className="min-h-8 flex gap-3 items-center">
        <div className="bg-table-head w-8 rounded-xs aspect-square flex items-center justify-center cursor-pointer">
          <img src={assets.attachmentIcon} className="w-4 aspect-square" />
        </div>
        <span> {`${fileName}`} </span>
      </div>

      <MoreOptionsPopup
        isPopupOpen={openMoreAction}
        togglePopupOpen={toggleOpenMoreAction}
        editAction={editAction}
        deleteAction={deleteAction}
      >
        <span className="cursor-pointer">
          <img
            src={assets.moreIcon}
            className="w-3.75 h-0.75"
            onClick={() => toggleOpenMoreAction((curr) => !curr)}
          />
        </span>
      </MoreOptionsPopup>
    </div>
  );
}

export default StyledAttachments;
