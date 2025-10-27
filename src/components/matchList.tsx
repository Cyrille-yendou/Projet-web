
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
  const [filteredDates, setFilteredDates] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState(["1", "2"]);

  //filteredMatches = matches.filter(match => (filteredTeams.includes( (match.homeTeam.name)||(match.awayTeam.name) )));
  //const test = matches[0].date.toLocaleDateString("en-CA");
  //console.log(test);

  useEffect(() => {
    getMatches()
      .then(res => {
        console.log(res.data[0]);
        const cleanedMatches = res.data.filter(match => match.status == "scheduled"); // Que les matchs planifiés

        const min: string = res.data[0].date.slice(0, res.data[0].date.indexOf("T")); // date du premier match pour selection filtre
        const max: string = res.data[res.data.length-1].date.slice(0, res.data[0].date.indexOf("T")); // date du dernier match pour selection filtre
        setFilteredDates([min, max])

        setMatches(cleanedMatches);
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

      <div>
        <h4>Filtres :</h4> 

        <label>Date : 
        <input type="date" min={filteredDates[0]} max={filteredDates[1]} name="date"/> </label>

        <label>Équipe : 
        <select>
          <option value="placeholder">placeholder</option>
        </select>
        </label>

        <label>Groupe : 
        <select>
          <option value="placeholder2">placeholder2</option>
        </select>
        </label>
      </div>

      <br></br>

      <ul>
          <li><b>Equipe domicile -vs- Equipe visiteur — date — stade </b></li>
        {matches.map((m) => (
          <li key={m.id}>
            {m.homeTeam.code}{m.homeTeam.flag} vs {m.awayTeam.flag}{m.awayTeam.code} — {m.date} — {m.stadium.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
