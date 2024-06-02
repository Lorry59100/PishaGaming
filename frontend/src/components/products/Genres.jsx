import { useEffect, useState } from 'react';
import axios from 'axios';
import "../../assets/styles/components/genres.css"
import { URL, URL_GENRES_LIST } from "../../constants/urls/URLBack";
import { Link } from 'react-router-dom';

function Genres() {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    // Récupérer la liste des genres à partir de l'API
    axios.get(`${URL}${URL_GENRES_LIST}`)
      .then(response => {
        // Mélanger le tableau de genres
        const shuffled = response.data.sort(() => Math.random() - 0.5);
        // Sélectionner les 9 premiers éléments du tableau mélangé
        const selected = shuffled.slice(0, 9);
        // Mettre à jour l'état local avec la liste des genres sélectionnés
        setGenres(selected);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div className='genres-container'>
      <h1 className='three-span'>Genres</h1>
      {genres.map(genre => (
        <Link to={`/order`} key={genre.name} className='genre-container'>
          <img src={`/src/assets/img/genres/background/${genre.name}.jpg`} alt="" className='genre-background' />
          <img src={`/src/assets/img/genres/chara/${genre.name}.png`} alt="" className='genre-chara' />
          <h2 className='genre-name'>{genre.name}</h2>
        </Link>
      ))}
    </div>
  )
}

export default Genres
