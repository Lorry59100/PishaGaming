import { useState, useEffect } from 'react';
import { TiShoppingCart } from 'react-icons/ti';
import { PiUserBold } from 'react-icons/pi';
import { IconContext } from 'react-icons';
import logo from '../../../assets/img/Logo.png';
import Searchbar from './Searchbar';
import '../../../assets/styles/components/navbar.css';
import { useAuth } from '../../account/services/tokenService';
import { URL, URL_ADMIN } from '../../../constants/urls/URLBack';
import { Link } from 'react-router-dom';

function Navbar() {
  const { userToken, decodedUserToken, logout } = useAuth();
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [menuClass, setMenuClass] = useState('');

  const toggleProfileVisibility = () => {
    setIsProfileVisible(!isProfileVisible);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }

      const shouldShowLinks = window.scrollY === 0;
      if (shouldShowLinks !== isVisible) {
        setIsVisible(shouldShowLinks);
      }

      const atTop = window.scrollY === 0;
      if (atTop !== isAtTop) {
        setIsAtTop(atTop);
        setMenuClass(atTop ? '' : 'center-menu');
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible, isAtTop, userToken, scrolled]);

  return (
    <div className={`navbar ${scrolled ? 'scrolled' : ''} ${isVisible ? 'visible' : 'hidden'} ${isAtTop ? 'at-top' : ''}`}>
      
      <div className="logo">
        <a href=""><img src={logo} alt="logo" className="orange-logo" /></a>
        <h3>Pisha Gaming</h3>
      </div>
      <div className={`menu ${menuClass}`}>
        <div className="links">
          <a href="/">Tendances</a>
          <a href="/">Précommandes</a>
          <a href="/">Prochaines sorties</a>
          <a href="/">Support 24/7</a>
        </div>
        <Searchbar />
      </div>

      <div className="cart-profile">
        <IconContext.Provider value={{ size: '2em' }}>
          <a href="/"><TiShoppingCart /></a>
          <button onClick={toggleProfileVisibility}><PiUserBold /></button>
        </IconContext.Provider>

        {isProfileVisible && (
          <div className="profile-content">
            <ul>
              <li>
                <a href="/">Paramètres</a>
              </li>
              <li>
                <a href="/">Achats</a>
              </li>
              <li>
                <a href="/">Wishlist</a>
              </li>
              {decodedUserToken && (
              <div className='user-panel-connected'>
                <li>
                  <a href="/" onClick={logout}>Déconnexion</a>
                </li>
                {decodedUserToken.roles.includes('ROLE_ADMIN') && (
                    <li>
                      <Link to={`${URL}${URL_ADMIN}`}>Admin</Link>
                    </li>
                  )}
              </div>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
