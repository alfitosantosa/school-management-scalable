import SignIn from "./auth/sign-in/page";

export default function Unauthorized() {
  return (
    <main>
      <h1>401 - Unauthorized</h1>
      <p>Please log in to access this page.</p>
      <SignIn />
    </main>
  );
}
