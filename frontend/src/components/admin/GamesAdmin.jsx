import { useState, useEffect } from "react";
import { URL, URL_PRODUCTS_LIST } from "../../constants/urls/URLBack";
import axios from 'axios';
import { convertToEuros } from "../products/services/PriceServices";
import { format } from "date-fns";
import {fr} from "date-fns/locale"
import {FaTrash} from "react-icons/fa"
import {FiEdit} from "react-icons/fi"
import { Link } from "react-router-dom"

export function GamesAdmin() {
const [games, setGames] = useState([]);

useEffect(() => {
    axios
      .get(`${URL}${URL_PRODUCTS_LIST}`)
      .then((response) => {
        console.log(response.data);
        // Filtrer les jeux ayant la catégorie "Jeux"
        const gamesFilter = response.data.filter(
          (product) =>
            product.categorys &&
            product.categorys.some((category) => category.id === 1)
        );
        setGames(gamesFilter);
        console.log(gamesFilter);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération de la liste de jeux :", error);
      });
  }, []);
  

  return (
    <div className="contenu1">
      <div className="title-admin-container">
        <h1>Jeux</h1>
      </div>
                <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Img</th>
                        <th>Développeur</th>
                        <th>Editeur</th>
                        <th>Date de sortie</th>
                        <th>Edition</th>
                        <th>Prix</th>
                        <th>Raw</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game) => (
                        game.editions.map((edition) => (
                            <tr key={`${game.id}-${edition.id}-${edition.edition_category}`}>
                                <td>{game.name}</td>
                                <td className="img-cell-container"><img src={edition.img} alt={`${game.name}-${edition.edition_category}`}/></td>
                                <td>{game.dev}</td>
                                <td>{game.editor}</td>
                                <td>{format(new Date(game.release.date), 'dd MMMM yyyy', {locale: fr})}</td>
                                <td key={edition.id}>{edition.edition_category}</td>
                                <td>{convertToEuros(edition.price)} €</td>
                                <td>{convertToEuros(edition.old_price)} €</td>
                                <td>{edition.stock}</td>
                                <td className="action-cell-container">
                                 <Link><FiEdit className="edit-icon"/></Link>
                                 <Link><FaTrash/></Link>
                                </td>
                                {console.log(edition)}
                            </tr>
                        ))
                    ))}
                </tbody>
          </table>
            </div>
  )
}
