// état global du panier et les fonctions de répartition
import  { createContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Ticket } from '../types/ticket';
import { cartReducer } from '../reducer/cartReducer'; 

export type CartState = {
  tickets: Ticket[]; // Les tickets actuellement dans le panier/en attente
  loading: boolean;
  error: string | null;
  totalAmount: number;
};

export type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART'; payload: Ticket[] }
  | { type: 'REMOVE_TICKET'; payload: string } // Payload: ticketId
  | { type: 'CALCULATE_TOTAL' };

export const initialState: CartState = {
  tickets: [],
  loading: true,
  error: null,
  totalAmount: 0,
};

export const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}>({
  state: initialState,
  dispatch: () => null, 
});

//  FOURNISSEUR DE CONTEXTE 
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'CALCULATE_TOTAL' });
  }, [state.tickets]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};