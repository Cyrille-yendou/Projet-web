import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {  removeFromTicket, payPending} from "../serviceAPI/dataRetriever";
import { useGlobalCart } from "../hook/useGlobalTicket";
import ModalConfirm from "./modalConfirm";

export default function Panier() {
 const { 
    tickets, 
    loading, 
    error, 
    totalAmount, 
    fetchCart, 
  } = useGlobalCart();

  const [modalType, setModalType] = useState<"delete" | "pay" | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null); 

  useEffect(() => {
    fetchCart(); 
  }, [fetchCart]); 

  // Supprimer un ticket 
  const handleRemove = async (ticketId: string) => {
    setMessage(null); 
    try {
      await removeFromTicket(ticketId); 
      await fetchCart();
      setMessage("Ticket retiré du panier.");
    } catch (err) {
      setMessage("Erreur lors de la suppression du ticket.");
    }
    setModalType(null); 
    setSelectedTicketId(null);
     
  };

//  Paiement
  const handlePay = async () => {
    setMessage(null);
    setModalType(null); 
    
    if (totalAmount === 0 || tickets.length === 0) {
        setMessage("Le panier est vide !");
        return;
    }
    try {
      await payPending(); 
      await fetchCart(); 
      setMessage(`Paiement de ${totalAmount.toFixed(2)} € effectué avec succès ! Vos tickets sont confirmés.`);
    } catch (err) {
      setMessage("Erreur lors du paiement. Veuillez réessayer.");
    }
  };


  if (loading)
    return <p className="text-center mt-10">Chargement du panier...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">🛒 Mon Panier</h2>
        
      {/* Affichage des messages de transaction (succès/erreur) */}
      {message && (
        <div className={`p-3 mb-4 rounded-lg text-center ${message.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
        </div>
      )}

      {tickets.length === 0 ? (
        <p className="text-center">
          Votre panier est vide.{" "}
          <Link to="/matches" className="text-blue-600 hover:underline">
            Retour aux matchs
          </Link>
        </p>
      ) : (
        <>
          <div className="overflow-x-auto shadow-lg rounded-2xl">
            <table className="w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100 text-gray-700 uppercase">
                <tr>
                  <th className="px-4 py-3">Match</th>
                  <th className="px-4 py-3">Catégorie</th>
                  <th className="px-4 py-3">Quantité</th>
                  <th className="px-4 py-3">Prix unitaire (€)</th>
                  <th className="px-4 py-3">Total (€)</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(tickets) && tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">
                      {ticket.match?.homeTeam.name} vs {ticket.match?.awayTeam.name}
                    </td>
                    <td className="px-4 py-3">{ticket.category.replace("CATEGORY_", "")}</td>
                    <td className="px-4 py-3 text-center">1</td>
                    <td className="px-4 py-3">{ticket.price.toFixed(2)}</td>
                    <td className="px-4 py-3">{ticket.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          setModalType("delete");
                          setSelectedTicketId(ticket.id); 
                        }}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                      >
                        🗑️ Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <h3 className="text-lg font-semibold">
              Total du panier :{" "}
              <span className="text-blue-600">{totalAmount.toFixed(2)} €</span>
            </h3>
            <button
              onClick={() => setModalType("pay")} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
            >
              💳 Payer tous les tickets
            </button>
          </div>
        </>
      )}
        
      {/* Modale de Suppression */}
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

      {/* Modale de Paiement */}
      {modalType === "pay" && ( 
        <ModalConfirm
          title="Confirmer le paiement"
          message={`Voulez-vous vraiment payer ces ${tickets.length} tickets pour un montant total de ${totalAmount.toFixed(2)} € ?`} 
          
            onCancel={() => setModalType(null)}
          
            onConfirm={handlePay}
        />
      )}
    </div>
  );
}
