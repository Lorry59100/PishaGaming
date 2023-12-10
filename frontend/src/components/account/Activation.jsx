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
/* import { SiNintendo } from "react-icons/si"; */

export function Activation() {
const { hideNavbar, showNavbar } = useContext(NavbarVisibilityContext);
const { decodedUserToken } = useAuth();
const [order, setOrder] = useState({});

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
            <div className="activation-component-layout-container">
              <div className="activation-component-container">
                <div className="activation-title-container">
                  {order.order && order.user && (
                      <h1>{order.user.firstname} {order.user.lastname}</h1>
                  )}
                  {order.order && order.order.reference && (
                      <h1>Commande numéro: {order.order.reference}</h1>
                  )}
                </div>
                <div className="order-details-container">
                  {order.orderDetails && order.orderDetails.length > 0 ? (
                  order.orderDetails.map((orderDetail, index) => {
                  let keyCounter = 0; // Counter for each product
                  let platformIcon;

                  // Déterminez quelle icône utiliser en fonction de la plateforme
                  switch (orderDetail.platform) {
                    case 'PC':
                    platformIcon = 
                      <IconContext.Provider value={{ size: '2em', color: 'white' }}>
                          <HiMiniComputerDesktop />
                      </IconContext.Provider>;
                  break;
                    case 'Xbox Series X':
                    platformIcon = 
                      <IconContext.Provider value={{ size: '2em', color: 'white' }}>
                        <BsXbox />
                      </IconContext.Provider>;
                  break;
                    case 'PS5':
                    platformIcon = 
                      <IconContext.Provider value={{ size: '2em', color: 'white' }}>
                        <FaPlaystation />
                      </IconContext.Provider>;
                  break;
                    default:
                    platformIcon = null; // Utilisez une icône par défaut ou ne rien afficher
                  }
                  return (
                    <div key={index} className="order-detail">
                      <div className="order-img-container">
                        <div className="platform-order-icon">
                          {platformIcon && platformIcon}
                        </div>
                        <img src={orderDetail.img} alt={orderDetail.name} />
                      </div>
                      <div className="order-infos-container">
                        <div className="order-info-title">
                          <h2>{orderDetail.name} x{orderDetail.quantity} </h2>
                          <h2>{convertToEuros(orderDetail.price)} €</h2>
                        </div>
                      {/* Display corresponding activation keys */}
                      {order.activationKeys.map((activationKey, activationIndex) => {
                        if (activationKey.orderId === orderDetail.id) {
                        keyCounter++; // Increment counter for each product
                      return (
                      <div key={activationIndex} className="order-info-keys">
                        <h3>{keyCounter}. </h3>
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
                      </div>
                    </div>
                  );
                  })
                  ) : (
                    <p>Aucun détail de commande trouvé.</p>
                  )}
                </div>
              </div>
            </div>
        </div>
    )
}
