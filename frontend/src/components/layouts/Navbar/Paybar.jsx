import "../../../assets/styles/components/paybar.css"

export function Paybar() {
    return (
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
    )
}
