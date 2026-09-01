import { assets } from "../../assets/icons";
import { type CustomBtnProps } from "../../components/common/CustomBtn";
import {
  filterFn_includesString,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type TableFeatures,
} from "@tanstack/react-table";
import { type ClientDataWithFilters } from "../../constants/dummyData";
import { CustomActionGroup } from "../../components/common/CustomActionGroup";
import { ClientNameBadge } from "../../components/common/ClientNameBadge";
import { CustomDataTable } from "../../components/common/CustomTable";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "../../hooks/debounce.hook";

import { ClientForm } from "../../components/clients/ClientForm";
import { CustomSheet } from "../../components/common/CustomSheet";
import { useNavigate } from "react-router";
import type { ClientCreationPayload } from "../../types/clientCreation.payload.type";
import { nanoid } from "@reduxjs/toolkit";
import SearchInputGruop from "../../components/common/SearchInputGruop";
import FilterBtn from "../../components/common/FilterBtn";
import { CustomHeader } from "../../components/common/CustomHeader";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { addClient, updateClient } from "../../redux/slices/clients.slice";
import { clientToDisplayData } from "../../lib/utils";
import type { ClientEditPayload } from "../../types/clientEdit.payload.type";
import type { Client } from "../../types/client.type";

export function ClientIndexPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeFilter, toggleActiveFilter] = useState<string>("recent");
  const [isFilterOpen, toggleFilterOpen] = useState(false);
  const [clientEditModal, toggleClientEditModal] = useState(false);
  const [targetClient, setTargetClient] = useState<Client>();
  const [searchParam, setSearchParam] = useState("");

  const [isPopoverOpen, toggleIsPopoverOpen] = useState(false);

  // ── Redux state ─────────────────────────────────────────────────────────────
  const reduxClients = useAppSelector((state) => state.clients);
  const reduxQuotes = useAppSelector((state) => state.quotes);

  // Map Client[] → ClientDataWithFilters[] (activityCount from quote count)
  const baseClientData: ClientDataWithFilters[] = useMemo(
    () => reduxClients.map((c) => clientToDisplayData(c, reduxQuotes)),
    [reduxClients, reduxQuotes],
  );
  const [clientData, setClientData] = useState<ClientDataWithFilters[]>([]);
  useEffect(() => {
    setClientData(
      baseClientData.toSorted(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    );
  }, [baseClientData]);

  const columns = useMemo(
    () =>
      [
        {
          accessorKey: "client",
          header: "CLIENT",
          filterFn: filterFn_includesString,
          cell: (info) => <ClientNameBadge name={info.getValue<string>()} />,
        },
        {
          accessorKey: "company",
          header: "COMPANY",
        },
        {
          accessorKey: "phone",
          header: "PHONE",
          enableSorting: false,
        },
        {
          accessorKey: "email",
          header: "EMAIL",
          enableSorting: false,
        },
        {
          accessorKey: "activityCount",
        },
        {
          accessorKey: "createdAt",
        },
        {
          id: "actions",
          header: "ACTION",
          enableSorting: false,
          cell: (info) => {
            const client = info.row.original;
            return (
              <CustomActionGroup
                openFn={() => navigate(`/clients/${client.id}`)}
                editFn={() => {
                  setTargetClient({
                    ...client,
                    street: "1600 Amphitheatre Driveway Sandra",
                    postCode: "CA 94043",
                    city: "Queens",
                    name: client.client,
                    companyName: client.company,
                    country: "USA",
                  });
                  toggleClientEditModal((curr) => !curr);
                }}
              />
            );
          },
        },
      ] as ColumnDef<TableFeatures, ClientDataWithFilters>[],
    [],
  );

  const hiddenCols: ColumnVisibilityState = useMemo(
    () => ({
      activityCount: false,
      createdAt: false,
    }),
    [],
  );

  const filters: { label: string; value: string }[] = useMemo(
    () => [
      { value: "asc", label: "A-Z" },
      { value: "desc", label: "Z-A" },
      { value: "recent", label: "Recently Added" },
      { value: "active", label: "Most Active" },
    ],
    [],
  );

  const getFilteredData = (filter: string) => {
    switch (filter) {
      case "asc":
        return clientData.toSorted((a, b) => a.client.localeCompare(b.client));
      case "desc":
        return clientData.toSorted((a, b) => b.client.localeCompare(a.client));
      case "recent":
        return clientData.toSorted(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case "active":
        return clientData.toSorted((a, b) => b.activityCount - a.activityCount);
      default:
        return clientData;
    }
  };

  const applyFilter = () => setClientData(getFilteredData(activeFilter));
  const clearFilter = () => {
    toggleActiveFilter("recent");
    setClientData(getFilteredData("recent"));
  };

  const debouncedSearchParam = useDebounce({ value: searchParam, delay: 500 });
  const localFilter: ColumnFiltersState = useMemo(
    () => [{ id: "client", value: debouncedSearchParam }],
    [debouncedSearchParam],
  );

  const clientCreatFn = (data: ClientCreationPayload) => {
    const newClientId = nanoid();
    const { name: client, companyName: company } = data;

    // Dispatch to Redux store
    dispatch(
      addClient({
        id: newClientId,
        ...data,
        createdAt: new Date().toISOString(),
      }),
    );

    // Also update local display state immediately
    const newDisplayClient: ClientDataWithFilters = {
      id: newClientId,
      ...data,
      client,
      company,
      createdAt: new Date().toISOString(),
      activityCount: 0,
    };
    setClientData((curr) =>
      [...curr, newDisplayClient].toSorted(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    );
  };

  const clientEditFn = (data: ClientEditPayload) => {
    dispatch(
      updateClient({
        id: targetClient?.id ?? "",
        ...data,
      }),
    );
  };

  const btnConfigList: CustomBtnProps[] = [
    {
      leftIcon: assets.plusIcon,
      buttonLabel: "Add Client",
      onClick: () => toggleIsPopoverOpen((curr) => !curr),
    },
  ];

  return (
    <>
      <div className="relative px-6 pt-6 pb-5 flex flex-col gap-6">
        {/* Header */}
        <CustomHeader
          header="Clients"
          headerInfo="Manage all your clients"
          btnConfigList={btnConfigList}
        />
        <ClientForm
          isFormOpen={isPopoverOpen}
          toggleFormOpen={toggleIsPopoverOpen}
          mode="creation"
          clientCreatFn={clientCreatFn}
        />

        <ClientForm
          isFormOpen={clientEditModal}
          toggleFormOpen={toggleClientEditModal}
          mode="updation"
          clientEditFn={clientEditFn}
          defaultValues={targetClient}
        />

        <div className="flex flex-col bg-table rounded-[10px] dashboard-card-theme gap-4.5 py-4.5">
          <CustomDataTable
            columns={columns}
            data={clientData}
            hiddenCols={hiddenCols}
            localFilters={localFilter}
            showPaginated={true}
            tableOptionsLeft={SearchInputGruop({
              searchTerm: searchParam,
              setSearchTerm: setSearchParam,
            })}
            tableOptionsRight={FilterBtn({
              toggleFilterSheetOpen: toggleFilterOpen,
            })}
          />
        </div>

        <CustomSheet
          isOpen={isFilterOpen}
          toggleIsOpen={toggleFilterOpen}
          withClearOption
          submitFn={applyFilter}
          clearFn={clearFilter}
        >
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
            <span className="text-placeholder-text text-sm font-semibold">
              SORT BY
            </span>

            {filters.map((filter) => (
              <span key={filter.label} className="flex items-center gap-2">
                <input
                  id={filter.value}
                  type="radio"
                  checked={filter.value === activeFilter}
                  value={filter.value}
                  onChange={(e) => toggleActiveFilter(e.target.value)}
                />
                <label htmlFor={filter.value} className="cursor-pointer">
                  {filter.label}
                </label>
              </span>
            ))}
          </div>
        </CustomSheet>
      </div>
    </>
  );
}
