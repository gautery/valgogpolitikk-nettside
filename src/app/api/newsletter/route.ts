import { NextRequest, NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/lib/buttondown";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "Ugyldig e-postadresse." },
        { status: 400 }
      );
    }

    const result = await subscribeToNewsletter(email);
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Noe gikk galt." },
      { status: 500 }
    );
  }
}
