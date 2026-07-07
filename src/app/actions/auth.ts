"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { ensureDatabaseConnection, prisma } from "@/db/prisma";
import { Prisma } from "@/generated/prisma/client";
import { hashPassword } from "@/lib/password";
import { uuid } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").trim(),
  email: z.string().email("Enter a valid email address.").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Za-z]/, "Password must include a letter.")
    .regex(/[0-9]/, "Password must include a number."),
});

export type RegisterState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
};

export async function registerUser(
  _state: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Check the highlighted fields.",
    };
  }

  try {
    await ensureDatabaseConnection();

    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true },
    });

    if (existingUser) {
      return {
        errors: { email: ["An account already exists for this email."] },
        message: "Use a different email or sign in.",
      };
    }

    const hashedPassword = await hashPassword(parsed.data.password);

    await prisma.user.create({
      data: {
        id: uuid(),
        name: parsed.data.name,
        email: parsed.data.email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        errors: { email: ["An account already exists for this email."] },
        message: "Use a different email or sign in.",
      };
    }

    console.error("Registration failed", error);

    return {
      message:
        "We could not create your account right now. Check that the database is running and try again.",
    };
  }

  redirect("/login?registered=1");
}
