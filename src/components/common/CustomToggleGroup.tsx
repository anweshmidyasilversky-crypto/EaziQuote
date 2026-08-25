export type CustomToggleGroupProps = {
  toggleConfig: {
    btnLabel: string;
    btnId: string;
  }[];
  activeId: string;
  toggleActive: React.Dispatch<React.SetStateAction<string>>;
};

export function CustomToggleGroup({
  toggleConfig,
  activeId,
  toggleActive,
}: CustomToggleGroupProps) {
  const isActive = (id: string) => id === activeId;
  return (
    <div className="w-full min-h-8.75 border-b border-b-client-detail-secondary">
      {/* Table Toggles */}
      <div className="flex">
        {toggleConfig.map((toggleBtn) => (
          <button
            className={`${isActive(toggleBtn.btnId) ? "btn-auth" : ""} rounded-b-none w-34.5 min-h-4.75`}
            onClick={() => toggleActive(toggleBtn.btnId)}
            key={toggleBtn.btnId}
          >
            {toggleBtn.btnLabel}
          </button>
        ))}
      </div>
    </div>
  );
}
