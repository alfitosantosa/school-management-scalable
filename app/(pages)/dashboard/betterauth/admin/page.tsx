"use client";

import * as React from "react";
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Eye, Copy, X, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/navbar";
import Image from "next/image";
import { ChangePasswordDialog } from "@/components/dialog/change/ChangePasswordDialog";
import { useSession } from "@/lib/auth-client";
import { useGetBetterAuth } from "@/app/hooks/useBetterAuth";

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  userData: {
    id: string;
    userId: string;
    academicYearId: string | null;
    address: string | null;
    avatarUrl: string | null;
    birthDate: string | null;
    birthPlace: string | null;
    classId: string | null;
    employeeId: string | null;
    endDate: string | null;
    enrollmentDate: string | null;
    gender: string | null;
    graduationDate: string | null;
    majorId: string | null;
    nik: string | null;
    nisn: string | null;
    parentPhone: string | null;
    position: string | null;
    relation: string | null;
    roleId: string;
    startDate: string | null;
    status: string;
    studentIds: [];
    email: string | null;
    name: string | null;
    role: { name: string };
  };
};

export default function DataTableBetterAuth() {
  const { data, isLoading, error } = useGetBetterAuth();

  //get session better auth
  const session = useSession();
  console.log(session.data);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = React.useState(false);
  const [userToChangePassword, setUserToChangePassword] = React.useState<{ id: string; name: string } | null>(null);

  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
      cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "profile",
      header: "Avatar",
      cell: ({ row }) => (
        <Image src={row.original.image || "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png"} alt="Avatar" className="w-10 h-10 rounded-full object-cover" width={40} height={40} />
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="font-medium">{row.original.name}</div>;
      },
      filterFn: (row, id, value) => {
        const fullName = `${row.original.name}`.toLowerCase();
        return fullName.includes(value.toLowerCase());
      },
    },
    {
      id: "email",
      header: "Email",
      cell: ({ row }) => <div className="text-sm">{row.original.email || "-"}</div>,
    },
    {
      id: "roles",
      header: "Roles",
      cell: ({ row }) => <div className="text-sm">{row.original.userData.role.name || "-"}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(user.id);
                  alert("User ID copied to clipboard!");
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy User ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user);
                  setIsDetailOpen(true);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setUserToChangePassword({ id: user.id, name: user.name });
                  setIsChangePasswordOpen(true);
                }}
              >
                <KeyRound className="mr-2 h-4 w-4" />
                Change Password
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data ?? [],
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
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto my-8 p-6">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-destructive font-semibold">Error loading data</p>
                <p className="text-sm text-muted-foreground">{error.message}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Card className="max-w-7xl mx-auto my-8 p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-3xl font-bold">BetterAuth Users</CardTitle>
          <CardDescription>Manage and view all BetterAuth users from the database.</CardDescription>
        </CardHeader>

        <CardContent className="px-0">
          <div className="flex items-center py-4 gap-4">
            <Input placeholder="Search by name..." value={(table.getColumn("name")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)} className="max-w-sm" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((col) => col.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.original.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-muted-foreground text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </div>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Image width={80} height={80} src={selectedUser.image || "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png"} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                <div className="flex-1 space-y-1">
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">{selectedUser.name && <Badge variant="secondary">@{selectedUser.name}</Badge>}</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Basic Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">User ID</p>
                    <p className="text-sm font-mono break-all">{selectedUser.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="text-sm">{selectedUser.name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="text-sm">{selectedUser.name || "-"}</p>
                  </div>
                </div>
              </div>
              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Contact Information</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Email Addresses</p>
                    <p className="text-sm">{selectedUser.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Numbers</p>
                    <p className="text-sm">{selectedUser?.userData?.parentPhone || "-"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Activity</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Created At</p>
                    <p className="text-sm">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {selectedUser?.userData?.role?.name && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="font-semibold">Roles</h4>
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="text-sm">{selectedUser.userData.role.name}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      {userToChangePassword && <ChangePasswordDialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen} userId={userToChangePassword.id} userName={userToChangePassword.name} />}
    </>
  );
}
