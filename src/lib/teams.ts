export const LEC_TEAMS = [
  "G2 Esports",
  "Fnatic",
  "Team Vitality",
  "Karmine Corp",
  "Movistar KOI",
  "GIANTX",
  "SK Gaming",
  "Shifters",
  "Team Heretics",
  "Natus Vincere",
] as const;

export function getTeamLogo(name: string): string {
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  return `/teams/${normalized}.png`;
}

export function getTeamInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
}
