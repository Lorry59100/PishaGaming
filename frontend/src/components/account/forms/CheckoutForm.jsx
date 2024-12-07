/* eslint-disable no-dupe-keys */
import React, { useState, useEffect, forwardRef, useContext } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import '../../../assets/styles/components/checkoutform.css';
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { CartContext } from '../../../contexts/CartContext';
import { useTokenService } from '../../../services/TokenService';
import { ToastError } from '../../../services/ToastService';

const CheckoutForm = forwardRef(({ cartData, selectedDate, addressInfo }, ref) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [hasError, setHasError] = useState(false); // État pour suivre les erreurs
  const stripe = useStripe();
  const elements = useElements();
  const [customerName, setCustomerName] = useState('');
  const { decodedUserToken } = useTokenService();
  const navigate = useNavigate();
  const { updateCart } = useContext(CartContext);
  const URL = import.meta.env.VITE_BACKEND;
  const URL_PAY = import.meta.env.VITE_PAY;
  const URL_ORDER = import.meta.env.VITE_ORDER;
  const URL_DELETE_CART = import.meta.env.VITE_DELETE_CART;
  const URL_ACTIVATION = import.meta.env.VITE_ACTIVATION;

  const getClientSecret = async () => {
    try {
      const response = await axios.post(`${URL}${URL_PAY}`, { cartData });
      return response.data.clientSecret;
    } catch (error) {
      console.error('Erreur lors de la récupération du clientSecret :', error);
      setHasError(true); // Mettre à jour l'état d'erreur
      return null;
    }
  };

  const handleBlur = (element, errorId, errorMessage) => {
    element.on('blur', () => {
      const displayError = document.getElementById(errorId);
      if (element._parent.classList.contains('StripeElement--empty') || element._parent.classList.contains('StripeElement--invalid')) {
        displayError.textContent = errorMessage;
        setHasError(true); // Mettre à jour l'état d'erreur
      } else {
        displayError.textContent = ''; // Efface le message d'erreur si le champ est valide
        setHasError(false); // Réinitialiser l'état d'erreur
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
      setHasError(true); // Mettre à jour l'état d'erreur
    } else {
      document.getElementById('card-errors-name').textContent = ''; // Effacer le message d'erreur si le champ est valide
      setIsFormValid(true);
      setHasError(false); // Réinitialiser l'état d'erreur
    }
  };

  const handleNameFocus = () => {
    // Effacer le message d'erreur lorsque l'utilisateur commence à interagir avec le champ
    document.getElementById('card-errors-name').textContent = '';
    setHasError(false); // Réinitialiser l'état d'erreur
  };

  const handleNameBlur = () => {
    // Vérifier si le champ du nom est vide lorsque l'utilisateur quitte le champ
    if (customerName.trim() === '') {
      document.getElementById('card-errors-name').textContent = 'Veuillez renseigner le nom sur la carte.';
      setIsFormValid(false);
      setHasError(true); // Mettre à jour l'état d'erreur
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

    const cardnumberElement = elements.getElement(CardNumberElement);
    // Vérifier si le champ numéro de carte est vide
    if (!cardnumberElement || cardnumberElement._parent.classList.contains('StripeElement--empty')) {
      document.getElementById('card-errors-number').textContent = 'Numéro de carte incomplet ou invalide';
      setHasError(true); // Mettre à jour l'état d'erreur
      ToastError('Une de vos informations de paiement est incomplète ou invalide')
      return Promise.reject(new Error('Numéro de carte incomplet ou invalide'));
    }

    const cardexpiryElement = elements.getElement(CardExpiryElement);
    // Vérifier si le champ numéro de carte est vide
    if (!cardexpiryElement || cardexpiryElement._parent.classList.contains('StripeElement--empty')) {
      document.getElementById('card-errors-expiry').textContent = 'Numéro de carte incomplet ou invalide';
      setHasError(true); // Mettre à jour l'état d'erreur
      ToastError('Une de vos informations de paiement est incomplète ou invalide')
      return Promise.reject(new Error('Numéro de carte incomplet ou invalide'));
    }

    const cardcvcElement = elements.getElement(CardCvcElement);
    // Vérifier si le champ CVC est vide
    if (!cardcvcElement || cardcvcElement._parent.classList.contains('StripeElement--empty')) {
      document.getElementById('card-errors-cvc').textContent = 'CVC incomplet ou invalide';
      setHasError(true); // Mettre à jour l'état d'erreur
      ToastError('Une de vos informations de paiement est incomplète ou invalide')
      return Promise.reject(new Error('CVC incomplet ou invalide'));
    }

    // Vérifier si le champ du nom est vide
    if (customerName.trim() === '') {
      document.getElementById('card-errors-name').textContent = 'Veuillez renseigner le nom sur la carte.';
      setHasError(true); // Mettre à jour l'état d'erreur
      ToastError('Une de vos informations de paiement est incomplète ou invalide')
      return Promise.reject(new Error('Veuillez renseigner le nom sur la carte.'));
    }

    if (!stripe || !elements || !isFormValid) {
      console.log('Le formulaire n\'est pas valide.');
      setHasError(true); // Mettre à jour l'état d'erreur
      return Promise.reject(new Error('Le formulaire n\'est pas valide.'));
    }

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
          setHasError(true); // Mettre à jour l'état d'erreur
          return Promise.reject(new Error(result.error.message));
        } else {
          console.log('Paiement confirmé avec succès !');
          const userId = decodedUserToken.id;
          const orderData = {
            cartData,
            userId,
            selectedDate,
            addressInfo,
          };
          // Redirigez l'utilisateur vers votre URL de réussite ou effectuez d'autres actions nécessaires
          axios.post(`${URL}${URL_ORDER}`, { cartData, userId, selectedDate, orderData })
            .then(response => {
              console.log(response.data)
              if (response.status === 200) {
                axios.delete(`${URL}${URL_DELETE_CART}`, {
                  data: { userId }, // Pass the userId in the request body
                })
                updateCart([]);
                navigate(URL_ACTIVATION);
              }
            })
            .catch(error => {
              console.error('Erreur lors de la récupération du panier :', error);
            });
        }
      } catch (error) {
        console.error('Erreur lors du paiement :', error);
        setHasError(true); // Mettre à jour l'état d'erreur
        return Promise.reject(new Error('Erreur lors du paiement : ' + error.message));
      }
    } else {
      console.error('Impossible d\'obtenir le clientSecret.');
      setHasError(true); // Mettre à jour l'état d'erreur
      return Promise.reject(new Error('Impossible d\'obtenir le clientSecret.'));
    }
  };

  React.useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const handleFormValidation = (isValid) => {
    setIsFormValid(isValid);
  };

  return (
    <form className={`pay-form ${hasError ? 'pay-form-error' : ''}`} onSubmit={handleSubmit}>
      <div className="card-element-container">
        <span className='card-info'>Numéro de carte</span>
        <CardNumberElement className="CardNumberElement" onChange={(e) => handleFormValidation(e.complete)}
          options={{ style: { base: { color: '#FFFFFF' } } }} />
        <div id="card-errors-number" className='error'></div>
      </div>
      <div className="mid-fields">
        <div className="card-element-container">
          <span className='card-info'>Date d'expiration</span>
          <CardExpiryElement className="CardExpiryElement" onChange={(e) => handleFormValidation(e.complete)}
            options={{ style: { base: { color: '#FFFFFF' } } }} />
          <div id="card-errors-expiry" className='error'></div>
        </div>
        <div className="card-element-container">
          <span className='card-info'>CVC</span>
          <CardCvcElement className="CardCvcElement" onChange={(e) => handleFormValidation(e.complete)}
            options={{ style: { base: { color: '#FFFFFF' } } }} />
          <div id="card-errors-cvc" className='error'></div>
        </div>
      </div>
      <div className="card-element-container">
        <span className='card-info'>Nom sur la carte</span>
        <div className="input-customer-name-container">
          <input type="text" className='customer-name' placeholder='A.Martin' value={customerName} onChange={handleNameChange} onFocus={handleNameFocus}
            onBlur={handleNameBlur} />
        </div>
        <div id="card-errors-name" className='error'></div>
      </div>
    </form>
  );
});

CheckoutForm.propTypes = {
  cartData: PropTypes.array, // Adjust the prop type based on the actual type of cartData
  selectedDate: PropTypes.instanceOf(Date),
  addressInfo: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    address: PropTypes.string,
  }),
};

CheckoutForm.displayName = 'CheckoutForm';

export default CheckoutForm;
