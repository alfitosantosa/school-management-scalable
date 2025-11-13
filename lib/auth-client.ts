// import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react

// export const authClient = createAuthClient({
//   baseURL: process.env.NEXT_PUBLIC_APP_URL,
// });

// // export const { signIn, signOut, signUp, useSession } = authClient;

// export const signIn = async () => {
//   await authClient.signIn.social({
//     provider: "google",
//     callbackURL: "/dashboard",
//   });
// };

// // const data = await authClient.signIn.social({
// //   provider: "google",
// // });

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

export const { signIn, signOut, signUp, useSession } = authClient;
