import { CustomBtn } from "./CustomBtn";
import { assets } from "../../assets/icons";

export type FilterBtnProps = {
  toggleFilterSheetOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

function FilterBtn({ toggleFilterSheetOpen }: FilterBtnProps) {
  return (
    <CustomBtn
      leftIcon={assets.filterIcon}
      buttonLabel="Filters"
      bgColor="bg-client-secondary"
      onClick={() => toggleFilterSheetOpen?.((curr) => !curr)}
    />
  );
}

export default FilterBtn;
