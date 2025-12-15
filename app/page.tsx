"use client";

import React, { useState } from "react";
import { User, Mail, Calendar, MapPin, Phone, GraduationCap, Building2, Shield, Clock, UserX, MessageSquare, Briefcase, Award, CheckCircle } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useGetUserByIdBetterAuth } from "./hooks/Users/useUsersByIdBetterAuth";

const UserProfileSkeleton = () => (
  <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-8 px-4">
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-linear-to-r from-blue-600 to-purple-600 h-32" />
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row items-center gap-6 -mt-16">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-300 animate-pulse" />
            <div className="space-y-3 text-center md:text-left flex-1">
              <div className="h-10 w-64 bg-gray-300 rounded animate-pulse mx-auto md:mx-0" />
              <div className="h-6 w-48 bg-gray-300 rounded animate-pulse mx-auto md:mx-0" />
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <div className="h-8 w-28 bg-gray-300 rounded-full animate-pulse" />
                <div className="h-8 w-32 bg-gray-300 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="h-7 w-48 bg-gray-300 rounded animate-pulse" />
              <div className="h-5 w-64 bg-gray-300 rounded animate-pulse mt-2" />
            </div>
            <div className="p-6 space-y-3">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="h-20 w-full bg-gray-300 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="h-7 w-48 bg-gray-300 rounded animate-pulse" />
        </div>
        <div className="p-6">
          <div className="grid sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 w-full bg-gray-300 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ErrorComponent = ({ error }: { error?: { message?: string } }) => (
  <div className="min-h-screen bg-linear-to-br from-red-50 to-pink-50 py-20 px-4">
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg text-center p-8">
        <div className="w-20 h-20 mx-auto bg-linear-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-red-900 mb-2">Error Loading Profile</h2>
        <p className="text-red-700 text-lg">{error?.message || "Failed to load user data"}</p>
      </div>
    </div>
  </div>
);

const NoUserDataComponent = ({ authUser }: { authUser: any }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-linear-to-r from-orange-500 to-red-500 p-8 text-white">
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

            <div className="p-8 space-y-6">
              {authUser && (
                <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="text-blue-900 font-semibold mb-2">Informasi Akun</h3>
                      <div className="text-blue-800 space-y-1 text-sm">
                        <p>
                          <strong>Nama:</strong> {authUser.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {authUser.email}
                        </p>
                        <p>
                          <strong>ID:</strong> <code className="bg-blue-100 px-2 py-1 rounded text-xs">{authUser.id}</code>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
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
                    <li key={i} className="flex gap-4 p-4 rounded-lg bg-linear-to-r from-gray-50 to-gray-100">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">{i + 1}</div>
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
                  <div className="border-2 border-blue-100 rounded-lg p-5 bg-white">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Mail className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-sm text-gray-600 mb-3">Kirim email ke administrator</p>
                        <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors" onClick={() => (window.location.href = "mailto:admin@school.com")}>
                          <Mail className="w-4 h-4" />
                          admin@school.com
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-2 border-green-100 rounded-lg p-5 bg-white">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Phone className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Telepon</h3>
                        <p className="text-sm text-gray-600 mb-3">Hubungi via telepon</p>
                        <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors" onClick={() => (window.location.href = "tel:+6281234567890")}>
                          <Phone className="w-4 h-4" />
                          +62 812-3456-7890
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <div className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Status: Menunggu Aktivasi
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-2">Butuh Bantuan Lebih Lanjut?</h3>
            <p className="text-sm text-gray-600">
              Jika Anda mengalami kesulitan atau memiliki pertanyaan, silakan hubungi bagian IT Support sekolah atau datang langsung ke ruang admin. Bawa informasi akun Anda untuk mempercepat proses aktivasi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; label: string; value: string }) => (
  <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
    <Icon className="w-5 h-5 text-gray-600 mt-1 shrink-0" />
    <div className="min-w-0 flex-1">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="font-medium text-gray-900 wrap-break-words">{value}</p>
    </div>
  </div>
);

export default function Home() {
  const { data: session } = useSession();
  const { data: user, isPending: userLoading } = useGetUserByIdBetterAuth(session?.user?.id ?? "");

  // Loading state
  if (userLoading) return <UserProfileSkeleton />;

  // No user data - show connection required page
  if (!user || !user.id) return <NoUserDataComponent authUser={session?.user} />;

  // Error state
  if (user?.error) return <ErrorComponent error={user?.error} />;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-linear-to-r from-blue-600 to-purple-600 h-32" />
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16">
              <div className="relative">
                <div className="w-32 h-32 border-4 border-white shadow-xl rounded-full overflow-hidden bg-gray-100">
                  <img src={user?.avatarUrl || "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png"} alt={user?.name || "User Avatar"} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-linear-to-r from-green-400 to-emerald-500 border-4 border-white rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-xl text-gray-600 mt-2">{user?.position || ""}</p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-4">
                  {user?.role?.name && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-linear-to-r from-blue-500 to-indigo-500 text-white text-sm rounded-full">
                      <Shield className="w-3 h-3" />
                      {user.role.name}
                    </span>
                  )}
                  {user?.employeeId && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-full">
                      <Briefcase className="w-3 h-3" />
                      ID: {user.employeeId}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                    <Calendar className="w-3 h-3" />
                    Since {formatDate(user?.startDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <div className="p-2 bg-linear-to-r from-blue-500 to-blue-600 rounded-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                Personal Information
              </h2>
              <p className="text-gray-600 text-sm mt-1">Basic personal details and contact information</p>
            </div>
            <div className="p-6 space-y-3">
              <InfoItem icon={Mail} label="Email Address" value={user?.email || "Not provided"} />
              <InfoItem icon={User} label="Gender" value={user?.gender === "L" ? "Laki-laki" : user?.gender === "P" ? "Perempuan" : "Not specified"} />
              <InfoItem icon={MapPin} label="Address" value={user?.address || "Not provided"} />
              <InfoItem icon={Phone} label="Parent Phone" value={user?.parentPhone || "Not provided"} />
              <InfoItem icon={Calendar} label="Birth Date" value={formatDate(user?.birthDate)} />
              <InfoItem icon={MapPin} label="Birth Place" value={user?.birthPlace || "Not provided"} />
            </div>
          </div>

          {/* Professional Info */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <div className="p-2 bg-linear-to-r from-green-500 to-emerald-600 rounded-lg">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                Professional Information
              </h2>
              <p className="text-gray-600 text-sm mt-1">Work-related details and academic information</p>
            </div>
            <div className="p-6 space-y-3">
              <InfoItem icon={Briefcase} label="Position" value={user?.position || "Not specified"} />
              <InfoItem icon={Shield} label="Role" value={user?.role?.name || "Not specified"} />
              <InfoItem icon={Calendar} label="Start Date" value={formatDate(user?.startDate)} />
              {user?.endDate && <InfoItem icon={Calendar} label="End Date" value={formatDate(user?.endDate)} />}
              <InfoItem icon={GraduationCap} label="Class" value={user?.class?.name || "No class assigned"} />
              {user?.major?.name && <InfoItem icon={Award} label="Major" value={user.major.name} />}
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <div className="p-2 bg-linear-to-r from-purple-500 to-pink-600 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              System Information
            </h2>
            <p className="text-gray-600 text-sm mt-1">Account creation and last update information</p>
          </div>
          <div className="p-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <InfoItem icon={Calendar} label="Created At" value={formatDate(user?.createdAt)} />
              <InfoItem icon={Clock} label="Last Updated" value={formatDate(user?.updatedAt)} />
              <InfoItem icon={User} label="User ID" value={user?.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
