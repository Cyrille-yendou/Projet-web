
import { useEffect, useState } from "react";
import { getGroups, getMatches, getTeams } from "../api/ticketing";
import type { Match } from "../types/match";
import type { Team } from "../types/team";
import type { Group } from "../types/group";


export default function MatchList () {
  console.log("CHARGEMENT MatchList");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // options des filtres (dates min et max de sélections, choix des équipes possibles, etc)
  const [fd_Boundary, set_fd_Boundary] = useState([]);
  const [ft_Options, set_ft_Options] = useState<Team[]>([]);
  const [fg_Options, set_fg_Options] = useState<Group[]>([]);
  
  // filtres d'affichages
  const [filterDates, setFilterDates] = useState();
  const [filterTeams, setFilterTeams] = useState<string[]>([]);
  const [filterGroups, setFilterGroups] = useState<string[]>([]);

  // filtre des matchs selon s'ils contiennent équipe(s) recherché(s) en filtre
  let filteredMatches = matches.filter(match => (filterTeams.length==0 || filterTeams.includes(match.homeTeam.name) || filterTeams.includes(match.awayTeam.name) ));
  // filtre des groups selon s'ils contiennent groupe(s) recherché(s) en filtre
  filteredMatches = filteredMatches.filter(match => (filterGroups.length==0 || filterGroups.includes(match.homeTeam.groupId.toString()))); 
  // les 2 équipes sont du meme groupe, on a pas besoin de vérifier les 2


  useEffect(() => {
    getMatches()
      .then(res => {
        const cleanedMatches = res.data.filter((match: { status: string; }) => match.status == "scheduled"); // Que les matchs planifiés
        // en considérant les matchs triés par ordre chronologique :
        const min: string = res.data[0].date.slice(0, res.data[0].date.indexOf("T")); // date du premier match pour selection filtre
        const max: string = res.data[res.data.length-1].date.slice(0, res.data[0].date.indexOf("T")); // date du dernier match pour selection filtre
        set_fd_Boundary([min, max])

        setMatches(cleanedMatches);
    })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    
    getTeams()
      .then(res => set_ft_Options(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
      
    getGroups()
      .then(res => set_fg_Options(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
   
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  
  const handleTeamFilter = (data: { target: { selectedOptions: any; }; }) => {
    const teams = [...data.target.selectedOptions];
    const teamsNames = teams.map(option => option.value);
    setFilterTeams(teamsNames);
  }
  
  const handleGroupFilter = (data: { target: { selectedOptions: any; }; }) => {
    const groups = [...data.target.selectedOptions];
    const groupsId = groups.map(option => option.value);
    //alert(groupsId);
    setFilterGroups(groupsId);
  }


  return (
    <div>
      <h2>Liste des matchs </h2>
      

      <div>
        <h4>Filtres :  {filteredMatches.length} match(s) correspondant(s))</h4> 

        <label>Date : 
        <input type="date" min={fd_Boundary[0]} max={fd_Boundary[1]} name="date"/> </label>

        <label>Équipe(s) : 
        <select multiple onChange={handleTeamFilter}>
          {ft_Options.map((t) => (
            <option key={t.id} value={t.name}>{t.flag} {t.name}</option>
          ))}
        </select>
        </label>

        <label>Groupe(s) : 
        <select multiple onChange={handleGroupFilter}>
          {fg_Options.map((g) => (
            <option key={g.id} value={g.id}>Groupe {g.name}</option>
          ))}
        </select>
        </label>
      </div>

      <br></br>

      <ul>
          <li><b>Equipe domicile -vs- Equipe visiteur — date — stade </b></li>
          {filteredMatches.map((m) => (
            <li key={m.id}>
              {m.homeTeam.code}{m.homeTeam.flag} vs {m.awayTeam.flag}{m.awayTeam.code} — {m.date} — {m.stadium.name}
            </li>
          ))}
      </ul>
    </div>
  );
};
