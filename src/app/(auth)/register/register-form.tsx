"use client";

import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

import { registerUser, type RegisterState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

const initialState: RegisterState = {};

export function RegisterForm() {
  const [state, action, isPending] = useActionState(registerUser, initialState);

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="name">
          Name
        </label>
        <input
          required
          className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
          id="name"
          name="name"
          type="text"
          autoComplete="name"
        />
        {state.errors?.name ? (
          <p className="text-sm text-destructive">{state.errors.name[0]}</p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          required
          className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
        />
        {state.errors?.email ? (
          <p className="text-sm text-destructive">{state.errors.email[0]}</p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input
          required
          className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
        />
        {state.errors?.password ? (
          <p className="text-sm text-destructive">{state.errors.password[0]}</p>
        ) : null}
      </div>
      {state.message ? (
        <p className="text-sm text-muted-foreground">{state.message}</p>
      ) : null}
      <Button className="h-10 w-full" disabled={isPending} type="submit">
        <UserPlus />
        {isPending ? "Creating account..." : "Create account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <Link className="font-medium text-foreground hover:underline" href="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
