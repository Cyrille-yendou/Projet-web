import type { Ticket, TicketResponse } from "../types/ticket";
import { useEffect, useState } from "react";
import { getTicket, validateTicket } from "../serviceAPI/ticketAPI"; 
import { dateFormatDDMMYYYY, timeFormatHHMM } from "../context/toolBox";
import ModalConfirm from "../context/modalConfirm";

export default function TicketsList() {
  const [ticketsData, setTicketsData] = useState<TicketResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState< string | null>(null);

  //  Gestion modale (Uniquement pour 'validate')
  const [modalType, setModalType] = useState<"validate" | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      const data = await getTicket();
      setTicketsData(data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) return <p className="text-center mt-10">Chargement des tickets...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!ticketsData || !ticketsData.counts || !ticketsData.grouped) return <p>Aucun ticket trouvé.</p>;

  const { grouped, counts } = ticketsData;

  //  Couleur selon statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_payment":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "used":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  //  Validation
  const handleValidate = async (id: string, qrCode: string) => {
    setMessage(null);
    try {
      const res = await validateTicket(id, qrCode); 
      setMessage(res.message || "Ticket validé avec succès !");
      await fetchTickets();
    } catch {
      setMessage("Erreur lors de la validation du ticket.");
    }
    setModalType(null);
    setSelectedTicketId(null);
    setQrCode(null);
  };

  const renderTicketSection = (title: string, list: Ticket[]) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">{title}</h2>
      {list.length === 0 ? (
        <p className="text-gray-500">Aucun ticket dans cette catégorie.</p>
      ) : (
        <div className="grid gap-4">
          {list.map((ticket) => (
            <div
              key={ticket.id}
              className="border rounded-2xl p-4 shadow-sm bg-white hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(
                    ticket.status
                  )}`}
                >
                  {ticket.status === "pending_payment"
                    ? "En attente de paiement"
                    : ticket.status === "confirmed"
                    ? "Confirmé"
                    : "Utilisé"}
                </span>

                <span className="text-gray-600 text-sm">
                  Siège : <strong>{ticket.seatNumber}</strong>
                </span>
              </div>

              <div className="text-gray-700">
                <p>
                  <strong>Match :</strong> {ticket.match.homeTeam} vs{" "}
                  {ticket.match.awayTeam}
                </p>
                <p>
                  <strong>Date :</strong>{" "}
                  {dateFormatDDMMYYYY(ticket.match.matchDate)} à{" "}
                  {timeFormatHHMM(ticket.match.matchDate)}
                </p>
                <p>
                  <strong>Stade :</strong> {ticket.match.stadium.name}
                </p>
                <p>
                  <strong>Catégorie :</strong>{" "}
                  {ticket.category.replace("CATEGORY_", "Catégorie ")}
                </p>
                <p>
                  <strong>Prix :</strong> {ticket.price} €
                </p>
              </div>

              {/* --- Boutons d’action --- */}
              <div className="flex flex-wrap gap-2 mt-3">
                {ticket.status === "confirmed" && (
                  <button
                    onClick={() => {
                      setModalType("validate");
                      setSelectedTicketId(ticket.id);
                      setQrCode(ticket.qrCode);
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    ✅ Valider
                  </button>
                )}
              </div>

              <div className="mt-3 text-right">
                <span className="text-xs text-gray-400">
                  Expire le {dateFormatDDMMYYYY(ticket.expiresAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">🎟️ Mes Tickets</h1>

      {message && (
        <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-center mb-4">
          {message}
        </div>
      )}

      <div className="text-center mb-6 text-gray-600">
        <p>Total : {counts.total}</p>
        <p>
          En attente : {counts.pending} | Confirmés : {counts.confirmed} | Utilisés :{" "}
          {counts.used}
        </p>
      </div>

      {renderTicketSection("En attente de paiement", grouped.pending)}
      {renderTicketSection("Confirmés", grouped.confirmed)}
      {renderTicketSection("Utilisés", grouped.used)}

      {modalType === "validate" && selectedTicketId && qrCode && (
        <ModalConfirm
          title="Validation du ticket"
          message="Souhaitez-vous valider ce ticket ?"
          onCancel={() => {
            setModalType(null);
            setSelectedTicketId(null);
            setQrCode(null );
          }}
          onConfirm={() => handleValidate(selectedTicketId, qrCode)}
        />
      )}
    </div>
  );
}
