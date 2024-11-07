import { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
/* import { URL, URL_SINGLE_PRODUCT, URL_PRODUCTS_LIST } from "../../constants/urls/URLBack"; */
import "../../assets/styles/components/gamestaffselection.css"
import { calculateDiscountPercentage, convertToEuros } from "./services/PriceServices";

export function GameStaffSelection() {
    const [games, setGames] = useState([]);
    const URL = import.meta.env.VITE_BACKEND;
    const URL_SINGLE_PRODUCT = import.meta.env.VITE_SINGLE_PRODUCT_BACK;
    const URL_PRODUCTS_LIST = import.meta.env.VITE_PRODUCTS_LIST;

    useEffect(() => {
        axios.get(`${URL}${URL_PRODUCTS_LIST}`)
            .then(response => {
                const productList = response.data.map(product => ({
                    ...product
                }));

                const filteredGames = productList.filter(product => {
                    const releaseYear = new Date(product.release.date).getFullYear();
                    const hasCategory = product.category && product.category.name === "Jeux Vidéos";
                    const hasEdition = product.edition && product.edition.name === "Standart";
                    return hasCategory && hasEdition && releaseYear >= 2000;
                });

                // Limiter le nombre de jeux à 9
                const limitedGames = filteredGames.slice(0, 9);
                setGames(limitedGames);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération de la liste de jeux :', error)
            });
    }, [URL, URL_PRODUCTS_LIST]);

    return (
        <div className='game-list-container game-list-container-first'>
            <h1 className="three-span">Notre Sélection</h1>
            {games.map(game => (
                <div key={game.id} className='game-container'>
                    <div className="game-card">
                        <Link to={`${URL_SINGLE_PRODUCT}/${game.id}`}>
                            <img src={`${URL}/uploads/images/products/videogames/main_img/${game.img}`} alt={game.name} />
                        </Link>
                        <div className="discount-label-cards">
                            <h5><strong>-</strong>{calculateDiscountPercentage(game.old_price, game.price)}</h5>
                        </div>
                    </div>
                    <div className="sub-title">
                        <h4>{game.name}</h4>
                        <h2>{convertToEuros(game.price)} €</h2>
                    </div>
                </div>
            ))}
        </div>
    )
}
