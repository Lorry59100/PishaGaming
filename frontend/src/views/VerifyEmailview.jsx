import { useEffect, useRef } from "react";
import axios from "axios";
import { URL, URL_ACCOUNT_ACTIVATION } from "../constants/urls/URLBack";
import { useParams } from "react-router-dom";

export function VerifyEmailview() {
    const flag = useRef(false);
    const { token } = useParams();
    console.log(token);

    useEffect(() => {
        const handleCheckEmail = async () => {
          if (flag.current === false) {
            try {
              const response = await axios.post(`${URL}${URL_ACCOUNT_ACTIVATION}`, {token: token});
              console.log('Response data', response.data);
              if (response.status === 200) {
                console.log(response);
              }
            } catch (error) {
              console.error('Erreur lors de la récupération des données :', error);
            } finally {
              flag.current = true;
            }
          }
        };
    
        handleCheckEmail();
      }, [token]);

  return (
    <div>
      <h3>Verification en cours...</h3>
    </div>
  )
}
