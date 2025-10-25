import type { Team } from './team';

export interface Match {
  id: string;
  date: string;
  country: string;
  city: string;           
  stadium: string;
  teams: [Team, Team];
  price: number;           // prix unitaire pour un ticket
  seatsAvailable: number;  // nombre de places restantes
  groupe: string;
}