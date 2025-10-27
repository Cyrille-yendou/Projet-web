import type { Team } from "./team";

export type Group = {
  id: string;
  name: string;
  teams: Team[];
}