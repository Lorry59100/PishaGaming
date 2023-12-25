import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

export const useTokenService = () => {
  const { userToken, decodedUserToken, login, logout } = useContext(AuthContext);

  // Vous pouvez ajouter d'autres fonctions spécifiques au service ici si nécessaire

  return {
    userToken,
    decodedUserToken,
    login,
    logout,
  };
};
