import PropTypes from 'prop-types';
import "../../../assets/styles/components/testform.css"
import { IconContext } from "react-icons";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { useEffect, useState, useRef, useCallback } from "react";
import { useTokenService } from "../services/tokenService";
import axios from "axios";
import { URL, URL_GET_TEST, URL_SUBMIT_TEST, URL_UPDATE_TEST, URL_USER_AVATAR, URL_USER_DATA } from "../../../constants/urls/URLBack";

export function TestForm({ onClose, productId, testExist, onSubmit }) {
    const [userData, setUserData] = useState(null);
    const [rating, setRating] = useState('');
    const [description, setDescription] = useState('');
    const [pros, setPros] = useState(['', '', '']);
    const [cons, setCons] = useState(['', '', '']);
    const { decodedUserToken } = useTokenService();
    const formRef = useRef(null);
    console.log('testExist from form component: ', testExist)

    useEffect(() => {
        console.log('useEffect triggered');
        console.log('decodedUserToken:', decodedUserToken);
        if (decodedUserToken) {
            const headers = {'Authorization': `Bearer ${decodedUserToken.username}`};
            axios.get(`${URL}${URL_USER_DATA}`, {headers})
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des adresses :', error);
            });
        }

        if (testExist) {
            console.log('url appelée : ',  `${URL}${URL_GET_TEST.replace(':id', productId)}`)
            // Faire une requête pour récupérer les données du test existant
            axios.get(`${URL}${URL_GET_TEST.replace(':id', productId)}`, {headers: {'Authorization': `Bearer ${decodedUserToken.username}`}})
            .then(response => {
                const testData = response.data;
                console.log('testData: ', testData)
                setRating(testData.rate);
                setDescription(testData.comment);

                // Assurez-vous que les tableaux pros et cons ont toujours 3 éléments
                const positivePoints = testData.positivePoints || [];
                const negativePoints = testData.negativePoints || [];

                setPros([...positivePoints, ...Array(3 - positivePoints.length).fill('')]);
                setCons([...negativePoints, ...Array(3 - negativePoints.length).fill('')]);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données du test :', error);
            });
        }
    }, [decodedUserToken, testExist, productId]);

    const handleClose = useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    const submitTest = () => {
        const data = {
            productId,
            rating,
            description,
            pros,
            cons
        };

        const headers = {'Authorization': `Bearer ${decodedUserToken.username}`};

        if (testExist) {
            // Mettre à jour le test existant
            axios.put(`${URL}${URL_UPDATE_TEST.replace(':id', productId)}`, data, { headers })
                .then(response => {
                    console.log('Test updated successfully:', response.data);
                    handleClose();
                    onSubmit();
                })
                .catch(error => {
                    console.error('Erreur lors de la mise à jour du test :', error);
                });
        } else {
            // Soumettre un nouveau test
            axios.post(`${URL}${URL_SUBMIT_TEST}`, data, { headers })
                .then(response => {
                    console.log('Test submitted successfully:', response.data);
                    handleClose();
                    onSubmit();
                })
                .catch(error => {
                    console.error('Erreur lors de la soumission du test :', error);
                });
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                handleClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClose]); // Ajoutez handleClose ici

    return (
        <div className="test-form-container" ref={formRef}>
            <div className="close" onClick={handleClose}>
                <IconContext.Provider value={{ size: '1em'}}>
                    <ImCross />
                </IconContext.Provider>
            </div>
            <div className="test-form">
                <div className="avatar">
                    {userData && userData.img ? (
                        <img src={`${URL}${URL_USER_AVATAR}${userData.img}`} alt="User Image" className="user-img-circled-test-form"/>
                    ) : (
                        <div>Loading...</div>
                    )}
                </div>
                <h2>Rédige ton test</h2>
                <p>Afin d'orienter les autres utilisateurs, vous pouvez écrire votre propre opinion sur ce jeu, et dire ce que vous avez aimé ou non.</p>
                <div className="notation">
                    <h2>Note (entre 0 et 20)</h2>
                    <input
                        type="number"
                        className="user-rate-input"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                    />
                </div>
                <textarea
                    className="desc-container"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="points-fields-container">
                    <div className="pros">
                        <div className="pros-head">
                            <IconContext.Provider value={{ size: '1.2em', color: 'green'}}>
                                <FaCheck />
                            </IconContext.Provider>
                            <h3>Points postifs (facultatif)</h3>
                        </div>
                        {pros.map((pro, index) => (
                            <input
                                key={index}
                                type="text"
                                className="point-input"
                                value={pro}
                                onChange={(e) => {
                                    const newPros = [...pros];
                                    newPros[index] = e.target.value;
                                    setPros(newPros);
                                }}
                            />
                        ))}
                    </div>
                    <div className="cons">
                        <div className="cons-head">
                            <IconContext.Provider value={{ size: '1.2em', color: 'red'}}>
                                <ImCross />
                            </IconContext.Provider>
                            <h3>Points négatifs (facultatif)</h3>
                        </div>
                        {cons.map((con, index) => (
                            <input
                                key={index}
                                type="text"
                                className="point-input"
                                value={con}
                                onChange={(e) => {
                                    const newCons = [...cons];
                                    newCons[index] = e.target.value;
                                    setCons(newCons);
                                }}
                            />
                        ))}
                    </div>
                </div>
                <button className='submit-button' onClick={submitTest}>Soumettre mon test</button>
            </div>
        </div>
    )
}

TestForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    productId: PropTypes.string.isRequired,
    testExist: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
};
