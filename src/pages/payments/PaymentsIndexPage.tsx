import { showErrorToast } from "@/api/axiosInstance";
import { assets } from "@/assets/icons";
import { ClientNameBadge } from "@/components/common/ClientNameBadge";
import { CustomActionGroup } from "@/components/common/CustomActionGroup";
import {
  CustomHeader,
  type CustomHeaderProps,
} from "@/components/common/CustomHeader";
import { CustomDataTable } from "@/components/common/CustomTable";
import DeleteDialog from "@/components/common/DeleteDialog";
import SearchInputGruop from "@/components/common/SearchInputGruop";
import { ShareOptions } from "@/components/common/ShareOptions";
import StatusBadge from "@/components/common/StatusBadge";
import usePaymentMutations from "@/hooks/apis/payments/usePaymentMutations";
import usePaymentsList from "@/hooks/apis/payments/usePaymentsList";
import { formatCurrency, formatDisplayDate } from "@/lib/utils";
import { PaymentStatus, type Payment } from "@/types/api.responses.type";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

function PaymentsIndexPage() {
  const {
    paymentList,
    searchTerm,
    setSearchTerm,
    isFetching,
    paginationMeta,
    setPageNo,
    refetch,
  } = usePaymentsList({});

  const { paymentDeleteMutation, paymentLinkShareMutation } =
    usePaymentMutations();
  const [deleteModalOpen, toggleDeleteModal] = useState(false);
  const [shareModalOpen, toggleShareModal] = useState(false);
  const targetPaymentId = useRef<number | undefined>(undefined);
  const targetClientEmail = useRef<string | undefined>(undefined);

  const handlePaymentDelete = () => {
    if (targetPaymentId.current) {
      paymentDeleteMutation.mutate(targetPaymentId.current, {
        onSuccess: (response) => {
          toast.success(response.message);
          toggleDeleteModal(false);
          refetch();
        },
        onError: (error) => showErrorToast(error),
      });
    }
  };

  const handlePaymentLinkShare = () => {
    if (targetClientEmail.current && targetPaymentId.current) {
      paymentLinkShareMutation.mutate(targetPaymentId.current, {
        onSuccess: (response) => {
          toast.success(response.message);
        },
        onError: (error) => {
          showErrorToast(error);
        },
      });
    }
  };

  const navigate = useNavigate();

  const headerBtnConfig: CustomHeaderProps["btnConfigList"] = [
    {
      buttonLabel: "Create Payment Record",
      leftIcon: assets.plusIcon,
      onClick: () => navigate(`/payments/record-payment`),
    },
  ];

  const paymentsColumns: ColumnDef<TableFeatures, Payment>[] = [
    {
      accessorKey: "id",
      enableSorting: false,
    },
    {
      accessorKey: "client_name",
      header: "client",
      cell: (info) => <ClientNameBadge name={info.getValue<string>()} />,
      enableSorting: false,
    },
    {
      accessorKey: "amount_type",
      header: "type",
      enableSorting: false,
      enableGlobalFilter: false,
    },
    {
      accessorKey: "amount",
      cell: (info) => formatCurrency(info.getValue<number>()),
      enableSorting: false,
      enableGlobalFilter: false,
    },
    {
      accessorKey: "allocated",
      cell: (info) => formatCurrency(info.getValue<number>()),
      enableSorting: false,
      enableGlobalFilter: false,
    },
    {
      accessorKey: "credit",
      cell: (info) => formatCurrency(info.getValue<number>()),
      enableSorting: false,
      enableGlobalFilter: false,
    },
    {
      accessorKey: "payment_date",
      header: "date",
      cell: (info) => formatDisplayDate(info.getValue<string>()),
      enableSorting: false,
      enableGlobalFilter: false,
    },
    {
      accessorKey: "status",
      cell: (info) => <StatusBadge status={info.getValue<PaymentStatus>()} />,
      enableSorting: false,
      enableGlobalFilter: false,
    },
    {
      accessorKey: "payment_method",
      header: "method",
      enableSorting: false,
      enableGlobalFilter: false,
    },
    {
      id: "action",
      header: () => <div className="w-full flex justify-end">{"ACTION"}</div>,
      cell: (info) => {
        const { id, status, client_email } = info.row.original;
        return (
          <div className="flex min-w-20 justify-end">
            <CustomActionGroup
              withEdit={false}
              withShare={status !== PaymentStatus.Received}
              withDelete={status !== PaymentStatus.Received}
              deleteFn={() => {
                targetPaymentId.current = id;
                toggleDeleteModal((curr) => !curr);
              }}
              openFn={() => navigate(`/payments/${id}`)}
              shareAction={() => {
                targetPaymentId.current = id;
                targetClientEmail.current = client_email;
                toggleShareModal((curr) => !curr);
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-5 flex flex-col gap-6">
      <CustomHeader
        header="Payments"
        headerInfo="Manage all your payments in one place"
        btnConfigList={headerBtnConfig}
      />

      <div className="bg-table py-5 flex flex-col gap-5 rounded-[10px]">
        <CustomDataTable
          columns={paymentsColumns}
          data={paymentList}
          tableOptionsRight={
            <SearchInputGruop
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchPlaceHolder="Search payment id or clients"
            />
          }
          showPaginated
          isFetching={isFetching}
          setPageNo={setPageNo}
          paginationMeta={paginationMeta}
          paginationBtns={paginationMeta?.links}
        />
      </div>

      <DeleteDialog
        isOpen={deleteModalOpen}
        toggleOpen={toggleDeleteModal}
        deleteAction={handlePaymentDelete}
        isPending={paymentDeleteMutation.isPending}
      />

      <ShareOptions
        isOpen={shareModalOpen}
        toggleIsOpen={toggleShareModal}
        clientEmail={targetClientEmail.current ?? ""}
        sendEmailAction={handlePaymentLinkShare}
        isEmailSending={paymentLinkShareMutation.isPending}
      />
    </div>
  );
}

export default PaymentsIndexPage;
