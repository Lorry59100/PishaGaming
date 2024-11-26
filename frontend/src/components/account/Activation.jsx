import { NavbarVisibilityContext } from "../../contexts/NavbarVisibilityContext";
import { useContext, useEffect, useState } from 'react';
import { Paybar } from "../layouts/Navbar/Paybar";
import "../../assets/styles/components/activation.css"
import axios from 'axios'
import { IconContext } from "react-icons";
import { IoIosWarning } from "react-icons/io";
import { useTokenService } from "../../services/TokenService";
import { convertToEuros } from "../../services/PriceServices";
import { formatDate } from "../../services/DateServices";

export function Activation() {
const { hideNavbar, showNavbar } = useContext(NavbarVisibilityContext);
const { decodedUserToken } = useTokenService();
const [order, setOrder] = useState({});
const [renderActivation, setRenderActivation] = useState(true);
const URL = import.meta.env.VITE_BACKEND;
const URL_GET_ORDER = import.meta.env.VITE_GET_ORDER;
const URL_MAIN_IMG = import.meta.env.VITE_MAIN_IMG;
const URL_PLATFORM_IMG = import.meta.env.VITE_PLATFORM_IMG;

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
    // Vérifiez si decodedUserToken est défini et n'est pas null avant d'accéder à id
    if (decodedUserToken && decodedUserToken.id) {
        const userId = decodedUserToken.id;
        axios.get(`${URL}${URL_GET_ORDER}/${userId}`)
            .then(response => {
                const [ order, orderDetails, activationKeys] = response.data;
                const initializedActivationKeys = activationKeys ? activationKeys.map(key => ({
                    ...key,
                    revealed: false, // Ajout de l'état revealed initial
                })) : [];
                setOrder({
                    order: order || {},
                    orderDetails: orderDetails || [],
                    activationKeys: initializedActivationKeys || [],
                });
                // Ajoutez une condition pour masquer la commande après 10 minutes
                if (order && order.date && order.date.date) {
                    const deliveryDate = new Date(order.date.date);
                    const currentDate = new Date();
                    const tenMinutesLater = new Date(deliveryDate.getTime() + 10 * 60 * 1000); // 10 minutes après la date de livraison
                    if (currentDate > tenMinutesLater) {
                        setRenderActivation(false);
                    }
                }
            })
            .catch(error => {
                console.error('Erreur lors de la récupération du produit :', error);
            });
    }
}, [decodedUserToken, URL, URL_GET_ORDER]);




  const handleRevealClick = (activationIndex) => {
    setOrder(prevOrder => {
      const updatedActivationKeys = [...prevOrder.activationKeys];
      updatedActivationKeys[activationIndex].revealed = true;
      return {
        ...prevOrder,
        activationKeys: updatedActivationKeys,
      };
    });
  };

  return (
    <div className="activation-layout-container">
      <Paybar isPaymentFormContext={false} isActivationContext={true} />
      {renderActivation ? (
        <div className="activation-component-layout-container">
          {/* Reste du contenu de la div.activation-component-layout-container */}
          <div className="activation-component-container">
            <div className="activation-title-container">
              {/* {order.order && order.user && <h1>{order.user.firstname} {order.user.lastname}</h1>} */}
              {order.order && order.order.reference && <h1>Commande numéro: {order.order.reference}</h1>}
            </div>
            <div className="order-details-container">
              {order.orderDetails && order.orderDetails.length > 0 ? (
                order.orderDetails.map((orderDetail, index) => {
                  let keyCounter = 0; // Counter for each product

                  return (
                    <div key={index} className="order-detail">
                      <div className="order-img-container">
                        <div className="img-container">
                          <div className="platform-order-icon"><img src={`${URL_PLATFORM_IMG}/${orderDetail.platform}.png`} alt={orderDetail.name} /></div>
                          <img src={`${URL}${URL_MAIN_IMG}/${orderDetail.img}`} alt={orderDetail.name} />
                        </div>
                      </div>
                      <div className="order-infos-container">
                        <div className="order-info-title">
                          <h2>
                            {orderDetail.name} {orderDetail.quantity > 1 && <span className="activation-quantity"><strong> x{orderDetail.quantity}</strong> </span>}
                          </h2>
                          <h2>{convertToEuros(orderDetail.price)} €</h2>
                        </div>
                        {/* Display corresponding activation keys */}
                        {order.activationKeys.map((activationKey, activationIndex) => {
                          if (activationKey.orderId === orderDetail.id) {
                            keyCounter++; // Increment counter for each product
                            return (
                              <div key={activationIndex} className="order-info-keys">
                                {orderDetail.quantity > 1 && <h3>{keyCounter}. </h3>}
                                <div className="single-key">
                                  <h3>{activationKey.revealed ? activationKey.activation_key : ''}</h3>
                                  {!activationKey.revealed && (
                                    <button className="submit-button activation-button" type="button" onClick={() => handleRevealClick(activationIndex)}>
                                      Afficher mon code
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          }
                          return null; // Ignore activation keys for other products
                        })}
                        {orderDetail.isPhysical && order.order && order.order.date && (
                          <div>
                            <div className="single-key"><h3>Date de livraison prévue : {formatDate(order.order.deliveryDate.date)}</h3></div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : null /* Aucun élément à afficher si orderDetails est vide */}
            </div>
          </div>
        </div>
        ) : (
          <div className="empty-order-container">
            <div className="empty-order">
              <div className="empty">
                <IconContext.Provider value={{ size: "4em" }}>
                  <IoIosWarning />
                </IconContext.Provider>
                <div className="go-to-buys">
                  <h3>Vous n'avez pas de commande. 
                  <br /> 
                  Vous pouvez retrouver vos commandes passées dans la section Achats de votre profil</h3>
                  <div className="btn-got-buy-container">
                    <button className="buy-button">Voir mes achats</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}