import PropTypes from 'prop-types';
import "../../../assets/styles/components/parameters.css"
import "../../../assets/styles/components/toasts.css"
import { PiUserBold } from 'react-icons/pi';
import { IconContext } from 'react-icons';
import { IoIosArrowForward, IoMdAdd } from "react-icons/io";
import { GiPadlockOpen } from "react-icons/gi";
import { BsGeoAlt } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { AddressForm } from "./AddressForm";
import { useTokenService } from "../services/tokenService";
import axios from "axios";
import { URL, URL_CHANGE_MAIL, URL_CHANGE_PASSWORD, URL_GET_ADDRESS, URL_USER_AVATAR, URL_USER_CHANGE_PSEUDO, URL_USER_DATA, URL_USER_UPLOAD_IMG } from "../../../constants/urls/URLBack";
import { PiPencilSimpleLineFill } from 'react-icons/pi';
import { BsTrash3 } from "react-icons/bs";
import { Field, Form, Formik } from "formik";
import { ToastCenteredSuccess } from "../../services/toastService";
import { MdOutlineCameraAlt } from "react-icons/md";
import { useOutletContext } from "react-router-dom";
import { ImCross } from 'react-icons/im';
import { FaCheck, FaHouse } from "react-icons/fa6";

export function Parameters() {
    const [activeTab, setActiveTab] = useState(0);
    const [isAddressFormVisible, setAddressFormVisible] = useState(false);
    const [isAddressModalVisible, setAddressModalVisible] = useState(false);
    const { decodedUserToken } = useTokenService();
    const [addresses, setAddresses] = useState([]);
    const fileInputRef = useRef(null);
    const [userData, setUserData] = useState(null);
    const [newPseudo, setNewPseudo] = useState('');
    const { onPseudoChange } = useOutletContext();

    useEffect(() => {
        if (decodedUserToken) {
            const headers = {
                'Authorization': `Bearer ${decodedUserToken.username}`,
            };

            axios.get(`${URL}${URL_USER_DATA}`, { headers })
                .then(response => {
                    setUserData(response.data);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des adresses :', error);
                });
        }
    }, [decodedUserToken]);

    useEffect(() => {
        if (userData) {
            setNewPseudo(userData.pseudo);
        }
    }, [userData]);

    const handleIconClick = () => {
        fileInputRef.current.click();
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('img', file);

        const headers = {
            'Authorization': `Bearer ${decodedUserToken.username}`,
            'Content-Type': 'multipart/form-data',
        };

        axios.post(`${URL}${URL_USER_UPLOAD_IMG}`, formData, { headers })
            .then(response => {
                setUserData({ ...userData, img: response.data.img });
                window.location.reload();
            })
            .catch(error => {
                console.error('Erreur lors de l\'upload de l\'image :', error);
            });
    };

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    const handleOpenAddressForm = () => {
        setAddressFormVisible(true);
    };

    const handleCloseAddressForm = () => {
        setAddressFormVisible(false);
    };

    const handleAddressAdded = (newAddress) => {
        console.log('New address added:', newAddress); // Debug log
        setAddresses(prevAddresses => [...prevAddresses, newAddress]);
        setAddressFormVisible(false);
    };
    
    
    useEffect(() => {
        if (decodedUserToken) {
            const headers = {
                'Authorization': `Bearer ${decodedUserToken.username}`,
            };
    
            axios.get(`${URL}${URL_GET_ADDRESS}`, { headers })
                .then(response => {
                    const addresses = response.data;
                    // Ensure the response is an array
                    if (Array.isArray(addresses)) {
                        // Ensure only one address is active
                        addresses.forEach(addr => {
                            if (addr.isActive) {
                                addresses.forEach(otherAddr => {
                                    if (otherAddr.id !== addr.id) {
                                        otherAddr.isActive = false;
                                    }
                                });
                            }
                        });
                        setAddresses(addresses);
                    } else {
                        console.error('Invalid response format:', addresses);
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des adresses :', error);
                });
        }
    }, [decodedUserToken]);
    
    

    useEffect(() => {
        console.log('Addresses updated:', addresses); // Debug log
    }, [addresses]);
    

    const handleEmailFormSubmit = (values, actions) => {
        const { mail, mail_confirm, password } = values;
        const headers = {
            'Authorization': `Bearer ${decodedUserToken.username}`,
        };
        axios.post(`${URL}${URL_CHANGE_MAIL}`, { mail, mail_confirm, password }, { headers })
            .then(response => {
                console.log('Email form submitted successfully:', response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la soumission du formulaire email :', error);
            })
            .finally(() => {
                actions.setSubmitting(false);
            });
    };

    const handlePasswordFormSubmit = (values, actions) => {
        const { password, newPassword, passwordConfirm } = values;
        const headers = {
            'Authorization': `Bearer ${decodedUserToken.username}`,
        };
        axios.post(`${URL}${URL_CHANGE_PASSWORD}`, { password, newPassword, passwordConfirm }, { headers })
            .then(response => {
                ToastCenteredSuccess(response.data.message);
                console.log('Password form submitted successfully:', response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la soumission du formulaire email :', error);
            })
            .finally(() => {
                actions.setSubmitting(false);
            });
    };

    const handlePseudoFormSubmit = () => {
        const headers = {
            'Authorization': `Bearer ${decodedUserToken.username}`,
        };
        axios.post(`${URL}${URL_USER_CHANGE_PSEUDO}`, { pseudo: newPseudo }, { headers })
            .then(response => {
                ToastCenteredSuccess(response.data.message);
                console.log('Pseudo form submitted successfully:', response.data);
                onPseudoChange(newPseudo);
            })
            .catch(error => {
                console.error('Erreur lors de la soumission du formulaire pseudo :', error);
            });
    };

    const handleEditAddressClick = () => {
        setAddressModalVisible(true);
    };

    const handleAddressSelect = (address) => {
        const headers = {
            'Authorization': `Bearer ${decodedUserToken.username}`,
            'Content-Type': 'application/json',
        };
    
        axios.put(`${URL}/change-address`, { addressId: address.id }, { headers })
            .then(response => {
                console.log('Address changed successfully:', response.data);
                setAddressModalVisible(false);
                // Update the active address in the state
                setAddresses(addresses.map(addr => ({
                    ...addr,
                    isActive: addr.id === address.id
                })));
            })
            .catch(error => {
                console.error('Erreur lors du changement d\'adresse :', error);
            });
    };    

    const deleteAddressSelect = (address) => {
        const headers = {
            'Authorization': `Bearer ${decodedUserToken.username}`,
        };
    
        axios.delete(`${URL}/delete-address`, {
            headers: headers,
            data: { addressId: address.id }
        })
        .then(response => {
            console.log('Address deleted successfully:', response.data);
            // Log the updated addresses
            console.log('Updated addresses:', response.data);
    
            // Ensure the response is an array
            if (Array.isArray(response.data)) {
                // Update the active address in the state
                setAddresses(response.data);
            } else {
                console.error('Invalid response format:', response.data);
            }
        })
        .catch(error => {
            console.error('Erreur lors de la suppression de l\'adresse :', error);
        });
    };
    
    
    return (
        <div className="tab-and-content-container">
            <div className="tab-container">
                <div className="tabs">
                    <button className={`tab ${activeTab === 0 ? 'active' : ''}`} onClick={() => handleTabClick(0)}>
                        <IconContext.Provider value={{ size: '1em' }}>
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
                        <IconContext.Provider value={{ size: '1.5em' }}>
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
                        <IconContext.Provider value={{ size: '2em' }}>
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
                {activeTab === 0 && (
                    <div className="profile-update-container">
                        <div className="profile-picture-upload">
                            <h3>Photo de profil</h3>
                            {userData && userData.img ? (
                                <div className="profile-picture-container" onClick={handleIconClick}>
                                    <img src={`${URL}${URL_USER_AVATAR}${userData.img}`} alt="User Image" className="user-img-circled-navbar" />
                                    <IconContext.Provider value={{ size: "2em" }}>
                                        <MdOutlineCameraAlt />
                                    </IconContext.Provider>
                                    <h5>.png .jpg</h5>
                                </div>
                            ) : (
                                <div className="profile-picture-container" onClick={handleIconClick}>
                                    <IconContext.Provider value={{ size: '2em' }}>
                                        <PiUserBold className='user-icon-circled' />
                                    </IconContext.Provider>
                                    <IconContext.Provider value={{ size: "2em" }}>
                                        <MdOutlineCameraAlt />
                                    </IconContext.Provider>
                                    <h5>.png .jpg</h5>
                                </div>
                            )}
                        </div>
                        <div className="profile-pseudo-update">
                            <h3>Pseudonyme</h3>
                            <input type="text" className="pseudo-input" value={newPseudo} onChange={(e) => setNewPseudo(e.target.value)} />
                            <button className="submit-button" type="button" onClick={handlePseudoFormSubmit}>Envoyer</button>
                        </div>
                    </div>
                )}
                {activeTab === 1 && (
                    <div className="parameter-forms-container">
                        <div className="title-security-container">
                            <h2>Sécurité du compte</h2>
                            <h4>{decodedUserToken.username}</h4>
                        </div>
                        <div className="security-forms-container">
                            <Formik initialValues={{ mail: '', mail_confirm: '', password: '' }} onSubmit={handleEmailFormSubmit}>
                                <Form className="email-form-container">
                                    <h3>Changer votre adresse mail</h3>
                                    <Field className="security-form-field" type="text" name="mail" placeholder="Nouvelle adresse email" />
                                    <Field className="security-form-field" type="text" name="mail_confirm" placeholder="Confirmation de votre nouvelle adresse email" />
                                    <Field className="security-form-field" type="password" name="password" placeholder="Votre mot de passe actuel :" />
                                    <div className="submit-button-container"><button className="submit-button" type="submit">Valider</button></div>
                                </Form>
                            </Formik>
                            <div className="security-forms-vertical-spacer"></div>
                            <Formik initialValues={{ password: '', newPassword: '', passwordConfirm: '' }} onSubmit={handlePasswordFormSubmit}>
                                <Form className="password-form-container">
                                    <h3>Changer votre mot de passe</h3>
                                    <Field className="security-form-field" type="password" name="password" placeholder="Votre mot de passe actuel :" />
                                    <Field className="security-form-field" type="password" name="newPassword" placeholder="Mot de passe" />
                                    <Field className="security-form-field" type="password" name="passwordConfirm" placeholder="Confirmation" />
                                    <div className="submit-button-container"><button className="submit-button" type="submit">Valider</button></div>
                                </Form>
                            </Formik>
                        </div>
                    </div>
                )}
                {activeTab === 2 && (
                    <div>
                        <h2 className="active-tab-title">Adresse de facturation & livraison</h2>
                        {addresses.find(address => address.isActive) && (
                            <div className="single-address-container">
                                <div>
                                    <h3>{decodedUserToken.lastname} {decodedUserToken.firstname}</h3>
                                    <button onClick={handleEditAddressClick}>
                                        <IconContext.Provider value={{ size: "1.5em", color: "white" }}>
                                            <PiPencilSimpleLineFill />
                                        </IconContext.Provider>
                                    </button>
                                </div>
                                <h4>{addresses.find(address => address.isActive).housenumber} {addresses.find(address => address.isActive).street} {addresses.find(address => address.isActive).postcode} {addresses.find(address => address.isActive).city}</h4>
                            </div>
                        )}
                        <div className="address-btn-container">
                            {!addresses.find(address => address.isActive) && (
                                <button className="submit-button" onClick={handleOpenAddressForm}>
                                    Créer une adresse
                                </button>
                            )}
                        </div>
                        {isAddressFormVisible && (<AddressForm onClose={handleCloseAddressForm} onAddressAdded={handleAddressAdded} />)}
                        {isAddressModalVisible && (
                            <div className="address-modal">
                                <div className="address-modal-content">
                                    <div className='modal-head-container'>
                                        <button className="close-button" onClick={() => setAddressModalVisible(false)}>
                                            <IconContext.Provider value={{ size: "1.5em", color: "white" }}>
                                                <ImCross/>
                                            </IconContext.Provider>
                                        </button>
                                    </div>
                                        <h1>Vos adresses de facturation & livraison</h1>
                                    {addresses.map(address => (
                                        <div key={address.id} className="single-address-container">
                                            <h3>{decodedUserToken.lastname} {decodedUserToken.firstname}</h3>
                                            <h4>{address.housenumber} {address.street} {address.postcode} {address.city}</h4>
                                            <div>
                                                    {address.isActive ? (
                                                        <button>
                                                            <IconContext.Provider value={{ size: "1.5em", color: "green" }}>
                                                                <FaCheck />
                                                            </IconContext.Provider>
                                                        </button>
                                                        ) : (
                                                        <button onClick={() => handleAddressSelect(address)}>
                                                            <IconContext.Provider value={{ size: "1.5em", color: "white" }}>
                                                                <FaHouse />
                                                            </IconContext.Provider>
                                                        </button>
                                                    )}
                                                        <button onClick={() => deleteAddressSelect(address)}>
                                                            <IconContext.Provider value={{ size: "1.5em", color: "white" }}>
                                                                <BsTrash3 />
                                                            </IconContext.Provider>
                                                        </button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className='submit-address-container'>
                                        <button className="submit-button add-address-btn" onClick={handleOpenAddressForm}>
                                            <IconContext.Provider value={{ size: "1.5em", color: "white" }}>
                                                <IoMdAdd />
                                            </IconContext.Provider>
                                            Créer une nouvelle adresse
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
        </div>
    );
}

Parameters.propTypes = {
    onPseudoChange: PropTypes.func.isRequired,
};

Parameters.defaultProps = {
    onPseudoChange: () => {},
};
