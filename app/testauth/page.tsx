"use client";
import { Button } from "@/components/ui/button";

import { redirect } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import Image from "next/image";
import NextImage from "@/public/next.svg";

export default function DashboardPage() {
  const session = useSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  const handleLogout = () => {
    signOut();
    redirect("/auth/sign-in");
  };

  const ProfileImage = session.data?.user?.image ? session.data?.user?.image : NextImage;

  return (
    <div className="flex items-center w-full">
      <h1>Welcome {session.data?.user?.email}</h1>
      <Image src={ProfileImage} alt="Profile" width={50} height={50} />
      <Button onClick={handleLogout}>Sign out</Button>
    </div>
  );
}
