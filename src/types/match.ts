import type { Stadium } from './stadium';
import type { Team } from './team';

export type Match = {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  stadium: Stadium;
  status: string;
  //stage: string; // pas utilisé, comme les dates 
  date: Date;
  seatsAvailable: number; // nombre de places restantes
  priceMultiplier: number; // prix unitaire pour un ticket
}