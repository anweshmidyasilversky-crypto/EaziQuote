import React from "react";
import {
  useTable,
  tableFeatures,
  columnVisibilityFeature,
  coreFeatures,
  type ColumnDef,
  type RowData,
  type TableFeatures,
  type ColumnVisibilityState,
  rowSortingFeature,
  createSortedRowModel,
  globalFilteringFeature,
  columnFilteringFeature,
  createFilteredRowModel,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { assets } from "../../assets/icons";

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<TableFeatures, TData>[];
  data: TData[];
  title?: string;
  headerSlot?: React.ReactNode;
  customFeatures?: TableFeatures;
  hiddenCols?: ColumnVisibilityState;
  globalFilterTerm?: string;
  localFilters?: ColumnFiltersState;
}

export function CustomDataTable<TData extends RowData>({
  columns,
  data,
  title,
  headerSlot,
  customFeatures,
  hiddenCols,
  globalFilterTerm,
  localFilters,
}: DataTableProps<TData>) {
  // baseline feature set for this component as an array
  const extraFeatures = tableFeatures({
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
    globalFilteringFeature,
    columnFilteringFeature,
    filteredRowModel: createFilteredRowModel(),
  });
  const baseFeatures = [coreFeatures, columnVisibilityFeature];

  const table = useTable({
    features: tableFeatures({
      ...customFeatures,
      ...baseFeatures,
      ...extraFeatures,
    }),
    columns,
    data,
    initialState: {
      columnVisibility: hiddenCols,
      globalFilter: globalFilterTerm,
    },
    state: {
      columnFilters: localFilters,
    },
  });

  return (
    <div className="w-full">
      {/* Header Slot / Title Bar */}
      {(title || headerSlot) && (
        <div className="p-4 flex items-center justify-between">
          {title ? (
            <h2 className="text-base font-medium text-placeholder-text">
              {title}
            </h2>
          ) : (
            <div />
          )}
          {headerSlot && <div>{headerSlot}</div>}
        </div>
      )}

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-table-head">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  // if (
                  //   localFilters &&
                  //   Object.keys(localFilters || {}).includes(header.id)
                  // ) {
                  //   console.log(`Found filter on ${header.id}`);
                  //   header.column.setFilterValue(
                  //     localFilters[header.id as keyof TData],
                  //   );
                  // }
                  return (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex justify-between ${header.column.getCanSort() ? "cursor-pointer" : ""}`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <table.FlexRender header={header} />
                          <div className="flex flex-col gap-1 max-w-1.5 max-h-2.5 items-center justify-center">
                            {header.column.getCanSort() &&
                              ["asc", false].includes(
                                header.column.getIsSorted(),
                              ) && (
                                <img
                                  src={assets.ascSortIcon}
                                  className="w-full h-0.75"
                                />
                              )}

                            {header.column.getCanSort() &&
                              ["desc", false].includes(
                                header.column.getIsSorted(),
                              ) && (
                                <img
                                  src={assets.ascSortIcon}
                                  className="w-full h-0.75 -rotate-180"
                                />
                              )}
                          </div>
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 text-sm font-normal text-slate-600 whitespace-nowrap"
                  >
                    {<table.FlexRender cell={cell} />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
