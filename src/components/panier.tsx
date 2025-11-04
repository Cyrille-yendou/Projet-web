import { useEffect, useState } from "react";
import { getPendingTickets, removeFromCart, payPending } from "../serviceAPI/dataRetriever";
import type { CartItem } from "../types/CartItem";
import { Link } from "react-router";

export default function Panier() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);

  // Charger le panier
  const loadCart = async () => {
    setLoading(true);
    try {
      const items = await getPendingTickets();
      setCart(items);
      const totalAmount = items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
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

  // Supprimer un ticket
  const handleRemove = async (ticketId: string) => {
    try {
      await removeFromCart(ticketId);
      alert("Ticket supprimé du panier ✅");
      loadCart(); // recharger le panier
    } catch (err) {
      alert("Erreur lors de la suppression du ticket ❌");
    }
  };

  // Payer le panier
  const handlePay = async () => {
    if (cart.length === 0) {
      alert("Votre panier est vide !");
      return;
    }
    try {
      await payPending();
      alert("Paiement effectué avec succès 🎉");
      setCart([]);
      setTotal(0);
    } catch (err) {
      alert("Erreur lors du paiement ❌");
    }
  };

  if (loading) return <p>Chargement du panier...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div>
      <h2>🛒 Mon Panier</h2>
      {cart.length === 0 ? (
        <p>Votre panier est vide. <Link to="/">Retour aux matchs</Link></p>
      ) : (
        <>
          <table border={1} cellPadding={5}>
            <thead>
              <tr>
                <th>Match</th>
                <th>Catégorie</th>
                <th>Quantité</th>
                <th>Prix unitaire (€)</th>
                <th>Total (€)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.matchId}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price.toFixed(2)}</td>
                  <td>{(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleRemove(item.id!)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Total du panier : {total.toFixed(2)} €</h3>
          <button onClick={handlePay}>💳 Payer le panier</button>
        </>
      )}
    </div>
  );
}
