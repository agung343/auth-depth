import { auth, signOut } from "@/lib/auth";

export default async function SettingPage() {
  const session = await auth();
  return (
    <>
      <h1>{JSON.stringify(session)}</h1>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </>
  );
}
