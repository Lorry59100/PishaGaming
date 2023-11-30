import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { IconContext } from "react-icons";
import { AiOutlineCheck, AiOutlineClose, AiOutlineMinusCircle } from 'react-icons/ai';
import { TiShoppingCart } from 'react-icons/ti';
import { ImPriceTag } from 'react-icons/im';
import {URL, URL_SINGLE_PRODUCT } from '../../constants/urls/URLBack';
import logo from '../../assets/img/Logo.png';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { PiPencilSimpleLineFill } from 'react-icons/pi';
import "../../assets/styles/components/singleproduct.css"
import RatingCircle from './RatingCircle';

function truncateDescription(description, maxLength) {
    if (description.length > maxLength) {
        return description.substring(0, maxLength) + '...';
    }
    return description;
}

function parseAndTruncateHTML(html, maxLength) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const plainText = doc.body.textContent || "";
    return truncateDescription(plainText, maxLength);
}

function parseHTML(html) {
    return new DOMParser().parseFromString(html, 'text/html');
}

export function SingleProduct() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [showAllTags, setShowAllTags] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);

    useEffect(() => {
        axios.get(`${URL}${URL_SINGLE_PRODUCT}/${id}`)
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
    const truncatedDescription = parseAndTruncateHTML(product.description, 500);
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
                                <img src={logo} alt="logo" className='orange-logo'/>
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
                           <h1>{product.price} €</h1>
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
                                <img src={logo} alt="logo" className='orange-logo'/>
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
                <div className="about-container">
                    <h1>À propos du jeu</h1>
                    <p>{truncatedDescription}</p>
                    <a href="/">Voir plus</a>
                </div>
                <div className="rating-container">
                    <div className="test-number-container">
                    <RatingCircle tests={product.tests} />
                    <div className="number">
                        <h4> Basé sur </h4> 
                        <h4> {product.tests.length} tests</h4>
                    </div>
                    </div>
                    <div className="sub-infos">
                        <div className="info-title">
                            <h5>Installation:</h5>
                            <h5>Développeur:</h5>
                            <h5>Editeur:</h5>
                            <h5>Date de sortie:</h5>
                            <h5>Genre:</h5>
                        </div>
                        <div className="content-info">
                            <h5> <button className='invisible-button'> Comment installer le jeu </button></h5>
                            <h5>{product.developer}</h5>
                            <h5>{product.editor}</h5>
                            <h5>{product.release.date}</h5>
                            <h5>{product.category}</h5>
                        </div>
                    </div>
                </div>
                <div className="users-tags">
                    Tags utilisateurs*:
                    {product.tags.slice(0, showAllTags ? product.tags.length : 4).map(tag => (
                        <div key={tag.id} className="tags-list">
                            <a href="/">{tag.name}</a>
                        </div>
                    ))}
                    {!showAllTags && product.tags.length > 4 && <div className="tags-list"></div>}
                    {product.tags.length > 4 && (
                        <div className={showAllTags ? "show-less" : "show-more"} onClick={(e) => {e.preventDefault(); setShowAllTags(!showAllTags); }}>
                            <a href='/'>
                                {showAllTags ? "..." : "..."}
                            </a>
                        </div>
                    )}
                </div>

                <div className="visuals-container">
                        <h1>Visuels</h1>
                        <div className="video-container">
                            <iframe width="100%" height="700px" src="https://www.youtube.com/embed/LtuqmZp1Ku0?si=cAGVlndilW05SZUJ" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                        </div>
                        <div className="screenshots-container">
                            <div className="main-img">
                                <img src={product.img} alt={product.name} />
                            </div>
                            <div className="gallery">
                                <div className="gallery-line">
                                    <img src={product.img} alt={product.name} />
                                    <img src={product.img} alt={product.name} />
                                </div>
                                <div className="gallery-line">
                                    <img src={product.img} alt={product.name} />
                                    <img src={product.img} alt={product.name} />
                                </div>
                            </div>
                        </div>
                </div>

                <div className="big-description">
    <h1>Description</h1>
    <p>
        {showFullDescription ? parseHTML(product.description) : truncatedDescription}
        {!showFullDescription && product.description.length > 500 && (
            <>
                <button className='show' onClick={() => setShowFullDescription(true)}>
                    <IconContext.Provider value={{ size: "4em", color: "grey"}}>
                        <IoIosAddCircleOutline/>
                    </IconContext.Provider>
                </button>
            </>
        )}
        {showFullDescription && (
            <button className='show' onClick={() => setShowFullDescription(false)}>
                <IconContext.Provider value={{ size: "4em", color: "grey"}}>
                    <AiOutlineMinusCircle/>
                </IconContext.Provider>
            </button>
        )}
    </p>
</div>

                <div className="tests">
                    <h1>Tests des joueurs</h1>
                    <div className="your-test">
                        <div className="rate-container">
                            <RatingCircle tests={product.tests} />
                            <div className="rate-content">
                                <h3>Note du jeu</h3>
                                <h4>basé sur {product.tests.length} tests</h4>
                            </div>
                        </div>
                            <button className='submit-button'>
                                <a href="/">
                                    Rédiger votre test sur ce jeu
                                    <IconContext.Provider value={{ size: "1em"}}>
                                        <PiPencilSimpleLineFill/>
                                    </IconContext.Provider>
                                </a>
                            </button>
                    </div>
                </div>
                
        </div>   
    </div>
    )
}
