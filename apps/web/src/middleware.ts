import createMiddleware from "next-intl/middleware";
import { routing } from "./navigation";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/((?!_next|_vercel|.*\\..*).*)",
    "/",
    "/(zh|ja|en)/:path*",
  ],
};
