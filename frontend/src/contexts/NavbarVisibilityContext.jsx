import { createContext, useState } from 'react';
import PropTypes from 'prop-types'; // Importer PropTypes

const NavbarVisibilityContext = createContext();

const NavbarVisibilityProvider = ({ children }) => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const hideNavbar = () => {
    setIsNavbarVisible(false);
  };

  const showNavbar = () => {
    setIsNavbarVisible(true);
  };

  return (
    <NavbarVisibilityContext.Provider value={{ isNavbarVisible, hideNavbar, showNavbar }}>
      {children}
    </NavbarVisibilityContext.Provider>
  );
};

NavbarVisibilityProvider.propTypes = {
  children: PropTypes.node.isRequired, // Validation de type pour children
};

export { NavbarVisibilityContext, NavbarVisibilityProvider };