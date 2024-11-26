import { useContext, useEffect, useState, useRef, useMemo } from "react";
import axios from 'axios';
import { NavbarVisibilityContext } from "../../../contexts/NavbarVisibilityContext";
import { Paybar } from "../../layouts/Navbar/Paybar";
import "../../../assets/styles/components/paymentform.css";
import { PiPencilSimpleLineFill } from 'react-icons/pi';
import { IconContext } from "react-icons";
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from "./CheckoutForm";
import DatePicker from "react-datepicker";
import { addDays } from 'date-fns';
import { IoIosWarning } from "react-icons/io";
import { FaRegCopy } from "react-icons/fa";
import { ToastError, ToastSuccess } from "../../../services/ToastService";
import { loadStripe } from '@stripe/stripe-js';
import { AddressForm } from "./AddressForm";
import { ImCross } from 'react-icons/im';
import { FaCheck, FaHouse } from "react-icons/fa6";
import { BsTrash3 } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { useTokenService } from "../../../services/TokenService";
import { calculateTotal, convertToEuros } from "../../../services/PriceServices";
import { useNavigate } from "react-router-dom";

export function PaymentForm() {
  const { hideNavbar, showNavbar } = useContext(NavbarVisibilityContext);
  const { decodedUserToken } = useTokenService();
  const [cartData, setCartData] = useState({ carts: [], message: "" });
  const totalPrice = calculateTotal(cartData.carts);
  const [stripe, setStripe] = useState(null);
  const checkoutFormRef = useRef();
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [deliveryError, setDeliveryError] = useState(false);
  const [isAddressModalVisible, setAddressModalVisible] = useState(false);
  const [isAddressFormVisible, setAddressFormVisible] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const stripePromise = useMemo(() => loadStripe(import.meta.env.VITE_STRIPE), []);
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_BACKEND;
  const URL_HOME = import.meta.env.VITE_HOME;
  const URL_USER_CART = import.meta.env.VITE_USER_CART;
  const URL_GET_ADDRESS = import.meta.env.VITE_GET_ADDRESS;
  const URL_DELETE_ADDRESS = import.meta.env.VITE_DELETE_ADDRESS;
  const URL_CHANGE_ADDRESS = import.meta.env.VITE_CHANGE_ADDRESS;
  const URL_RGPD = import.meta.env.VITE_RGPD;
  const URL_SALES_CONDITION = import.meta.env.VITE_SALES_CONDITION;
  const URL_MAIN_IMG = import.meta.env.VITE_MAIN_IMG;

  useEffect(() => {
    document.body.classList.add('unset-padding');

    return () => {
      document.body.classList.remove('unset-padding');
    };
  }, []);

  useEffect(() => {
    const fetchStripe = async () => {
      const instanceStripe = await stripePromise;
      setStripe(instanceStripe);
    };

    fetchStripe();
  }, [stripePromise]);

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
    setIsUserLoaded(true);
  }, [decodedUserToken, URL, URL_USER_CART]);

  useEffect(() => {
    if (decodedUserToken) {
      const headers = {
        'Authorization': `Bearer ${decodedUserToken.username}`,
      };

      axios.get(`${URL}${URL_GET_ADDRESS}`, { headers })
        .then(response => {
          const addresses = response.data;
          // Ensure the response is an array
          if (Array.isArray(addresses)) {
            // Ensure only one address is active
            addresses.forEach(addr => {
              if (addr.isActive) {
                addresses.forEach(otherAddr => {
                  if (otherAddr.id !== addr.id) {
                    otherAddr.isActive = false;
                  }
                });
              }
            });
            setAddresses(addresses);
          } else {
            console.error('Invalid response format:', addresses);
          }
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des adresses :', error);
        });
    }
  }, [decodedUserToken, URL, URL_GET_ADDRESS]);

  useEffect(() => {
    if (isUserLoaded && !decodedUserToken) {
      navigate(URL_HOME);
      ToastError('Vous devez être connecté pour accéder à cette page.');
    }
  }, [isUserLoaded, decodedUserToken, navigate]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      ToastSuccess('Numéro de carte copié dans le presse-papiers !');
    }).catch(err => {
      console.error('Erreur lors de la copie du texte : ', err);
    });
  };

  const handleOpenAddressModal = () => {
    setAddressModalVisible(true);
  };

  const handleCloseAddressModal = () => {
    setAddressModalVisible(false);
  };

  const handleOpenAddressForm = () => {
    setAddressFormVisible(true);
  };

  const handleCloseAddressForm = () => {
    setAddressFormVisible(false);
  };

  const handleAddressAdded = (newAddress) => {
    setAddresses(prevAddresses => [...prevAddresses, newAddress]);
    setAddressFormVisible(false);
    setDeliveryError(false);
  };

  const handleAddressSelect = (address) => {
    const headers = {
      'Authorization': `Bearer ${decodedUserToken.username}`,
      'Content-Type': 'application/json',
    };

    axios.put(`${URL}${URL_CHANGE_ADDRESS}`, { addressId: address.id }, { headers })
      .then(() => {
        setAddressModalVisible(false);
        // Update the active address in the state
        setAddresses(addresses.map(addr => ({
          ...addr,
          isActive: addr.id === address.id
        })));
      })
      .catch(error => {
        console.error('Erreur lors du changement d\'adresse :', error);
      });
  };

  const deleteAddressSelect = (address) => {
    const headers = {
      'Authorization': `Bearer ${decodedUserToken.username}`,
    };

    axios.delete(`${URL}${URL_DELETE_ADDRESS}`, {
      headers: headers,
      data: { addressId: address.id }
    })
      .then(response => {
        // Ensure the response is an array
        if (Array.isArray(response.data)) {
          // Update the active address in the state
          setAddresses(response.data);
        } else {
          console.error('Invalid response format:', response.data);
        }
      })
      .catch(error => {
        console.error('Erreur lors de la suppression de l\'adresse :', error);
      });
  };

  const activeAddress = addresses.find(address => address.isActive);

  const handlePayClick = (event) => {
    if (cartData.carts.some(item => item.isPhysical) && !selectedDate) {
      ToastError('Vous devez sélectionner une date de livraison')
      setDateError(true);
      return;
    }
    if (!activeAddress) {
      ToastError('Vous devez sélectionner une adresse de facturation/livraison');
      setDeliveryError(true);
      return;
    }
    setDateError(false);
    setDeliveryError(false);
    setIsLoading(true);

    // Appeler handleSubmit du composant CheckoutForm avant de mettre à jour isLoading
    checkoutFormRef.current.handleSubmit(event).then(() => {
      setIsLoading(true);
    }).catch(() => {
      setIsLoading(false);
    });
  };

  return (
    <div>
      <Paybar isPaymentFormContext={true} isActivationContext={true} />
      <div className="payment-layout-container">
        <div className="payment-container">
          <div className="address-and-payform-container">
            <div className="address-container">
              <h2>Adresse de facturation</h2>
              <div className={`info-change-container ${deliveryError ? 'error-border' : ''}`}>
                  {activeAddress ? (
                    <>
                    <div className="address-info address-info-pay">
                      <div className="address-info-container">
                        <h3>{activeAddress.lastname} {activeAddress.firstname}</h3>
                        <h4>{activeAddress.housenumber} {activeAddress.street}, {activeAddress.postcode} {activeAddress.city}</h4>
                      </div>
                      <div className="change-address">
                        <IconContext.Provider value={{ size: "1.2em" }}>
                          <PiPencilSimpleLineFill onClick={handleOpenAddressModal} />
                        </IconContext.Provider>
                      </div>
                    </div>
                    </>
                  ) : (
                    <>
                    <div className="address-info address-info-pay-no-address">
                    <h4>Vous n'avez pas d'adresse de facturation/livraison renseignée.
                      <br /> Vous devez en avoir une pour passer commande.
                    </h4>
                      <button className="submit-button create-address-pay" onClick={handleOpenAddressForm}>
                                    Créer une adresse
                      </button>
                    </div>
                    </>
                  )}
                </div>

              {isAddressModalVisible && (
                <div className="address-modal">
                  <div className="address-modal-content">
                    <div className='modal-head-container'>
                      <button className="close-button" onClick={handleCloseAddressModal}>
                        <IconContext.Provider value={{ size: "1.5em", color: "white" }}>
                          <ImCross />
                        </IconContext.Provider>
                      </button>
                    </div>
                    <h1>Vos adresses de facturation & livraison</h1>
                    {addresses.map(address => (
                      <div key={address.id} className="single-address-container">
                        <h3>{address.lastname} {address.firstname}</h3>
                        <h4>{address.housenumber} {address.street} {address.postcode} {address.city}</h4>
                        <div>
                          {address.isActive ? (
                            <button>
                              <IconContext.Provider value={{ size: "1.5em", color: "green" }}>
                                <FaCheck />
                              </IconContext.Provider>
                            </button>
                          ) : (
                            <button onClick={() => handleAddressSelect(address)}>
                              <IconContext.Provider value={{ size: "1.5em", color: "white" }}>
                                <FaHouse />
                              </IconContext.Provider>
                            </button>
                          )}
                          <button onClick={() => deleteAddressSelect(address)}>
                            <IconContext.Provider value={{ size: "1.5em", color: "white" }}>
                              <BsTrash3 />
                            </IconContext.Provider>
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className='submit-address-container'>
                      <button className="submit-button add-address-btn" onClick={handleOpenAddressForm}>
                        <IconContext.Provider value={{ size: "1.5em", color: "white" }}>
                          <IoMdAdd />
                        </IconContext.Provider>
                        Créer une nouvelle adresse
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {isAddressFormVisible && (
                <AddressForm
                  onClose={handleCloseAddressForm}
                  onAddressAdded={handleAddressAdded}
                />
              )}
              {cartData.carts && cartData.carts.length > 0 && cartData.carts.some(item => item.isPhysical) && (
                <div className="date-picker-container">
                  <h2>Vous devez choisir une date de livraison pour les produits suivants</h2>
                  <div className={`physical-products-container ${dateError ? 'error-border' : ''}`}>
                    <div className="datepicker-container">
                      <h5>Date de livraison</h5>
                      <DatePicker
                        className="deliveryDate"
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Date de livraison"
                        selected={selectedDate}
                        minDate={addDays(new Date(), 2)}
                        onChange={date => {
                          setSelectedDate(date);
                          setDateError(false);
                        }}
                      />
                    </div>
                    <div className="delivery-items-container">
                      {cartData.carts && cartData.carts.filter(item => (item.category === 'Hardware' || (item.category === 'Jeux Vidéos' && item.isPhysical))).map((item, index) => (
                        <div key={index} className="physical-product">
                          <img src={`${URL}${URL_MAIN_IMG}/${item.img}`} alt={item.name} />
                          <h4 className="physical-product-name">{item.name}</h4>
                          <div className="multiple-items">
                            <div className="delivery-platform">
                              <img src={`/src/assets/img/platforms/${item.platform}.png`} alt={item.platform} className='logo-img-delivery' />
                            </div>
                            {item.quantity > 1 && (
                              <div className="delivery-quantity">
                                <h4>
                                  {`x${item.quantity} `}
                                </h4>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {dateError && (
                      <div className="error-message">
                        <p>Veuillez sélectionner une date de livraison pour les produits physiques.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="warning">
              <IconContext.Provider value={{ size: "3em" }}>
                <IoIosWarning />
              </IconContext.Provider>
              <p>
                Ce site est actuellement en mode de démonstration.
                Veuillez ne pas renseigner vos vraies informations de paiement.
                Pour tester les fonctionnalités de paiement, utilisez le numéro de carte de test suivant :
                <br />
                <button className="copy-button" onClick={() => copyToClipboard('4242 4242 4242 4242')}>
                  <strong>4242 4242 4242 4242</strong>
                  <IconContext.Provider value={{ size: "1.2em" }}>
                    <FaRegCopy />
                  </IconContext.Provider>
                </button>
                <br />
                Merci de votre compréhension.
              </p>
            </div>
            <div className="payform-container">
              <h2>Méthode de paiement</h2>
              {stripe && (
                <Elements stripe={stripe}>
                  <CheckoutForm cartData={cartData.carts} selectedDate={selectedDate} ref={checkoutFormRef} />
                </Elements>
              )}
            </div>
          </div>
          <div className="summary-and-total-container">
            <h2>Résumé</h2>
            {cartData.carts && cartData.carts.map((item, index) => (
              <div key={item.id} className="items-container">
                <div className="single-item-container">
                  <div className="product-info-quantity">
                    <h3>
                      {item.name}
                      <span className={item.quantity > 1 ? 'multiple-items-info' : ''}>
                        {item.quantity > 1 ? `x${item.quantity} ` : ''}
                      </span>
                    </h3>
                    <h4>{item.platform}</h4>
                  </div>
                  <div className="product-price">
                    <h4>{convertToEuros(item.price * item.quantity)} €</h4>
                  </div>
                </div>
                {index !== cartData.carts.length - 1 && <div className="cutline-summary-form"></div>}
              </div>
            ))}
            <div className="white-line"></div>
            <div className="summary-total-container">
              <h3>Total :</h3>
              <h2>{convertToEuros(totalPrice)}€</h2>
            </div>
            <div className="btn-summary-container">
              <button type="submit" className='submit-button' onClick={handlePayClick} disabled={isLoading}>
                {isLoading ? 'Traitement en cours...' : 'Payer'}
              </button>
            </div>
            <span>
              <div className="terms-and-politic">
                En cliquant sur "Payer" je reconnais avoir lu et accepté les&nbsp;
                  <a href={URL_SALES_CONDITION} className="pay-terms" target="_blank" rel="noopener noreferrer">termes et conditions</a>,
                et la&nbsp;
                  <a href={URL_RGPD} className="pay-terms" target="_blank" rel="noopener noreferrer">politique de confidentialité</a>.
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
