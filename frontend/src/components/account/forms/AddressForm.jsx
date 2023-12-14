import React, { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { IconContext } from "react-icons";
import { getSuggestions, handleAddressChange, handleAddressClick } from "../services/addressServices";
import { URL, URL_ADD_ADDRESS } from "../../../constants/urls/URLBack";
import axios from "axios";
import { Formik, Form } from "formik";
import { useAuth } from "../services/tokenService";

export function AddressForm({ onClose }) {
    const [address, setAddress] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState();
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const { decodedUserToken } = useAuth();
    const handleCloseForm = () => {
        onClose();
    };

  /* Initialise les suggestions d'adresses lors du chargement de la page */
  useEffect(() => {
    getSuggestions(); 
  }, []);

  /* Met à jour les suggestions d'adresses en fonction de l'input utilisateur */
  const handleAddressInputChange = (e) => {
    const query = e.target.value;
    setSelectedSuggestion(query);
    handleAddressChange(query, setSelectedAddress, setSuggestions );
  };

  /* Mettre à jour l'adresse séléctionnée */
  const handleAddressItemClick = (selectedLabel) => {
    handleAddressClick(selectedLabel, suggestions, setSelectedSuggestion, setSelectedAddress, setSuggestions);
  };
  
  console.log('suggestion :', selectedSuggestion);
  /* console.log('addresse :', selectedAddress); */
  /* console.log('label :', selectedLabel); */

  const onSubmit = (values) => {
    if (decodedUserToken) {
      console.log(selectedSuggestion);
      console.log('Selected housenumber:', selectedSuggestion.properties.housenumber);
      axios.post(`${URL}${URL_ADD_ADDRESS}`, {
        email: decodedUserToken.username,
        housenumber: selectedSuggestion.properties.housenumber,
        street: selectedSuggestion.properties.street,
        postcode: selectedSuggestion.properties.postcode,
        city: selectedSuggestion.properties.city,
      })
      .then((response) => {
        console.log('Response data', response.data);
        if (response.status === 200) {
          console.log(response.data);
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
          <h1>Nouvelle addresse</h1>
          <IconContext.Provider value={{ size: "1.5em" }}>
            <ImCross onClick={handleCloseForm} />
          </IconContext.Provider>
        </div>
        <div className="address-input-container">
            <input type="text" name="address" placeholder="Entrez votre adresse" autoComplete="off" 
            onChange={(e) => handleAddressInputChange(e)} value={selectedAddress}/>
            { suggestions.length > 0 && (
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
        </div>
        <div className="btn-container btn-address-container">
            <button className="submit-button" type="submit"> Ajouter une adresse</button>
        </div>
      </Form>
      </Formik>
    </div>
  );
}
