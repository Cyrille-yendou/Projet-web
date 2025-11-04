import type { Match } from "./match";

export type Ticket = {
  id: string;
  userId: string;
  matchId: number;
  category: string;
  price: number;
  status: string;
  seatNumber: string;
  qrCode: string;
  expiresAt: string;
  paymentDate: string;
  validatedAt: string;
  match: Match;
  quantity: number;
};

interface GroupedTickets {
  pending: Ticket[];
  confirmed: Ticket[];
  used: Ticket[];
}

export interface TicketResponse {
  tickets: Ticket[];
  grouped: GroupedTickets;
  counts: {
    total: number;
    pending: number;
    confirmed: number;
    used: number;
  };
}