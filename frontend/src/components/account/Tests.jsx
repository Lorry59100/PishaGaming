import { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/components/tests.css";
import RatingCircle from "../products/RatingCircle";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import { IconContext } from "react-icons";
import { useNavigate } from 'react-router-dom';
import { useTokenService } from "../../services/TokenService";

// Fonction utilitaire pour tronquer le texte
const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

export function Tests() {
    const { decodedUserToken } = useTokenService();
    const [tests, setTests] = useState([]);
    const navigate = useNavigate();
    const URL = import.meta.env.VITE_BACKEND;
    const URL_MAIN_IMG = import.meta.env.VITE_MAIN_IMG;
    const URL_USER_TESTS = import.meta.env.VITE_USER_TESTS;
    const URL_SINGLE_PRODUCT = import.meta.env.VITE_SINGLE_PRODUCT_FRONT;

    useEffect(() => {
        if (decodedUserToken) {
        const headers = {
            'Authorization': `Bearer ${decodedUserToken.username}`,
            // autres en-têtes si nécessaire...
        };
            axios.get(`${URL}${URL_USER_TESTS}`, {headers})
            .then(response => {
                setTests(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des adresses :', error);
            });
        }
    }, [decodedUserToken, URL, URL_USER_TESTS]);

    return (
        <div className="user-tests-container">
            <h1>{tests.length} test(s) trouvé(s)</h1>
            <div className="tests-grid">
                {tests.map(test => (
                    <div key={test.id} className="test-user-item">
                        <img src={`${URL}${URL_MAIN_IMG}/${test.img}`} alt={test.id} />
                        <RatingCircle singleRating={test.rate} />
                        <h5 className="test-desc">{truncateText(test.comment, 200)}</h5>
                        <button className='submit-button user-test-btn' onClick={() => navigate(`${URL_SINGLE_PRODUCT.replace(':id', test.productId)}`, { state: { editTest: true } })}>
                            <h4>Editer mon avis</h4>
                            <IconContext.Provider value={{ size: "1em"}}>
                                <PiPencilSimpleLineFill/>
                            </IconContext.Provider>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
