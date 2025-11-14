
import type { Match } from "../types/match";
import type { Team } from "../types/team";
import type { Group } from "../types/group";
import type { Availability } from "../types/availability";


const API_REST  = "https://worldcup2026.shrp.dev"; 

// Récupérer tous les matchs
export async function getMatches(): Promise<Match[]> {
  console.log("Appel API - getMatches()");
  const res = await fetch(`${API_REST}/matches`);
  if (!res.ok) throw new Error("Erreur HTTP "+ res.status); // erreur lors du chargement des matchs
  const matches = await res.json();
  //console.log(Object.keys(matches.data).length + " objets dans la liste, recu depuis API");
  return matches;
}

// Récupérer les détails d’un match
export async function getMatchById(id: number): Promise<Match> {
  console.log("Appel API - getMatchById() "+id);
  const res = await fetch(`${API_REST}/matches/${id}`);
  if (!res.ok) throw new Error("Erreur HTTP "+ res.status);
  const match = await res.json();
  return match;
}

// Récupérer les disponibilités d’un match
export async function getAvailabilityByMatchId(id: number): Promise<Availability> {
  console.log("Appel API - getAvailabilityByMatchId() "+id);
  const res = await fetch(`${API_REST}/matches/${id}/availability`);
  if (!res.ok) throw new Error("Erreur HTTP "+ res.status);
  const availability = await res.json();
  return availability;
}

// Récupérer toutes les équipes
export async function getTeams(): Promise<Team[]> {
  console.log("Appel API - getTeams()");
  const res = await fetch(`${API_REST}/teams`);
  if (!res.ok) throw new Error("Erreur HTTP "+ res.status); // erreur lors du chargement des équipes
  const teams = await res.json();
  //console.log(Object.keys(teams.data).length + " objets dans la liste, recu depuis API");
  return teams;
}

// Récupérer tous les groupes
export async function getGroups(): Promise<Group[]> {
  console.log("Appel API - getGroups()");
  const res = await fetch(`${API_REST}/groups`);
  if (!res.ok) throw new Error("Erreur HTTP "+ res.status); // erreur lors du chargement des groupes
  const groups = await res.json();
  //console.log(Object.keys(groups.data).length + " objets dans la liste, recu depuis API");
  return groups;
}
