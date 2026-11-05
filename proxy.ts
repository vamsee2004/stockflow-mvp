import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  let valid = false;
  const token = req.cookies.get("session")?.value;
  const secretValue = process.env.JWT_SECRET;
  if (token && secretValue) {
    try {
      await jwtVerify(token, new TextEncoder().encode(secretValue));
      valid = true;
    } catch {
      valid = false;
    }
  }

  if (!valid && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (valid && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/products/:path*", "/settings/:path*", "/login", "/signup"],
};