import { useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastErrorWithLink, ToastSuccess } from "../services/ToastService";
import "react-toastify/dist/ReactToastify.css";
import "../assets/styles/components/verify-account.css"
import loader from "../assets/img/loader.gif"
import { useTokenService } from "../services/TokenService";

export function ChangeMailview() {
    const { token } = useParams();
    const isToastDisplayed = useRef(false);
    const navigate = useNavigate();
    const { logout, login } = useTokenService();
    console.log(token);
    const URL = import.meta.env.VITE_BACKEND;
    const URL_CHECK_MAIL = import.meta.env.VITE_CHECK_MAIL;
    const URL_HOME = import.meta.env.VITE_HOME;

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
    }, [token, navigate, login, logout, URL, URL_CHECK_MAIL, URL_HOME]);
    return (
    <div className="verify-account-container">
      <h2>Verification en cours...</h2>
      <img src={loader} alt="loader"/>
    </div>
    )
}
