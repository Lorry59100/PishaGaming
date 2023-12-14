import { NavbarVisibilityContext } from "../../contexts/NavbarVisibilityContext";
import { useContext, useEffect, useState } from 'react';
import { Paybar } from "../layouts/Navbar/Paybar";
import "../../assets/styles/components/activation.css"
import { URL, URL_GET_ORDER } from "../../constants/urls/URLBack";
import { useAuth } from "./services/tokenService";
import axios from 'axios'
import { convertToEuros } from "../products/services/PriceServices";
import { HiMiniComputerDesktop } from 'react-icons/hi2';
import { IconContext } from "react-icons";
import { FaPlaystation } from "react-icons/fa";
import { BsXbox } from "react-icons/bs";
import { formatDate } from "./services/dateServices";
import { SiNintendo } from "react-icons/si";
import { IoIosWarning } from "react-icons/io";

export function Activation() {
const { hideNavbar, showNavbar } = useContext(NavbarVisibilityContext);
const { decodedUserToken } = useAuth();
const [order, setOrder] = useState({});
const [renderActivation, setRenderActivation] = useState(true);

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
      console.log(userId);
      axios.get(`${URL}${URL_GET_ORDER}/${userId}`)
        .then(response => {
          console.log(response.data)
          // Assuming the structure of the data
          const [user, order, orderDetails, activationKeys] = response.data;
          const initializedActivationKeys = activationKeys.map(key => ({
            ...key,
            revealed: false, // Ajout de l'état revealed initial
          }));
          setOrder({
              user: user || {},
              order: order || {},
              orderDetails: orderDetails || [],
              activationKeys: initializedActivationKeys || [],
          });
            // Ajoutez une condition pour masquer la commande après 10 minutes
              const deliveryDate = new Date(order.date.date);
              const currentDate = new Date();
              const tenMinutesLater = new Date(deliveryDate.getTime() + 10 * 60 * 1000); // 10 minutes après la date de livraison
              if (currentDate > tenMinutesLater) {
              setRenderActivation(false);
              }
        })
        .catch(error => {
          console.error('Erreur lors de la récupération du produit :', error);
        });
    }
  }, [decodedUserToken]);

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
              {order.order && order.user && <h1>{order.user.firstname} {order.user.lastname}</h1>}
              {order.order && order.order.reference && <h1>Commande numéro: {order.order.reference}</h1>}
            </div>
            <div className="order-details-container">
              {order.orderDetails && order.orderDetails.length > 0 ? (
                order.orderDetails.map((orderDetail, index) => {
                  let keyCounter = 0; // Counter for each product
                  let platformIcon;
  
                  // Déterminez quelle icône utiliser en fonction de la plateforme
                  switch (orderDetail.platform) {
                    // ... (votre code pour déterminer l'icône en fonction de la plateforme)
                  }
  
                  return (
                    <div key={index} className="order-detail">
                      <div className="order-img-container">
                        <div className="platform-order-icon">{platformIcon && platformIcon}</div>
                        <img src={orderDetail.img} alt={orderDetail.name} />
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