import { useEffect, useRef } from "react";
import axios from "axios";
import { URL, URL_CHECK_MAIL } from "../constants/urls/URLBack";
import { useNavigate, useParams } from "react-router-dom";
import { ToastErrorWithLink, ToastSuccess } from "../components/services/toastService";
import "react-toastify/dist/ReactToastify.css";
import "../assets/styles/components/verify-account.css"
import loader from "../assets/img/loader.gif"
import { URL_HOME } from "../constants/urls/URLFront";
import { useAuth } from "../components/account/services/tokenService";

export function ChangeMailview() {
    const { token } = useParams();
    const isToastDisplayed = useRef(false);
    const navigate = useNavigate();
    const { logout, login } = useAuth();
    console.log(token);

    useEffect(() => {
      const handleCheckEmail = async () => {
        try {
          const response = await axios.post(`${URL}${URL_CHECK_MAIL}`, { token: token });
          console.log('Response data', response.data);
  
          if (!isToastDisplayed.current) {
            if (response.status === 200 && response.data.message) {
              // Traitement réussi
              console.log(response.data.message);
              ToastSuccess(response.data.message);
              //Déconnecter l'user
              logout();
              setTimeout(() => {
                window.location.href = URL_HOME;
              }, 8000);
            } else if (response.data.error) {
              ToastErrorWithLink(response.data.error, "En cliquant ici", "http://localhost:5173/parameters");
              isToastDisplayed.current = true; // Marquer le toast comme déjà affiché
              navigate(URL_HOME)
            } else {
              // Autres cas non traités
              console.error('Réponse inattendue du serveur', response);
            }
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données :', error);
        }
      };
  
      handleCheckEmail();
    }, [token, navigate, login, logout]);
    return (
    <div className="verify-account-container">
      <h2>Verification en cours...</h2>
      <img src={loader} alt="loader"/>
    </div>
    )
}
