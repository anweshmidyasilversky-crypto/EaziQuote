import { assets } from "../../assets/icons";

export type CustomActionGroupProps = {
  openFn?: () => void;
  editFn?: () => void;
  deleteFn?: () => void;
  withOpen?: boolean;

  paymentActionGroup?: boolean;
  paymentPending?: boolean;
  shareAction?: () => void;
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
  paymentActionGroup,
  paymentPending,
  shareAction,
  withOpen = true,
}: CustomActionGroupProps) {
  const btnList: ActionBtnList = [
    {
      id: "openEye",
      icon: assets.openEyeIcon,
      action: openFn,
    },
    {
      id: "editPencil",
      icon: assets.pencilIcon,
      action: editFn,
    },
    {
      id: "deleteBin",
      icon: assets.binIcon,
      action: deleteFn,
    },
  ];
  if (!withOpen) {
    btnList.splice(0, 1);
  }
  return (
    <div className="flex gap-2 min-h-6 min-w-6 w-fit shrik-0">
      {btnList.map((btn) => {
        if (paymentActionGroup && btn.id !== "openEye") {
          return <></>;
        }
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

      {paymentActionGroup && paymentPending && (
        <button
          onClick={shareAction}
          className="flex w-4 shrink-0 items-center justify-center"
        >
          <img src={assets.shareIcon} className="w-4 aspect-square" />
        </button>
      )}
    </div>
  );
}
