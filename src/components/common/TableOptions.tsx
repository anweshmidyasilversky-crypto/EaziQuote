import { assets } from "../../assets/icons";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { CustomBtn } from "./customBtn";

export type TableOptionsProp = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

export function TableOptions({ searchTerm, setSearchTerm }: TableOptionsProp) {
  return (
    <div className="flex justify-between min-h-9.5 px-5">
      <InputGroup className="flex gap-2.25 rounded-[7px] min-h-9.5 max-w-75 ring-0 border border-searchbox-border focus-within:ring-0 focus-within:border focus-within:border-searchbox-border has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-searchbox-border">
        <InputGroupAddon className="w-4.5 h-4.5">
          <img
            src={assets.searchIcon}
            className="max-h-[13.5px] max-w-[13.5px]"
          />
        </InputGroupAddon>

        <InputGroupInput
          placeholder="Search clients"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </InputGroup>

      <CustomBtn
        leftIcon={assets.filterIcon}
        buttonLabel="Filters"
        bgColor="bg-client-secondary"
      />
    </div>
  );
}
