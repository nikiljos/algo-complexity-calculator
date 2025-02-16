import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const SHORT_LIMIT = Number(process.env.RL_SHORT_LIMIT) || 5;
const LONG_LIMIT = Number(process.env.RL_LONG_LIMIT) || 15;

const shortRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(SHORT_LIMIT, "5 m"),
  prefix: "ac_short",
});

const longRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(LONG_LIMIT, "6 h"),
  prefix: "ac_long",
});

const isProtectedRoute = createRouteMatcher(["/api(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {
      success: shortSuccess,
      remaining: shortRemaining,
      reset: shortReset,
    } = await shortRatelimit.limit(userId);

    console.log({
      userId,
      shortRemaining,
      shortReset,
    });
    if (!shortSuccess) {
      const resetWindow = (
        (shortReset - new Date().getTime()) /
        (1000 * 60)
      )?.toFixed(1);
      return Response.json(
        {
          message: `Sorry, My budget won't allow that many requests at a time. Please try after ${resetWindow} minutes.`,
        },
        { status: 429 }
      );
    }

    const {
      success: longSuccess,
      remaining: longRemaining,
      reset: longReset,
    } = await longRateLimit.limit(userId);
    console.log({
      userId,
      longRemaining,
      longReset,
    });
    if (!longSuccess) {
      shortRatelimit.resetUsedTokens(userId);
      const resetWindow = (
        (longReset - new Date().getTime()) /
        (1000 * 60 * 60)
      )?.toFixed();
      return Response.json(
        {
          message: `Looks like you're lovin' it, but my wallet is not. Please try after ${resetWindow} hours.`,
        },
        { status: 429 }
      );
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
