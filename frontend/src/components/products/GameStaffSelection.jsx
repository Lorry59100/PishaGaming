import { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { URL, URL_SINGLE_PRODUCT ,URL_PRODUCTS_LIST } from "../../constants/urls/URLBack";
import "../../assets/styles/components/gamestaffselection.css"
import { calculateDiscountPercentage, convertToEuros } from "./services/PriceServices";
export function GameStaffSelection() {
    const [games, setGames] = useState([]);
    useEffect(() => {
        axios.get(`${URL}${URL_PRODUCTS_LIST}`)
        .then(response => {
            const productList = response.data.map(product => ({
                ...product
            }));
            const filteredGames = productList.filter(product => {
                const releaseYear = new Date(product.release.date).getFullYear();
                const hasCategory = product.category && product.category.name === "Jeux vidéo";
                const hasEdition = product.edition && product.edition.name === "Standart";
                return hasCategory && hasEdition && releaseYear >= 2000;
            });
            setGames(filteredGames);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération de la liste de jeux :', error)
            });
    }, []);
  return (
    <div className='game-list-container game-list-container-first'>
        <h1 className="three-span">Notre Séléction</h1>
    {games.map(game => (
        <div key={game.id} className='game-container'>
            <div className="game-card">
                <Link to={`${URL_SINGLE_PRODUCT}/${game.id}`}><img src={game.img} alt={game.name} /></Link>
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
