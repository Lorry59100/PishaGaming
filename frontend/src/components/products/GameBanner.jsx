import { useState, useEffect } from "react";
import axios from 'axios';
import { URL, URL_PRODUCTS_LIST, URL_SINGLE_PRODUCT } from "../../constants/urls/URLBack";
import "../../assets/styles/components/gamebanner.css"
import { convertToEuros, calculateDiscountPercentage } from "./services/PriceServices";
import { Link } from 'react-router-dom';

function GameBanner() {
    const [randomProduct, setRandomProduct] = useState(null);

    useEffect(() => {
        axios.get(`${URL}${URL_PRODUCTS_LIST}`)
        .then(response => {
            const productList = response.data;
            const filteredProducts = productList.filter(product => {
                const hasCategory = product.category && product.category.name === "Jeux Vidéos";
                const hasEdition = product.edition && product.edition.name === "Standart";
                return hasCategory && hasEdition;
            });
                    const randomIndex = Math.floor(Math.random() * filteredProducts.length);
                    const randomProduct = filteredProducts[randomIndex];
                    setRandomProduct(randomProduct);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération de la liste de jeux :', error)
            });
    }, []);

    return (
        <div className="game-banner-container">
            <Link to={`${URL_SINGLE_PRODUCT}/${randomProduct?.id}`}>
            <div className="background-header-container">
                {randomProduct && (
                    <div className='random-game-container'>
                        <div key={randomProduct.id}>
                            <div className="background-header" style={{ backgroundImage: `url(${URL}/uploads/images/products/videogames/main_img/${randomProduct.img})` }}></div>
                            <div className="random-game-content">
                                <h1>{randomProduct.name}</h1>
                                <div className="random-game-price">
                                    <div className="discount-label"> 
                                        <h4><strong>-</strong>{calculateDiscountPercentage(randomProduct.old_price, randomProduct.price)}</h4>
                                    </div>
                                    <h1>{convertToEuros(randomProduct.price)} €</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            </Link>
        </div>
    );
    
}

export default GameBanner;
