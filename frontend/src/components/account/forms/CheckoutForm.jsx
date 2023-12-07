/* eslint-disable no-dupe-keys */
import React, { useState, useEffect, forwardRef } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import '../../../assets/styles/components/checkoutform.css';
import { URL, URL_PAY, URL_ORDER } from '../../../constants/urls/URLBack';
import PropTypes from "prop-types";
import { useAuth } from '../services/tokenService';

const CheckoutForm = forwardRef(({ cartData }, ref) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [customerName, setCustomerName] = useState('');
  const { decodedUserToken } = useAuth();
  
  console.log(cartData);

  const getClientSecret = async () => {
    try {
      const response = await axios.post(`${URL}${URL_PAY}`, {cartData});
      return response.data.clientSecret;
    } catch (error) {
      console.error('Erreur lors de la récupération du clientSecret :', error);
      return null;
    }
  };

  const handleBlur = (element, errorId, errorMessage) => {
    element.on('blur', () => {
      const displayError = document.getElementById(errorId);
      if (element._parent.classList.contains('StripeElement--empty') || element._parent.classList.contains('StripeElement--invalid')) {
        displayError.textContent = errorMessage;
      } else {
        displayError.textContent = ''; // Efface le message d'erreur si le champ est valide
      }
    });
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setCustomerName(name);

    // Vérifier si le nom est vide
    if (name.trim() === '') {
      document.getElementById('card-errors-name').textContent = 'Veuillez renseigner le nom sur la carte.';
      setIsFormValid(false);
    } else {
      document.getElementById('card-errors-name').textContent = ''; // Effacer le message d'erreur si le champ est valide
      setIsFormValid(true);
    }
  };

  const handleNameFocus = () => {
    // Effacer le message d'erreur lorsque l'utilisateur commence à interagir avec le champ
    document.getElementById('card-errors-name').textContent = '';
  };

  const handleNameBlur = () => {
    // Vérifier si le champ du nom est vide lorsque l'utilisateur quitte le champ
    if (customerName.trim() === '') {
      document.getElementById('card-errors-name').textContent = 'Veuillez renseigner le nom sur la carte.';
      setIsFormValid(false);
    }
  };

  useEffect(() => {
    if (elements) {
      const elementsToCheck = [
        { element: elements.getElement(CardNumberElement), errorId: 'card-errors-number', errorMessage: 'Numéro de carte incomplet ou invalide.' },
        { element: elements.getElement(CardExpiryElement), errorId: 'card-errors-expiry', errorMessage: 'Date d\'expiration incomplète ou invalide' },
        { element: elements.getElement(CardCvcElement), errorId: 'card-errors-cvc', errorMessage: 'CVC incomplet ou invalide' },
      ];

      elementsToCheck.forEach(({ element, errorId, errorMessage }) => {
        if (element) {
          handleBlur(element, errorId, errorMessage);
        }
      });
    }
  }, [elements]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !isFormValid) {
      console.log('Le formulaire n\'est pas valide.');
      return;
    }

    const cardnumberElement = elements.getElement(CardNumberElement);
    const cardexpiryElement = elements.getElement(CardExpiryElement);
    const cardcvcElement = elements.getElement(CardCvcElement);

    const paymentData = {
      payment_method: {
        card: cardnumberElement,
        card: cardexpiryElement,
        card: cardcvcElement,
      },
    };

    const clientSecret = await getClientSecret(cartData); // Obtenir le clientSecret ici

    if (clientSecret) {
      try {
        const result = await stripe.confirmCardPayment(clientSecret, paymentData);

        if (result.error) {
          console.error(result.error.message);
        } else {
          console.log('Paiement confirmé avec succès !');
          const userId = decodedUserToken.id;
          // Redirigez l'utilisateur vers votre URL de réussite ou effectuez d'autres actions nécessaires
          axios.post(`${URL}${URL_ORDER}`, {cartData, userId})
                .then(response => {
                    console.log(response.data)
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération du panier :', error);
                });
        }
      } catch (error) {
        console.error('Erreur lors du paiement :', error);
      }
    } else {
      console.error('Impossible d\'obtenir le clientSecret.');
    }
  };

  React.useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const handleFormValidation = (isValid) => {
    setIsFormValid(isValid);
  };

  return (
    <form className='pay-form' onSubmit={handleSubmit}>
      <div className="card-element-container">
        <span className='card-info'>Numéro de carte</span>
        <CardNumberElement className="CardNumberElement" onChange={(e) => handleFormValidation(e.complete)} />
        <div id="card-errors-number" className='error'></div>
      </div>
      <div className="mid-fields">
        <div className="card-element-container">
          <span className='card-info'>Date d'expiration</span>
          <CardExpiryElement className="CardExpiryElement" onChange={(e) => handleFormValidation(e.complete)} />
          <div id="card-errors-expiry" className='error'></div>
        </div>
        <div className="card-element-container">
          <span className='card-info'>CVC</span>
          <CardCvcElement className="CardCvcElement" onChange={(e) => handleFormValidation(e.complete)} />
          <div id="card-errors-cvc" className='error'></div>
        </div>
      </div>
      <div className="card-element-container">
        <span className='card-info'>Nom sur la carte</span>
        <div className="input-customer-name-container">
          <input type="text" className='customer-name' placeholder='A.Martin' value={customerName} onChange={handleNameChange} onFocus={handleNameFocus} 
          onBlur={handleNameBlur}/>
        </div>
        <div id="card-errors-name" className='error'></div>
      </div>
    </form>
  );
});

CheckoutForm.propTypes = {
  cartData: PropTypes.array, // Adjust the prop type based on the actual type of cartData
};

CheckoutForm.displayName = 'CheckoutForm';

export default CheckoutForm;
