import { useEffect, useState } from "react";
import { useTokenService } from "./services/tokenService";
import { URL, URL_USER_ORDER } from "../../constants/urls/URLBack";
import axios from "axios";
import "../../assets/styles/components/orderhistoric.css"
import { formatDate } from "./services/dateServices";
import { convertToEuros } from "../products/services/PriceServices";

function OrderHistoric() {
    const { decodedUserToken } = useTokenService();
    const [orders, setOrders] = useState(null);

    useEffect(() => {
        if (decodedUserToken) {
          const headers = {
            'Authorization': `Bearer ${decodedUserToken.username}`,
            // autres en-têtes si nécessaire...
          };
      
          axios.get(`${URL}${URL_USER_ORDER}`, {headers})
            .then(response => {
                console.log(response.data);
                setOrders(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des adresses :', error);
            });
        }
      }, [decodedUserToken]);

  return (
    <div className="order-historic-container">
            <h1>Historique des commandes</h1>
            {orders !== null && orders.map((order) => (
                <div key={order.id}>
                    <div className="order-container">
                        {order.status === 1 ? (
                            <span className="order-status order-done">Terminée</span>
                        ) : order.status === 0 ? (
                            <span className="order-status order-incoming">En cours de livraison</span>
                        ) : (
                            <p>Le statut n'est ni égal à 1 ni égal à 0</p>
                        )}
                        <div>
                            {order.order_details.map((detail, detailIndex) => (
                                <div key={detail.id}>
                                    <div className="order-detail-container">
                                        <div className="order-detail-img-info">
                                            <img src={detail.img} alt={detail.product} />
                                            <div className="order-detail-info">
                                                <h2>{detail.product} x {detail.quantity}</h2>
                                                <h4>{detail.platform}</h4>
                                            </div>
                                        </div>
                                        <div className="order-detail-price">
                                            <h4>{convertToEuros(detail.price)} €</h4>
                                        </div>
                                    </div>
                                        {detailIndex < order.order_details.length - 1 && (
                                            <div className="cutline-form"></div>
                                        )}
                                </div>
                            ))}
                        </div>
                        <div className="cutline-form"></div>
                        <div className="order-total-price">
                            <h2>Total</h2>
                            <h2>{convertToEuros(order.total)}€</h2>
                        </div>
                    </div>
                    <div className="sub-order-container">
                        <p>Commande: {order.reference}, passée le: {formatDate(order.created_at.date)}</p>
                        <p>Délivrée le: {formatDate(order.delivery_date.date)}</p>
                    </div>
                </div>
            ))}
        </div>
  )
}

export default OrderHistoric