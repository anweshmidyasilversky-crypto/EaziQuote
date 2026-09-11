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
import { useDebounce } from "../../hooks/useDebounce";

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
import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  ClientCreateApiPayload,
  UpdateClientApiPayload,
} from "@/types/api.requests.type";
import {
  createClient,
  deleteClient,
  getClientList,
  updateClient,
} from "@/api/clients.api";
import { toast } from "react-toastify";
import { showErrorToast } from "@/api/axiosInstance";

export function ClientIndexPage() {
  const navigate = useNavigate();
  const [activeFilter, toggleActiveFilter] = useState<string>("recent");
  const [isFilterOpen, toggleFilterOpen] = useState(false);
  const [clientModalOpen, toggleClientModal] = useState(false);
  const targetClient = useRef<
    ClientCreationPayload | ClientEditPayload | undefined
  >(undefined);
  const targetClientId = useRef<number>(0);
  const clientFormMode = useRef<ClientFormProps["mode"]>("creation");
  const [searchParam, setSearchParam] = useState("");
  const debouncedSearchParam = useDebounce({ value: searchParam, delay: 500 });
  const sortBy = useRef<string | null>(null);
  const mutated = useRef<number>(0);

  const {
    data: clientListResponse,
    isFetching,
    error,
  } = useQuery({
    queryKey: [
      "clientIndex",
      "clients",
      debouncedSearchParam,
      sortBy.current,
      mutated.current,
    ],
    queryFn: () =>
      getClientList({
        search: debouncedSearchParam,
        sort_by: sortBy.current,
      }),
  });

  if (error) {
    showErrorToast(error);
  }

  const clientList = clientListResponse?.payload.data;
  const clientListMeta = clientListResponse?.payload.meta;
  const itemStartNo = clientListMeta
    ? clientListMeta.last_page * clientListMeta.per_page + 1
    : 0;
  const itemEndNo = itemStartNo + (clientList?.length ?? 0);

  const { mutateAsync: createClientAsync } = useMutation({
    mutationKey: ["clientIndex", "creation"],
    mutationFn: (data: ClientCreateApiPayload) => createClient(data),
  });

  const { mutateAsync: updateClientAsync } = useMutation({
    mutationKey: ["clientIndex", "updation"],
    mutationFn: (data: UpdateClientApiPayload) => {
      return updateClient(targetClientId.current.toString(), data);
    },
  });

  const { mutateAsync: deleteClientAsync } = useMutation({
    mutationKey: ["clientIndex", "client", "delete"],
    mutationFn: () => deleteClient(targetClientId.current.toString()),
  });

  const columns = useMemo(
    () =>
      [
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
                    street: client.address,
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
      ] as ColumnDef<TableFeatures, ClientDetails>[],
    [],
  );

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
    try {
      const response = createClientAsync({
        ...data,
        postcode: data.postCode,
        company_name: data.companyName,
        address: data.street,
      });
      toast.success((await response).message);
      mutated.current ^= 1;
    } catch (err) {
      throw err;
    }
  };

  const clientEditFn = async (data: ClientEditPayload) => {
    try {
      const response = await updateClientAsync({
        ...data,
        postcode: data.postCode,
        company_name: data.companyName,
        address: data.street,
        _method: "put",
      });
      toast.success(response.message);
      mutated.current ^= 1;
    } catch (err) {
      throw err;
    }
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

  const handleDelete = async () => {
    try {
      const res = await deleteClientAsync();
      toast.success(res.message);
      mutated.current ^= 1;
    } catch (err) {
      showErrorToast(err);
    }
  };

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
        />

        <div className="flex flex-col bg-table rounded-[10px] dashboard-card-theme gap-4.5 py-4.5">
          <CustomDataTable
            columns={columns}
            data={clientList ?? []}
            showPaginated={true}
            tableOptionsLeft={SearchInputGruop({
              searchTerm: searchParam,
              setSearchTerm: setSearchParam,
            })}
            tableOptionsRight={FilterBtn({
              toggleFilterSheetOpen: toggleFilterOpen,
            })}
            totalRecords={clientListMeta?.total}
            startItemNo={itemStartNo}
            endItemNo={itemEndNo}
            paginationBtns={clientListMeta?.links}
            isFetching={isFetching}
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
