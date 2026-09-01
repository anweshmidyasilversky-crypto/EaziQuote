import { Button as ButtonPrimitive } from "@base-ui/react";
export type CustomToggleGroupProps = {
  toggleConfig: {
    btnLabel: string;
    btnId: string;
    disabled?: boolean;
  }[];
  activeId: string;
  toggleActive: React.Dispatch<React.SetStateAction<string>>;
  containerCls?: string;
  btnCls?: string;
} & ButtonPrimitive.Props;

export function CustomToggleGroup({
  toggleConfig,
  activeId,
  toggleActive,
  className,
  containerCls,
  btnCls,
}: CustomToggleGroupProps) {
  const isActive = (id: string) => id === activeId;
  return (
    <div
      className={`w-full min-h-8.75 border-b border-b-client-detail-secondary ${containerCls}`}
    >
      {/* Table Toggles */}
      <div className={`flex ${className}`}>
        {toggleConfig.map((toggleBtn) => (
          <button
            className={`${isActive(toggleBtn.btnId) ? "btn-auth btnActive" : ""} rounded-b-none w-34.5 min-h-4.75 ${btnCls}`}
            onClick={() => toggleActive(toggleBtn.btnId)}
            key={toggleBtn.btnId}
            disabled={toggleBtn.disabled || false}
          >
            {toggleBtn.btnLabel}
          </button>
        ))}
      </div>
    </div>
  );
}
