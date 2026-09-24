import { assets } from "../../assets/icons";

export type CustomActionGroupProps = {
  openFn?: () => void;
  editFn?: () => void;
  deleteFn?: () => void;
  downloadFn?: () => void;
  withOpen?: boolean;
  withDelete?: boolean;
  withEdit?: boolean;
  withShare?: boolean;

  paymentActionGroup?: boolean;
  paymentPending?: boolean;
  shareAction?: () => void;
  downloadOnly?: boolean;
  isDeletePending?: boolean;
};

export type ActionBtnList = Array<{
  id: string;
  icon: string;
  action?: () => void;
}>;

export function CustomActionGroup({
  openFn,
  editFn,
  deleteFn,
  shareAction,
  withOpen = true,
  downloadOnly,
  downloadFn,
  withDelete = true,
  withShare = false,
  withEdit = true,
}: CustomActionGroupProps) {
  const btnList: ActionBtnList = [
    {
      id: "openEye",
      icon: assets.openEyeIcon,
      action: () => openFn?.(),
    },
    {
      id: "editPencil",
      icon: assets.pencilIcon,
      action: () => editFn?.(),
    },
    {
      id: "deleteBin",
      icon: assets.binIcon,
      action: () => deleteFn?.(),
    },
  ];

  if (!withEdit) {
    btnList.splice(1, 1);
  }

  if (!withOpen) {
    btnList.splice(0, 1);
  }
  if (!withDelete) {
    btnList.splice(btnList.length - 1, 1);
  }
  if (downloadOnly) {
    btnList.splice(0, btnList.length);
    btnList.push({
      id: "download",
      icon: assets.downloadIconBlue,
      action: downloadFn,
    });
  }

  if (withShare) {
    btnList.push({
      id: "share",
      icon: assets.shareIcon,
      action: shareAction,
    });
  }

  return (
    <>
      <div className="flex gap-2 min-h-6 min-w-6 w-fit items-center shrik-0">
        {btnList.map((btn) => {
          return (
            <button
              key={btn.id}
              onClick={btn.action}
              className="flex w-4 shrink-0 items-center justify-center"
            >
              <img src={btn.icon} className="w-4 aspect-square" />
            </button>
          );
        })}
      </div>
    </>
  );
}
