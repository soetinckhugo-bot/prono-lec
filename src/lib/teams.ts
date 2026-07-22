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

export const TEAM_COLORS: Record<string, string> = {
  "G2 Esports": "#FF0000",
  "Fnatic": "#FF8C00",
  "Team Vitality": "#FFFF00",
  "Karmine Corp": "#00BFFF",
  "Movistar KOI": "#8A2BE2",
  "GIANTX": "#FFFFFF",
  "SK Gaming": "#808080",
  "Shifters": "#FF69B4",
  "Team Heretics": "#FFD700",
  "Natus Vincere": "#CCCC00",
};

export function getTeamColor(name: string): string {
  return TEAM_COLORS[name] || "#E94560";
}

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
