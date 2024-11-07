import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { calculateDiscountPercentage, convertToEuros } from "./services/PriceServices";
import "../../assets/styles/components/gamestaffselection.css"
import "../../assets/styles/components/search.css"
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { IconContext } from "react-icons";
import { FaChevronDown, FaTimes } from "react-icons/fa";

function Search() {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 21;

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const [platforms, setPlatforms] = useState([]);
  const [genres, setGenres] = useState([]);

  const [selectedPlatform, setSelectedPlatform] = useState(searchParams.get('platform') || "default-value");
  const [selectedGenres, setSelectedGenres] = useState(searchParams.getAll('genre') || []);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "default-value");
  const [minPrice, setMinPrice] = useState(parseInt(searchParams.get('minPrice')) || 0);
  const [maxPrice, setMaxPrice] = useState(parseInt(searchParams.get('maxPrice')) || 500);
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || "default-value");
  const searchQuery = searchParams.get('q') || "";

  const URL = import.meta.env.VITE_BACKEND;
  const URL_GENRES_LIST = import.meta.env.VITE_GENRES_LIST;
  const URL_MAIN_IMG = import.meta.env.VITE_MAIN_IMG;
  const URL_PLATFORMS_LIST = import.meta.env.VITE_PLATFORMS_LIST;
  const URL_PRODUCTS_LIST = import.meta.env.VITE_PRODUCTS_LIST;
  const URL_SINGLE_PRODUCT = import.meta.env.VITE_SINGLE_PRODUCT_BACK;

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
  }, [URL, URL_PRODUCTS_LIST]);

  useEffect(() => {
    axios.get(`${URL}${URL_PLATFORMS_LIST}`)
      .then(response => {
        setPlatforms(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération de la liste des plateformes :', error)
      });
  }, [URL, URL_PLATFORMS_LIST]);

  useEffect(() => {
    axios.get(`${URL}${URL_GENRES_LIST}`)
      .then(response => {
        setGenres(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération de la liste des genres :', error)
      });
  }, [URL, URL_GENRES_LIST]);

  useEffect(() => {
    let filtered = games;
    const filters = [
      { type: 'searchQuery', value: searchQuery },
      { type: 'selectedPlatform', value: selectedPlatform },
      { type: 'selectedGenres', value: selectedGenres },
      { type: 'selectedCategory', value: selectedCategory },
      { type: 'priceRange', value: { minPrice, maxPrice } }
    ];
  
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
          case 'selectedGenres':
            if (filter.value.length > 0) {
              filtered = filtered.filter(game =>
                filter.value.every(genreName =>
                  game.genres.some(genre => genre.name.toLowerCase() === genreName.toLowerCase())
                )
              );
            }
            break;
          case 'selectedCategory':
            if (filter.value !== "default-value") {
              filtered = filtered.filter(game =>
                game.category.name === filter.value
              );
            }
            break;
          case 'priceRange':
            filtered = filtered.filter(game =>
              game.price >= filter.value.minPrice * 100 && game.price <= filter.value.maxPrice * 100
            );
            break;
          default:
            break;
        }
      }
    });
  
    if (selectedSort === "asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (selectedSort === "date-asc") {
      filtered.sort((a, b) => new Date(a.release.date) - new Date(b.release.date));
    } else if (selectedSort === "date-desc") {
      filtered.sort((a, b) => new Date(b.release.date) - new Date(a.release.date));
    }
  
    setFilteredGames(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedPlatform, selectedGenres, selectedCategory, minPrice, maxPrice, selectedSort, games]);
  
  // Mettre à jour l'URL lorsque les filtres changent
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedPlatform !== "default-value") params.set('platform', selectedPlatform);
    selectedGenres.forEach(genre => params.append('genre', genre.toLowerCase()));
    if (selectedCategory !== "default-value") params.set('category', selectedCategory);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (selectedSort !== "default-value") params.set('sort', selectedSort);
  
    navigate({ search: params.toString() });
  }, [searchQuery, selectedPlatform, selectedGenres, selectedCategory, minPrice, maxPrice, selectedSort, navigate]);
  
  // Calculer l'index de départ et de fin pour les produits à afficher
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredGames.slice(indexOfFirstProduct, indexOfLastProduct);

  // Fonction pour changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getGenreDisplayName = (genreName) => {
    const genre = genres.find(g => g.name.toLowerCase() === genreName.toLowerCase());
    return genre ? genre.name : genreName;
  };
  
  // Fonction pour gérer la sélection des genres
  const handleGenreChange = (e) => {
    const genreName = e.target.value;
    setSelectedGenres(prevSelectedGenres =>
      prevSelectedGenres.includes(genreName)
        ? prevSelectedGenres.filter(name => name !== genreName)
        : [...prevSelectedGenres, genreName]
    );
  };
  
  const removeGenre = (genreName) => {
    setSelectedGenres(prevSelectedGenres => prevSelectedGenres.filter(name => name !== genreName));
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setSelectedPlatform("default-value");
    setSelectedGenres([]);
    setSelectedCategory("default-value");
    setMinPrice(0);
    setMaxPrice(500);
    setSelectedSort("default-value");
  };

  // Fonction pour gérer le clic sur "Voir les sorties récentes"
  const handleRecentReleasesClick = () => {
    resetFilters();
    setSelectedSort("date-desc");
  };

  return (
    <div className='game-list-container'>
      <div className="form-search">
        <div className="form-search-select-container">
          <select className="form-search-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="default-value">Catégories</option>
            <option value="Jeux Vidéos">Jeux Vidéos</option>
            <option value="Hardware">Hardware</option>
          </select>
          <span className="select-arrow"><FaChevronDown /></span>
        </div>
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
          <select className="form-search-select" value="" onChange={handleGenreChange}>
            <option value="">Genres</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.name}>{genre.name}</option>
            ))}
          </select>
          <span className="select-arrow"><FaChevronDown /></span>
        </div>
        <div className="form-search-price-container">
          <label>
            <span className="label-text">Entre</span>
            <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          </label>
          <label>
            <span className="label-text">Et</span>
            <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            <span className="label-text-last">€</span>
          </label>
          <div className="vertical-medium-spacer"></div>
          <div className="order-result-container">
            <select className="form-order-results" value={selectedSort} onChange={(e) => setSelectedSort(e.target.value)}>
              <option value="default-value">Trier par</option>
              <option value="asc">Prix croissant</option>
              <option value="desc">Prix décroissant</option>
              <option value="date-desc">Sorties : récentes</option>
              <option value="date-asc">Sorties : anciennes</option>
            </select>
            <span className="select-order-arrow"><FaChevronDown /></span>
          </div>
          <div className="vertical-medium-spacer"></div>
          <button className="reset-filters-btn" onClick={resetFilters}>
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      <div className="selected-genres-container">
  {selectedGenres.map(genreName => (
    <div key={genreName} className="selected-genre">
      <span className="remove-genre" onClick={() => removeGenre(genreName)}>
        <h5>{getGenreDisplayName(genreName)}</h5>
        <FaTimes />
      </span>
    </div>
  ))}
</div>


{filteredGames.length === 0 ? (
        <div className="no-results">
          <h3>Désolé, aucun résultat n'a été trouvé.</h3>
          <h4>Il semble que nous n'ayons aucun jeu correspondant à votre recherche</h4>
          <button className="submit-button" type="submit" onClick={handleRecentReleasesClick}>
            Voir les sorties récentes
          </button>
        </div>
      ) : (
        currentProducts.map(game => (
          <div key={game.id} className='game-container'>
            <div className="game-card">
              <Link to={`${URL_SINGLE_PRODUCT}/${game.id}`}><img src={`${URL}${URL_MAIN_IMG}/${game.img}`} alt={game.name} /></Link>
              <div className="discount-label-cards">
                <h5><strong>-</strong>{calculateDiscountPercentage(game.old_price, game.price)}</h5>
              </div>
            </div>
            <div className="sub-title">
              <h4>{game.name}</h4>
              <h2>{convertToEuros(game.price)} €</h2>
            </div>
          </div>
        ))
      )}
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
