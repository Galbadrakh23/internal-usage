import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the token from the cookies
  const token = request.cookies.get("token")?.value;

  // Check if the current path starts with /dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      // Redirect to login if no token exists
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/dashboard/:path*"],
};
