import { assets } from "../../assets/icons";
import { type CustomBtnProps } from "../../components/common/CustomBtn";
import {
  filterFn_includesString,
  type ColumnDef,
  type TableFeatures,
} from "@tanstack/react-table";
import { CustomActionGroup } from "../../components/common/CustomActionGroup";
import { ClientNameBadge } from "../../components/common/ClientNameBadge";
import { CustomDataTable } from "../../components/common/CustomTable";
import { useMemo, useRef, useState } from "react";

import {
  ClientForm,
  type ClientFormProps,
} from "../../components/clients/ClientForm";
import { CustomSheet } from "../../components/common/CustomSheet";
import { useNavigate } from "react-router";
import type { ClientCreationPayload } from "../../types/clientCreation.payload.type";
import SearchInputGruop from "../../components/common/SearchInputGruop";
import FilterBtn from "../../components/common/FilterBtn";
import { CustomHeader } from "../../components/common/CustomHeader";
import type { ClientEditPayload } from "../../types/clientEdit.payload.type";
import { type ClientDetails } from "@/types/api.responses.type";
import { toast } from "react-toastify";
import { showErrorToast } from "@/api/axiosInstance";
import useClients from "@/hooks/apis/clients/useClients";
import type { PageFilters } from "@/types/api.requests.type";
import useClientMutations from "@/hooks/apis/clients/useClientMutations";

export function ClientIndexPage() {
  const navigate = useNavigate();
  const [activeFilter, toggleActiveFilter] = useState<string>("recent");
  const [isFilterOpen, toggleFilterOpen] = useState(false);
  const [clientModalOpen, toggleClientModal] = useState(false);
  // targetClient to be passed to the client editing form
  const targetClient = useRef<
    ClientCreationPayload | ClientEditPayload | undefined
  >(undefined);
  const targetClientId = useRef<number>(0);
  const clientFormMode = useRef<ClientFormProps["mode"]>("creation");
  const sortBy = useRef<string | null>(null);

  const tableFilters = useMemo(
    () =>
      ({
        sort_by: sortBy.current,
      }) as PageFilters,
    [sortBy.current],
  );

  const {
    clientList,
    searchTerm,
    setSearchTerm,
    isFetching: isClientListFetching,
    clientListMeta,
    refetch: refetchClients,
    setPageNo,
  } = useClients({ filters: tableFilters });

  const { clientCreatMutation, clientUpdateMutation, clientDeleteMutation } =
    useClientMutations();

  const columns = [
    {
      accessorKey: "name",
      header: "CLIENT",
      filterFn: filterFn_includesString,
      cell: (info) => <ClientNameBadge name={info.getValue<string>()} />,
    },
    {
      accessorKey: "company_name",
      header: "COMPANY",
    },
    {
      accessorKey: "phone",
      enableSorting: false,
    },
    {
      accessorKey: "email",
      enableSorting: false,
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
              targetClient.current = {
                companyName: client.company_name,
                street: client.address ?? "",
                postCode: client.postcode,
                ...client,
                phone: client.phone.slice(6).replaceAll(" ", ""),
              };
              targetClientId.current = client.id;
              clientFormMode.current = "updation";
              toggleClientModal((curr) => !curr);
            }}
            withDelete={true}
            deleteFn={async () => {
              targetClientId.current = client.id;
              await handleDelete();
            }}
          />
        );
      },
    },
  ] as ColumnDef<TableFeatures, ClientDetails>[];

  const filters: { label: string; value: string }[] = useMemo(
    () => [
      { value: "asc", label: "A-Z" },
      { value: "desc", label: "Z-A" },
      { value: "recent", label: "Recently Added" },
      { value: "ma", label: "Most Active" },
    ],
    [],
  );

  const clientCreatFn = async (data: ClientCreationPayload) => {
    clientCreatMutation.mutate(
      {
        ...data,
        postcode: data.postCode,
        company_name: data.companyName,
        address: data.street,
      },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          toggleClientModal(false);
          refetchClients();
          setPageNo(1);
          setSearchTerm("");
        },
        onError: (error) => {
          showErrorToast(error);
        },
      },
    );
  };

  const clientEditFn = async (data: ClientEditPayload) => {
    clientUpdateMutation.mutate(
      {
        client_id: targetClientId.current.toString(),
        ...data,
        postcode: data.postCode,
        company_name: data.companyName,
        address: data.street,
        _method: "put",
      },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          toggleClientModal(false);
          refetchClients();
        },

        onError: (error) => {
          showErrorToast(error);
        },
      },
    );
  };

  const handleDelete = async () => {
    clientDeleteMutation.mutate(targetClientId.current.toString(), {
      onSuccess: (response) => {
        toast.success(response.message);
        toggleClientModal(false);
        refetchClients();
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  const btnConfigList: CustomBtnProps[] = [
    {
      leftIcon: assets.plusIcon,
      buttonLabel: "Add Client",
      onClick: () => {
        targetClient.current = undefined;
        ((clientFormMode.current = "creation"),
          toggleClientModal((curr) => !curr));
      },
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
          isFormOpen={clientModalOpen}
          toggleFormOpen={toggleClientModal}
          mode={clientFormMode.current}
          clientCreatFn={clientCreatFn}
          clientEditFn={clientEditFn}
          defaultValues={targetClient.current}
          isSubmitting={
            clientCreatMutation.isPending || clientUpdateMutation.isPending
          }
        />

        <div className="flex flex-col bg-table rounded-[10px] dashboard-card-theme gap-4.5 py-5">
          <CustomDataTable
            columns={columns}
            data={clientList}
            showPaginated={true}
            tableOptionsLeft={
              <SearchInputGruop
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            }
            tableOptionsRight={
              <FilterBtn toggleFilterSheetOpen={toggleFilterOpen} />
            }
            totalRecords={clientListMeta?.total}
            paginationBtns={clientListMeta?.links}
            isFetching={isClientListFetching}
            paginationMeta={clientListMeta}
            setPageNo={setPageNo}
          />
        </div>

        <CustomSheet
          isOpen={isFilterOpen}
          toggleIsOpen={toggleFilterOpen}
          withClearOption
          clearFn={() => {
            toggleActiveFilter("recent");
            sortBy.current = null;
          }}
          submitFn={() =>
            (sortBy.current = activeFilter === "recent" ? null : activeFilter)
          }
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
