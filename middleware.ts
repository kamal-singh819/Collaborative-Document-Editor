import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isAuthRoute =
      req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register";

    if (isAuthRoute && req.nextauth.token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const isAuthRoute =
          req.nextUrl.pathname === "/login" ||
          req.nextUrl.pathname === "/register";

        return isAuthRoute || Boolean(token);
      },
    },
    pages: {
      signIn: "/login",
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
