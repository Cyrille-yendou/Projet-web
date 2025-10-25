
import React, { useEffect, useState } from "react";
import { getMatches } from "../api/ticketing";
import type { Match } from "../types/Match";


export const MatchList: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMatches()
      .then(setMatches)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div>
      <h2>Liste des matchs</h2>
      <ul>
        {matches.map((m) => (
          <li key={m.id}>
            {m.teams[0].name} vs {m.teams[1].name} — {m.date} — {m.price} €
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchList;
