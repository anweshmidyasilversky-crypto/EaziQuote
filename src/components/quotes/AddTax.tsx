import type { Vat } from "@/types/api.responses.type";
import CustomDialog from "../common/CustomDialog";
import { CustomCombobox } from "../common/CustomCombobox";
import { useRef, useState } from "react";

export type AddTaxProps = {
  isOpen: boolean;
  toggleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  vatSettings: Vat[];
  setTaxId: (num: Vat | undefined) => void;
};

function AddTax({ isOpen, toggleIsOpen, vatSettings, setTaxId }: AddTaxProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const selectedTaxRate = useRef<Vat | undefined>(undefined);

  const handleTax = (vat: Vat | undefined) => {
    if (vat) {
      setTaxId(vat);
    }
  };

  return (
    <CustomDialog
      dialogOpen={isOpen}
      toggleDialogOpen={toggleIsOpen}
      header="Select VAT / Tax Rate"
      withFooter
      footerBtnLabel="Apply Tax"
      footerBtnAction={() => handleTax(selectedTaxRate.current)}
    >
      <div className="p-5 md:min-w-125">
        <CustomCombobox
          items={vatSettings}
          getItemLabel={(vatSetting) => {
            if (vatSetting) {
              return vatSetting.name;
            }
            return "";
          }}
          inptFieldValue={searchTerm}
          inptFieldChange={(query) => setSearchTerm(query)}
          filterFn={(item, query) => {
            return Object.values(item).some((val) =>
              String(val)
                .toLocaleLowerCase()
                .includes(query.toLocaleLowerCase()),
            );
          }}
          placeholder="Select a taxrate option"
          onValueChange={(vat) => {
            if (vat) {
              selectedTaxRate.current = vat;
              setSearchTerm(vat.name);
            }
          }}
        />
      </div>
    </CustomDialog>
  );
}

export default AddTax;
