import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useTokenService } from "./services/tokenService";
import { URL, URL_USER_CART } from '../../constants/urls/URLBack';
import "../../assets/styles/components/cart.css"
import { BsTrash3 } from "react-icons/bs";
import { HiMiniComputerDesktop } from 'react-icons/hi2';
import { IconContext } from "react-icons";
import { FaPlaystation } from "react-icons/fa";
import { BsXbox } from "react-icons/bs";
import { SiNintendo } from "react-icons/si";
import "../../assets/styles/components/form.css"
import { calculateDifference, calculateTotal, calculateTotalOldPrice, convertToEuros } from '../products/services/PriceServices';
import { Paybar } from '../layouts/Navbar/Paybar';
import { NavbarVisibilityContext } from '../../contexts/NavbarVisibilityContext';
import { useContext } from 'react';
import { URL_PAYMENT } from '../../constants/urls/URLFront';
import { useNavigate } from 'react-router-dom';
import { LoginAndRegisterForm } from './forms/LoginAndRegisterForm';

export function Cart() {
    const { decodedUserToken } = useTokenService();
    const [cartData, setCartData] = useState(null);
    const totalOldPrice = calculateTotalOldPrice(cartData);
    const totalPrice = calculateTotal(cartData);
    const difference = calculateDifference(cartData);
    const { hideNavbar, showNavbar } = useContext(NavbarVisibilityContext);
    const [showLoginAndRegisterForm, setShowLoginAndRegisterForm] = useState(false);
    const navigate = useNavigate();

    console.log(totalPrice);

    useEffect(() => {
        // Add a class to the body element when the component mounts
        document.body.classList.add('unset-padding');
    
        // Remove the class when the component is unmounted
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

    useEffect(() => {
        // Vérifier si l'utilisateur est connecté avant de faire la requête
        if (decodedUserToken) {
            console.log(decodedUserToken);
            const userId = decodedUserToken.id;
            axios.get(`${URL}${URL_USER_CART}/${userId}`)
                .then(response => {
                    console.log(response.data)
                    setCartData(response.data);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération du panier :', error);
                });
        }
        if(!decodedUserToken) {
            const getCart = localStorage.getItem('cart');
        if (getCart) {
            const cartItems = JSON.parse(getCart);
            // Afficher les produits du panier stockés localement
            setCartData(cartItems);
        }
        }
    }, [decodedUserToken]);

    const handlePaymentClick = () => {
        if (decodedUserToken) {
            // Redirige vers la page de paiement si l'utilisateur est connecté
            navigate(URL_PAYMENT);
        } else {
            // Affiche le formulaire de connexion si l'utilisateur n'est pas connecté
            setShowLoginAndRegisterForm(true);
        }
    };

  return (
<div className='tunnel-cart-container'>
    <Paybar isPaymentFormContext={false} isActivationContext={false}/>
    <div className="cart-component-layout-container">
        <div className="cart-component-container">
            <div className="cart-container">
                <h2>Panier</h2>
                <div className="cart-products">
                {decodedUserToken && cartData && (
                    <div>
                        <h1>Connecté</h1>
                    {cartData && cartData.map((item, index) => (
                        <React.Fragment key={`${item.id}-${item.platform}`}>
                        {index > 0 && <div className="cutline-form"></div>}
                        <div className='single-product-detail'>
                            <div className="product-img">
                                <img src={item.img} alt={item.name} />
                            </div>
                            <div className="middle-content">
                                <div className="middle-head">
                                {item.platform === 'PC' && (
                                <IconContext.Provider value={{ size: '1.5em', color: 'white' }}>
                                    <HiMiniComputerDesktop />
                                </IconContext.Provider>
                                )}

                                {item.platform === 'Xbox Series X' && (
                                <IconContext.Provider value={{ size: '1.5em', color: 'white' }}>
                                    <BsXbox />
                                </IconContext.Provider>
                                )}

                                {(item.platform === 'PS5' || item.platform === 'PS1') && (
                                <IconContext.Provider value={{ size: '1.5em', color: 'white' }}>
                                    <FaPlaystation />
                                </IconContext.Provider>
                                )}

                                {(item.platform === 'Nintendo Switch' || item.platform === 'Super Nintendo') && (
                                <div className='nintendo-icon'>
                                <IconContext.Provider value={{ size: '1.2em', color: 'white' }}>
                                    <SiNintendo className='nintendo-svg'/>
                                </IconContext.Provider>
                                </div>
                                )}

                                    <h4>{item.name}</h4>
                                </div>
                                <span>{item.platform}</span>
                                <div className="middle-foot">
                                    <BsTrash3 />
                                    <div className="vertical-spacer"></div>
                                    <button>Déplacer en wishlist</button>
                                </div>
                            </div>
                            <div className="quantity-selector">
                                <h3>{convertToEuros(item.price*item.quantity)} €</h3>
                                <select className="quantity-dropdown" value={item.quantity} onChange={(e) => (e.target.value)}>
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
                {!decodedUserToken && cartData && (
                    <div>
                    <h1>Non connecté</h1>
                    {cartData && cartData.map((item, index) => (
                        <React.Fragment key={`${item.id}-${item.platform}`}>
                        {index > 0 && <div className="cutline-form"></div>}
                        <div className='single-product-detail'>
                            <div className="product-img">
                                <img src={item.img} alt={item.name} />
                            </div>
                            <div className="middle-content">
                                <div className="middle-head">
                                {item.platform === 'PC' && (
                                <IconContext.Provider value={{ size: '1.5em', color: 'white' }}>
                                    <HiMiniComputerDesktop />
                                </IconContext.Provider>
                                )}

                                {item.platform === 'Xbox Series X' && (
                                <IconContext.Provider value={{ size: '1.5em', color: 'white' }}>
                                    <BsXbox />
                                </IconContext.Provider>
                                )}

                                {(item.platform === 'PS5' || item.platform === 'PS1') && (
                                <IconContext.Provider value={{ size: '1.5em', color: 'white' }}>
                                    <FaPlaystation />
                                </IconContext.Provider>
                                )}

                                {(item.platform === 'Nintendo Switch' || item.platform === 'Super Nintendo') && (
                                <div className='nintendo-icon'>
                                <IconContext.Provider value={{ size: '1.2em', color: 'white' }}>
                                    <SiNintendo className='nintendo-svg'/>
                                </IconContext.Provider>
                                </div>
                                )}

                                    <h4>{item.name}</h4>
                                </div>
                                <span>{item.platform}</span>
                                <div className="middle-foot">
                                    <BsTrash3 />
                                    <div className="vertical-spacer"></div>
                                    <button>Déplacer en wishlist</button>
                                </div>
                            </div>
                            <div className="quantity-selector">
                                <h3>{convertToEuros(item.price*item.quantity)} €</h3>
                                <select className="quantity-dropdown" value={item.quantity} onChange={(e) => (e.target.value)}>
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
                        <button type="submit" className='submit-button submit-payment' onClick={handlePaymentClick}>Aller au paiement &gt;</button>
                        {showLoginAndRegisterForm && <LoginAndRegisterForm onCloseForm={() => setShowLoginAndRegisterForm(false)} />}
                    </div>
                    <div className="cutline-form first-cutline">
                        <span className="cutline-text-cart">ou</span>
                    </div>
                    <h4 className='keep-buying-container'>&lt; <a href="">Continuer mes achats</a></h4>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}
