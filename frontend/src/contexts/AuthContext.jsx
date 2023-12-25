import { createContext, useState, useEffect } from 'react';
import { decodeToken } from 'react-jwt';
import PropTypes from 'prop-types';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [decodedUserToken, setDecodedUserToken] = useState(null);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setUserToken(token);
  
    // Mettre à jour decodedUserToken ici
    try {
      const decodedToken = decodeToken(token);
      setDecodedUserToken(decodedToken);
    } catch (error) {
      console.error('Erreur lors du décodage du token :', error);
    }
  };

  const logout = () => {
  localStorage.removeItem('authToken');
  setUserToken(null);
  setDecodedUserToken(null); // Assurez-vous que decodedUserToken est mis à null lors de la déconnexion
};

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');

    if (storedToken !== userToken) {
      setUserToken(storedToken);

      if (storedToken) {
        try {
          const decodedToken = decodeToken(storedToken);
          setDecodedUserToken(decodedToken);
        } catch (error) {
          console.error('Erreur lors du décodage du token :', error);
        }
      }
    }
  }, [userToken]);

  return (
    <AuthContext.Provider value={{ userToken, decodedUserToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

/* export const useAuth = () => useContext(AuthContext); */
export { AuthContext, AuthProvider };
