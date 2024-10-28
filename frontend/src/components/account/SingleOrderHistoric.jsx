import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { URL, URL_USER_SINGLE_ORDER } from "../../constants/urls/URLBack";
import "../../assets/styles/components/singleorder.css";
import { IoChevronBackOutline } from "react-icons/io5";
import { IconContext } from "react-icons";
import { FaShippingFast, FaCheck } from "react-icons/fa";
import { formatDate } from "./services/dateServices";
import { PLATFORM_IMG, URL_ACCOUNT, URL_ORDER_HISTORIC } from "../../constants/urls/URLFront";

function SingleOrderHistoric() {
  const { reference } = useParams();
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    axios.get(`${URL}${URL_USER_SINGLE_ORDER}/${reference}`)
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération de la commande :', error);
      });
  }, [reference]);

  return (
    <div className="single-order-container">
      <div className="single-order-header">
        <Link to={`${URL_ACCOUNT}${URL_ORDER_HISTORIC}`} className="back-button">
          <IconContext.Provider value={{ size: "1.5em", color: "white" }}>
            <IoChevronBackOutline />
          </IconContext.Provider>
        </Link>
        <h3 className="back-text">Mes achats</h3>
      </div>

      {orders !== null && orders[1].map(order => (
          <div key={order.id}>
            {order.status === 0 && (
              <div className="status-container is-shipping">
                <IconContext.Provider value={{ size: "2em"}}>
                  <FaShippingFast />
                </IconContext.Provider>
                <h2>Certains produits sont encore en cours de livraison</h2>
              </div>
            )}
            {order.status === 1 && (
              <div className="status-container delivered">
                <IconContext.Provider value={{ size: "2em"}}>
                  <FaCheck />
                </IconContext.Provider>
                <h2>Achat terminé</h2>
              </div>
            )}
          </div>
        ))}

      <div className="single-order-main">
        {orders !== null && orders[0].map(orderDetail => (
          <div key={orderDetail.id} className="single-order-detail-container">
            <div className="img-container">
              <img src={`${URL}/uploads/images/products/videogames/main_img/${orderDetail.img}`} alt={orderDetail.product} />
              <div className="logo-img-order-container">
                <img src={`${PLATFORM_IMG}/${orderDetail.platform}.png`} alt={orderDetail.platform} className='logo-img' />
              </div>
            </div>
            <h2> {orderDetail.product} {orderDetail.quantity > 1 ? ` x${orderDetail.quantity}` : ''} </h2>
            
            {orderDetail.productType === false && (
              <p>est maintenant prêt à être activé</p>
            )}
            {orderDetail.productType === true && (
              <p>Livraison prévue le : {formatDate(orderDetail.delivery.date)} </p>
            )}

            {orderDetail.activationKeys && orderDetail.activationKeys.map(activationKey => (
              <div key={activationKey.activationKeyId} className="single-key">
                <h3>{activationKey.activation}</h3>
              </div>
            ))}
          </div>
        ))}
      </div>
      {orders !== null && orders[1].map(order => (
        <div key={order.id} className="single-order-details-bottom-container">
          <p>Commande {order.reference} • effectuée le {formatDate(order.date.date)}</p>
        </div>
      ))}
    </div>
  );
}

export default SingleOrderHistoric;
