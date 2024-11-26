import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { IconContext } from "react-icons";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import { getSuggestions, handleAddressChange, handleAddressClick } from '../../../services/AddressServices';
import { useTokenService } from '../../../services/TokenService';

export function AddressForm({ onClose, onAddressAdded }) {
    const [suggestions, setSuggestions] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState();
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const { decodedUserToken } = useTokenService();
    const URL = import.meta.env.VITE_BACKEND
    const URL_ADD_ADDRESS = import.meta.env.VITE_ADD_ADDRESS

    const handleCloseForm = () => {
        onClose();
    };

    useEffect(() => {
        getSuggestions();
    }, []);

    const handleAddressInputChange = (e) => {
        const query = e.target.value;
        setSelectedSuggestion(query);
        handleAddressChange(query, setSelectedAddress, setSuggestions);
    };

    const handleAddressItemClick = (selectedLabel) => {
        handleAddressClick(selectedLabel, suggestions, setSelectedSuggestion, setSelectedAddress, setSuggestions);
    };

    const onSubmit = (values) => {
        if (decodedUserToken) {
            const street = selectedSuggestion.properties.street || selectedSuggestion.properties.locality;
            axios.post(`${URL}${URL_ADD_ADDRESS}`, {
                email: decodedUserToken.username,
                housenumber: selectedSuggestion.properties.housenumber,
                street: street,
                postcode: selectedSuggestion.properties.postcode,
                city: selectedSuggestion.properties.city,
                firstname: values.firstname,
                lastname: values.lastname,
            })
            .then((response) => {
                if (response.status === 200) {
                    onAddressAdded(response.data.data); // Notifier le composant parent
                }
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des données :', error);
            });
        } else {
            console.error('decodedUserToken is null. Unable to make the request.');
        }
    };

    return (
        <div className="address-form-overlay">
            <Formik initialValues={{ address: "" }} onSubmit={onSubmit}>
                <Form className="address-form-container">
                    <div className="address-form-head">
                        <h1>Nouvelle adresse</h1>
                        <IconContext.Provider value={{ size: "1.5em" }}>
                            <ImCross onClick={handleCloseForm} />
                        </IconContext.Provider>
                    </div>
                    <div className="address-input-container">
                        <input type="text" name="address" placeholder="Entrez votre adresse" autoComplete="off"
                            onChange={(e) => handleAddressInputChange(e)} value={selectedAddress}/>
                        {suggestions.length > 0 && (
                            <ul className="address-suggestions-container">
                                {suggestions.map((suggestion) => (
                                    <li key={suggestion.properties.id} onClick={() => handleAddressItemClick(suggestion.properties.label)}>
                                        <div>
                                            {suggestion.properties.label}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className='address-user-info-container'>
                            <Field type="text" name="firstname" placeholder="Prénom" />
                            <Field type="text" name="lastname" placeholder="Nom" />
                        </div>
                    </div>
                    <div className="btn-container btn-address-container">
                        <button className="submit-button" type="submit"> Ajouter une adresse</button>
                    </div>
                </Form>
            </Formik>
        </div>
    );
}

AddressForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onAddressAdded: PropTypes.func.isRequired,
};
