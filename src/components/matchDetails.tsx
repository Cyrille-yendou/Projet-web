import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getAvailabilityByMatchId, getMatchById, addTicket, getTicket} from "../serviceAPI/dataRetriever";
import type { Match } from "../types/match";
import type { Availability } from "../types/availability";
import { dateFormatDDMMYYYY, timeFormatHHMM } from "./toolBox";
import { Link as RouterLink } from "react-router";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Divider,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import { Stadium, CalendarToday } from "@mui/icons-material";


export default function MatchDetails() {

  const PATH_IMG_FLAGS = "/assets/flags/"; //pareil que dans matchList

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
  if (error) return <p>Erreur : {error}</p>;

  // Le 'match' et 'availability' sont garantis non-null ici après les vérifications
  if (!match || !availability || !availability.categories) {
    return <p>Impossible d'afficher les détails du match : données manquantes ou structure invalide.</p>;
  }

  async function handleBuy(category: string) {
    const quantity = quantities[category]|| 1;
    const matchId = match.id; 

    if (userTicketCount + quantity > MAX_GLOBAL_TICKETS) {
        alert(`Limite dépassée : Vous avez déjà ${userTicketCount} billets. Vous ne pouvez ajouter que ${MAX_GLOBAL_TICKETS - userTicketCount} de plus.`);
        return;
    }

    if (!matchId || typeof matchId !== 'number') {
        alert("Erreur: ID du match non trouvé.");
        return;
    }
    if (quantity === undefined || quantity < 1 || quantity > 6) { 
      alert("Veuillez sélectionner une quantité valide (entre 1 et 6 tickets maximum).");
      return;
    }

    try {
      const res = await addTicket( matchId, category, quantity);
      alert(`${quantity} ticket(s) ajouté(s) au panier avec succès !`);
      //debug
      //console.log("Billets ajoutés au panier avec succès !");
      //console.log("Réponse du serveur :", res);
    } catch (err) {
      if (err instanceof Error) {
        alert(`Erreur : ${err.message}`); 
        navigate("/matches/"+matchId); //on renvoie l'utilisateur sur la page du détail du match
      } else {
        alert("Erreur lors de l’ajout au panier. Cause inconnue.");
        //console.error("Erreur inattendue attrapée:", err);
      }
       navigate("/matches/"+matchId); //pareil
    }
}

return (
  <Container sx={{ py: 5, fontFamily: "Montserrat, sans-serif" }}>
    <Card
      sx={{
        maxWidth: 800,
        mx: "auto",
        boxShadow: 4,
        borderRadius: 3,
        bgcolor: "white",
      }}
    >
      {/* Bandeau titre bleu */}
      <Box
        sx={{
          bgcolor: "rgba(4, 86, 148, 0.9)",
          color: "white",
          py: 2,
          textAlign: "center",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Informations du match n°{match.id}
        </Typography>
      </Box>

      <CardContent sx={{ p: 4 }}>
        {/*l'en-tête avec les équipes (globalement pareil que matchList*/}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
              flexWrap: "wrap",
            }}
          >
            {/*l'équipe à domicile*/}
            <Box sx={{ textAlign: "center" }}>
              <Box
                component="img"
                src={`${PATH_IMG_FLAGS}${match.homeTeam.code}.png`}
                alt={match.homeTeam.name}
                sx={{ width: 64, height: 48 }}
              />
              <Typography variant="body1" fontWeight="bold">
                {match.homeTeam.name}
              </Typography>
            </Box>

            {/*le vs*/}
            <Typography variant="h6" sx={{ color: "rgba(153,153,153,1)" }}>
              VS
            </Typography>

            {/*la carte de l'équipe à l'extérieur*/}
            <Box sx={{ textAlign: "center" }}>
              <Box
                component="img"
                src={`${PATH_IMG_FLAGS}${match.awayTeam.code}.png`}
                alt={match.awayTeam.name}
                sx={{ width: 64, height: 48 }}
              />
              <Typography variant="body1" fontWeight="bold">
                {match.awayTeam.name}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/*les informations date + lieu*/}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <CalendarToday sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
            Le {dateFormatDDMMYYYY(match.date)} à {timeFormatHHMM(match.date)}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <Stadium sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
            {match.stadium.name} — {match.stadium.city}, {match.stadium.country}
          </Typography>

          <Typography
            variant="h6"
            sx={{ mt: 2, color: "rgba(4, 86, 148, 0.9)", fontWeight: "bold" }}
          >
            {match.availableSeats} places disponibles
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/*catégories dispo*/}
        <Box>
          <Typography variant="h6" gutterBottom>
            Catégories disponibles :
          </Typography>

          {Object.entries(availability.categories).map(([key, cat]) => {
            const qty = quantities[key] || 1;
            return (
              <Paper
                key={key}
                sx={{
                  p: 2,
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: cat.available ? "rgba(249, 249, 249, 1)" : "rgba(238, 238, 238, 1)",
                  borderRadius: 2,
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography fontWeight="bold">{key}</Typography>
                  {cat.available ? (
                    <Typography variant="body2" color="text.secondary">
                      {cat.availableSeats} places — {cat.price} €
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="error">
                      Aucune place disponible
                    </Typography>
                  )}
                </Box>

                {cat.available && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <TextField
                      type="number"
                      size="small"
                      label="Quantité"
                      value={qty}
                      onChange={(e) =>
                        handleChangeQuantity(key, Number(e.target.value))
                      }
                      sx={{ width: 80 }}
                    />
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "rgba(4, 86, 148, 0.8)",
                        "&:hover": {
                          backgroundColor: "rgba(4, 86, 148, 1)",
                        },
                      }}
                      onClick={() => handleBuy(key)}
                    >
                      Acheter ({(cat.price * match.priceMultiplier * qty).toFixed(2)} €)
                    </Button>
                  </Box>
                )}
              </Paper>
            );
          })}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Bouton panier */}
        <CardActions sx={{ justifyContent: "center" }}>
          <Button
            variant="outlined"
            component={Link}
            to="/tickets/pending"
            sx={{
              borderColor: "rgba(4, 86, 148, 0.9)",
              color: "rgba(4, 86, 148, 0.9)",
              fontWeight: "bold",
              "&:hover": {
                borderColor: "rgba(4, 86, 148, 1)",
                color: "rgba(4, 86, 148, 1)",
              },
            }}
          >
            Voir mon panier
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  </Container>
); 
}