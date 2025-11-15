import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Button,
} from "@mui/material";

import { useEffect, useState } from 'react';
import { useAuth } from '../hook/useAuth'; 
import { getPaidTickets } from '../serviceAPI/ticketAPI'; 
import { Link } from 'react-router-dom';

interface PaidTicket {
    id: string;
    match: {
        id:number
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

      //comme sur teamList, on évite le scroll horizontal (présent sur toutes les pages)
      useEffect(() => {
        document.body.style.overflowX = "hidden";
        return () => {
          document.body.style.overflowX = "auto";
        };
      }, []);


if (authLoading || loading) {
    return (
        <Container sx={{ textAlign: "center", mt: 6, fontFamily: "Montserrat, sans-serif" }}>
            <CircularProgress />
            <Typography mt={2}>Chargement de l'historique...</Typography>
        </Container>
    );
}

if (error) {
    return (
        <Container sx={{ mt: 6, fontFamily: "Montserrat, sans-serif" }}>
            <Alert severity="error" sx={{ maxWidth: 500, mx: "auto" }}>
                {error}
            </Alert>
        </Container>
    );
}

if (!isAuthenticated) {
    return (
        <Container sx={{ mt: 6, maxWidth: 500, fontFamily: "Montserrat, sans-serif" }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
                Authentification requise
            </Alert>

            <Typography textAlign="center" mb={2} sx={{fontFamily: "Montserrat, sans-serif"}}>
                Veuillez vous connecter pour consulter votre historique de commandes.
            </Typography>

            <Button
                component={Link}
                to="/authentification"
                variant="contained"
                fullWidth
                sx={{fontFamily: "Montserrat, sans-serif"}}
            >
                Me connecter
            </Button>
        </Container>
    );
}

if (history.length === 0) {
    return (
        <Container sx={{ mt: 6, maxWidth: 500, textAlign: "center", fontFamily: "Montserrat, sans-serif" }}>
            <Typography variant="h6" gutterBottom>
                Vous n'avez pas encore de commandes passées
            </Typography>

            <Button
                component={Link}
                to="/matches"
                variant="contained"
                color="primary"
                sx={{
                    mt: 2,
                    color: "white",
                    fontFamily: "Montserrat, sans-serif",
                    backgroundColor: "primary.main",
                    "&:hover": {
                        backgroundColor: "primary.dark",
                    },
                }}
            >
                Retour aux matchs
            </Button>
        </Container>
    );
}

//sinon affichage de l'historique des commandes
return (
    <Container sx={{ mt: 6, mb: 6, fontFamily: "Montserrat, sans-serif" }}>
        <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
            gutterBottom
        >
            Historique des Commandes
        </Typography>

        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
                gap: 3,
                mt: 4,
            }}
        >
            {history.map((ticket) => (
                <Card
                    key={ticket.id}
                    sx={{
                        borderRadius: 3,
                        boxShadow: 3,
                        transition: "0.2s",
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold">
                            Match n°{ticket.match.id}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            Catégorie :
                            <b> {ticket.category.replace("CATEGORY_", "")}</b>
                        </Typography>

                        <Box sx={{ textAlign: "right", mt: 2 }}>
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                color="green"
                            >
                                {ticket.price.toFixed(2)} €
                            </Typography>

                            <Typography variant="body2" color="green">
                                Payé
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Box>
    </Container>
)
}