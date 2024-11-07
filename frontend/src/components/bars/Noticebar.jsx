import GamerImg from "../../assets/img/gamergirl.png"
import { AiFillStar } from 'react-icons/ai';
import { IconContext } from "react-icons";
import "../../assets/styles/components/noticebar.css"

export function Noticebar() {
  return (
    <div className='notice-bar-container'>
        <img src={GamerImg} alt="gamer" />
        <div className="content">
            <div className="stars">
                <IconContext.Provider value={{ size: "1.5em", color: "#FCAF02" }}>
                    <AiFillStar/>
                    <AiFillStar/>
                    <AiFillStar/>
                    <AiFillStar/>
                    <AiFillStar/>
                </IconContext.Provider>
            </div>
            <div className="notice-text">
                <h3> <b>Pisha Gaming</b> est une plateforme incroyable pour acheter ses jeux tout en supportant les developpeurs. 
                    C'est rapide, paiement effectué avec Paypal, et code reçu immédiatement.
                </h3>
            </div>
            <div className="noticebar-button-container">
            <button className='submit-button'>1,494,359 avis d'utilisateurs</button>
            </div>
        </div>
    </div>
    
  )
}