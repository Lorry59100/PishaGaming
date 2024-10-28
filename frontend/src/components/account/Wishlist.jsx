import { useEffect, useState, useCallback } from "react";
import { useTokenService } from "./services/tokenService";
import axios from "axios";
import { URL, URL_ADD_TO_WISHLIST, URL_MAIN_IMG, URL_SINGLE_PRODUCT } from "../../constants/urls/URLBack";
import "../../assets/styles/components/wishlist.css";
import { calculateDiscountPercentage, convertToEuros } from "../products/services/PriceServices";
import { ImCross } from "react-icons/im";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";

export function Wishlist() {
    const [wishlists, setWishlists] = useState([]);
    const { decodedUserToken } = useTokenService();

    const fetchWishlist = useCallback(() => {
        if (!decodedUserToken) return;

        const headers = {
            'Authorization': `Bearer ${decodedUserToken.username}`,
        };

        axios.get(`${URL}/get-wishlist`, { headers })
            .then(response => {
                setWishlists(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des adresses :', error);
            });
    }, [decodedUserToken]);

    useEffect(() => {
        if (decodedUserToken) {
            fetchWishlist();
        }
    }, [decodedUserToken, fetchWishlist]);

    const addToWishlist = async (productId, decodedUserToken) => {
        if (!decodedUserToken) {
            console.error('decodedUserToken is undefined');
            return;
        }

        try {
            const response = await axios.post(`${URL}${URL_ADD_TO_WISHLIST.replace(':id', productId)}`, {
                userId: decodedUserToken.id
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
            {wishlists.map(wishlist => (
                <div key={wishlist.id} className="single-wishlist-container">
                    {wishlist && wishlist.product ? (
                        <div className="wishlist-user-item">
                            <Link to={`${URL_SINGLE_PRODUCT}/${wishlist.product.id}`}>
                                <img src={`${URL}${URL_MAIN_IMG}/${wishlist.product.img}`} alt={wishlist.product.name} />
                            </Link>
                            <div className="discount-label-cards">
                                <h5><strong>-</strong>{calculateDiscountPercentage(wishlist.product.old_price, wishlist.product.price)}</h5>
                            </div>
                            <div className="remove-close-icon">
                                <button type="submit" onClick={() => addToWishlist(wishlist.product.id, decodedUserToken)}>
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
