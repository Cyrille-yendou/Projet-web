import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getAvailabilityByMatchId, getMatchById, addToCart} from "../serviceAPI/dataRetriever";
import type { Match } from "../types/match";
import type { Availability } from "../types/availability";
import { dateFormatDDMMYYYY, timeFormatHHMM } from "./toolBox";
import type { PlaceAvailability } from "../types/placeAvailability";

export default function MatchDetails() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  // 1. Correction : Initialisation à null et types ajustés
  const [match, setMatch] = useState<Match | null>(null);
  const [availability, setAvailability] = useState<Availability | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quantités par catégorie
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  

  useEffect(() => {
    const controller = new AbortController();

    getMatchById(Number(matchId))
      .then(res => setMatch(res.data))
      .catch(err => setError(err.message));

    getAvailabilityByMatchId(Number(matchId))
      // J'ai corrigé setavailability en setAvailability
      .then(res => setAvailability(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [matchId]); // Ajout de matchId dans les dépendances pour une meilleure pratique

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  // 3. Nouvelle Vérification Cruciale : S'assurer que les données sont chargées
  if (!match || !availability) {
    // Cela gère le cas où loading est false, mais les données sont toujours null (ex: l'API n'a rien retourné sans erreur formelle)
    return <p>Impossible d'afficher les détails du match : données manquantes.</p>;
  }

  async function handleBuy(category: string, placeAv: PlaceAvailability) {
    
    // Le 'match' est garanti non-null ici grâce à la vérification ci-dessus
    const quantity = quantities[category];
    if (quantity < 1 || quantity > 6) {
      alert("⚠️ Vous pouvez acheter entre 1 et 6 tickets maximum.");
      return;
    }

    try {
      await addToCart(match.id, placeAv.category, quantity);
      alert(`🎟️ ${quantity} ticket(s) ajouté(s) au panier avec succès !`);
      navigate("/panier");
    } catch (err) {
      alert("❌ Erreur lors de l’ajout au panier.");
    }
  }

  // Le rendu principal est maintenant sécurisé
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
        {Object.entries(availability.categories).map(([key, placeAv]) => (
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
                    value={quantities[key] || 1}
                    onChange={(e) =>
                      setQuantities(prev => ({ ...prev, [key]: Number(e.target.value) }))
                    }
                  />
                </label>
                <button onClick={() => handleBuy(key, placeAv)}>
                  Acheter à {(placeAv.price * match.priceMultiplier * (quantities[key] || 1)).toFixed(2)} €
                </button>
              </div>
            ) : (
              <div>Aucune place disponible</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}