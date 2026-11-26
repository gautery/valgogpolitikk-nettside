// Sider som er bygd i kode (ikke i Pages CMS) og fortsatt er utkast.
// Så lenge en side står som «true» her, er den skjult for søkemotorer og
// står ikke i nettstedskartet. Sett til «false» når Gaute har godkjent siden.

export const UTKAST = {
  trappa: true,
  statsbudsjett: true,
} as const;

// Før lansering er hele nettstedet en demo: utkast vises da i lister og menyer,
// merket «Utkast», så Gaute ser hvordan alt henger sammen. Settes til false ved lansering.
export const DEMO = false;

export const SKJULT_FOR_SOK = { index: false, follow: false } as const;
