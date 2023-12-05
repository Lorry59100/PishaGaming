import { useContext, useEffect, useState } from "react";
import axios from 'axios'
import { NavbarVisibilityContext } from "../../../contexts/NavbarVisibilityContext";
import { Paybar } from "../../layouts/Navbar/Paybar";
import "../../../assets/styles/components/paymentform.css"
import { PiPencilSimpleLineFill } from 'react-icons/pi';
import { IconContext } from "react-icons";
import { useAuth } from "../services/tokenService";
import { URL, URL_USER_CART } from "../../../constants/urls/URLBack";
import { calculateTotal, convertToEuros } from "../../products/services/PriceServices";


export function PaymentForm() {
    const { hideNavbar, showNavbar } = useContext(NavbarVisibilityContext);
    const { decodedUserToken } = useAuth();
    const [cartData, setCartData] = useState(null);
    const totalPrice = calculateTotal(cartData);
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
            //rediriger
        }
    }, [decodedUserToken]);
    console.log('cartData : ',cartData);
  return (
    <div>
        <Paybar/>

        <div className="payment-layout-container">
            <div className="payment-container">
                <div className="address-and-payform-container">
                    <div className="address-container">
                        <h2>Adresse de facturation</h2>
                        <div className="info-change-container">
                            <div className="address-info">
                                <h4>CARREL Lorry</h4>
                                <h5>17 rue Isabeau de Roubaix, 59100 ROUBAIX</h5>
                            </div>
                            <div className="change-address">
                                <IconContext.Provider value={{ size: "1.2em"}}>
                                    <PiPencilSimpleLineFill/>
                                </IconContext.Provider>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="summary-and-total-container">
                    <h2>Résumé</h2>
                    <div className="summary-container">
                        {cartData && cartData.map((item, index) => (
                            <div key={item.id} className="items-container">
                                <div className="single-item-container">
                                    <div className="product-info-quantity">
                                        <h3>{item.name} x{item.quantity}</h3>
                                        <h4>{item.platform}</h4>
                                    </div>
                                    <div className="product-price">
                                        <h4>{convertToEuros(item.price*item.quantity)} €</h4>
                                    </div>
                                </div>
                                {index !== cartData.length - 1 && <div className="cutline-summary-form"></div>}
                            </div>
                        ))}
                        <div className="white-line"></div>
                        <div className="summary-total-container">
                            <h3>Total :</h3>
                            <h2>{convertToEuros(totalPrice)}€</h2>
                        </div>
                        <div className="btn-summary-container">
                            <button type="submit" className='submit-button'>Payer</button>
                        </div>
                        <span>
                            <div>
                            En cliquant sur "Payer" je reconnais avoir lu et accepté les 
                            <a href=""> termes et conditions</a>, 
                            et la
                            <a href=""> politique de confidentialité</a>.
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}
