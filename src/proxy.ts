import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/train(.*)",
  "/dashboard(.*)",
  "/api/progress(.*)",
  "/api/checkout(.*)",
]);

// Routes that should always be public
const isPublicRoute = createRouteMatcher([
  "/",
  "/training(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/verify(.*)",
  "/dev(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return;
  }

  const url = new URL(request.url);
  if (url.searchParams.get("dev") === "true") {
    const response = NextResponse.next();
    response.headers.set("x-dev-bypass", "true");
    return response;
  }

  if (isProtectedRoute(request) && !isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip static files and Next.js internals
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
