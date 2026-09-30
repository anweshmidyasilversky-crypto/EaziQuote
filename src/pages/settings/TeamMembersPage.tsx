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
import type { TeamMember } from "@/types/api.responses.type";
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
  } = useMembersList({});

  const { memberUpdateMutation } = useMembersMutation();

  const handleActiveStatusUpdate = (memberId: number, status: boolean) => {
    memberUpdateMutation.mutate(
      {
        id: memberId,
        active: status ? 1 : 0,
      },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          refetch();
        },
        onError: (error) => {
          showErrorToast(error);
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
        return <ClientNameBadge name={name} imgSrc={assets.userImgFemale} />;
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
            onCheckedChange={(state) => handleActiveStatusUpdate(id, state)}
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
          isFetching={isFetching || memberUpdateMutation.isPending}
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
