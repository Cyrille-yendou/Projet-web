import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getAvailabilityByMatchId, getMatchById, addTicket, getTicket} from "../serviceAPI/dataRetriever";
import type { Match } from "../types/match";
import type { Availability } from "../types/availability";
import { dateFormatDDMMYYYY, timeFormatHHMM } from "./toolBox";
import { Link } from "react-router";


export default function MatchDetails() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  
  const [match, setMatch] = useState<Match | null>(null);
  const [availability, setAvailability] = useState<Availability | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [userTicketCount, setUserTicketCount] = useState(0); 
  const MAX_GLOBAL_TICKETS = 6;

  const handleChangeQuantity = (category: string, newQuantity: number) => {
    const value = Number(newQuantity);

    // Vérification de NaN et conversion en entier
    if (isNaN(value)) {
      return;
    }
    
    const safeQuantity = Math.max(1, Math.min(6, Math.floor(value))); 

    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [category]: safeQuantity,
    }));
  };

  useEffect(() => {
    const controller = new AbortController();
    console.log("CHARGEMENT MatchDetails "+matchId);
    
    const id = Number(matchId);
    if (isNaN(id)) {
        setError("ID du match invalide.");
        setLoading(false);
        return;
    }

    getMatchById(id)
      .then(res => setMatch(res.data))
      .catch(err => setError(err.message));

    getAvailabilityByMatchId(id)
      .then(res => setAvailability(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    getTicket()
      .then(user => setUserTicketCount(user.ticketCount))
      .catch(err => console.error("Erreur de chargement du compte de billets:", err));

    return () => controller.abort();
  }, [matchId]); 

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>❌ Erreur : {error}</p>;

  // Le 'match' et 'availability' sont garantis non-null ici après les vérifications
  if (!match || !availability || !availability.categories) {
    return <p>Impossible d'afficher les détails du match : données manquantes ou structure invalide.</p>;
  }

  async function handleBuy(category: string) {
    const quantity = quantities[category]|| 1;
    const matchId = match.id; 

    if (userTicketCount + quantity > MAX_GLOBAL_TICKETS) {
        alert(`❌ Limite dépassée : Vous avez déjà ${userTicketCount} billets. Vous ne pouvez ajouter que ${MAX_GLOBAL_TICKETS - userTicketCount} de plus.`);
        return;
    }

    if (!matchId || typeof matchId !== 'number') {
        alert("Erreur: ID du match non trouvé.");
        return;
    }
    if (quantity === undefined || quantity < 1 || quantity > 6) { 
      alert("⚠️ Veuillez sélectionner une quantité valide (entre 1 et 6 tickets maximum).");
      return;
    }

    try {
      
      const res = await addTicket( matchId, category, quantity);
      alert(`🎟️ ${quantity} ticket(s) ajouté(s) au panier avec succès !`);
      console.log("✅ Billets ajoutés au panier avec succès !");
      console.log("Réponse du serveur :", res);
    } catch (err) {
      if (err instanceof Error) {
        alert(`❌ Erreur : ${err.message}`); 
      } else {
        alert("❌ Erreur lors de l’ajout au panier. Cause inconnue.");
        console.error("Erreur inattendue attrapée:", err);
      }
       navigate("/tickets");
    }
}

  return (
    <div>
      <h2>Informations du Match n°{match.id}</h2>
      <h2>
        ({match.homeTeam.confederation}) {match.homeTeam.name} {match.homeTeam.flag} vs {match.awayTeam.flag} {match.awayTeam.name} ({match.awayTeam.confederation})
      </h2>

      <span>
        Le {dateFormatDDMMYYYY(match.date)} à {timeFormatHHMM(match.date)} <br />
        au <i>{match.stadium.name}</i> situé à {match.stadium.city} ({match.stadium.country})
      </span>

      <br />
      <h4>— {match.availableSeats} Places disponibles —</h4>

      <ul>
        {Object.entries(availability.categories).map(([key, placeAv]) => {
          const currentQuantity = quantities[key] || 1;
          
          return (
            <li key={key}>
              {key} : {placeAv.available ? (
                <div>
                  {placeAv.availableSeats} places disponibles <br />
                  <label>
                    Quantité :
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={currentQuantity}
                      onChange={(e) => 
                          handleChangeQuantity(key, Number(e.target.value))
                      }
                    />
                  </label>
                  <button 
                    onClick={() => handleBuy(key)}
                    // Désactivation si la quantité n'est pas dans la plage valide
                    disabled={currentQuantity < 1 || currentQuantity > 6} 
                  >
                    Acheter à {(placeAv.price * match.priceMultiplier * currentQuantity).toFixed(2)} €
                  </button>
                </div>
              ) : (
                <div>Aucune place disponible</div>
              )}
            </li>
          );
        })}
      </ul>
      <br />
      <h4> 
        <Link to={"/tickets/pending"} > Voir mon Panier</Link>  
      </h4>
    </div>
  );
}