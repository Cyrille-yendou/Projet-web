
import { useEffect, useState } from 'react';
import { useAuth } from '../hook/useAuth'; 
import { getPaidTickets } from '../serviceAPI/ticketAPI'; 
import { Link } from 'react-router-dom';

interface PaidTicket {
    id: string;
    match: {
        homeTeam: { name: string };
        awayTeam: { name: string };
    };
    category: string;
    price: number; 
}

export default function HistoriqueCommandes() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [history, setHistory] = useState<PaidTicket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated) {
            setLoading(false); 
            return;
        }

        const fetchHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const confirmedTickets = await getPaidTickets();
                setHistory(confirmedTickets);
            } catch (e) {
                console.error("Erreur lors du chargement de l'historique:", e);
                setError("Impossible de charger l'historique des commandes.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [isAuthenticated, authLoading]); 

    if (authLoading || loading) {
        return <p className="text-center mt-10">Chargement de l'historique...</p>;
    }
    
    if (error) {
        return <p className="text-center text-red-500 mt-10">❌ {error}</p>;
    }

    if (!isAuthenticated) {
        return (
            <div className="text-center mt-10 p-4 bg-yellow-100 rounded-lg max-w-md mx-auto">
                <p className="font-semibold">🔒 Authentification requise</p>
                <p>Veuillez vous connecter pour consulter votre historique de commandes.</p>
                <Link to="/authentification" className="text-blue-600 hover:underline"> Me connecter </Link>
            </div>
        );
    }
    if (history.length === 0) {
        return (
            <div className="text-center mt-10">
                <p>Vous n'avez pas encore de commandes passées. 🎫</p>
                <Link to="/matches" className="text-blue-600 hover:underline">
                    Retour aux matchs
                </Link>
            </div>
        );
    }

    // --- Affichage de l'historique ---

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6">
            <h2 className="text-3xl font-bold mb-8 text-center">🧾 Historique des Commandes</h2>
            
            <div className="space-y-6">
                {history.map((ticket) => (
                    <div 
                        key={ticket.id} 
                        className="p-4 border border-green-200 bg-white shadow-lg rounded-xl flex justify-between items-center transition hover:shadow-xl"
                    >
                        <div>
                            <p className="text-lg font-bold text-gray-800">
                                Match : {ticket.match?.homeTeam} vs {ticket.match?.awayTeam}
                            </p>
                            
                            <p className="text-sm text-gray-600 mt-1">
                                Catégorie : <span className="font-medium">{ticket.category.replace("CATEGORY_", "")}</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-extrabold text-green-700">{ticket.price.toFixed(2)} €</p>
                            <span className="text-sm text-green-500 font-semibold">Payé</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
