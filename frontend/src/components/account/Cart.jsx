import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import "../../assets/styles/components/cart.css";
import { BsTrash3 } from "react-icons/bs";
import { IconContext } from "react-icons";
import "../../assets/styles/components/form.css";
import { Paybar } from '../layouts/Navbar/Paybar';
import { NavbarVisibilityContext } from '../../contexts/NavbarVisibilityContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginAndRegisterForm } from './forms/LoginAndRegisterForm';
import { CartContext } from '../../contexts/CartContext';
import { dismissToast, ToastCenteredWarning } from '../../services/ToastService';
import { TiShoppingCart } from 'react-icons/ti';
import { useTokenService } from '../../services/TokenService';
import { calculateDifference, calculateTotal, calculateTotalOldPrice, convertToEuros } from '../../services/PriceServices';
import { FaArrowUp } from 'react-icons/fa';

export function Cart() {
  const { cart, updateCart } = useContext(CartContext);
  const { decodedUserToken } = useTokenService();
  const totalOldPrice = calculateTotalOldPrice(cart);
  const totalPrice = calculateTotal(cart);
  const difference = calculateDifference(cart);
  const { hideNavbar, showNavbar } = useContext(NavbarVisibilityContext);
  const [showLoginAndRegisterForm, setShowLoginAndRegisterForm] = useState(false);
  const [wishlists, setWishlists] = useState([]);
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_BACKEND;
  const URL_DELETE_ITEM = import.meta.env.VITE_DELETE_ITEM;
  const URL_PLATFORM_IMG = import.meta.env.VITE_PLATFORM_IMG;
  const URL_MOVE_TO_WISHLIST = import.meta.env.VITE_MOVE_TO_WISHLIST;
  const URL_UPDATE_CART = import.meta.env.VITE_UPDATE_CART;
  const URL_USER_CART = import.meta.env.VITE_USER_CART;
  const URL_MAIN_IMG = import.meta.env.VITE_MAIN_IMG;
  const URL_PAYMENT = import.meta.env.VITE_PAYMENT;
  const URL_SEARCH = import.meta.env.VITE_SEARCH;
  const URL_GET_WISHLIST = import.meta.env.VITE_GET_WISHLIST;
  const URL_ADD_TO_CART = import.meta.env.VITE_ADD_TO_CART;
  const URL_ADD_TO_WISHLIST = import.meta.env.VITE_ADD_TO_WISHLIST;

  useEffect(() => {
    document.body.classList.add('unset-padding');
    return () => {
      document.body.classList.remove('unset-padding');
    };
  }, []);

  useEffect(() => {
    hideNavbar();
    return () => {
      showNavbar();
    };
  }, [hideNavbar, showNavbar]);

  const fetchCart = useCallback(() => {
    if (decodedUserToken) {
        const userId = decodedUserToken.id;
        axios.get(`${URL}${URL_USER_CART}/${userId}`)
            .then(response => {
                if (response.data && response.data.carts) {
                    updateCart(response.data.carts);
                    if (response.data.message && response.data.message.trim() !== '') {
                        ToastCenteredWarning(response.data.message);
                    }
                }
            })
            .catch(error => {
                console.error('Erreur lors de la récupération du panier :', error);
            });
    } else {
        const getCart = localStorage.getItem('cart');
        if (getCart) {
            const cartItems = JSON.parse(getCart);
            updateCart(cartItems);
        }
    }
}, [decodedUserToken, updateCart, URL_USER_CART, URL]);


  const handlePaymentClick = () => {
    if (decodedUserToken) {
      navigate(URL_PAYMENT);
    } else {
      setShowLoginAndRegisterForm(true);
    }
  };

  const handleDiscoverClick = () => {
      navigate(URL_SEARCH);
  };

  const removeItem = useCallback(async (userId = null, itemId) => {
    if (decodedUserToken) {
      try {
        await axios.delete(`${URL}${URL_DELETE_ITEM}`, {
          data: {
            userId,
            itemId
          }
        });
        const newCartData = cart.filter((item) => item.id !== itemId);
        updateCart(newCartData);
      } catch (error) {
        console.error(error);
      }
    } else {
      const cartItems = JSON.parse(localStorage.getItem('cart'));
      const newCartItems = cartItems.filter((item) => item.id !== itemId);
      localStorage.setItem('cart', JSON.stringify(newCartItems));
      updateCart(newCartItems);
    }
  }, [decodedUserToken, cart, updateCart, URL, URL_DELETE_ITEM]);

  const updateQuantity = useCallback(async (userId, productId, platform, quantity, itemId) => {
    try {
      await axios.put(`${URL}${URL_UPDATE_CART}`, {
        userId,
        productId,
        platform,
        quantity,
        itemId
      });
      const newCartData = cart.map((cartItem) => {
        if (cartItem.id === itemId && cartItem.platform === platform) {
          return { ...cartItem, quantity: quantity };
        }
        return cartItem;
      });
      updateCart(newCartData);
    } catch (error) {
      ToastCenteredWarning(error.response.data.error);
    }
  }, [cart, updateCart, URL, URL_UPDATE_CART]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.Toastify__toast-container') && !event.target.closest('.submit-button')) {
        dismissToast();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const fetchWishlist = useCallback(() => {
    if (!decodedUserToken) return;
  
    const headers = {
        'Authorization': `Bearer ${decodedUserToken.username}`,
    };
  
    axios.get(`${URL}${URL_GET_WISHLIST}`, { headers })
        .then(response => {
            setWishlists(response.data);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des adresses :', error);
        });
  }, [decodedUserToken, URL, URL_GET_WISHLIST]);
  
  useEffect(() => {
    if (decodedUserToken) {
        fetchWishlist();
    }
    fetchCart();
  }, [decodedUserToken, fetchWishlist, fetchCart]);

  const moveToWishlist = useCallback(async (userId, productId, platform) => {
    try {
        await axios.post(`${URL}${URL_MOVE_TO_WISHLIST.replace(':id', productId)}`, {
            userId: userId,
            platform: platform
        });

        // Supprimer tous les exemplaires du produit du panier
        const newCartData = cart.filter((item) => item.productId !== productId || item.platform !== platform);
        updateCart(newCartData);

        fetchWishlist(); // Appeler fetchWishlist pour mettre à jour la wishlist
    } catch (error) {
        console.error(error);
    }
  }, [cart, updateCart, URL, URL_MOVE_TO_WISHLIST, fetchWishlist]);

  const addToCartAndRemoveFromWishlist = useCallback(async (userId, productId, platform, quantity) => {
    try {
        // Ajouter le produit au panier
        const addToCartResponse = await axios.post(`${URL}${URL_ADD_TO_CART}/${productId}`, {
            userId: userId,
            platform: platform,
            quantity: quantity
        });

        if (addToCartResponse.data.success) {
            // Supprimer le produit de la wishlist
            await axios.post(`${URL}${URL_ADD_TO_WISHLIST.replace(':id', productId)}`, {
                userId: userId,
                platform: platform
            });

            // Mettre à jour le panier et la wishlist localement
            fetchCart();
            fetchWishlist();
        } else {
            ToastCenteredWarning(addToCartResponse.data.error);
        }
    } catch (error) {
        console.error(error);
        ToastCenteredWarning('Erreur lors de l\'ajout au panier ou de la suppression de la wishlist.');
    }
}, [URL, fetchCart, fetchWishlist]);

  return (
    <div className='tunnel-cart-container'>
      <Paybar isPaymentFormContext={false} isActivationContext={false} isLoginFormVisible={showLoginAndRegisterForm} />
      <div className="cart-component-layout-container">
        <div className="cart-component-container">
          <div className="cart-container">
            <h2>Panier</h2>
            <div className="cart-products">
              {cart && cart.length === 0 && (
                <div className='empty-cart-container'>
                  <IconContext.Provider value={{ size: '4em' }}>
                    <TiShoppingCart />
                  </IconContext.Provider>
                  <h3>Votre panier est vide</h3>
                  <p>Vous n'avez pas encore ajouté de jeux dans votre panier. <br /> Parcourez le site pour trouver des offres à votre goût.</p>
                  <button className='discover-btn' onClick={handleDiscoverClick}>Découvrir des jeux</button>
                </div>
              )}
              {decodedUserToken && cart && cart.length > 0 && (
                <div>
                  {cart && cart.map((item, index) => (
                    <React.Fragment key={`${item.id}-${item.platform}`}>
                      {index > 0 && <div className="cutline-form"></div>}
                      <div className='single-product-detail'>
                        <div className="product-img">
                          <img src={`${URL}${URL_MAIN_IMG}/${item.img}`} alt={item.name} />
                        </div>
                        <div className="middle-content">
                          <div className="middle-head">
                            <div className="logo-img-container">
                              <img src={`${URL_PLATFORM_IMG}/${item.platform}.png`} alt={item.platform} className='logo-img' />
                            </div>
                            <h4>{item.name}</h4>
                          </div>
                          <span>{item.platform}</span>
                          <div className="middle-foot">
                            <button type='submit' onClick={() => removeItem(decodedUserToken.id, item.id)}><IconContext.Provider value={{ size: '1.2em' }}><BsTrash3 /></IconContext.Provider></button>
                            <div className="vertical-spacer"></div>
                            <button onClick={() => moveToWishlist(decodedUserToken.id, item.productId, item.platform)}>Déplacer en wishlist</button>
                          </div>
                        </div>
                        <div className="quantity-selector">
                          <h3>{convertToEuros(item.price * item.quantity)} €</h3>
                          <select
                            className="quantity-dropdown"
                            value={item.quantity}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value);
                              updateQuantity(decodedUserToken.id, item.productId, item.platform, newQuantity, item.id);
                            }}
                          >
                            {(() => {
                              const options = [];
                              for (let i = 1; i <= 10; i++) {
                                options.push(
                                  <option key={i} value={i} className='dropdown-quantity-options'>
                                    {i}
                                  </option>
                                );
                              }
                              return options;
                            })()}
                          </select>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              )}
              {!decodedUserToken && cart && (
                <div>
                  {cart && cart.map((item, index) => (
                    <React.Fragment key={`${item.id}-${item.platform}`}>
                      {index > 0 && <div className="cutline-form"></div>}
                      <div className='single-product-detail'>
                        <div className="product-img">
                          <img src={`${URL}${URL_MAIN_IMG}/${item.img}`} alt={item.name} />
                        </div>
                        <div className="middle-content">
                          <div className="middle-head">
                            <h4>{item.name}</h4>
                          </div>
                          <span>{item.platform}</span>
                          <div className="middle-foot">
                            <button type='submit' onClick={() => removeItem(null, item.id)}><IconContext.Provider value={{ size: '1.2em' }}><BsTrash3 /></IconContext.Provider></button>
                            <div className="vertical-spacer"></div>
                            <button>Déplacer en wishlist</button>
                          </div>
                        </div>
                        <div className="quantity-selector">
                          <h3>{convertToEuros(item.price * item.quantity)} €</h3>
                          <select
                            className="quantity-dropdown"
                            value={item.quantity}
                            onChange={(e) => {
                              const newCartData = cart.map((cartItem) => {
                                if (cartItem.id === item.id && cartItem.platform === item.platform) {
                                  return { ...cartItem, quantity: parseInt(e.target.value) };
                                }
                                return cartItem;
                              });
                              updateCart(newCartData);
                              localStorage.setItem('cart', JSON.stringify(newCartData));
                            }}
                          >
                            {(() => {
                              const options = [];
                              for (let i = 1; i <= 10; i++) {
                                options.push(
                                  <option key={i} value={i} className='dropdown-options'>
                                    {i}
                                  </option>
                                );
                              }
                              return options;
                            })()}
                          </select>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
            {decodedUserToken && wishlists && wishlists.length > 0 && (
              <div className="wishlist-container">
                <h2>Wishlist</h2>
                <div className="wishlist-products">
                  {wishlists.map((item, index) => (
                    <React.Fragment key={`${item.id}-${item.platform}`}>
                      {index > 0 && <div className="cutline-form"></div>}
                      <div className='single-wishlist-product-detail'>
                        <div className="wishlist-product-img">
                          <img src={`${URL}${URL_MAIN_IMG}/${item.product.img}`} alt={item.product.name} />
                        </div>
                        <div className="wishlist-middle-content">
                          <div className="wishlist-middle-head">
                            <h4>{item.product.name}</h4>
                            <h5>{item.product.platform}</h5>
                          </div>
                          <div className="wishlist-middle-foot">
                            <h4>{convertToEuros(item.product.price)} €</h4>
                          </div>
                        </div>
                        <div className="move-to-cart-container">
                          <button className='move-to-cart-btn' onClick={() => addToCartAndRemoveFromWishlist(decodedUserToken.id, item.product.id, item.product.platform, 1)}>
                            <h4>Ajouter au panier</h4>
                            <FaArrowUp />
                          </button>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="summary-container">
            <h2>Résumé</h2>
            <div className="summary-info-container">
              <div className="official">
                <h4>Prix officiel</h4>
                <h4>{convertToEuros(totalOldPrice)} €</h4>
              </div>
              <div className="reduct">
                <h4>Réduction</h4>
                <h4>-{convertToEuros(difference)} €</h4>
              </div>
              <div className="total">
                <h4>Total</h4>
                <h2>{convertToEuros(totalPrice)} €</h2>
              </div>
              <div className="btn-container">
              <button
  type="submit"
  className={`submit-payment ${cart.length > 0 ? 'submit-button' : 'disabled-button'}`}
  onClick={handlePaymentClick}
  disabled={cart.length === 0}
>
  Aller au paiement &gt;
</button>
                {showLoginAndRegisterForm && <LoginAndRegisterForm onCloseForm={() => setShowLoginAndRegisterForm(false)} />}
              </div>
              <div className="cutline-form first-cutline">
                <span className="cutline-text-cart">ou</span>
              </div>
              <h4 className='keep-buying-container'>&lt; <a href="/">Continuer mes achats</a></h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
