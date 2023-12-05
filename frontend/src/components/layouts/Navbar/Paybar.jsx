import "../../../assets/styles/components/paybar.css"
import logo from "../../../assets/img/Logo.png"
import { GiPadlock } from "react-icons/gi";
import { IconContext } from 'react-icons';

export function Paybar() {
    return (
        <div className="buying-tunnel-layout-container">
            <div className="logo-paybar-container">
                <a href=""><img src={logo} alt="logo" className="orange-logo" /></a>
                <h3>Pisha Gaming</h3>
            </div>

            <div className="buying-tunnel-container">
                <div className="cart-tunnel">
                    <span className='index-tunnel'>1</span>
                    <h3>Panier</h3>
                </div>
                <div className="payment-tunnel">
                    <div className="tunnel-line"></div>
                    <span className='index-tunnel'>2</span>
                    <h3>Paiement</h3>
                </div>
                <div className="activation-tunnel">
                    <div className="tunnel-line"></div>
                    <span className='index-tunnel'>3</span>
                    <h3>Activation</h3>
                </div>
            </div>

            <div className="payment-logo-container">
                <IconContext.Provider value={{ size: '2em' }}>
                    <GiPadlock />
                </IconContext.Provider>
                <div className="vertical-paybar-spacer"></div>
                <div className="text-payment">
                    <h4>Paiement sécurisé</h4>
                    <h5>256-bit SSL Secured</h5>
                </div>
            </div>

        </div>
    )
}
