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
            // Filtrer les produits par catégorie et édition
            const filteredProducts = response.data.map(product => {
                const hasJeuxCategory = product.categorys.some(category => category.id === 1);
                const standardEdition = product.editions.find(edition => edition.edition_category === 'Standart Edition');
                // Vérifier s'il y a une édition Standart Edition
                if (hasJeuxCategory && standardEdition) {
                    return {
                        ...product,
                        editions: [standardEdition]
                    };
                }
                return null; // Retourner null pour les produits sans édition Standart Edition
            }).filter(product => product !== null); // Filtrer les produits non null
    
            // Choisir un produit au hasard parmi les produits filtrés
            const randomIndex = Math.floor(Math.random() * filteredProducts.length);
            const randomProduct = filteredProducts[randomIndex];
            console.log(randomProduct);
            setRandomProduct(randomProduct);
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
                        {randomProduct.editions.map(edition => (
                            <div key={edition.id}>
                                <div className="background-header" style={{ backgroundImage: `url(${edition.img})` }}></div>
                                <div className="random-game-content">
                                    <h1>{randomProduct.name}</h1>
                                    <div className="random-game-price">
                                        <div className="discount-label"> 
                                            <h4><strong>-</strong>{calculateDiscountPercentage(edition.old_price, edition.price)}</h4>
                                        </div>
                                        <h1>{convertToEuros(edition.price)} €</h1>
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
