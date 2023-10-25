import logo from "../../assets/img/Logo.png"
import { SiTrustpilot } from 'react-icons/si';
import { BiLogoDiscordAlt, BiLogoTwitter, BiLogoInstagram, BiLogoFacebook, BiLogoYoutube, BiLogoTwitch } from 'react-icons/bi';
import { BsApple, BsFillGeoAltFill, BsCurrencyExchange } from 'react-icons/bs';
import { LuLanguages } from 'react-icons/lu';
import { BiGift } from 'react-icons/bi';
import { GiNotebook } from 'react-icons/gi';
import { FaGooglePlay } from 'react-icons/fa6';
import { IconContext } from "react-icons";
import "../../assets/styles/components/footer.css"

export function Footer() {
    
    return (
        <footer className='footer'>
            <div className="footer-main-container">
                <div className="logos">
                    <div className="logo-footer">
                    <img src={logo} alt="logo" className='orange-logo'/>
                        <h3>Pisha  <br /> Gaming</h3>
                    </div>
                    <div className="trustpilot">
                        <div className="trustpilot-title-container">
                            <IconContext.Provider value={{ size: "2em", color:"#00B67A" }}>
                            <SiTrustpilot/>
                            </IconContext.Provider>
                            <h3>DoNotTrustpilot</h3>
                        </div>
                        <div className="trustpilot-stars-container">
                        <IconContext.Provider value={{ size: "1.2em", color:"white" }}>
                            <div className="star-container">
                                <SiTrustpilot/>
                            </div>
                            <div className="star-container">
                                <SiTrustpilot/>
                            </div>
                            <div className="star-container">
                                <SiTrustpilot/>
                            </div>
                            <div className="star-container">
                                <SiTrustpilot/>
                            </div>
                            <div className="star-container">
                                <SiTrustpilot/>
                            </div>
                        </IconContext.Provider>
                        </div>
                        
                    </div>
                </div>
                <div className="footer-links">
                    <ul>
                        <li>Les conditions de vente</li>
                        <li>Politique de confidentialité</li>
                        <li>Nous contacter</li>
                        <li>FAQ</li>
                        <li className='li-icons'>
                            <IconContext.Provider value={{ size: "1.5em", color:"#ff5400" }}>
                                <BiGift/>
                            </IconContext.Provider>
                                Utiliser une Carte Cadeau
                        </li>
                        <li className='li-icons'>
                            <IconContext.Provider value={{ size: "1.5em", color:"#ff5400" }}>
                                <GiNotebook/>
                            </IconContext.Provider>
                            Retrouve les dernières actus jeu vidéo
                        </li>
                    </ul>
                </div>
                <div className="medias">
                    <div className="media-icons">
                        <a href="/" className='discord'>
                            <IconContext.Provider value={{ size: "2.5em" }}>
                                <BiLogoDiscordAlt />
                            </IconContext.Provider>
                        </a>
                        <a href="/" className='twitter'>
                            <IconContext.Provider value={{ size: "2.5em" }}>
                                <BiLogoTwitter />
                            </IconContext.Provider>
                        </a>
                        <a href="/" className='instagram'>
                            <IconContext.Provider value={{ size: "2.5em" }}>
                                <BiLogoInstagram />
                            </IconContext.Provider>
                        </a>
                        <a href="/" className='facebook'>
                            <IconContext.Provider value={{ size: "2.5em" }}>
                                <BiLogoFacebook />
                            </IconContext.Provider>
                        </a>
                        <a href="/" className='youtube'>
                            <IconContext.Provider value={{ size: "2.5em" }}>
                                <BiLogoYoutube />
                            </IconContext.Provider>
                        </a>
                        <a href="/" className='twitch'>
                            <IconContext.Provider value={{ size: "2.5em" }}>
                                <BiLogoTwitch />
                            </IconContext.Provider>
                        </a>
                    </div>
                    <div className="media-dl">
                        <button className='download-btn'>
                        <IconContext.Provider value={{ size: "1.3em", color:"white" }}>
                            <BsApple/>
                            <div className="dl-text">
                                <p>Available on the</p>
                                <h4>App Store</h4>
                            </div>
                        </IconContext.Provider>
                        </button>
                        <button className='download-btn'>
                        <IconContext.Provider value={{ size: "1.3em", color:"white" }}>
                            <FaGooglePlay/>
                            <div className="dl-text">
                                <p>GET IT ON</p>
                                <h4>Google Play</h4>
                            </div>
                        </IconContext.Provider>
                        </button>
                    </div>
                </div>
            </div>

            <div className="cutline"></div>

            <div className="infos">
                <div className="copyright">
                    <h5>Copyright © 2023 Pisha Gaming - Not all rights reserved</h5>
                </div>
                <div className="locale-info">
                    <BsFillGeoAltFill/>
                    France
                    <div className="white-spacer"></div>
                    <LuLanguages/>
                    Français
                    <div className="white-spacer"></div>
                    <BsCurrencyExchange/>
                    EUR
                </div>
            </div>
            
        </footer>
    )
}

export default Footer
