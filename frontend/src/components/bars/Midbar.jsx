import { IconContext } from "react-icons";
import { SlCloudDownload } from 'react-icons/sl';
import { BsShieldCheck } from 'react-icons/bs';
import { SiTrustpilot } from 'react-icons/si';
import { PiWechatLogoLight } from 'react-icons/pi';
import "../../assets/styles/components/midbar.css"
import "../../assets/styles/components/button.css"

export function Midbar() {
  return (
    <div className='midbar-container'>
        <div className="feature-container">
            <div className="feature-icon">
                <IconContext.Provider value={{ size: "3em"}}>
                    <SlCloudDownload/>
                </IconContext.Provider>
            </div>
            <div className="feature-content">
                <h2>Ultra rapide</h2>
                <h5>Téléchargement instantané</h5>
            </div>
        </div>

        <div className="white-spacer"></div>
        
        <div className="feature-container">
            <div className="feature-icon">
                <IconContext.Provider value={{ size: "3em"}}>
                    <BsShieldCheck/>
                </IconContext.Provider>
            </div>
            <div className="feature-content">
                <h2>Fiable et sûr</h2>
                <h5>Plus de 10,000 jeux</h5>
            </div>
        </div>

        <div className="white-spacer"></div>

        <div className="feature-container">
            <div className="feature-icon">
                <IconContext.Provider value={{ size: "4em"}}>
                    <PiWechatLogoLight/>
                </IconContext.Provider>
            </div>
            <div className="feature-content">
                <h2>Service client</h2>
                <h5>Conseillers disponibles 24/7</h5>
            </div>
        </div>

        <div className="white-spacer"></div>

        <div className="trustpilot-container">
            <div className="trustpilot-icon">
            <div className="trustpilot-midbar-title-container">
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
            <div className="trustpilot-content">
                <h5>Noté 4.8 sur 5, basé sur 585,689 avis</h5>
            </div>
        </div>
    </div>
  )
}