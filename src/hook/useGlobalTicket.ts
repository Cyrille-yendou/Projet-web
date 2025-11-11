
import { useContext, useCallback } from 'react'; 
import { CartContext } from '../context/cartContext';
import { getPendingTickets } from '../serviceAPI/dataRetriever'; 

export const useGlobalCart = () => {
  const { state, dispatch } = useContext(CartContext);

  const fetchCart = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const tickets = await getPendingTickets();
      dispatch({ type: 'SET_CART', payload: tickets });
    } catch (err) {
      console.error(err);
      dispatch({ type: 'SET_ERROR', payload: "Erreur lors du chargement du panier." });
      dispatch({ type: 'SET_LOADING', payload: false }); 
    }
  }, [dispatch]); 
  const removeTicket = useCallback((ticketId: string) => {
    dispatch({ type: 'REMOVE_TICKET', payload: ticketId });
  }, [dispatch]);
  
  

  return {
    ...state, 
    fetchCart,
    removeTicket,
    dispatch 
  };
};
