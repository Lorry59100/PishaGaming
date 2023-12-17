import "../../../assets/styles/components/parameters.css"
import { PiUserBold } from 'react-icons/pi';
import { IconContext } from 'react-icons';
import { IoIosArrowForward } from "react-icons/io";
import { GiPadlockOpen } from "react-icons/gi";
import { BsGeoAlt } from "react-icons/bs";
import { useEffect, useState } from "react";
import { AddressForm } from "./AddressForm";
import { useAuth } from "../services/tokenService";
import axios from "axios";
import { URL, URL_GET_ADDRESS } from "../../../constants/urls/URLBack";
import { PiPencilSimpleLineFill } from 'react-icons/pi';
import { BsTrash3 } from "react-icons/bs";

export function Parameters() {
    const [activeTab, setActiveTab] = useState(0);
    const [isAddressFormVisible, setAddressFormVisible] = useState(false);
    const { decodedUserToken } = useAuth();
    const [addresses, setAddresses] = useState([]);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    const handleOpenAddressForm = () => {
        setAddressFormVisible(true);
      };
    
      const handleCloseAddressForm = () => {
        setAddressFormVisible(false);
      };

      /* console.log(decodedUserToken); */
      /* console.log(decodedUserToken.username); */
      useEffect(() => {
        if (decodedUserToken) {
          const headers = {
            'Authorization': `Bearer ${decodedUserToken.username}`,
            // autres en-têtes si nécessaire...
          };
      
          axios.get(`${URL}${URL_GET_ADDRESS}`, {headers})
            .then(response => {
                console.log(response.data);
                setAddresses(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des adresses :', error);
            });
        }
      }, [decodedUserToken]);

    return (
        <div className="parameters-container">
            <IconContext.Provider value={{ size: '4em'}}>
                <PiUserBold className='user-icon-circled user-icon-circled-big'/>
            </IconContext.Provider>
            <h1>gamer-c0a8e8</h1>
            <h4>Membre depuis : nov. 28, 2017</h4>
            <div className="cutline-form cutline-form-big"></div>
            <div className="tab-and-content-container">
            <div className="tab-container">
        <div className="tabs">
          <button className={`tab ${activeTab === 0 ? 'active' : ''}`} onClick={() => handleTabClick(0)}>
            <IconContext.Provider value={{ size: '1em'}}>
                <PiUserBold className='user-parameter-icon-circled' />
            </IconContext.Provider>
            <div className="mid-tab">
              <h3>Personnalisez votre profil</h3>
              <h4>Avatar & pseudonyme</h4>
            </div>
            <div className="arrow">
              <IoIosArrowForward size="1.5em" color="white" />
            </div>
          </button>
          <button className={`tab ${activeTab === 1 ? 'active' : ''}`} onClick={() => handleTabClick(1)}>
            <IconContext.Provider value={{ size: '1.5em'}}>
                <GiPadlockOpen className='parameter-icon' />
            </IconContext.Provider>
            <div className="mid-tab">
              <h3>Sécurité du compte</h3>
              <h4>Email & mot de passe</h4>
            </div>
            <div className="arrow">
              <IoIosArrowForward size="1.5em" color="white" />
            </div>
          </button>
          <button className={`tab ${activeTab === 2 ? 'active' : ''}`} onClick={() => handleTabClick(2)}>
            <IconContext.Provider value={{ size: '2em'}}>
                <BsGeoAlt className='parameter-icon' />
            </IconContext.Provider>
            <div className="mid-tab">
              <h3>Adresse de facturation & livraison</h3>
              <h4>Ajoutez ou modifiez vos adresses de facturation et livraison</h4>
            </div>
            <div className="arrow">
              <IoIosArrowForward size="1.5em" color="white" />
            </div>
          </button>
        </div>
      <div className="vertical-spacer"></div>
      </div>
      <div className="content-container">
        {/* Contenu en fonction de l'onglet actif */}
        {activeTab === 0 && (
          <div>
            <h1>1</h1>
          </div>
        )}
        {activeTab === 1 && (
          <div>
            <h1>2</h1>
          </div>
        )}
        {activeTab === 2 && (
          <div>
          <h2 className="active-tab-title">Mes adresses</h2>
          {addresses.map(address => (
            <div key={address.id} className='single-address-container'>
              <div>
                <h3>{decodedUserToken.lastname} {decodedUserToken.firstname}</h3>
                <button>
                <IconContext.Provider value={{ size: "1.5em", color: "white"}}>
                  <PiPencilSimpleLineFill/>
                </IconContext.Provider>
                </button>
                <h4>{address.housenumber} {address.street} {address.postcode} {address.city}</h4>
              </div>
              <button>
                <IconContext.Provider value={{ size: "1.5em", color: "white"}}>
                  <BsTrash3 />
                </IconContext.Provider>
              </button>
            </div>
          ))}
          <div className="address-btn-container">
            <button className="submit-button" onClick={handleOpenAddressForm}>
              Ajouter une adresse
            </button>
          </div>
          {isAddressFormVisible && (<AddressForm onClose={handleCloseAddressForm} />)}
        </div>
        )}
      </div>
            </div>
        </div>
    )
}
