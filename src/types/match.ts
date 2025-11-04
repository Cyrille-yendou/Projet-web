import type { Stadium } from './stadium';
import type { Team } from './team';

export type Match = {
  data(data: any): void | PromiseLike<void>;
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  stadium: Stadium;
  status: string;
  //stage: string; // pas utilisé, comme les dates 
  date: Date;
  availableSeats: number; // nombre de places restantes
  priceMultiplier: number; // prix unitaire pour un ticket
  //category: string;
}