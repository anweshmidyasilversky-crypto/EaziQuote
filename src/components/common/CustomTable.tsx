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
  createPaginatedRowModel,
  rowPaginationFeature,
  type PaginationState,
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
  showPaginated?: boolean;
  totalRecords?: number;
  pagination?: PaginationState;
  setPagination?: React.Dispatch<React.SetStateAction<PaginationState>>;
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
  showPaginated,
  totalRecords,
  pagination,
  setPagination,
}: DataTableProps<TData>) {
  let startItemNo: number | undefined;
  let endItemNo: number | undefined;
  if (pagination) {
    startItemNo =
      pagination && data.length > 0
        ? pagination.pageIndex * pagination.pageSize + 1
        : 0;

    endItemNo =
      pagination && data.length > 0
        ? Math.min(
            (pagination.pageIndex + 1) * pagination.pageSize,
            totalRecords ?? data.length,
          )
        : 0;
  }

  const table = useTable({
    features: tableFeatures({
      ...coreFeatures,
      columnVisibilityFeature,

      rowSortingFeature,
      sortedRowModel: createSortedRowModel(),

      globalFilteringFeature,
      columnFilteringFeature,
      filteredRowModel: createFilteredRowModel(),

      rowPaginationFeature,
      paginatedRowModel: createPaginatedRowModel(),

      ...customFeatures,
    }),

    columns,
    data,
    autoResetPageIndex: false,

    onPaginationChange: setPagination,

    initialState: {
      columnVisibility: hiddenCols,
    },

    state: {
      columnFilters: localFilters,
      globalFilter: globalFilterTerm,
      pagination,
    },
  });

  return (
    <div className="w-full h-fit">
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
                {headerGroup.headers.map((header) => (
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
                ))}
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

      {/* Table Footer only if pagination is applied*/}
      {showPaginated && pagination && (
        <div className="flex justify-between px-6 pt-6">
          <span className="text-placeholder-text max-h-3.75 font-normal text-[12px] items-center">
            {" "}
            Showing <b> {startItemNo} </b> to <b> {endItemNo} </b> of{" "}
            {totalRecords} items{" "}
          </span>

          {/* Pagination Navigation buttons */}
          <div className="w-fit flex justify-between gap-2 min-h-8 items-center">
            <button
              type="button"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              className="pagination-btn flex items-center"
            >
              <span> Previous </span>
            </button>

            <span className="btn-auth rounded-1 font-regular text-[14px] max-w-8.5 max-h-8">
              {pagination.pageIndex + 1}
            </span>

            <button
              type="button"
              disabled={!table.getCanNextPage()}
              onClick={() => {
                table.nextPage();
              }}
              className="pagination-btn flex items-center"
            >
              <span>Next</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
