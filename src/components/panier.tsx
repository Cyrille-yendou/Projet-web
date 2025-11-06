import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPendingTickets, removeFromCart, payPending } from "../serviceAPI/dataRetriever";
import type { Ticket } from "../types/ticket"; 

export default function Panier() {
  const [cart, setCart] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);

  //  États pour modales (supprimer / payer)
  const [TicketId, setTicketId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"delete" | "pay" | null>(null);

  // Charger le panier
  const loadCart = async () => {
    setLoading(true);
    try {
      const items = await getPendingTickets();
      setCart(items);
      const totalAmount = items.reduce(
        (sum: number, item: Ticket) => sum + item.price,
        0
      );
      setTotal(totalAmount);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement du panier");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Supprimer un ticket (après confirmation)
  const handleRemoveConfirm = async () => {
    if (!TicketId) return;
    try {
      await removeFromCart(TicketId);
      alert("Ticket supprimé avec succès !");
      loadCart();
    } catch {
      alert("Erreur lors de la suppression");
    } finally {
      setModalType(null);
      setTicketId(null);
    }
  };

  //  Payer tous les tickets en attente
  const handlePayConfirm = async () => {
    if (cart.length === 0) {
      alert("Votre panier est vide !");
      setModalType(null);
      return;
    }
    try {
      await payPending();
      alert("Paiement effectué avec succès !");
      setCart([]);
      setTotal(0);
    } catch {
      alert("Erreur lors du paiement ");
    } finally {
      setModalType(null);
    }
  };

  if (loading)
    return <p className="text-center mt-10">Chargement du panier...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Mon Panier</h2>

      {cart.length === 0 ? (
        <p className="text-center">
          Votre panier est vide.{" "}
          <Link to="/" className="text-blue-600 hover:underline">
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
                {cart.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">
                      {item.match?.homeTeam.name} vs {item.match?.awayTeam.name}
                    </td>
                    <td className="px-4 py-3">{item.category}</td>
                    <td className="px-4 py-3 text-center">1</td>
                    <td className="px-4 py-3">{item.price.toFixed(2)}</td>
                    <td className="px-4 py-3">{item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          setTicketId(item.id);
                          setModalType("delete");
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
              <span className="text-blue-600">{total.toFixed(2)} €</span>
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

      {/*  Modales de confirmation */}
      {modalType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center">
            {modalType === "delete" && (
              <>
                <h3 className="text-lg font-semibold text-red-700 mb-3">
                  Supprimer le ticket ?
                </h3>
                <p className="text-gray-600 mb-4">
                  Voulez-vous supprimer ce ticket du panier ?
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleRemoveConfirm}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Oui, supprimer
                  </button>
                  <button
                    onClick={() => setModalType(null)}
                    className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Annuler
                  </button>
                </div>
              </>
            )}

            {modalType === "pay" && (
              <>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">
                  Confirmer le paiement ?
                </h3>
                <p className="text-gray-600 mb-4">
                  Vous allez payer{" "}
                  <strong>{total.toFixed(2)} €</strong> pour vos{" "}
                  {cart.length} tickets en attente.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handlePayConfirm}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Oui, payer
                  </button>
                  <button
                    onClick={() => setModalType(null)}
                    className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Annuler
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
