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
  flexRender,
} from "@tanstack/react-table";
import { assets } from "../../assets/icons";
import { memo, useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import React from "react";

export interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<TableFeatures, TData>[];
  data: TData[];
  title?: string;
  headerSlot?: React.ReactNode;
  customFeatures?: TableFeatures;
  hiddenCols?: ColumnVisibilityState;
  globalFilterTerm?: string;
  localFilters?: ColumnFiltersState;
  showPaginated?: boolean;

  tableOptionsLeft?: React.ReactNode;
  tableOptionsRight?: React.ReactNode;
  withFooterBorder?: boolean;
}

function CustomTable<TData extends RowData>({
  columns,
  data,
  title,
  headerSlot,
  customFeatures,
  hiddenCols,
  globalFilterTerm,
  localFilters,
  showPaginated,

  tableOptionsLeft,
  tableOptionsRight,
  withFooterBorder,
}: DataTableProps<TData>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const totalRecords = data.length;
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

  useEffect(() => {
    setPagination?.((curr) => ({ ...curr, pageIndex: 0 }));
  }, [localFilters, globalFilterTerm]);

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
    autoResetPageIndex: showPaginated ? false : undefined,

    onPaginationChange: showPaginated ? setPagination : undefined,

    initialState: {
      columnVisibility: hiddenCols,
    },

    state: {
      columnFilters: localFilters,
      globalFilter: globalFilterTerm,
      pagination: showPaginated ? pagination : undefined,
    },
  });

  const pageCount = table.getPageCount();
  const currentPage = pagination.pageIndex;
  const visiblePages = 3;

  let startPage = Math.max(0, currentPage - 1);
  let endPage = startPage + visiblePages - 1;

  if (endPage >= pageCount) {
    endPage = pageCount - 1;
    startPage = Math.max(0, endPage - visiblePages + 1);
  }

  const pageNumbers = Array.from(
    { length: Math.max(0, endPage - startPage + 1) },
    (_, i) => startPage + i,
  );

  return (
    <>
      {/* Table Options */}
      {(tableOptionsLeft || tableOptionsRight) && (
        <div className="flex justify-between min-h-9.5 px-5">
          {tableOptionsLeft}
          {tableOptionsRight}
        </div>
      )}

      {/* Table */}
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

            {/* Table Footer */}
            <tfoot>
              {withFooterBorder && (
                <tr className="h-4 pointer-events-none select-none">
                  <td colSpan={table.getVisibleFlatColumns().length}>
                    {" "}
                    <Separator className={`bg-separator`} />{" "}
                  </td>
                </tr>
              )}
              {table.getFooterGroups().map((footerGroup) => (
                <tr
                  key={footerGroup.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  {footerGroup.headers.map((header) => (
                    <td
                      key={header.id}
                      className="px-6 py-4 text-sm font-normal text-slate-600 whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext(),
                          )}
                    </td>
                  ))}
                </tr>
              ))}
            </tfoot>
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

              {/* First page + left ellipsis */}
              {startPage > 0 && (
                <>
                  <button
                    className={`table-pagination-btn-common ${
                      currentPage === 0 ? "" : "table-pagination-btn-inactive"
                    }`}
                    onClick={() =>
                      setPagination((curr) => ({
                        ...curr,
                        pageIndex: 0,
                      }))
                    }
                  >
                    1
                  </button>

                  {startPage > 1 && (
                    <span className="table-pagination-btn-inactive min-w-8.5 min-h-8 rounded text-center hover:text-black-text">
                      ...
                    </span>
                  )}
                </>
              )}

              {/* Current page window */}
              {pageNumbers.map((pageIndex) => (
                <button
                  key={pageIndex}
                  className={`table-pagination-btn-common ${
                    currentPage === pageIndex
                      ? ""
                      : "table-pagination-btn-inactive"
                  }`}
                  onClick={() =>
                    setPagination((curr) => ({
                      ...curr,
                      pageIndex,
                    }))
                  }
                >
                  {pageIndex + 1}
                </button>
              ))}

              {/* Right ellipsis + last page */}
              {endPage < pageCount - 1 && (
                <>
                  {endPage < pageCount - 2 && (
                    <span className="table-pagination-btn-inactive min-w-8.5 min-h-8 rounded text-center hover:text-black-text">
                      ...
                    </span>
                  )}

                  <button
                    className={`table-pagination-btn-common ${
                      currentPage === pageCount - 1
                        ? ""
                        : "table-pagination-btn-inactive"
                    }`}
                    onClick={() =>
                      setPagination((curr) => ({
                        ...curr,
                        pageIndex: pageCount - 1,
                      }))
                    }
                  >
                    {pageCount}
                  </button>
                </>
              )}

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
    </>
  );
}

export const CustomDataTable = memo(CustomTable) as typeof CustomTable;
