import { useContext, useEffect, useState, useRef } from "react";
import axios from 'axios';
import { NavbarVisibilityContext } from "../../../contexts/NavbarVisibilityContext";
import { Paybar } from "../../layouts/Navbar/Paybar";
import "../../../assets/styles/components/paymentform.css";
import { PiPencilSimpleLineFill } from 'react-icons/pi';
import { IconContext } from "react-icons";
import { useTokenService } from "../services/tokenService";
import { URL, URL_USER_CART } from "../../../constants/urls/URLBack";
import { calculateTotal, convertToEuros } from "../../products/services/PriceServices";
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from "./CheckoutForm";
import { stripePromise } from "../services/Stripe";
import DatePicker from "react-datepicker";
import { addDays } from 'date-fns';

export function PaymentForm() {
  const { hideNavbar, showNavbar } = useContext(NavbarVisibilityContext);
  const { decodedUserToken } = useTokenService();
  const [cartData, setCartData] = useState(null);
  const totalPrice = calculateTotal(cartData);
  const [stripe, setStripe] = useState(null);
  const checkoutFormRef = useRef();
  const [selectedDate, setSelectedDate] = useState(null);
  

  useEffect(() => {
    document.body.classList.add('unset-padding');

    return () => {
      document.body.classList.remove('unset-padding');
    };
  }, []);

  const handlePayClick = (event) => {
    checkoutFormRef.current.handleSubmit(event);
  };

  useEffect(() => {
    const fetchStripe = async () => {
      const instanceStripe = await stripePromise;
      setStripe(instanceStripe);
    };

    fetchStripe();
  }, []);

  useEffect(() => {
    hideNavbar();

    return () => {
      showNavbar();
    };
  }, [hideNavbar, showNavbar]);

  useEffect(() => {
    if (decodedUserToken) {
      const userId = decodedUserToken.id;
      axios.get(`${URL}${URL_USER_CART}/${userId}`)
        .then(response => {
          setCartData(response.data);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération du panier :', error);
        });
    }
    if (!decodedUserToken) {
      // Redirection
    }
  }, [decodedUserToken]);

  console.log('dans le panier :', cartData)

  return (
    <div>
      <Paybar isPaymentFormContext={true} isActivationContext={true} />
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
              {cartData && cartData.length > 0 && cartData.some(item => item.isPhysical) && (
  <div className="date-picker-container">
    <h2>Vous devez choisir une date de livraison pour les produits suivants</h2>
    <div className="physical-products-container">

                    <div className="datepicker-container">
                      <h5>Date de livraison</h5>
                      <DatePicker
                        className="deliveryDate"
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Date de livraison"
                        selected={selectedDate}
                        minDate={addDays(new Date(), 2)}
                        onChange={date => setSelectedDate(date)}
                      />
                    </div>

      <div className="delivery-items-container">

      {cartData && cartData.filter(item => (item.category === 'Hardware' || (item.category === 'Jeux Vidéos' && item.isPhysical))).map((item, index) => (
  <div key={index} className="physical-product">
    <img src={item.img} alt={item.name} />
    <div className="single-physical-product">
      <h4>{item.name}</h4>
      <span className={item.quantity > 1 ? 'multiple-items' : ''}>
        {item.quantity > 1 ? `x${item.quantity} ` : ''}
        {/* {item.platform} */}
      </span>
    </div>
  </div>
))}


      </div>
    </div>
  </div>
)}
            </div>
            <div className="payform-container">
              <h2>Méthode de paiement</h2>
              <Elements stripe={stripe}>
                <CheckoutForm cartData={cartData} selectedDate={selectedDate} ref={checkoutFormRef}/>
              </Elements>
            </div>
          </div>
          <div className="summary-and-total-container">
            <h2>Résumé</h2>
            {cartData && cartData.map((item, index) => (
              <div key={item.id} className="items-container">
                <div className="single-item-container">
                  <div className="product-info-quantity">
                    <h3>
                      {item.name}
                      <span className={item.quantity > 1 ? 'multiple-items' : ''}>
                        {item.quantity > 1 ? `x${item.quantity} ` : ''}
                      </span>
                    </h3>
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
              <button type="submit" className='submit-button' onClick={handlePayClick}>Payer</button>
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
  );
}
