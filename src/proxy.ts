import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Før lansering: alle som besøker valgogpolitikk.no (med eller uten www)
// får «Kommer snart»-siden. Demoadressen på vercel.app viser hele nettsiden.
// Ved lansering: slett denne filen.

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").toLowerCase();
  if (host.endsWith("valgogpolitikk.no")) {
    return NextResponse.rewrite(new URL("/kommer-snart", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|kommer-snart).*)"],
};
