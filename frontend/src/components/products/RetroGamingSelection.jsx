import { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { URL, URL_PRODUCTS_LIST, URL_SINGLE_PRODUCT } from "../../constants/urls/URLBack";
import "../../assets/styles/components/gamestaffselection.css"
import { calculateDiscountPercentage, convertToEuros } from "./services/PriceServices";
export function RetroGamingSelection() {
    const [games, setGames] = useState([]);
    useEffect(() => {
        axios.get(`${URL}${URL_PRODUCTS_LIST}`)
            .then(response => {
                const gamesList = response.data.map(game => ({
                    ...game
                }));

                // Filtrer les jeux dont la release est comprise entre 1970 et 1999
                const filteredGames = gamesList.filter(game => {
                    const releaseYear = new Date(game.release.date).getFullYear();
                    return releaseYear >= 1970 && releaseYear <= 1999;
                });
                setGames(filteredGames);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération de la liste de jeux :', error)
            });
    }, []);
  return (
    <div className='game-list-container'>
        <h1 className="three-span">Rétro Gaming</h1>
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
