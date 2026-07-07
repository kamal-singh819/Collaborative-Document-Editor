import { ArrowRight, FileText } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 px-4 py-10">
      <section className="w-full max-w-2xl rounded-lg border bg-background p-8 shadow-sm">
        <div className="mb-6 flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <FileText className="size-5" />
        </div>
        <h1 className="text-3xl font-semibold">Collaborative Document Editor</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          A local-first editor foundation with secure authentication before the
          offline sync engine and collaboration layer.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            className={cn(buttonVariants({ className: "h-10" }))}
            href="/register"
          >
            Create account
            <ArrowRight />
          </Link>
          <Link
            className={cn(
              buttonVariants({ className: "h-10", variant: "outline" }),
            )}
            href="/login"
          >
            Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
