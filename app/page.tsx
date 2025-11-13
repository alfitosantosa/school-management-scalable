//make sure you're using the react client
"use client";
import Navbar from "@/components/navbar";
import { createAuthClient } from "better-auth/react";
const { useSession, signIn, signOut } = createAuthClient();

export default function User() {
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = useSession();
  return (
    <>
      <Navbar />
      <div>{session ? <p>Logged in as {session.user.email}</p> : <p>Not logged in</p>}</div>;
    </>
  );
}
