export type CheckboxConfig = {
  id: string;
  label: string;
  value: string;
}[];
export type RenderMultiSelectCheckboxProps = {
  checkboxconfig: CheckboxConfig;
  selectedFilters: string[];
  toggleSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>;
};
export function RenderMultiSelectCheckbox({
  checkboxconfig,
  selectedFilters,
  toggleSelectedFilters,
}: RenderMultiSelectCheckboxProps) {
  const selectHandler = (filterValue: string) => {
    if (selectedFilters.includes(filterValue)) {
      toggleSelectedFilters((curr) =>
        curr.filter((currFilter) => currFilter !== filterValue),
      );
    } else {
      toggleSelectedFilters((curr) => [...curr, filterValue]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {checkboxconfig.map((checkbox) => (
        <div key={checkbox.id} className="flex gap-2 min-h-5">
          <input
            id={checkbox.id}
            value={checkbox.value}
            type="checkbox"
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
