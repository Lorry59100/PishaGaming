import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Importer PropTypes

const NavbarVisibilityContext = createContext();

const NavbarVisibilityProvider = ({ children }) => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const hideNavbar = () => {
    setIsNavbarVisible(false);
  };

  const showNavbar = () => {
    setIsNavbarVisible(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <NavbarVisibilityContext.Provider value={{ isNavbarVisible, hideNavbar, showNavbar, scrolled, setScrolled }}>
      {children}
    </NavbarVisibilityContext.Provider>
  );
};

NavbarVisibilityProvider.propTypes = {
  children: PropTypes.node.isRequired, // Validation de type pour children
};

export { NavbarVisibilityContext, NavbarVisibilityProvider };
