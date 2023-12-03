import axios from 'axios'
import { useEffect, useState } from 'react'
import { useAuth } from "./services/tokenService";
import { URL, URL_USER_CART } from '../../constants/urls/URLBack';
import "../../assets/styles/components/cart.css"
import { BsTrash3 } from "react-icons/bs";
import { HiMiniComputerDesktop } from 'react-icons/hi2';
import { IconContext } from "react-icons";
import { FaPlaystation } from "react-icons/fa";
import { BsXbox } from "react-icons/bs";
import { SiNintendo } from "react-icons/si";
import "../../assets/styles/components/form.css"
import { convertToEuros } from '../products/services/PriceServices';

export function Cart() {
    const { decodedUserToken } = useAuth();
    const [cartData, setCartData] = useState(null);

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
    }, [decodedUserToken]);
  return (
    <div className="cart-component-container">
        <div className="cart-container">
            <h2>Panier</h2>
            <div className="cart-products">
            {decodedUserToken && (
                <div>
                {cartData && cartData.map(item => (
                    <div key={item.id} className='single-product-detail'>
                        <div className="product-img">
                            <img src={item.img} alt={item.name} />
                        </div>
                        <div className="middle-content">
                            <div className="middle-head">
                            {item.platform === 'PC' && (
                            <IconContext.Provider value={{ size: '1.5em', color: 'white' }}>
                                <HiMiniComputerDesktop />
                            </IconContext.Provider>
                            )}

                            {item.platform === 'Xbox Series X' && (
                            <IconContext.Provider value={{ size: '1.5em', color: 'white' }}>
                                <BsXbox />
                            </IconContext.Provider>
                            )}

                            {(item.platform === 'PS5' || item.platform === 'PS1') && (
                            <IconContext.Provider value={{ size: '1.5em', color: 'white' }}>
                                <FaPlaystation />
                            </IconContext.Provider>
                            )}

                            {(item.platform === 'Nintendo Switch' || item.platform === 'Super Nintendo') && (
                            <div className='nintendo-icon'>
                            <IconContext.Provider value={{ size: '1.2em', color: 'white' }}>
                                <SiNintendo className='nintendo-svg'/>
                            </IconContext.Provider>
                            </div>
                            )}

                                <h4>{item.name}</h4>
                            </div>
                            <span>{item.platform}</span>
                            <div className="middle-foot">
                                <BsTrash3 />
                                <div className="vertical-spacer"></div>
                                <button>Déplacer en wishlist</button>
                            </div>
                        </div>
                        <div className="quantity-selector">
                            <h3>{convertToEuros(item.price)*item.quantity} €</h3>
                            <select className="quantity-dropdown" value={item.quantity} onChange={(e) => (e.target.value)}>
                                {(() => {
                                    const options = [];
                                    for (let i = 1; i <= 10; i++) {
                                        options.push(
                                            <option key={i} value={i} className='dropdown-options'>
                                                {i}
                                            </option>
                                        );
                                    }
                                    return options;
                                })()}
                            </select>
                        </div>  
                    </div>
                ))}
                </div>
            )}
            {!decodedUserToken && (
                <h1>Non connecté</h1>
            )}

            </div>
        </div>
        <div className="summary-container">
            <h2>Résumé</h2>
        </div>
    </div>
  )
}
