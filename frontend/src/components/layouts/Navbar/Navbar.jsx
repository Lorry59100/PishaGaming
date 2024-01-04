import { useState, useEffect, useRef } from 'react';
import { TiShoppingCart } from 'react-icons/ti';
import { PiUserBold } from 'react-icons/pi';
import { IconContext } from 'react-icons';
import logo from '../../../assets/img/Logo.png';
import Searchbar from './Searchbar';
import '../../../assets/styles/components/navbar.css';
import { useTokenService } from '../../account/services/tokenService';
import { URL, URL_ADMIN, URL_USER_ORDER } from '../../../constants/urls/URLBack';
import { Link } from 'react-router-dom';
import { LoginAndRegisterForm } from '../../account/forms/LoginAndRegisterForm';
import { NavbarVisibilityContext } from '../../../contexts/NavbarVisibilityContext';
import { useContext } from 'react';
import { URL_CART, URL_HOME, URL_PARAMETERS } from '../../../constants/urls/URLFront';
import { CartContext } from '../../../contexts/CartContext';

function Navbar() {
  const { userToken, decodedUserToken, logout, login } = useTokenService();
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [menuClass, setMenuClass] = useState('');
  const [showLoginAndRegisterForm, setShowLoginAndRegisterForm] = useState(false);
  const { isNavbarVisible } = useContext(NavbarVisibilityContext);
  const { cart, resetCart } = useContext(CartContext);
  const itemCount = cart ? cart.reduce((total, item) => total + item.quantity, 0) : 0;
  const profileContentRef = useRef(null);

  const toggleProfileVisibility = () => {
    if (!userToken) {
      setShowLoginAndRegisterForm(!showLoginAndRegisterForm);
    } else {
      setIsProfileVisible(!isProfileVisible);
      setShowLoginAndRegisterForm(false); // Formulaire masqué lorsqu'on ouvre le profil
    }
  };

  const handleLoginButtonClick = () => {
    setShowLoginAndRegisterForm(!showLoginAndRegisterForm);
    setIsProfileVisible(false); // Profil est masqué lors de la tentative de connexion
  };

  const handleLogoutButtonClick = () => {
    setIsProfileVisible(false); // Profil est masqué lors de la déconnexion
    logout();
    resetCart();
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
  }, [isVisible, isAtTop, userToken, scrolled, decodedUserToken]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileContentRef.current &&
        !profileContentRef.current.contains(event.target) &&
        !event.target.classList.contains('user-icon-circled')
      ) {
        // Click outside of profile content, close it
        setIsProfileVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileContentRef]);
  

  const handleLinkClick = () => {
    // Close the profile content when clicking on a link
    setIsProfileVisible(false);
  };

  return (
    // Utilisation de la condition isNavbarVisible pour rendre la Navbar visible ou non
    isNavbarVisible && (
      <div className={`navbar ${showLoginAndRegisterForm ? '' : (scrolled ? 'scrolled' : '')} ${isVisible ? 'visible' : 'hidden'} ${isAtTop ? 'at-top' : ''}`}>
        
        <div className="logo">
        <Link to={`${URL_HOME}`}><img src={logo} alt="logo" className="orange-logo" />
          <h3>Pisha Gaming</h3></Link>
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
        
        <div className='profile-container'>
          <div className="cart-profile">
            <IconContext.Provider value={{ size: '2em' }}>
              <Link to={`${URL_CART}`}><TiShoppingCart /></Link>
              { itemCount > 0 && (
                <div className='cart-number-items-container'>
                  {itemCount}
                </div>
              )}
              {!decodedUserToken && (
                <button onClick={handleLoginButtonClick}><PiUserBold /></button>
              )}
              {decodedUserToken && (
                <button onClick={toggleProfileVisibility}>
                  <IconContext.Provider value={{ size: '2em'}}>
                    <PiUserBold className='user-icon-circled'/>
                  </IconContext.Provider>
                </button>
              )}
            </IconContext.Provider>
            {userToken && isProfileVisible && (
              <div className="profile-content" ref={profileContentRef}>
                <ul>
                  <li>
                    <Link to={`${URL_PARAMETERS}`} onClick={handleLinkClick}>Paramètres</Link>
                  </li>
                  <li>
                  <Link to={`${URL_USER_ORDER}`} onClick={handleLinkClick}>Achats</Link>
                  </li>
                  <li>
                  <Link to={`${URL_USER_ORDER}`} onClick={handleLinkClick}>Wishlist</Link>
                  </li>
                  {decodedUserToken && (
                    <div className='user-panel-connected'>
                      <li>
                      <Link to={URL_HOME} onClick={handleLogoutButtonClick}>Déconnexion</Link>
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
            {!userToken && showLoginAndRegisterForm && <LoginAndRegisterForm login={login} onCloseForm={() => setShowLoginAndRegisterForm(false)} />}
          </div>
        </div>
      </div>
    )
  );
}

export default Navbar;
