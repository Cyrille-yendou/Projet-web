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

  const [match, setMatch] = useState<Match>(Object);
  const [availability, setavailability] = useState<Availability>(Object);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quantités par catégorie
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  // Récupération du token JWT depuis localStorage
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    alert("Vous devez être connecté pour acheter des tickets !");
  }

  useEffect(() => {
    const controller = new AbortController();

    getMatchById(Number(matchId))
      .then(res => setMatch(res.data.apply))
      .catch(err => setError(err.message));

     getAvailabilityByMatchId(Number(matchId))
      .then(res => setavailability(res.data.apply))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  async function handleBuy(category: string, placeAv: PlaceAvailability) {
     if (!token) {
      alert("Vous devez être connecté pour acheter des tickets !");
      return;
    }

    const quantity = quantities[category];
    if (quantity < 1 || quantity > 6) {
      alert("⚠️ Vous pouvez acheter entre 1 et 6 tickets maximum.");
      return;
    }

    try {
      await addToCart(match.id, placeAv.category, quantity, token);
      alert(`🎟️ ${quantity} ticket(s) ajouté(s) au panier avec succès !`);
      navigate("/panier");
    } catch (err) {
      alert("❌ Erreur lors de l’ajout au panier.");
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
