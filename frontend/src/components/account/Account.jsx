import "../../assets/styles/components/parameters.css";
import { PiUserBold } from "react-icons/pi";
import { IconContext } from "react-icons";
import { MdOutlineSettings } from "react-icons/md";
import { Link, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Parameters } from "./forms/Parameters";
import OrderHistoric from "./OrderHistoric";
import { Tests } from "./Tests";
import { Wishlist } from "./Wishlist";
import axios from "axios";
import { useEffect, useState } from "react";
import { LoginAndRegisterForm } from "./forms/LoginAndRegisterForm";
import { useTokenService } from "../../services/TokenService";

function Account() {
  const location = useLocation();
  const { decodedUserToken, login } = useTokenService();
  const [userData, setUserData] = useState(null);
  const [showLoginAndRegisterForm, setShowLoginAndRegisterForm] = useState(false);
  const URL = import.meta.env.VITE_BACKEND;
  const URL_ACCOUNT = import.meta.env.VITE_ACCOUNT;
  const URL_ORDER_HISTORIC = import.meta.env.VITE_ORDER_HISTORIC;
  const URL_PARAMETERS = import.meta.env.VITE_PARAMETERS;
  const URL_TESTS = import.meta.env.VITE_TESTS;
  const URL_WISHLIST = import.meta.env.VITE_WISHLIST;
  const URL_IMG = import.meta.env.VITE_IMG;
  const URL_USER_DATA = import.meta.env.VITE_USER_DATA;

  useEffect(() => {
    if (decodedUserToken) {
      const headers = {
        'Authorization': `Bearer ${decodedUserToken.username}`,
        // autres en-têtes si nécessaire...
      };

      axios.get(`${URL}${URL_USER_DATA}`, { headers })
        .then(response => {
          setUserData(response.data);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des adresses :', error);
        });
    }
  }, [decodedUserToken, URL, URL_USER_DATA]);

  const handleLoginButtonClick = () => {
    setShowLoginAndRegisterForm(!showLoginAndRegisterForm);
  };

  const handleCloseForm = () => {
    setShowLoginAndRegisterForm(false);
  };

  const handlePseudoChange = (newPseudo) => {
    setUserData(prevUserData => ({
      ...prevUserData,
      pseudo: newPseudo
    }));
  };

  if (!decodedUserToken) {
    return (
      <div className="forbidden">
        <h3>Vous devez être connecté pour accéder à cette page.</h3>
        <button className="submit-button" type="button" onClick={handleLoginButtonClick}>Se connecter</button>
        {showLoginAndRegisterForm && <LoginAndRegisterForm login={login} onCloseForm={handleCloseForm} />}
      </div>
    );
  }

  return (
    <div className="account-container">
      <div className="parameters-container">
        {userData && (
          <div className="user-info-container">
            {!userData.img && (
              <IconContext.Provider value={{ size: "4em" }}>
                <PiUserBold className="user-icon-circled user-icon-circled-big" />
              </IconContext.Provider>
            )}
            {userData.img && (
              <img src={`${URL}${URL_IMG}/${userData.img}`} alt="User Image" className="user-img-circled" />
            )}
            <h1>{userData.pseudo}</h1>
            <h4>Membre depuis : nov. 28, 2017</h4>
          </div>
        )}
        <div className="links-selector">
          <div className="main-links">
            <Link to={`${URL_ACCOUNT}${URL_ORDER_HISTORIC}`} className={location.pathname === `${URL_ACCOUNT}${URL_ORDER_HISTORIC}` ? "active" : ""}>
              <span>Mes achats</span>
              <div className="active-link-line"></div>
            </Link>
            <Link to={`${URL_ACCOUNT}${URL_WISHLIST}`} className={location.pathname === `${URL_ACCOUNT}${URL_WISHLIST}` ? "active" : ""}>
              <span>Wishlist</span>
              <div className="active-link-line"></div>
            </Link>
            <Link to={`${URL_ACCOUNT}${URL_TESTS}`} className={location.pathname === `${URL_ACCOUNT}${URL_TESTS}` ? "active" : ""}>
              <span>Tests</span>
              <div className="active-link-line"></div>
            </Link>
          </div>
          <div className="parameters-link">
            <Link to={`${URL_ACCOUNT}${URL_PARAMETERS}`} className={location.pathname === `${URL_ACCOUNT}${URL_PARAMETERS}` ? "active" : ""}>
              <IconContext.Provider value={{ size: "1.5em" }}>
                <MdOutlineSettings />
              </IconContext.Provider>
              <span>Paramètres</span>
              <div className="active-parameters-line"></div>
            </Link>
          </div>
        </div>
        <div className="cutline-form cutline-form-big cutline-form-margin"></div>
        <Outlet context={{ onPseudoChange: handlePseudoChange }} />
      </div>
    </div>
  );
}

export default function AccountPage() {
  const URL_ACCOUNT = import.meta.env.VITE_ACCOUNT;
  const URL_ORDER_HISTORIC = import.meta.env.VITE_ORDER_HISTORIC;
  const URL_PARAMETERS = import.meta.env.VITE_PARAMETERS;
  const URL_TESTS = import.meta.env.VITE_TESTS;
  const URL_WISHLIST = import.meta.env.VITE_WISHLIST;
  return (
    <Routes>
      <Route path={URL_ACCOUNT} element={<Account />}>
        <Route path={`${URL_ACCOUNT}${URL_ORDER_HISTORIC}`} element={<OrderHistoric />} />
        <Route path={`${URL_ACCOUNT}${URL_WISHLIST}`} element={<Wishlist />} />
        <Route path={`${URL_ACCOUNT}${URL_TESTS}`} element={<Tests />} />
        <Route path={`${URL_ACCOUNT}${URL_PARAMETERS}`} element={<Parameters />} />
      </Route>
    </Routes>
  );
}
