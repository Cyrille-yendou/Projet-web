import { useEffect, useState } from "react";
import { getGroups, getMatches, getTeams } from "../serviceAPI/dataRetriever";
import type { Match } from "../types/match";
import type { Team } from "../types/team";
import type { Group } from "../types/group";
import { Link } from "react-router";
import { dateFormatDDMMYYYY } from "./toolBox";


export default function MatchList () {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // options des filtres (dates min et max de sélections, choix des équipes possibles, etc)
  const [fd_Boundary, set_fd_Boundary] = useState<string[]>([]);
  const [fg_Options, set_fg_Options] = useState<Group[]>([]);
  const [ft_Options, set_ft_Options] = useState<Team[]>([]);
  
  // filtres d'affichages
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterGroups, setFilterGroups] = useState<string[]>([]);
  const [filterTeams, setFilterTeams] = useState<string[]>([]);

  // filtre des matchs selon s'ils contiennent équipe(s) recherché(s) en filtre
  let filteredMatches = matches.filter(match => (filterTeams.length==0 || filterTeams.includes(match.homeTeam.name) || filterTeams.includes(match.awayTeam.name) ));
  // filtre des matchs selon s'ils contiennent groupe(s) recherché(s) en filtre
  // les 2 équipes sont du meme groupe, on a pas besoin de vérifier les 2
  filteredMatches = filteredMatches.filter(match => (filterGroups.length==0 || filterGroups.includes(match.homeTeam.groupId.toString()))); 
  // filtre des matchs selon s'ils contiennent date recherchée en filtre
  filteredMatches = filteredMatches.filter(match => (filterDate.length==0 || filterDate.includes(match.date.toString().substring(0,10)))); 


  useEffect(() => {
    const controller = new AbortController();
    //console.log("CHARGEMENT MatchList");
    getMatches()
      .then(res => {
        const cleanedMatches = res.data.filter((match: { status: string; }) => match.status == "scheduled"); // Que les matchs planifiés
        // en considérant les matchs triés par ordre chronologique :
        const min: string = cleanedMatches[0].date.substring(0,10);; // date du premier match pour selection filtre
        const max: string = cleanedMatches[cleanedMatches.length-1].date.substring(0,10);; // date du dernier match pour selection filtre
        set_fd_Boundary([min, max])

        setMatches(cleanedMatches);
    })
      .catch((err) => setError(err.message))
    
    getTeams()
      .then(res => set_ft_Options(res.data))
      .catch((err) => setError(err.message))
      
    getGroups()
      .then(res => set_fg_Options(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    
    return () => {controller.abort();};
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;


  const handleDateFilter = (data: { target: { value: any; }; }) => {
    const date = data.target.value;
    setFilterDate(date);
  }
  
  const handleGroupFilter = (data: { target: { selectedOptions: any; }; }) => {
    const groups = [...data.target.selectedOptions];
    const groupsId = groups.map(option => option.value);
    setFilterGroups(groupsId);
  }

  const handleTeamFilter = (data: { target: { selectedOptions: any; }; }) => {
    const teams = [...data.target.selectedOptions];
    const teamsNames = teams.map(option => option.value);
    setFilterTeams(teamsNames);
  }
  

  return (
    <div>
      <h2>Liste des matchs </h2>      

      <div>
        <h4>Filtres :  {filteredMatches.length} match(s) correspondant(s)</h4> 

        <label>Date : 
        <input type="date" min={fd_Boundary[0]} max={fd_Boundary[1]} onChange={handleDateFilter}/> </label>
          
        <label>Groupe(s) : 
        <select multiple onChange={handleGroupFilter}>
          {fg_Options.map((g) => (
            <option key={g.id} value={g.id}>Groupe {g.name}</option>
          ))}
        </select>
        </label>

        <label>Équipe(s) : 
        <select multiple onChange={handleTeamFilter}>
          {ft_Options.map((t) => (
            <option key={t.id} value={t.name}>{t.flag} {t.name}</option>
          ))}
        </select>
        </label>
      </div>

      <br></br>

      <ul>
          <li><b>Numéro de match : Equipe domicile -vs- Equipe visiteur — date — stade </b></li>
          {filteredMatches.map((m) => (
            <li key={m.id}>
              <Link to={"/matches/"+m.id}>
                n°{m.id}: {m.homeTeam.code}{m.homeTeam.flag} vs {m.awayTeam.flag}{m.awayTeam.code} — {dateFormatDDMMYYYY(m.date)} — {m.stadium.name}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};
