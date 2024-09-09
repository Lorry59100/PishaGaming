import { useEffect, useState } from "react";
import { useTokenService } from "./services/tokenService";
import axios from "axios";
import { URL, URL_USER_TESTS } from "../../constants/urls/URLBack";
import "../../assets/styles/components/tests.css";
import RatingCircle from "../products/RatingCircle";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import { IconContext } from "react-icons";
import { useNavigate } from 'react-router-dom';

export function Tests() {
    const { decodedUserToken } = useTokenService();
    const [tests, setTests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (decodedUserToken) {
          const headers = {
            'Authorization': `Bearer ${decodedUserToken.username}`,
            // autres en-têtes si nécessaire...
          };

          axios.get(`${URL}${URL_USER_TESTS}`, {headers})
            .then(response => {
                console.log(response.data);
                setTests(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des adresses :', error);
            });
        }
      }, [decodedUserToken]);

      console.log(tests);

    return (
        <div className="user-tests-container">
            <h1>{tests.length} test(s) trouvé(s)</h1>
            <div className="tests-grid">
                {tests.map(test => (
                    <div key={test.id} className="test-user-item">
                        <img src={test.img} alt={test.id} />
                        <RatingCircle singleRating={test.rate} />
                        <h5>{test.comment}</h5>
                        <button className='submit-button user-test-btn' onClick={() => navigate(`/single-product/${test.productId}`, { state: { editTest: true } })}>
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
