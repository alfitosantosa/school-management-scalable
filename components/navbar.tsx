"use client";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/logo-smkfajarsentosa.svg";
import { useSession, signOut } from "@/lib/auth-client";
import { LogOut, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const permissionLabels: Record<string, string> = {
  "/": "Home",
  "/dashboard": "Dashboard ",
  "/dashboard/roles": "Roles Management",
  "/dashboard/users": "Users Management",
  "/dashboard/academicyear": "Tahun Ajaran Management",
  "/dashboard/majors": "Jurusan Management",
  "/dashboard/classes": "Kelas Management",
  "/dashboard/subjects": "Mata Pelajaran Management",
  "/dashboard/schedules": "Jadwal Management",
  "/dashboard/attendance": "Absensi Management",
  "/dashboard/typeviolations": "Jenis Pelanggaran Management",
  "/dashboard/violations": "Pelanggaran Management",
  "/dashboard/payments": "Pembayaran",
  "/dashboard/specialschedule": "Jadwal Khusus",
  "/dashboard/calender": "Kalender",
  "/dashboard/calender/teacher": "Kalender untuk Guru",
  "/dashboard/calender/student": "Kalender untuk Siswa",
  "/dashboard/violations/student": "Pelanggaran untuk Siswa",
  "/dashboard/violations/teacher": "Pelanggaran untuk Guru",
  "/dashboard/teacher/schedule": "Jadwal untuk Guru",
  "/dashboard/student/attendance": "Absensi untuk Siswa",
  "/dashboard/student/schedule": "Jadwal untuk Siswa",
  "/dashboard/parent": "Orang Tua Page",
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  // Get session from Better Auth
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const userRoles = user?.role?.name;

  const handleNavigate = (value: string) => {
    router.push(value);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/sign-in");
    router.refresh();
  };

  const navigationItems = (user?.role?.permissions || []).map((permission: string) => ({
    href: permission,
    label: permissionLabels[permission] || permission,
  }));

  // Get user initials for avatar
  const getUserInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Image src={Logo} alt="Logo SMK Fajar Sentosa" className="h-10 w-10" />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900">SMK Fajar Sentosa</h1>
                <p className="text-sm text-gray-500">Sistem Informasi Sekolah</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && navigationItems.length > 0 && (
              <Select onValueChange={handleNavigate} value={pathname}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Pilih Menu" />
                </SelectTrigger>
                <SelectContent>
                  {navigationItems.map((item: { href: string; label: string }) => (
                    <SelectItem key={item.href} value={item.href}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <div className="flex items-center space-x-2">
              {isPending ? (
                <div className="h-8 w-8 animate-pulse bg-gray-200 rounded-full" />
              ) : user ? (
                // Signed In
                <div className="flex items-center space-x-2">
                  <div className="hidden md:block">
                    <Badge variant="secondary" className="text-sm">
                      {userRoles || "User"}
                    </Badge>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                          <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push("/profile")}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                // Signed Out
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" onClick={() => router.push("/auth/sign-in")}>
                    Sign In
                  </Button>
                  <Button onClick={() => router.push("/auth/sign-up")}>Sign Up</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
