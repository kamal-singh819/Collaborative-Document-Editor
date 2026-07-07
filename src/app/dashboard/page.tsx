import { FileText, ShieldCheck, Wifi } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { SignOutButton } from "./sign-out-button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-svh bg-muted/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
        <header className="flex flex-col gap-4 rounded-lg border bg-background p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Signed in as</p>
            <h1 className="text-2xl font-semibold">{session.user.name}</h1>
            <p className="text-sm text-muted-foreground">{session.user.email}</p>
          </div>
          <SignOutButton />
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-background p-5 shadow-sm">
            <FileText className="mb-4 size-5" />
            <h2 className="font-medium">Documents</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The next slice will add document creation and local drafts.
            </p>
          </div>
          <div className="rounded-lg border bg-background p-5 shadow-sm">
            <Wifi className="mb-4 size-5" />
            <h2 className="font-medium">Sync engine</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Offline queues and conflict resolution will sit behind this area.
            </p>
          </div>
          <div className="rounded-lg border bg-background p-5 shadow-sm">
            <ShieldCheck className="mb-4 size-5" />
            <h2 className="font-medium">Authorization</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Owner, editor, and viewer checks will guard document mutations.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
