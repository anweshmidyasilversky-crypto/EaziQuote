import { assets } from "../../assets/icons";

export type CustomActionGroupProps = {
  openFn?: () => void;
  editFn?: () => void;
  deleteFn?: () => void;
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
  return (
    <div className="flex gap-2 min-h-6 min-w-6 w-fit max-w-25">
      {btnList.map((btn) => (
        <button key={btn.id} onClick={btn.action}>
          <img src={btn.icon} className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
