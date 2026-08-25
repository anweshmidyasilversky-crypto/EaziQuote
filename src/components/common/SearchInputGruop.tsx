import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { assets } from "../../assets/icons";

export type SearchInputGruopProps = {
  searchTerm: string;
  searchPlaceHolder?: string;
  setSearchTerm?: React.Dispatch<React.SetStateAction<string>>;
};

export function SearchInputGruop({
  searchTerm,
  searchPlaceHolder,
  setSearchTerm,
}: SearchInputGruopProps) {
  return (
    <InputGroup className="flex gap-2.25 rounded-[7px] min-h-9.5 max-w-75 ring-0 border border-searchbox-border focus-within:ring-0 focus-within:border focus-within:border-searchbox-border has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-searchbox-border">
      <InputGroupAddon className="w-4.5 h-4.5">
        <img
          src={assets.searchIcon}
          className="max-h-[13.5px] max-w-[13.5px]"
        />
      </InputGroupAddon>

      <InputGroupInput
        placeholder={searchPlaceHolder ?? "Search clients"}
        value={searchTerm}
        onChange={(event) => setSearchTerm?.(event.target.value)}
      />
    </InputGroup>
  );
}

export default SearchInputGruop;
