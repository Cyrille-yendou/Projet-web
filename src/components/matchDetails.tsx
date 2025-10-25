import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Match } from '../types/Match';

export default function MatchDetails() {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`https://worldcup2026.shrp.dev/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Match non trouvé');
        return res.json();
      })
      .then((data: Match) => setMatch(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Chargement du match...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!match) return <p>Match introuvable</p>;

  return (
    <div>
      <h1>Détails du match</h1>
      <p>
        {match.teams[0].name} vs {match.teams[1].name}
      </p>
      <p>Ville : {match.city}</p>
      <p>Stade : {match.stadium}</p>
      <p>Date : {match.date}</p>
      <p>Prix : {match.price} €</p>
      <p>Places restantes : {match.seatsAvailable}</p>
      <Link to="/">← Retour à la liste</Link>
    </div>
  );
}
