import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../../assets/styles/components/wishlist.css";
import { ImCross } from "react-icons/im";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";
import { useTokenService } from "../../services/TokenService";
import { calculateDiscountPercentage, convertToEuros } from "../../services/PriceServices";

export function Wishlist() {
    const [wishlists, setWishlists] = useState([]);
    const { decodedUserToken } = useTokenService();
    const URL = import.meta.env.VITE_BACKEND;
    const URL_ADD_TO_WISHLIST = import.meta.env.VITE_ADD_TO_WISHLIST;
    const URL_MAIN_IMG = import.meta.env.VITE_MAIN_IMG;
    const URL_SINGLE_PRODUCT = import.meta.env.VITE_SINGLE_PRODUCT_FRONT;
    const URL_GET_WISHLIST = import.meta.env.VITE_GET_WISHLIST;
    const URL_PLATFORM_IMG = import.meta.env.VITE_PLATFORM_IMG;

    const fetchWishlist = useCallback(() => {
        if (!decodedUserToken) return;

        const headers = {
            'Authorization': `Bearer ${decodedUserToken.username}`,
        };

        axios.get(`${URL}${URL_GET_WISHLIST}`, { headers })
            .then(response => {
                setWishlists(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des adresses :', error);
            });
    }, [decodedUserToken, URL, URL_GET_WISHLIST]);

    useEffect(() => {
        if (decodedUserToken) {
            fetchWishlist();
        }
    }, [decodedUserToken, fetchWishlist]);

    const addToWishlist = async (productId, platform, decodedUserToken) => {
        if (!decodedUserToken) {
            console.error('decodedUserToken is undefined');
            return;
        }
    
        try {
            const response = await axios.post(`${URL}${URL_ADD_TO_WISHLIST.replace(':id', productId)}`, {
                userId: decodedUserToken.id,
                platform: platform
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.data.success) {
                // Refetch the wishlist after adding a product
                fetchWishlist();
            } else {
                alert('Erreur : ' + response.data.error);
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout à la wishlist:', error);
            alert('Une erreur s\'est produite lors de l\'ajout à la wishlist.');
        }
    };
    
    return (
        <div className="wishlists-container">
            <div className="wishlist-count">
                <h1>{wishlists.length} jeu(x) en wishlist</h1>
            </div>
            {wishlists.map(wishlist => (
                <div key={wishlist.id} className="single-wishlist-container">
                    {wishlist && wishlist.product ? (
                        <div className="wishlist-user-item">
                            <div className="wishlist-platform-img">
                                <img src={`${URL_PLATFORM_IMG}/${wishlist.product.platform}.png`} alt={wishlist.product.platform} className='logo-img' />
                            </div>
                            <Link to={`${URL_SINGLE_PRODUCT.replace(':id', wishlist.product.id)}`}>
                                <img src={`${URL}${URL_MAIN_IMG}/${wishlist.product.img}`} alt={wishlist.product.name} />
                            </Link>
                            <div className="discount-label-cards">
                                <h5><strong>-</strong>{calculateDiscountPercentage(wishlist.product.old_price, wishlist.product.price)}</h5>
                            </div>
                            <div className="remove-close-icon">
                            <button type="submit" onClick={() => addToWishlist(wishlist.product.id, wishlist.product.platform, decodedUserToken)}>
                                    <IconContext.Provider value={{ size: "1.2em" }}>
                                        <ImCross className="shadow" />
                                    </IconContext.Provider>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>Produit non défini</div>
                    )}
                    <div className="sub-title">
                        <h4>{wishlist.product.name}</h4>
                        <h2>{convertToEuros(wishlist.product.price)} €</h2>
                    </div>
                </div>
            ))}
        </div>
    );
}
