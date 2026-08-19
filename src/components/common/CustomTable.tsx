import { tableFeatures, useTable, type ColumnDef } from "@tanstack/react-table";
import { transactionItems } from "../../constants/dummyData";
import { type TransactionItem } from "../../constants/dummyData";

export function CustomTable() {
  const features = tableFeatures({});
  const columns: ColumnDef<typeof features, TransactionItem>[] = [
    {
      accessorKey: "title",
      header: "TITLE",
    },
    {
      accessorKey: "quoteInvoice",
      header: "QUOTE/INVOICE",
    },
    {
      accessorKey: "client",
      header: "CLIENT",
    },
    {
      accessorKey: "amount",
      header: "AMOUNT",
    },
    {
      accessorKey: "status",
      header: "STATUS",
    },
    {
      accessorKey: "creationDate",
      header: "CREATION DATE",
    },
    {
      accessorKey: "expiryDueDate",
      header: "EXPIRY/DUE DATE",
    },
    {
      id: "actions",
      header: "ACTION",
    },
  ];
  const table = useTable({
    data: transactionItems,
    columns,
    features,
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>{<table.FlexRender header={header} />}</th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getAllCells().map((cell) => (
              <td key={cell.id}>{<table.FlexRender cell={cell} />}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
