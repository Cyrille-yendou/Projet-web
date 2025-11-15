import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { removeFromTicket, payPending } from "../serviceAPI/ticketAPI";
import { useGlobalCart } from "../hook/useGlobalTicket";
import { useAuth } from "../hook/useAuth";
import ModalConfirm from "../context/modalConfirm";

export default function Panier() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { tickets, loading, error, totalAmount, fetchCart } = useGlobalCart();

  const [modalType, setModalType] = useState<"delete" | "pay" | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const navigate = useNavigate();

  //on charge le panier que si l'utilisateur est connecté
  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      fetchCart();
    }
  }, [authLoading, isAuthenticated, fetchCart]);

  // Comme sur teamList, on évite le scroll horizontal
  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
    };
  }, []);

  const handleRemove = async (ticketId: string) => {
    setMessage(null);
    try {
      await removeFromTicket(ticketId);
      await fetchCart();
      setMessage({ text: "Ticket retiré du panier.", type: "success" });
    } catch (err) {
      setMessage({ text: "Erreur lors de la suppression du ticket.", type: "error" });
    }
    setModalType(null);
    setSelectedTicketId(null);
  };

  const handlePay = async () => {
    setMessage(null);
    setModalType(null);

    if (totalAmount === 0 || tickets.length === 0) {
      setMessage({ text: "Le panier est vide !", type: "error" });
      return;
    }
    try {
      await payPending();
      await fetchCart();
      setMessage({
        text: `Paiement de ${totalAmount.toFixed(2)} € effectué avec succès ! Vos tickets sont confirmés.`,
        type: "success",
      });
    } catch (err: any) {
      setMessage({
        text: err?.message || "Erreur lors du paiement. Veuillez réessayer.",
        type: "error",
      });
    }
  };

  //affichage si auth charge encore
  if (authLoading || loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 6, fontFamily: "Montserrat, sans-serif" }}>
        <CircularProgress />
        <Typography mt={2}>Chargement du panier...</Typography>
      </Container>
    );
  }

  //si on a un utilisateur pas connecté
  if (!isAuthenticated) {
    return (
      <Container sx={{ mt: 6, fontFamily: "Montserrat, sans-serif" }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Authentification requise
        </Alert>
        <Typography textAlign="center" mb={2}>
          Veuillez vous connecter pour consulter votre panier.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/auth")}
        >
          Se connecter
        </Button>
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

  //l'affichage si le panier est vide
  if (tickets.length === 0) {
    return (
      <Container sx={{ mt: 6, maxWidth: 500, textAlign: "center", fontFamily: "Montserrat, sans-serif" }}>
        <Typography variant="h6" gutterBottom>
          Votre panier est vide
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => navigate("/matches")}
        >
          Retour aux matchs
        </Button>
      </Container>
    );
  }

  //affichage panier si on est connecté
  return (
    <Container sx={{ mt: 6, mb: 6, maxWidth: 900, fontFamily: "Montserrat, sans-serif" }}>
      <Typography
        variant="h4"
        textAlign="center"
        fontWeight="bold"
        gutterBottom
      >
        Mon Panier
      </Typography>

      {/* messages de succès / erreur */}
      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
          gap: 3,
          mt: 4,
        }}
      >
        {tickets.map((ticket) => (
          <Card key={ticket.id} sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 1 }}>
                <Chip
                  label={`Catégorie ${ticket.category.replace("CATEGORY_", "")}`}
                  color="primary"
                  size="small"
                />
              </Box>

              <Typography variant="h6" fontWeight="bold">
                Match n° {ticket.matchId}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Typography>Quantité : {ticket.quantity ?? 1}</Typography>
                <Typography>
                  Prix unitaire : <b>{ticket.price.toFixed(2)} €</b>
                </Typography>
                <Typography>
                  Total : <b style={{ color: "rgba(4, 86, 148, 1)" }}>{ticket.price.toFixed(2)} €</b>
                </Typography>
              </Box>

              <Box sx={{ textAlign: "right", mt: 3 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setModalType("delete");
                    setSelectedTicketId(ticket.id);
                  }}
                >
                  Supprimer
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* total et paiement */}
      <Box
        sx={{
          mt: 5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          Total du panier : <span style={{ color: "rgba(6, 112, 193, 1)" }}>{totalAmount.toFixed(2)} €</span>
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ px: 4, py: 1.5 }}
          onClick={() => setModalType("pay")}
        >
          Payer tous les tickets
        </Button>
      </Box>

      {/* Modale suppression */}
      {modalType === "delete" && selectedTicketId && (
        <ModalConfirm
          title="Supprimer le ticket ?"
          message="Voulez-vous supprimer ce ticket du panier ?"
          onConfirm={() => handleRemove(selectedTicketId)}
          onCancel={() => {
            setModalType(null);
            setSelectedTicketId(null);
          }}
          confirmText="Oui, supprimer"
          cancelText="Annuler"
        />
      )}

      {/* Modale paiement */}
      {modalType === "pay" && (
        <ModalConfirm
          title="Confirmer le paiement"
          message={`Voulez-vous vraiment payer ces ${tickets.length} tickets pour un montant total de ${totalAmount.toFixed(
            2
          )} € ?`}
          onConfirm={handlePay}
          onCancel={() => setModalType(null)}
        />
      )}
    </Container>
  );
}