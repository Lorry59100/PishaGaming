import { useState, useEffect } from 'react';
import { decodeToken } from 'react-jwt';

export const useAuth = () => {
  const [userToken, setUserToken] = useState(null);
  const [decodedUserToken, setDecodedUserToken] = useState(null);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setUserToken(token);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUserToken(null);
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

  return {
    userToken,
    decodedUserToken,
    login,
    logout,
  };
};
