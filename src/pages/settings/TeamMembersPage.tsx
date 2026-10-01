import { showErrorToast } from "@/api/axiosInstance";
import { assets } from "@/assets/icons";
import { ClientNameBadge } from "@/components/common/ClientNameBadge";
import { CustomActionGroup } from "@/components/common/CustomActionGroup";
import { HeaderBreadCrumb } from "@/components/common/CustomBreadCrumb";
import { CustomBtn } from "@/components/common/CustomBtn";
import { CustomDataTable } from "@/components/common/CustomTable";
import SearchInputGruop from "@/components/common/SearchInputGruop";
import type { MemberFormProps } from "@/components/settings/MemberForm";
import MemberForm from "@/components/settings/MemberForm";
import { Switch } from "@/components/ui/switch";
import useMembersList from "@/hooks/apis/members/useMembersList";
import useMembersMutation from "@/hooks/apis/members/useMembersMutation";
import type {
  ApiResponse,
  ListResponse,
  TeamMember,
} from "@/types/api.responses.type";
import { useQueryClient } from "@tanstack/react-query";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

function TeamMembersPage() {
  const {
    memberList,
    isFetching,
    searchTerm,
    setSearchTerm,
    setPageNo,
    refetch,
    paginationMeta,
    queryKey,
  } = useMembersList({});

  const { memberUpdateMutation } = useMembersMutation();
  const queryClient = useQueryClient();

  // Only for switch spinner ui
  const statusUpdatingMemberId = useRef<string>("");
  const handleActiveStatusUpdate = (memberId: number, status: boolean) => {
    memberUpdateMutation.mutate(
      {
        id: memberId,
        active: status ? 1 : 0,
      },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          // Update the cache instade of full refetch
          queryClient.setQueryData(
            queryKey,
            (oldData: ApiResponse<ListResponse<TeamMember>>) => {
              if (!oldData) return oldData;

              // 2. Return the identical structure down to payload.data
              return {
                ...oldData,
                payload: {
                  ...oldData.payload,
                  data: oldData.payload.data.map((member: TeamMember) =>
                    member.id === memberId
                      ? { ...member, active: status } // Update target member
                      : member,
                  ),
                },
              };
            },
          );
        },
        onError: (error) => {
          showErrorToast(error);
        },
        onSettled: () => {
          statusUpdatingMemberId.current = "";
        },
      },
    );
  };

  const [memberFormOpen, toggleMemberFormOpen] = useState(false);
  const memberFormMode = useRef<MemberFormProps["mode"]>("creation");
  const memberDet = useRef<TeamMember | undefined>(undefined);

  const membersColumns: ColumnDef<TableFeatures, TeamMember>[] = [
    {
      accessorKey: "name",
      header: "USER",
      cell: (info) => {
        const name = info.getValue<string>();
        return (
          <ClientNameBadge name={name} imgSrc={assets.userImgFemale} textWrap />
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "email",
      header: "EMAIL",
      enableSorting: false,
    },
    {
      id: "password",
      header: "PASSWORD",
      enableSorting: false,
      cell: () => `**********`,
    },
    {
      accessorKey: "active",
      header: "IS ACTIVE",
      cell: (info) => {
        const { id, active } = info.row.original;
        return (
          <Switch
            className="max-w-11!"
            checked={active}
            onCheckedChange={(state) => {
              statusUpdatingMemberId.current = id.toString();
              handleActiveStatusUpdate(id, state);
            }}
            isTansitioning={
              statusUpdatingMemberId.current === id.toString() &&
              memberUpdateMutation.isPending
            }
          />
        );
      },
      enableSorting: false,
    },
    {
      id: "action",
      header: "ACTION",
      cell: (info) => (
        <CustomActionGroup
          withOpen={false}
          withDelete={false}
          editFn={() => {
            memberDet.current = info.row.original;
            memberFormMode.current = "updation";
            toggleMemberFormOpen((curr) => !curr);
          }}
        />
      ),
      enableSorting: false,
    },
  ];
  return (
    <React.Fragment>
      <HeaderBreadCrumb pageName="Team Members" />
      <div className="m-6 flex flex-col bg-table rounded-[10px] dashboard-card-theme gap-4.5 py-4.5">
        <CustomDataTable
          columns={membersColumns}
          data={memberList}
          tableOptionsLeft={
            <SearchInputGruop
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchPlaceHolder="Search member"
            />
          }
          tableOptionsRight={
            <CustomBtn
              buttonLabel="New Member"
              leftIcon={assets.plusIcon}
              onClick={() => {
                memberDet.current = undefined;
                ((memberFormMode.current = "creation"),
                  toggleMemberFormOpen((curr) => !curr));
              }}
            />
          }
          showPaginated
          paginationMeta={paginationMeta}
          paginationBtns={paginationMeta?.links}
          setPageNo={setPageNo}
          isFetching={isFetching}
        />
      </div>

      <MemberForm
        isOpen={memberFormOpen}
        toggleIsOpen={toggleMemberFormOpen}
        mode={memberFormMode.current}
        defaultValues={memberDet.current}
        onMutate={() => refetch()}
      />
    </React.Fragment>
  );
}

export default TeamMembersPage;
