
import type { Match } from "../types/match";
import type { CartItem } from "../types/CartItem";

const API_REST  = "https://worldcup2026.shrp.dev"; 

// Récupérer tous les matchs
export async function getMatches(): Promise<Match[]> {
  console.log("Appel API");
  const res = await fetch(`${API_REST}/matches`);
  if (!res.ok) throw new Error("Erreur HTTP "+ res.status); // erreur lors du chargement des matchs
  const matches = await res.json();
  console.log(Object.keys(matches.data).length + " objets dans la liste, recu depuis API");
  return matches;
}

// Récupérer les détails d’un match
export async function getMatchById(id: number): Promise<Match> {
  const res = await fetch(`${API_REST}/matches/${id}`);
  if (!res.ok) throw new Error("Match introuvable");
  return res.json();
}

// Passer une commande (simulée)
export async function createOrder(items: CartItem[]) {
  const res = await fetch(`${API_REST}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) throw new Error("Erreur lors de la commande");
  return res.json();
}
