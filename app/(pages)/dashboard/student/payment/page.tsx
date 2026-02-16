"use client";

import * as React from "react";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus, Pencil, Trash2, DollarSign, CheckCircle, Clock, XCircle, TrendingUp, Users, Calendar } from "lucide-react";
import Script from "next/script";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// Import hooks
import { useGetPayments, useCreatePayment, useUpdatePayment, useDeletePayment, useGetPaymentByStudentId } from "@/app/hooks/Payments/usePayment";
import { useGetPaymentTypes } from "@/app/hooks/Payments/usePaymentType";
import { useGetUsers } from "@/app/hooks/Users/useUsers";
import Loading from "@/components/loading";
import { useSession } from "@/lib/auth-client";
import { unauthorized } from "next/navigation";
import { useGetUserByIdBetterAuth } from "@/app/hooks/Users/useUsersByIdBetterAuth";
import { useCreateSnapMidtransTransaction } from "@/app/hooks/Midtrans/useMidtrans";

// Declare Snap type for TypeScript
declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
        },
      ) => void;
    };
  }
}

// Type definitions
export type PaymentData = {
  id: string;
  studentId: string;
  paymentTypeId: string;
  amount: number;
  dueDate?: Date | string;
  status: string;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  paymentDate: Date | string;
  receiptNumber?: string;
  student?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  paymentType?: {
    id: string;
    name: string;
    amount: number;
  };
};

