
import { Link, Routes, Route } from 'react-router-dom';
import MatchDetails from './matchDetails';
import MatchesList from './matchList';

export default function Home() {
  return (
    <div>
      <h1>Billetterie Coupe du Monde 2026</h1>
      <p>Bienvenue sur l’application de billetterie. Veuillez sélectionner un match dans la liste.</p>
       <nav>
        <Link to="/matches">Voir les matches</Link>
      </nav>

      <Routes>
        <Route path="/matches" element={<MatchesList />} />
        <Route path="/match/:id" element={<MatchDetails />} />
      </Routes>
    </div>
  );
}
