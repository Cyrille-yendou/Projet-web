
import { useEffect, useState } from "react";
import { getMatches } from "../api/ticketing";
import type { Match } from "../types/match";


export default function MatchList () {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState(["0", "2"]);
  
  const testMatches = [
    {id: 1, teams: [{id: 0, name: "0"}, {id: 1, name: "1"}], date: Date(), price:3},
    {id: 2, teams: [{id: 2, name: "2"}, {id: 3, name: "3"}], date: Date(), price:4},
    {id: 3, teams: [{id: 2, name: "2"}, {id: 0, name: "0"}], date: Date(), price:5},
    {id: 4, teams: [{id: 2, name: "3"}, {id: 0, name: "4"}], date: Date(), price:6}
  ];

  const filteredMatches = testMatches.filter(match => (filteredTeams.includes( (match.teams[0].name)||(match.teams[1].name) )));

  useEffect(() => {
    getMatches()
      .then(data => setMatches(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div>
      <h2>Liste des matchs</h2>
      <ul>
        {filteredMatches.map((m) => (
          <li key={m.id}>
            {m.teams[0].name} vs {m.teams[1].name} — {m.date} — {m.price} €
          </li>
        ))}
      </ul>
    </div>
  );
};
