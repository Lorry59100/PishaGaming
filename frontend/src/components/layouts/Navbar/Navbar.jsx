import { useState, useEffect } from 'react'
import { TiShoppingCart } from 'react-icons/ti';
import { PiUserBold } from 'react-icons/pi';
import { IconContext } from "react-icons";
import logo from "../../../assets/img/Logo.png"
import Searchbar from './Searchbar';
import "../../../assets/styles/components/navbar.css"

function Navbar() {
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
          // Ajoute ou retire la classe 'center-menu' en fonction de la position de défilement
          setMenuClass(atTop ? '' : 'center-menu');
        }
      };
  
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [scrolled, isVisible, isAtTop]);

  return (
    <div className={`navbar ${scrolled ? 'scrolled' : ''} ${isVisible ? 'visible' : 'hidden'} ${isAtTop ? 'at-top' : ''}`}>
      <div className="logo">
        <a href=""><img src={logo} alt="logo" className='orange-logo'/></a>
        <h3>Pisha Gaming</h3>
      </div>
      <div className={`menu ${menuClass}`}>
        <div className="links">
          <a href="/">Tendances</a>
          <a href="/">Précommandes</a>
          <a href="/">Prochaines sorties</a>
          <a href="/">Support 24/7</a>
        </div>
        <Searchbar/>
      </div>

      {/* Icônes droite de la navbar */}
      <div className="cart-profile">
          <IconContext.Provider value={{ size: "2em" }}>
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
              <li>
                <a href="/">Déconnexion</a>
              </li>
            </ul>
          </div>
          )}
      </div>
    </div>
  )
}

export default Navbar