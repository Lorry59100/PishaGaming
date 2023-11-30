import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { IconContext } from "react-icons";
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { TiShoppingCart } from 'react-icons/ti';
import { ImPriceTag } from 'react-icons/im';
import { URL_SINGLE_PRODUCT } from '../../constants/urls/URLBack';

export function SingleProduct() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    let total = 0;

    useEffect(() => {
        axios.get(`${URL_SINGLE_PRODUCT}/${id}`)
        .then(response => {
            console.log(response.data)
            setProduct(response.data);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération du produit :', error);
        })
    }, [id]);
    if (product === null) {
        return <div>Chargement en cours...</div>;
    }
    return (
        <div className='single-product-container'>

        <div className="background-header-container">
            <div className="background-header" style={{ backgroundImage: `url(${product.img})` }}></div>
        </div>

        <div className="dual-cards-container">

            <div className="single-product-img-container">
                <img src={product.img} alt={product.name} />
            </div>
            
            {/* EN STOCK */}
            {product.stock > 0 && (
            <div className="buy-info-container">
                <div className="title">
                    <h1>{product.name}</h1>
                </div>
                <div className="stock-container">
                        <div className="in-stock">
                            <div className="logo-container">
                                <img src={minilogo} alt="logo" className='orange-logo'/>
                                <h4>Pisha Gaming</h4>
                                <div className="spacer"></div>
                            </div>
                            <IconContext.Provider value={{ size: "1.5em", color: "green"}}>
                                <AiOutlineCheck/>
                            </IconContext.Provider>
                            <h4>En stock</h4>
                            <div className="spacer"></div>
                            <h4>Restants : {product.stock}</h4>
                        </div>
                </div>

                    <div className="platforms">
                        <select className="platforms-dropdown">
                            {product.plateformes.map(plateforme => (
                            <option key={plateforme.id} value={plateforme.id} className='dropdown-options'>
                                {plateforme.name}
                            </option>
                        ))}
                        </select>
                    </div>

                    <div className="amount">
                        <div className="first-price">
                            <IconContext.Provider value={{ size: "1em", color: "grey"}}>
                                <ImPriceTag/>
                            </IconContext.Provider>
                            <h3>{((product.price / 100) * (100 / (100 - product.discount))).toFixed(2)} €</h3>
                        </div>
                        <div className="discount">
                        <h3>-{product.discount}%</h3>
                        </div>
                        <div className="price">
                           <h1>{formatPrice(product.price)} €</h1>
                        </div>
                    </div>

                    <div className="cart-and-buy">
                        <div className="cart-btn">
                            <IconContext.Provider value={{ size: "2em" }}>
                                <button type="submit" className='submit-button'> <TiShoppingCart /></button>
                            </IconContext.Provider>
                        </div>
                        <div className="buy-btn">
                                <button type="submit" className='submit-button'>Acheter maintenant</button>
                        </div>
                    </div>
            </div>
            )}

            {/* RUPTURE DE STOCK */}
            {product.stock <= 0 && (
            <div className="buy-info-container">
                <div className="title">
                    <h1>{product.name}</h1>
                </div>
                <div className="stock-container">
                        <div className="sold-out">
                            <div className="logo-container">
                                <img src={minilogo} alt="logo" className='orange-logo'/>
                                <h4>Pisha Gaming</h4>
                                <div className="spacer"></div>
                            </div>
                            <IconContext.Provider value={{ size: "1.5em", color: "red"}}>
                                <AiOutlineClose/>
                            </IconContext.Provider>
                            <h4>Rupture de stock</h4>
                        </div>
                </div>
                    <div className="platforms">
                        <select className="platforms-dropdown">
                            {product.plateformes.map(plateforme => (
                            <option key={plateforme.id} value={plateforme.id} className='dropdown-options'>
                                {plateforme.name}
                            </option>
                        ))}
                        </select>
                    </div>
                    <div className="alert-mail">
                        <button type="submit" className='submit-button'>Recevoir un e-mail lors de la remise en stock</button>
                    </div>
            </div>
            )}
            <div className='about-rating-container'>
                <div className="about-container">
                    <h1>À propos du jeu</h1>
                    {product.description}
                </div>
                <div className="rating-container">
                    {product.tests.map(test =>(                        
                           (total = total + test.note)   
                    ))}
                    <br />
                    {(total / product.tests.length)}
                </div>
            </div>
        </div>
            
    </div>
    )
}
