import "../../../assets/styles/components/paybar.css"
import logo from "../../../assets/img/Logo.png"
import { GiPadlock } from "react-icons/gi";
import { IconContext } from 'react-icons';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export function Paybar({ isPaymentFormContext, isActivationContext, isLoginFormVisible }) {
    const URL_HOME = import.meta.env.VITE_HOME;
    return (
        <div className={`buying-tunnel-layout-container ${isLoginFormVisible ? 'login-form-visible' : ''}`}>
            <div className="logo-paybar-container">
                <Link to={`${URL_HOME}`}>
                    <img src={logo} alt="logo" className="orange-logo" />
                    <h3>Pisha Gaming</h3>
                </Link>
            </div>

            <div className="buying-tunnel-container">
                <div className={`cart-tunnel ${isPaymentFormContext || isActivationContext ? 'payment-form-context' : ''}`}>
                    <span className={`index-tunnel is-valid ${isPaymentFormContext || isActivationContext ? 'payment-form-style' : ''}`}>1</span>
                    <h3>Panier</h3>
                </div>
                <div className={`payment-tunnel ${isPaymentFormContext || isActivationContext ? 'payment-form-context' : ''}`}>
                    <div className={`tunnel-line ${isPaymentFormContext || isActivationContext ? 'payment-form-style' : ''}`}></div>
                    <span className={`index-tunnel ${isPaymentFormContext || isActivationContext ? 'payment-form-style' : ''} ${isActivationContext ? 'is-valid' : ''}`}>2</span>
                    <h3>Paiement</h3>
                </div>
                <div className={`activation-tunnel ${isActivationContext ? 'payment-form-context' : ''}`}>
                    <div className={`tunnel-line ${isActivationContext ? 'payment-form-style' : ''}`}></div>
                    <span className={`index-tunnel ${isActivationContext ? 'payment-form-style' : ''}`}>3</span>
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

Paybar.propTypes = {
    isPaymentFormContext: PropTypes.bool.isRequired,
    isActivationContext: PropTypes.bool.isRequired,
    isLoginFormVisible: PropTypes.bool.isRequired,
};
