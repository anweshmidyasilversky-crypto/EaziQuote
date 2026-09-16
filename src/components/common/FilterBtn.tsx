import { CustomBtn } from "./CustomBtn";
import { assets } from "../../assets/icons";
import { memo } from "react";

export type FilterBtnProps = {
  toggleFilterSheetOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const FilterBtn = memo(({ toggleFilterSheetOpen }: FilterBtnProps) => {
  return (
    <CustomBtn
      leftIcon={assets.filterIcon}
      buttonLabel="Filters"
      bgColor="bg-client-secondary"
      onClick={() => toggleFilterSheetOpen?.((curr) => !curr)}
    />
  );
});

export default FilterBtn;
