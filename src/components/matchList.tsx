
import { useEffect, useState } from "react";
import { getMatches } from "../api/ticketing";
import type { Match } from "../types/match";


export default function MatchList () {
  console.log("CHARGEMENT MatchList");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState(["Mexico"]);

  const filteredMatches = matches.filter(match => (filteredTeams.includes( (match.homeTeam.name)||(match.awayTeam.name) )));

  useEffect(() => {
    getMatches()
      .then(res => {
        setMatches(res.data);
        //console.log(res.data);
    })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
   
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div>
      <h2>Liste des matchs</h2>

      <ul>
          <li><b>Equipe domicile -vs- Equipe visiteur — date — prix (€) </b></li>
        {matches.map((m) => (
          <li key={m.id}>
            {m.homeTeam.name} vs {m.awayTeam.name} — {m.date} — {m.priceMultiplier} €
          </li>
        ))}
      </ul>
    </div>
  );
};
