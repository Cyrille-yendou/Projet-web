
import type { Match } from "../types/match";
import type { Team } from "../types/team";
import type { Group } from "../types/group";
import type { Availability } from "../types/availability";
import type { User } from "../types/user";

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
/* ----------------------- PANIER ----------------------- */

// Ajouter des tickets dans le panier
export async function addTicket(matchId: number, category: string, quantity: number) {
  const res = await fetch(`${API_REST}/tickets`, {
    method: "POST",
    credentials: "include", 
    headers: { 
      "Content-Type": "application/json"},
    body: JSON.stringify({ matchId, category, quantity }),
  });
  if (!res.ok) {
    const errorBody = await res.json();
    if (errorBody && errorBody.message) {
      throw new Error(errorBody.message); 
    } 
    throw new Error("Erreur lors de l’ajout au panier");
  }
  return res.json();
}

// Supprimer un ticket du panier
export async function removeFromTicket(id: string) {
  const res = await fetch(`${API_REST}/tickets/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {   "Content-Type": "application/json" },
    body: JSON.stringify({ id}),
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Authentification requise pour voir les tickets.");
     } 
   throw new Error("Erreur lors de la récupération des tickets (HTTP " + res.status + ")");
    }
  return res.json();
}

// Voir les tickets dans le panier
export async function getPendingTickets() {
  const res = await fetch(`${API_REST}/tickets/pending`, {
    credentials: "include",
    headers: {    "Content-Type": "application/json"}
  });
  if (!res.ok) throw new Error("Erreur lors de la récupération du panier");
  const data = await res.json();
  //  Filtre des résultats pour ne garder que ceux en statut "pending_payment"
 if (data.data && data.data.tickets) {
    const pendingTickets = data.data.tickets.filter(
        (ticket: any) => ticket.status === "pending_payment"
    );
    return pendingTickets.map((ticket: any) => ({
      id: ticket.id, 
      matchId: ticket.matchId,
      category: ticket.category,
      quantity: 1, 
      price: ticket.price,
    }));
 }
  return res.json();
}
//voir tickets achetés
export async function getTicket() {
  const res = await fetch(`${API_REST}/tickets`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Authentification requise pour voir les tickets.");
     } 
   throw new Error("Erreur lors de la récupération des tickets (HTTP " + res.status + ")");
    }
   const data = await res.json();
   return data.data as User;
}

// Payer les tickets du panier
export async function payPending() {
 const res = await fetch(`${API_REST}/tickets/pay-pending`, {
    method: "POST",
    credentials: "include",
    headers: {  "Content-Type": "application/json" }
   });
   
   if (!res.ok) {
    if (res.status === 401) {
         throw new Error("Authentification requise pour payer les tickets.");
    } else if (res.status === 400) {
       throw new Error("Erreur lors du paiement du panier : aucun ticket en attente, tickets expirés, ou données incorrectes.");
    } else {
      throw new Error("Erreur lors de la tentative de paiement (HTTP " + res.status + ").");
    }
  } 
  return res.json();
}

// Valider un ticket acheté
export async function validateTicket(id: string, qrCode: string) {
  const res = await fetch(`${API_REST}/tickets/${id}/validate`, {
    method: "POST",
    credentials: "include",
    headers: {   "Content-Type": "application/json" },
    body: JSON.stringify({ qrCode}),
  });
  
  if (!res.ok) throw new Error("Erreur lors de la validation du ticket");
  return res.json();
}

// Voir les tickets déjà payé
export async function getPaidTickets() {
  const res = await fetch(`${API_REST}/tickets/pending`, {
    method: "GET",
    credentials: "include",
    headers: {    "Content-Type": "application/json"}
  });
  if (!res.ok) throw new Error("Erreur lors de la récupération du panier");
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Authentification requise pour voir l'historique.");
    }
    throw new Error("Erreur lors de la récupération de l'historique (HTTP " + res.status + ")");
  }
  //  Filtre des résultats pour ne garder que ceux en statut "paid"
 if (data.data && data.data.tickets) {
    const pendingTickets = data.data.tickets.filter(
        (ticket: any) => ticket.status === "confirmed"
    );
    return pendingTickets.map((ticket: any) => ({
      id: ticket.id, 
      matchId: ticket.matchId,
      category: ticket.category,
      price: ticket.price,
    }));
 }
  return res.json();
}