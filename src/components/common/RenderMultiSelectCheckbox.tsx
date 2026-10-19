import { cn } from "@/lib/utils/helper";

export type CheckboxConfig = {
  id: string;
  label: string;
  value: string;
}[];
export type RenderMultiSelectCheckboxProps = {
  checkboxconfig: CheckboxConfig;
  selectedFilters: string[];
  toggleSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>;
  type?: "single" | "multiple";
};
export function RenderMultiSelectCheckbox({
  checkboxconfig,
  selectedFilters,
  toggleSelectedFilters,
  type = "multiple",
}: RenderMultiSelectCheckboxProps) {
  const selectHandler = (filterValue: string) => {
    if (selectedFilters.includes(filterValue)) {
      toggleSelectedFilters((curr) =>
        curr.filter((currFilter) => currFilter !== filterValue),
      );
    } else {
      if (type === "multiple") {
        toggleSelectedFilters((curr) => [...curr, filterValue]);
      } else {
        toggleSelectedFilters([filterValue]);
      }
    }
  };

  return (
    <div
      className={cn(
        "gap-4 mt-4",
        type === "multiple" ? `grid grid-cols-2` : `flex flex-col`,
      )}
    >
      {checkboxconfig.map((checkbox) => (
        <div key={checkbox.id} className="flex gap-2 min-h-5">
          <input
            id={checkbox.id}
            value={checkbox.value}
            type={type === "multiple" ? "checkbox" : "radio"}
            className="roudned w-5 aspect-square"
            checked={selectedFilters?.includes(checkbox.value)}
            onChange={(e) => selectHandler(e.target.value)}
          />
          <label
            htmlFor={checkbox.id}
            className="min-h-4.75 text-[16px] cursor-pointer"
          >
            {checkbox.label}
          </label>
        </div>
      ))}
    </div>
  );
}
