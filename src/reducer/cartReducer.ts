//gère toute la logique de modification de l'état en fonction de l'action reçue
import type { CartState, CartAction } from '../context/cartContext'; 

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_CART':
      return { ...state, tickets: action.payload, loading: false };

    case 'REMOVE_TICKET':
      const filteredTickets = state.tickets.filter(
        (ticket) => ticket.id !== action.payload
      );
      return { 
          ...state, 
          tickets: filteredTickets 
      };

    case 'CALCULATE_TOTAL':
      const newTotal = state.tickets.reduce(
        (sum, ticket) => sum + ticket.price, 0
      );
      return { ...state, totalAmount: newTotal };

    default:
      return state;
  }
};