import type { PlaceAvailability } from "./placeAvailability";

export type Availability = {
    data(data: any): void | PromiseLike<void>;
    matchId: number;
    totalAvailableSeats: number;
    categories: {
        [key: string]: PlaceAvailability; // chaque clef (VIP, CAT1, etc)
    };
}