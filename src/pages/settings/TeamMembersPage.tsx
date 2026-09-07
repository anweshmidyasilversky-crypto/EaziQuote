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
import { useDebounce } from "@/hooks/useDebounce";
import { useAppSelector } from "@/redux/store";
import type { MemberCreationPayload } from "@/types/memberCreation.payload.type";
import { nanoid } from "@reduxjs/toolkit";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import React, { useRef, useState } from "react";

function TeamMembersPage() {
  const clients = useAppSelector((state) => state.clients);
  const members: MemberCreationPayload[] = clients.map((client) => ({
    name: client.name,
    email: client.email,
    password: nanoid(8),
  }));
  const [searchParam, setSearchParam] = useState("");
  const debouncedSearchParam = useDebounce({ value: searchParam, delay: 500 });
  const [memberFormOpen, toggleMemberFormOpen] = useState(false);
  const memberFormMode = useRef<MemberFormProps["mode"]>("creation");
  const memberDet = useRef<MemberCreationPayload | undefined>(undefined);
  const membersColumns: ColumnDef<TableFeatures, MemberCreationPayload>[] = [
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
      accessorKey: "password",
      header: "PASSWORD",
      enableSorting: false,
    },
    {
      id: "active",
      header: "IS ACTIVE",
      cell: () => <Switch className="max-w-11!" />,
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
          data={members}
          tableOptionsLeft={
            <SearchInputGruop
              searchTerm={searchParam}
              setSearchTerm={setSearchParam}
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
          globalFilterTerm={debouncedSearchParam}
        />
      </div>

      <MemberForm
        isOpen={memberFormOpen}
        toggleIsOpen={toggleMemberFormOpen}
        mode={memberFormMode.current}
        defaultValues={memberDet.current}
      />
    </React.Fragment>
  );
}

export default TeamMembersPage;
