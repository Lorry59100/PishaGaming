import { useState, useEffect } from "react";
import axios from 'axios';
import { URL, URL_PRODUCTS_LIST } from "../../constants/urls/URLBack";
import "../../assets/styles/components/gamebanner.css"
import { convertToEuros, calculateDiscountPercentage } from "./services/PriceServices";

function GameBanner() {
    const [randomProduct, setRandomProduct] = useState(null);

    useEffect(() => {
        axios.get(`${URL}${URL_PRODUCTS_LIST}`)
            .then(response => {
                console.log(response.data);
                // Récupérer la liste des produits directement
                const productList = response.data;
                console.log(productList);
                // Mettre à jour l'état avec la liste des produits
                setRandomProduct(productList);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération de la liste de jeux :', error)
            });
    }, []);
    

    return (
        <div className="game-banner-container">
            <div className="background-header-container">
                {randomProduct && (
                    <div className='random-game-container'>
                        {randomProduct.map(product => (
                            <div key={product.id}>
                                <div className="background-header" style={{ backgroundImage: `url(${product.img})` }}></div>
                                <div className="random-game-content">
                                    <h1>{product.name}</h1>
                                    <div className="random-game-price">
                                        <div className="discount-label"> 
                                            <h4><strong>-</strong>{calculateDiscountPercentage(product.old_price, product.price)}</h4>
                                        </div>
                                        <h1>{convertToEuros(product.price)} €</h1>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
    
}

export default GameBanner;
