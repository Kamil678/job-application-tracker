import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth, getSession } from "@/lib/auth/auth";
import { AppShell } from "@/components/app/nav/app-shell";

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Server Component — runs on every request.
 * Validates the session and redirects unauthenticated users before
 * any client JS is sent to the browser.
 */
export default async function AppLayout({ children }: AppLayoutProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <AppShell
      user={{
        name: session.user.name,
        email: session.user.email,
      }}
    >
      {children}
    </AppShell>
  );
}
