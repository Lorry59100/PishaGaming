import { createContext, useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { decodeToken } from 'react-jwt';
import axios from 'axios';
import { URL, URL_USER_CART } from '../constants/urls/URLBack';
import { ToastCenteredWarning } from '../components/services/toastService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const [cart, setCart] = useState(storedCart);

    const authToken = localStorage.getItem('authToken');
    const decodedUserToken = authToken ? decodeToken(authToken) : null;
    const fetchDataExecuted = useRef(false);

    // Fonction pour vider panier
    const resetCart = useCallback(() => {
      setCart([]);
    }, []);

    // Mettre à jour le panier d'un utilisateur déconnecté.
    useEffect(() => {
        if (!decodedUserToken) {
          localStorage.setItem('cart', JSON.stringify(cart));
        }

      }, [decodedUserToken, cart]);

      //Mettre à jour le panier si l'utilisateur est connecté et actualise la page.
      useEffect(() => {
        if (decodedUserToken && !fetchDataExecuted.current) {
          const userId = decodedUserToken.id;
          const fetchData = async () => {
            try {
              // Effectuer une requête au backend pour obtenir le panier de l'utilisateur
              const response = await axios.get(`${URL}${URL_USER_CART}/${userId}`);
              if (response.data && response.data.carts) {
                setCart(response.data.carts);
                if (response.data.message) {
                  ToastCenteredWarning(response.data.message)
                }
              }
            } catch (error) {
              console.error('Erreur lors de la récupération du panier utilisateur :', error);
            }
          };
          fetchData();
          // Mise à jour de la référence après l'exécution du code
          fetchDataExecuted.current = true;
        }
      }, [decodedUserToken]);

      const updateCart = useCallback((newCart) => {
        if (decodedUserToken) {
          const userId = decodedUserToken.id;
          axios.get(`${URL}${URL_USER_CART}/${userId}`, {
            params: { cart: cart },
          })
          .then(response => {
            if (response.data && response.data.carts && JSON.stringify(response.data.carts) !== JSON.stringify(cart)) {
              setCart(response.data.carts);           
            }
          })
          .catch(error => {
            console.error('Erreur lors de la mise à jour du panier utilisateur :', error);
          });
        }
        if (newCart && JSON.stringify(newCart) !== JSON.stringify(cart)) {
          setCart(newCart);
        }
      }, [decodedUserToken, cart]);
      
      

      return (
        <CartContext.Provider value={{ cart, updateCart, resetCart }}>
          {children}
        </CartContext.Provider>
      );
    };

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

export { CartContext };
