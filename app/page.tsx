// app/page.tsx
"use client";

import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { useGetUserByIdBetterAuth } from "@/app/hooks/Users/useUsersByIdBetterAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, MapPin, Phone, GraduationCap, Building2, Shield, Clock, UserX, MessageSquare, Briefcase, Award, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const NoUserDataComponent = ({ authUser }: { authUser: any }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 text-white">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <UserX className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Akun Belum Terhubung</h1>
                <p className="text-white/90">Akun Better Auth Anda belum terhubung dengan sistem sekolah</p>
              </div>
            </div>
          </div>

          <CardContent className="p-8 space-y-6">
            {authUser && (
              <Alert className="border-blue-200 bg-blue-50">
                <Shield className="h-5 w-5 text-blue-600" />
                <AlertTitle className="text-blue-900 font-semibold">Informasi Akun</AlertTitle>
                <AlertDescription className="text-blue-800 mt-2 space-y-1">
                  <p>
                    <strong>Nama:</strong> {authUser.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {authUser.email}
                  </p>
                  <p>
                    <strong>ID:</strong> <code className="bg-blue-100 px-2 py-1 rounded text-xs">{authUser.id}</code>
                  </p>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Apa yang Terjadi?</h2>
              <div className="bg-gray-50 rounded-lg p-5 space-y-3 text-gray-700">
                <p>
                  Anda telah berhasil login menggunakan Better Auth, namun akun Anda
                  <strong className="text-orange-600"> belum terdaftar </strong>
                  dalam sistem database sekolah kami.
                </p>
                <p>
                  Untuk dapat mengakses fitur-fitur sistem seperti absensi, jadwal, dan data akademik, akun Anda perlu <strong className="text-blue-600">dihubungkan dengan data user</strong> di sistem oleh administrator.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Langkah Selanjutnya</h2>
              <ol className="space-y-3">
                {[
                  { title: "Hubungi Administrator", desc: "Kirimkan permintaan ke admin untuk menghubungkan akun Anda" },
                  { title: "Berikan Informasi", desc: "Sampaikan ID dan email Anda kepada administrator" },
                  { title: "Tunggu Konfirmasi", desc: "Admin akan menghubungkan akun Anda dengan data di sistem" },
                ].map((step, i) => (
                  <li key={i} className="flex gap-4 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">{i + 1}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                Hubungi Administrator
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-2 border-blue-100">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Mail className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-sm text-gray-600 mb-3">Kirim email ke administrator</p>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => (window.location.href = "mailto:admin@school.com")}>
                          <Mail className="w-4 h-4 mr-2" />
                          admin@school.com
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-100">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Phone className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Telepon</h3>
                        <p className="text-sm text-gray-600 mb-3">Hubungi via telepon</p>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => (window.location.href = "tel:+6281234567890")}>
                          <Phone className="w-4 h-4 mr-2" />
                          +62 812-3456-7890
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Badge variant="secondary" className="px-4 py-2 bg-orange-100 text-orange-800">
                <Clock className="w-4 h-4 mr-2" />
                Status: Menunggu Aktivasi
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Butuh Bantuan Lebih Lanjut?</h3>
            <p className="text-sm text-gray-600">
              Jika Anda mengalami kesulitan atau memiliki pertanyaan, silakan hubungi bagian IT Support sekolah atau datang langsung ke ruang admin. Bawa informasi akun Anda untuk mempercepat proses aktivasi.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const UserProfileSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
    <div className="max-w-7xl mx-auto space-y-6">
      <Card>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32" />
        <CardContent className="pt-0 px-6">
          <div className="flex flex-col md:flex-row items-center gap-6 -mt-16">
            <Skeleton className="w-32 h-32 rounded-full border-4 border-white" />
            <div className="space-y-3 text-center md:text-left flex-1">
              <Skeleton className="h-10 w-64 mx-auto md:mx-0" />
              <Skeleton className="h-6 w-48 mx-auto md:mx-0" />
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-5 w-64" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(6)].map((_, j) => (
                <Skeleton key={j} className="h-20 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const ErrorComponent = ({ error }: { error: any }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-20 px-4">
    <div className="max-w-md mx-auto">
      <Card className="text-center">
        <CardHeader>
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl text-red-900">Error Loading Profile</CardTitle>
          <CardDescription className="text-red-700 text-lg">{error?.message || "Failed to load user data"}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  </div>
);

const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
    <Icon className="w-5 h-5 text-gray-600 mt-1 shrink-0" />
    <div className="min-w-0 flex-1">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="font-medium text-gray-900 break-words">{value}</p>
    </div>
  </div>
);

export default function Home() {
  const { data: session } = useSession();
  const { data: user, isPending: userLoading } = useGetUserByIdBetterAuth(session?.user?.id ?? "");

  if (userLoading) return <UserProfileSkeleton />;
  if (!user || !user.id) return <NoUserDataComponent authUser={session?.user} />;
  if (user?.error) return <ErrorComponent error={user?.error} />;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32" />
          <CardContent className="pt-0 px-6 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16">
              <div className="relative">
                <div className="w-32 h-32 border-4 border-white shadow-xl rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={user?.avatarUrl || "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png"}
                    alt={user?.name || "User Avatar"}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 border-4 border-white rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-xl text-gray-600 mt-2">{user?.position || ""}</p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-4">
                  {user?.role?.name && (
                    <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500">
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role.name}
                    </Badge>
                  )}
                  {user?.employeeId && (
                    <Badge variant="outline">
                      <Briefcase className="w-3 h-3 mr-1" />
                      ID: {user.employeeId}
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    <Calendar className="w-3 h-3 mr-1" />
                    Since {formatDate(user?.startDate)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                Personal Information
              </CardTitle>
              <CardDescription>Basic personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoItem icon={Mail} label="Email Address" value={user?.email || "Not provided"} />
              <InfoItem icon={User} label="Gender" value={user?.gender === "L" ? "Laki-laki" : user?.gender === "P" ? "Perempuan" : "Not specified"} />
              <InfoItem icon={MapPin} label="Address" value={user?.address || "Not provided"} />
              <InfoItem icon={Phone} label="Phone" value={user?.parentPhone || "Not provided"} />
              <InfoItem icon={Calendar} label="Birth Date" value={formatDate(user?.birthDate)} />
              <InfoItem icon={MapPin} label="Birth Place" value={user?.birthPlace || "Not provided"} />
            </CardContent>
          </Card>

          {/* Professional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                Professional Information
              </CardTitle>
              <CardDescription>Work-related details and academic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoItem icon={Briefcase} label="Position" value={user?.position || "Not specified"} />
              <InfoItem icon={Shield} label="Role" value={user?.role?.name || "Not specified"} />
              <InfoItem icon={Calendar} label="Start Date" value={formatDate(user?.startDate)} />
              {user?.endDate && <InfoItem icon={Calendar} label="End Date" value={formatDate(user?.endDate)} />}
              <InfoItem icon={GraduationCap} label="Class" value={user?.class?.name || "No class assigned"} />
              {user?.major?.name && <InfoItem icon={Award} label="Major" value={user.major.name} />}
            </CardContent>
          </Card>
        </div>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              System Information
            </CardTitle>
            <CardDescription>Account creation and last update information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <InfoItem icon={Calendar} label="Created At" value={formatDate(user?.createdAt)} />
              <InfoItem icon={Clock} label="Last Updated" value={formatDate(user?.updatedAt)} />
              <InfoItem icon={User} label="User ID" value={user?.id} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
