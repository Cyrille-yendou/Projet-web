import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getAvailabilityByMatchId, getMatchById } from "../serviceAPI/dataRetriever";
import type { Match } from "../types/match";
import type { Availability } from "../types/availability";
import { dateFormatDDMMYYYY, timeFormatHHMM } from "./toolBox";
import type { PlaceAvailability } from "../types/placeAvailability";

export default function MatchDetails () {
  const {matchId} = useParams();
  const [match, setMatch] = useState<Match>(Object);
  const [availability, setavailability] = useState<Availability>(Object);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    //console.log("CHARGEMENT MatchDetails "+matchId);
    
    getMatchById(Number(matchId))
      .then(res => setMatch(res.data))
      .catch((err) => setError(err.message))
    
    getAvailabilityByMatchId(Number(matchId))
      .then(res => setavailability(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    return () => {controller.abort();};
  }, []);
  
  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;


  function visualizeAvailability(placeAv: PlaceAvailability, multiplier: number) {
    if (placeAv.available) {
      return (<div>
        {placeAv.availableSeats} places disponibles {"  "} <br></br>
        <button><Link to={"/placeholder"}>Acheter à {(placeAv.price * multiplier).toFixed(2)} €</Link></button>
      </div>)
    }
    else return (<div> Aucune place disponible </div>)
  }

  return (
    <div>
      <h2>Informations du Match n°{match.id}</h2> 
      <h2>({match.homeTeam.confederation}) {match.homeTeam.name} {match.homeTeam.flag} vs {match.awayTeam.flag} {match.awayTeam.name} ({match.awayTeam.confederation})</h2>
      
      <span>
        Le {dateFormatDDMMYYYY(match.date)} à {timeFormatHHMM(match.date)} <br></br>
        au <i>{match.stadium.name}</i> situé à {match.stadium.city} ({match.stadium.country})
      </span>

      <br></br> 
      <h4>— {match.availableSeats} Places disponibles —</h4>

      <ul>
        {Object.entries(availability.categories).map(([key, placeAv]) => (
          <li key={key}>
            {key} : {visualizeAvailability(placeAv, match.priceMultiplier)} <br></br>
          </li>
        ))}
      </ul>

    </div>
  );
};