// Form schema
const paymentSchema = z.object({
  studentId: z.string().min(1, "Siswa wajib dipilih"),
  paymentTypeId: z.string().min(1, "Jenis pembayaran wajib dipilih"),
  amount: z.number().min(0, "Jumlah minimal 0"),
  dueDate: z.string().optional(),
  status: z.string().min(1, "Status wajib dipilih"),
  notes: z.string().optional(),
  paymentDate: z.string().min(1, "Tanggal pembayaran wajib diisi"),
  receiptNumber: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

// Payment status options
const paymentStatuses = [
  { value: "pending", label: "Belum Lunas" },
  { value: "paid", label: "Lunas" },
  { value: "overdue", label: "Terlambat" },
  { value: "cancelled", label: "Dibatalkan" },
];

// Statistics Card Component
function StatisticsCards({ payments }: { payments: PaymentData[] }) {
  const totalPayments = payments.length;
  const paidPayments = payments.filter((p) => p.status === "paid").length;
  const pendingPayments = payments.filter((p) => p.status === "pending").length;
  const overduePayments = payments.filter((p) => p.status === "overdue").length;

  const totalRevenue = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + Number(p.amount), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pembayaran</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPayments}</div>
          <p className="text-xs text-muted-foreground">Total transaksi pembayaran</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lunas</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{paidPayments}</div>
          <p className="text-xs text-muted-foreground">{formatCurrency(totalRevenue)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Belum Lunas</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{pendingPayments}</div>
          <p className="text-xs text-muted-foreground">Menunggu pembayaran</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{overduePayments}</div>
          <p className="text-xs text-muted-foreground">Melewati jatuh tempo</p>
        </CardContent>
      </Card>
    </div>
  );
}

//payment dialog components midtrans integration
function MidtransPaymentDialog({ open, onOpenChange, paymentData, onSuccess }: { open: boolean; onOpenChange: (open: boolean) => void; paymentData?: PaymentData | null; onSuccess: () => void }) {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const mutation = useCreateSnapMidtransTransaction();

  const handlePayment = () => {
    if (!paymentData) {
      toast.error("Data pembayaran tidak tersedia");
      return;
    }

    setIsProcessing(true);

    const transactionData = {
      transaction_details: {
        order_id: paymentData.receiptNumber && paymentData.receiptNumber.trim() !== "" ? paymentData.receiptNumber : `ORD-${paymentData.id}-${Date.now()}`,
        gross_amount: Number(paymentData.amount),
      },
      customer_details: {
        first_name: paymentData.student?.name || "Siswa",
        email: paymentData.student?.email || "student@example.com",
        phone: paymentData.student?.phone || "08123456789",
      },
      credit_card: {
        secure: true,
      },
      item_details: [
        {
          id: paymentData.paymentTypeId,
          price: Number(paymentData.amount),
          quantity: 1,
          name: paymentData.paymentType?.name || "Pembayaran Sekolah",
        },
      ],
      page_expiry: {
        duration: 3,
        unit: "hours",
      },
    };

    mutation.mutate(transactionData, {
      onSuccess: (response) => {
        console.log("Snap token received:", response);

        // Check if snap is loaded
        if (typeof window.snap === "undefined") {
          toast.error("Midtrans belum siap. Silakan coba lagi.");
          setIsProcessing(false);
          return;
        }

        // Open Snap payment popup
        window.snap.pay(response.token, {
          onSuccess: function (result) {
            console.log("Payment success:", result);
            toast.success("Pembayaran berhasil!");
            onSuccess();
            onOpenChange(false);
            setIsProcessing(false);
          },
          onPending: function (result) {
            console.log("Payment pending:", result);
            toast.info("Pembayaran menunggu konfirmasi");
            onSuccess();
            onOpenChange(false);
            setIsProcessing(false);
          },
          onError: function (result) {
            console.log("Payment error:", result);
            toast.error("Pembayaran gagal. Silakan coba lagi.");
            setIsProcessing(false);
          },
          onClose: function () {
            console.log("Payment popup closed");
            toast.info("Pembayaran dibatalkan");
            setIsProcessing(false);
          },
        });
      },
      onError: (error) => {
        console.error("Error creating transaction:", error);
        toast.error("Gagal membuat transaksi. Silakan coba lagi.");
        setIsProcessing(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pembayaran Midtrans</DialogTitle>
        </DialogHeader>
        <div className="grid mb-4">
          <div className="font-bold">Detail Tagihan</div>
          <Table className="w-full mt-2">
            <TableBody>
              <TableRow>
                <TableCell>No Kwitansi</TableCell>
                <TableCell>{paymentData?.receiptNumber || "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Nama Siswa</TableCell>
                <TableCell>{paymentData?.student?.name || "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jenis Pembayaran</TableCell>
                <TableCell>{paymentData?.paymentType?.name || "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jumlah</TableCell>
                <TableCell>{paymentData ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(paymentData.amount) : "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jatuh Tempo</TableCell>
                <TableCell>{paymentData?.dueDate ? new Date(paymentData.dueDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>
                  {paymentData ? (
                    <Badge className={`text-white ${paymentData.status === "paid" ? "bg-green-600" : paymentData.status === "pending" ? "bg-yellow-600" : paymentData.status === "overdue" ? "bg-red-600" : "bg-gray-600"}`}>
                      {paymentData.status === "paid" ? "Lunas" : paymentData.status === "pending" ? "Belum Lunas" : paymentData.status === "overdue" ? "Terlambat" : "-"}
                    </Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {paymentData ? (
            <Button className="mt-4" onClick={handlePayment} disabled={isProcessing}>
              {isProcessing ? "Memproses..." : "Bayar dengan Midtrans"}
            </Button>
          ) : (
            <p className="text-red-600 mt-4">Tidak dapat memproses pembayaran karena data tidak lengkap.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main DataTable Component
function PaymentDashboard({ userId }: { userId: string }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Dialog states
  const [midtransDialogOpen, setMidtransDialogOpen] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState<PaymentData | null>(null);

  const { data: payments = [], isLoading, refetch } = useGetPaymentByStudentId(userId);

  const handleSuccess = () => {
    refetch();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-600";
      case "pending":
        return "bg-yellow-600";
      case "overdue":
        return "bg-red-600";
      case "cancelled":
        return "bg-gray-600";
      default:
        return "bg-blue-600";
    }
  };

  const getStatusLabel = (status: string) => {
    const found = paymentStatuses.find((s) => s.value === status);
    return found ? found.label : status;
  };

  const columns: ColumnDef<PaymentData>[] = [
    {
      id: "select",
      header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
      cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "receiptNumber",
      header: "No. Kwitansi",
      cell: ({ row }) => <div className="font-medium">{row.getValue("receiptNumber") || "-"}</div>,
    },
    {
      accessorKey: "student",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Nama Siswa
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const student = row.getValue("student") as PaymentData["student"];
        return <div className="font-medium">{student?.name || "-"}</div>;
      },
    },
    {
      accessorKey: "paymentType",
      header: "Jenis Pembayaran",
      cell: ({ row }) => {
        const paymentType = row.getValue("paymentType") as PaymentData["paymentType"];
        return <div>{paymentType?.name || "-"}</div>;
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Jumlah
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number;
        return <div className="font-medium">{formatCurrency(amount)}</div>;
      },
    },
    {
      accessorKey: "paymentDate",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Tgl Bayar
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue("paymentDate") as string;
        return <div>{formatDate(date)}</div>;
      },
    },
    {
      accessorKey: "dueDate",
      header: "Jatuh Tempo",
      cell: ({ row }) => {
        const date = row.getValue("dueDate") as string;
        return <div>{date ? formatDate(date) : "-"}</div>;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <Badge className={`text-white ${getStatusBadgeColor(status)}`}>{getStatusLabel(status)}</Badge>;
      },
    },
    {
      accessorKey: "notes",
      header: "Catatan",
      cell: ({ row }) => (
        <div className="max-w-xs truncate" title={row.getValue("notes")}>
          {row.getValue("notes") || "-"}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const paymentData = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(paymentData.id)}>Copy ID Pembayaran</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedPayment(paymentData);
                  setMidtransDialogOpen(true);
                }}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Bayar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: payments,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="mx-auto my-8 p-6 max-w-7xl min-h-screen">
        <div className="mb-6">
          <h1 className="font-bold text-3xl mb-2">Dashboard Pembayaran</h1>
          <p className="text-muted-foreground">Kelola pembayaran SPP dan pembayaran sekolah lainnya</p>
        </div>

        {/* Statistics Cards */}
        <StatisticsCards payments={payments} />

        <div className="mx-auto">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <Select
                value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
                onValueChange={(value) => {
                  table.getColumn("status")?.setFilterValue(value === "all" ? "" : value);
                }}
              >
                <SelectTrigger className="w-45">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  {paymentStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border w-max-7xl">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Tidak ada data pembayaran.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} dari {table.getFilteredRowModel().rows.length} baris dipilih.
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                Sebelumnya
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Selanjutnya
              </Button>
            </div>
          </div>
        </div>

        {/* Dialogs */}
        <MidtransPaymentDialog open={midtransDialogOpen} onOpenChange={setMidtransDialogOpen} paymentData={selectedPayment} onSuccess={handleSuccess} />
      </div>
    </>
  );
}

export default function PaymentDashboardPage() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;

  const { data: userData, isLoading: isLoadingUserData } = useGetUserByIdBetterAuth(userId as string);
  const userRole = userData?.role?.name;
  const userDataId = userData?.id;

  // Show loading while checking authorization
  if (isPending || isLoadingUserData) {
    return <Loading />;
  }

  // Check if user is Admin
  if (userRole !== "Admin") {
    if (userRole !== "Student") {
      unauthorized();
      return null;
    }
  }

  // Render dashboard only after authorization is confirmed
  return (
    <>
      {/* Load Midtrans Snap script */}
      <Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "YOUR_CLIENT_KEY_HERE"} strategy="afterInteractive" />
      <PaymentDashboard userId={userDataId as string} />
    </>
  );
}
