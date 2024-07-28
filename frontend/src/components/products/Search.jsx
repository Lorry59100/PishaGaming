import axios from "axios";
import { useEffect, useState } from "react";
import { URL, URL_GENRES_LIST, URL_PLATFORMS_LIST, URL_PRODUCTS_LIST, URL_SINGLE_PRODUCT } from "../../constants/urls/URLBack";
import { Link, useLocation } from "react-router-dom";
import { calculateDiscountPercentage, convertToEuros } from "./services/PriceServices";
import "../../assets/styles/components/gamestaffselection.css"
import "../../assets/styles/components/search.css"
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { IconContext } from "react-icons";
import { FaChevronDown } from "react-icons/fa";

function Search() {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 21;

  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');

  const [platforms, setPlatforms] = useState([]);
  const [genres, setGenres] = useState([]);

  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    axios.get(`${URL}${URL_PRODUCTS_LIST}`)
      .then(response => {
        const productList = response.data.map(product => ({
          ...product,
          platforms: product.platforms || [],
        }));
        setGames(productList);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération de la liste de jeux :', error)
      });
  }, []);

  useEffect(() => {
    axios.get(`${URL}${URL_PLATFORMS_LIST}`)
      .then(response => {
        setPlatforms(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération de la liste des plateformes :', error)
      });
  }, []);

  useEffect(() => {
    axios.get(`${URL}${URL_GENRES_LIST}`)
      .then(response => {
        setGenres(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération de la liste des genres :', error)
      });
  }, []);

  useEffect(() => {
    let filtered = games;
    // Définir les filtres à appliquer
    const filters = [
        { type: 'searchQuery', value: searchQuery },
        { type: 'selectedPlatform', value: selectedPlatform },
        { type: 'selectedGenre', value: selectedGenre }
    ];
    // Appliquer chaque filtre si nécessaire
    filters.forEach(filter => {
        if (filter.value) {
            switch (filter.type) {
                case 'searchQuery':
                    filtered = filtered.filter(game =>
                        game.name.toLowerCase().includes(filter.value.toLowerCase())
                    );
                    break;
                case 'selectedPlatform':
                    if (filter.value !== "default-value") {
                        filtered = filtered.filter(game =>
                            game.platforms.some(platform => platform.id === parseInt(filter.value, 10))
                        );
                    }
                    break;
                case 'selectedGenre':
                    if (filter.value !== "default-value") {
                        filtered = filtered.filter(game =>
                            game.genres.some(genre => genre.id === parseInt(filter.value, 10))
                        );
                    }
                    break;
                default:
                    break;
            }
        }
    });
    setFilteredGames(filtered);
    setCurrentPage(1); // Réinitialiser la page courante sur 1
}, [searchQuery, selectedPlatform, selectedGenre, games]);

  // Calculer l'index de départ et de fin pour les produits à afficher
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredGames.slice(indexOfFirstProduct, indexOfLastProduct);

  // Fonction pour changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
    <div className='game-list-container'>
            <div className="form-search">
                <div className="form-search-select-container">
                    <select className="form-search-select" value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)}>
                        <option value="default-value">Plateformes</option>
                        {platforms.map(platform => (
                          <option key={platform.id} value={platform.id}>{platform.name}</option>
                        ))}
                    </select>
                    <span className="select-arrow"><FaChevronDown /></span>
                </div>
                <div className="form-search-select-container">
                    <select className="form-search-select" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                        <option value="default-value">Genres</option>
                        {genres.map(genre => (
                          <option key={genre.id} value={genre.id}>{genre.name}</option>
                        ))}
                    </select>
                    <span className="select-arrow"><FaChevronDown /></span>
                </div>
            </div>
            {currentProducts.map(game => (
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
      {/* Boutons de navigation pour la pagination */}
      {filteredGames.length > productsPerPage && (
        <div className="pagination">
          <button className="pagination-btn" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            <IconContext.Provider value={{ size: "4em" }}>
              <MdNavigateBefore className={currentPage === 1 ? "icon-disabled" : "icon-white"} />
            </IconContext.Provider>
          </button>
          <span>Page {currentPage} </span>
          <button className="pagination-btn" onClick={() => paginate(currentPage + 1)} disabled={indexOfLastProduct >= filteredGames.length}>
            <IconContext.Provider value={{ size: "4em" }}>
              <MdNavigateNext className={indexOfLastProduct >= filteredGames.length ? "icon-disabled" : "icon-white"} />
            </IconContext.Provider>
          </button>
        </div>
      )}
    </div>
  )
}

export default Search
