export function extraireJours(texte: string): number | null {
  // Regex insensible à la casse et tolérante aux espaces
  const match = texte.match(/(\d+)\s*jours?/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null; // retourne null si pas trouvé
}