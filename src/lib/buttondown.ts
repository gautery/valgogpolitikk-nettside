export async function subscribeToNewsletter(
  email: string
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.BUTTONDOWN_API_KEY;

  if (!apiKey) {
    return { ok: false, error: "Nyhetsbrev er ikke konfigurert ennå." };
  }

  const res = await fetch("https://api.buttondown.com/v1/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, tags: ["nettside"] }),
  });

  if (res.ok) {
    return { ok: true };
  }

  const data = await res.json().catch(() => null);
  if (res.status === 409) {
    return { ok: true }; // Already subscribed — treat as success
  }

  return {
    ok: false,
    error: data?.detail || "Noe gikk galt. Prøv igjen senere.",
  };
}
