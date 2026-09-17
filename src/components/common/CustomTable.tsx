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
  flexRender,
  rowSelectionFeature,
} from "@tanstack/react-table";
import { assets } from "../../assets/icons";
import { memo, useState } from "react";
import { Separator } from "../ui/separator";
import React from "react";
import type {
  ApiResponseMeta,
  PaginationBtnMeta,
} from "@/types/api.responses.type";
import { CustomBtn } from "./CustomBtn";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

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

  paginationBtns?: PaginationBtnMeta[];
  totalRecords?: number;
  startItemNo?: number;
  endItemNo?: number;
  currPageNo?: number;
  setPageNo?: React.Dispatch<React.SetStateAction<number>>;
  lastPageNo?: number;
  isFetching?: boolean;
  paginationMeta?: ApiResponseMeta;

  tableOptionsLeft?: React.ReactNode;
  tableOptionsRight?: React.ReactNode;
  withFooterBorder?: boolean;
  withSelectionToggle?: boolean;
  rowIdSelector?: (row: TData) => string;
}

function CustomTable<TData extends RowData>({
  columns,
  data: renderData,
  title,
  headerSlot,
  customFeatures,
  hiddenCols,
  globalFilterTerm,
  localFilters,
  showPaginated,

  paginationBtns,
  paginationMeta,

  setPageNo,
  isFetching,

  tableOptionsLeft,
  tableOptionsRight,
  withFooterBorder,
  rowIdSelector,
  withSelectionToggle = false,
}: DataTableProps<TData>) {
  const currPageNo = paginationMeta?.current_page;
  console.log(
    `currPage: ${currPageNo}, nextPage: ${Number(currPageNo ?? 0) + 1}`,
  );
  const [rowSelection, setRowSelection] = useState({});
  const data = renderData ?? [];

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

      rowSelectionFeature,

      ...customFeatures,
    }),

    columns,
    data,
    autoResetPageIndex: showPaginated ? false : undefined,

    initialState: {
      columnVisibility: hiddenCols,
    },

    state: {
      columnFilters: localFilters,
      globalFilter: globalFilterTerm,
      rowSelection: withSelectionToggle ? rowSelection : undefined,
    },

    onRowSelectionChange: withSelectionToggle ? setRowSelection : undefined,
    enableRowSelection: withSelectionToggle,

    getRowId: rowIdSelector ? rowIdSelector : undefined,
  });

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
      <div className="w-full h-fit overflow-x-auto">
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

            {isFetching ? (
              <tbody>
                <tr className="w-full">
                  <td colSpan={table.getVisibleLeafColumns().length}>
                    <div className="flex items-center justify-center p-2">
                      <Spinner className="text-brand-dark w-15 h-15 aspect-square" />
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <>
                <tbody>
                  {table.getRowModel().rows.length === 0 ? (
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td
                        colSpan={table.getVisibleLeafColumns().length}
                        className="py-4 text-sm font-normal text-slate-600 whitespace-nowrap text-center"
                      >
                        <div className="flex flex-col gap-4.5">
                          <Separator className={`bg-separator`} />
                          No results found
                          <Separator className={`bg-separator`} />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-6 py-4 text-sm font-normal text-slate-600 whitespace-nowrap"
                          >
                            <div className="flex items-center">
                              {<table.FlexRender cell={cell} />}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>

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
              </>
            )}
          </table>
        </div>

        {/* Table Footer only if pagination is applied*/}
        {/* {showPaginated && pagination && (
          <div className="flex justify-between items-center gap-2 px-6 pt-6">
            <span className="text-placeholder-text max-h-3.75 font-normal text-[12px] items-center">
              {" "}
              Showing <b> {startItemNo} </b> to <b> {endItemNo} </b> of{" "}
              {totalRecords} items{" "}
            </span>

            
            <div className="w-fit flex justify-between gap-2 min-h-8 items-center">
              <button
                type="button"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
                className="pagination-btn flex items-center"
              >
                <span> Previous </span>
              </button>

              
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
        )} */}

        {showPaginated && (
          <div className="flex justify-between items-center gap-2 px-6 pt-6">
            <span className="text-placeholder-text max-h-3.75 font-normal text-[12px] items-center">
              {" "}
              Showing <b> {paginationMeta?.from ?? 0} </b> to{" "}
              <b> {paginationMeta?.to ?? 0} </b> of {paginationMeta?.total ?? 0}{" "}
              items{" "}
            </span>

            <div className="w-fit flex justify-between gap-2 min-h-8 items-center">
              {paginationBtns?.map((paginationBtn, index) => {
                let label = paginationBtn.label;
                if (index === 0) {
                  label = "Previous";
                } else if (index === paginationBtns?.length - 1) {
                  label = "Next";
                }
                return (
                  <CustomBtn
                    key={label}
                    buttonLabel={label}
                    onClick={() => {
                      if (index === 0) {
                        setPageNo?.((curr) => Math.max(1, curr - 1));
                      } else if (index === paginationBtns?.length - 1) {
                        setPageNo?.((curr) =>
                          Math.min(
                            Number(paginationMeta?.last_page ?? 1),
                            curr + 1,
                          ),
                        );
                      } else {
                        if (!Number.isNaN(Number(label))) {
                          setPageNo?.(Number(label));
                        }
                      }
                    }}
                    btncls={cn(
                      `table-pagination-btn-common min-w-fit translate-y-0 table-pagination-btn-inactive hover:bg-transparent hover:text-black-text
                      ${paginationBtn.active ? `bg-brand-dark! text-white! max-w-8.5!` : ``}
                       ${
                         ["Previous", "Next"].includes(label)
                           ? `table-pagination-btn-common!`
                           : ``
                       } `,
                    )}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export const CustomDataTable = memo(CustomTable) as typeof CustomTable;
