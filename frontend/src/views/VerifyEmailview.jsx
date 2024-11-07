import { useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastErrorWithLink, ToastSuccess } from "../components/services/toastService";
import "react-toastify/dist/ReactToastify.css";
import "../assets/styles/components/verify-account.css"
import loader from "../assets/img/loader.gif"

export function VerifyEmailview() {
    const { token } = useParams();
    const isToastDisplayed = useRef(false);
    const navigate = useNavigate();
    console.log(token);
    const URL = import.meta.env.VITE_BACKEND;
    const URL_ACCOUNT_ACTIVATION = import.meta.env.VITE_ACCOUNT_ACTIVATION;
    const URL_HOME = import.meta.env.VITE_HOME;

    useEffect(() => {
      const handleCheckEmail = async () => {
        try {
          const response = await axios.post(`${URL}${URL_ACCOUNT_ACTIVATION}`, { token: token });  
          if (!isToastDisplayed.current) {
            if (response.status === 200 && response.data.message) {
              ToastSuccess(response.data.message);
              navigate(URL_HOME)
            } else if (response.data.error) {
              ToastErrorWithLink(response.data.error, "en cliquant ici", "http://localhost:5173/resend-activation-token");
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
    }, [token, navigate, URL, URL_ACCOUNT_ACTIVATION, URL_HOME]);

  return (
    <div className="verify-account-container">
      <h2>Verification en cours...</h2>
      <img src={loader} alt="loader"/>
    </div>
  )
}
