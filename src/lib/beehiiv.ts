// Påmelding til nyhetsbrevet på Beehiiv.
// Krever to miljøvariabler i Vercel (Settings → Environment Variables):
//   BEEHIIV_API_KEY         – API-nøkkel fra Beehiiv (Settings → API)
//   BEEHIIV_PUBLICATION_ID  – starter med «pub_», står på samme side i Beehiiv

export async function subscribeToNewsletter(
  email: string
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    return { ok: false, error: "Nyhetsbrevet er ikke koblet til ennå." };
  }

  const res = await fetch(
    `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        reactivate_existing: false,
        send_welcome_email: true,
        utm_source: "nettside",
        referring_site: "valgogpolitikk",
      }),
    }
  );

  if (res.ok) {
    return { ok: true };
  }

  return { ok: false, error: "Noe gikk galt. Prøv igjen senere." };
}
