import axios from 'axios'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { IconContext } from "react-icons";
import { AiOutlineCheck, AiOutlineClose, AiOutlineMinusCircle } from 'react-icons/ai';
import { TiShoppingCart } from 'react-icons/ti';
import { ImCross, ImPriceTag } from 'react-icons/im';
import logo from '../../assets/img/Logo.png';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { PiPencilSimpleLineFill, PiUserBold } from 'react-icons/pi';
import "../../assets/styles/components/singleproduct.css"
import RatingCircle from './RatingCircle';
import { calculateDiscountPercentage, convertToEuros } from '../../services/PriceServices';
import { FaCheck, FaHeart, FaRegHeart } from "react-icons/fa";
import parse from 'html-react-parser';
import { CartContext } from '../../contexts/CartContext';
import { LuThumbsDown, LuThumbsUp } from "react-icons/lu";
import { LoginAndRegisterForm } from '../account/forms/LoginAndRegisterForm';
import { TestForm } from '../account/forms/TestForm';
import { dismissToast, ToastCenteredWarning } from '../../services/ToastService';
import { formatDate } from '../../services/DateServices';
import { useTokenService } from '../../services/TokenService';

function parseHTML(html, maxLength = null) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    let plainText = tempDiv.textContent || tempDiv.innerText;
    if (maxLength !== null && plainText.length > maxLength) {
        plainText = plainText.substring(0, maxLength) + '...';
    }
    return plainText;
}

export function SingleProduct() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [showAllTags, setShowAllTags] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const { decodedUserToken } = useTokenService();
    const { updateCart } = useContext(CartContext)
    const navigate = useNavigate();
    const [showLoginAndRegisterForm, setShowLoginAndRegisterForm] = useState(false);
    const [showTestForm, setShowTestForm] = useState(false);
    const [testExist, setTestExist] = useState(false);
    const location = useLocation();
    const [expandedComments, setExpandedComments] = useState({});
    const [wishlist, setWishlist] = useState([]);
    const [productQuantity, setProductQuantity] = useState(0);
    const [ , setIsLoggedIn] = useState(false); // Ajout de l'état de connexion
    const URL = import.meta.env.VITE_BACKEND;
    const URL_ADD_TO_CART = import.meta.env.VITE_ADD_TO_CART;
    const URL_USER_CART = import.meta.env.VITE_USER_CART;
    const URL_VOTE_TEST = import.meta.env.VITE_VOTE_TEST;
    const URL_USER_AVATAR = import.meta.env.VITE_USER_AVATAR;
    const URL_ADD_TO_WISHLIST = import.meta.env.VITE_ADD_TO_WISHLIST;
    const URL_GET_WISHLIST = import.meta.env.VITE_GET_WISHLIST;
    const URL_MAIN_IMG = import.meta.env.VITE_MAIN_IMG;
    const URL_TRAILER = import.meta.env.VITE_TRAILER;
    const URL_IMG = import.meta.env.VITE_IMG;
    const URL_CART = import.meta.env.VITE_CART;
    const URL_SINGLE_PRODUCT = import.meta.env.VITE_SINGLE_PRODUCT_BACK;

    const toggleComment = (testId, section) => {
        setExpandedComments(prevState => ({
            ...prevState,
            [`${section}-${testId}`]: !prevState[`${section}-${testId}`]
        }));
    };

    useEffect(() => {
        const editTest = location.state?.editTest;
        if (editTest) {
            setShowTestForm(true);
        }
    }, [location.state]);

    useEffect(() => {
        // Récupérer les données du produit
        axios.get(`${URL}${URL_SINGLE_PRODUCT}/${id}`)
            .then(response => {
                setProduct(response.data);
                setProductQuantity(response.data.stock);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération du produit :', error);
            });
    }, [id, URL, URL_SINGLE_PRODUCT]);

    useEffect(() => {
        if (decodedUserToken) {
            setIsLoggedIn(true); // Mettre à jour l'état de connexion
            // Récupérer les données du produit après la connexion
            axios.get(`${URL}${URL_SINGLE_PRODUCT}/${id}`)
                .then(response => {
                    setProduct(response.data);
                    setProductQuantity(response.data.stock);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération du produit :', error);
                });
        }
    }, [decodedUserToken, id, URL, URL_SINGLE_PRODUCT]);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const descriptionClassName = showFullDescription ? 'big-description full' : 'big-description';

    // Set an initial platform when the component is loaded
    useEffect(() => {
        if (product && product.plateformes.length > 0) {
            setSelectedPlatform(product.plateformes[0].name);
        }
    }, [product]);

    const getWishlist = useCallback(async (decodedUserToken) => {
        if (!decodedUserToken) {
            console.error('decodedUserToken is undefined');
            return;
        }

        try {
            const response = await axios.get(`${URL}${URL_GET_WISHLIST}`, {
                headers: {
                    'Authorization': `Bearer ${decodedUserToken.username}`,
                }
            });

            if (response.data) {
                setWishlist(response.data);
            } else {
                console.error('Invalid server response:', response);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de la wishlist:', error);
        }
    }, [URL, URL_GET_WISHLIST]);

    useEffect(() => {
        if (decodedUserToken) {
            getWishlist(decodedUserToken);
        }
    }, [decodedUserToken, getWishlist]);

    const isProductInWishlist = (wishlist, productId) => {
        return wishlist.some(item => {
            if (item.product && typeof item.product.id !== 'undefined') {
                return item.product.id == productId;
            } else {
                console.error('item.product or item.product.id is undefined');
                return false;
            }
        });
    };

    const addToWishlist = async (productId, decodedUserToken) => {
        if (!decodedUserToken) {
            console.error('decodedUserToken is undefined');
            return;
        }

        try {
            const response = await axios.post(`${URL}${URL_ADD_TO_WISHLIST.replace(':id', productId)}`, {
                userId: decodedUserToken.id
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                getWishlist(decodedUserToken);
            } else {
                alert('Erreur : ' + response.data.error);
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout à la wishlist:', error);
            alert('Une erreur s\'est produite lors de l\'ajout à la wishlist.');
        }
    };

    const addToCart = (redirect) => {
        if (!decodedUserToken) {
            // Récupérer le panier depuis le stockage local
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            // Vérifier si le produit est déjà dans le panier
            const existingProductIndex = cart.findIndex(item => item.id === product.id && item.platform === selectedPlatform);
            if (existingProductIndex !== -1) {
                // Si il existe déjà 10 exemplaires d'un produit dans le panier
                if (cart[existingProductIndex].quantity >= 10) {
                    ToastCenteredWarning('Vous ne pouvez pas ajouter plus de 10 exemplaires de ce produit.');
                } else {
                    // Si le produit est déjà dans le panier, incrémentez la quantité
                    cart[existingProductIndex].quantity += 1;
                }
            } else {
                // Si le produit n'est pas encore dans le panier, ajoutez-le
                cart.push({
                    id: product.id,
                    name: product.name,
                    img: product.img,
                    platform: selectedPlatform,
                    price: product.price,
                    oldPrice: product.old_price,
                    quantity: 1,
                });
            }
            // Mettre à jour le panier dans le stockage local
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart(cart);
        }
        if (decodedUserToken) {
            axios.post(`${URL}${URL_ADD_TO_CART}/${id}`, {
                platform: selectedPlatform,
                userId: decodedUserToken.id,
                id: product.id,
                name: product.name,
                img: product.img,
                quantity: 1,
            })
                .then(response => {
                    if (response.data && response.data.success) {
                        // Faire une requête supplémentaire pour obtenir le panier mis à jour
                        axios.get(`${URL}${URL_USER_CART}/${decodedUserToken.id}`)
                            .then(cartResponse => {
                                if (cartResponse.data && Array.isArray(cartResponse.data.carts)) {
                                    updateCart(cartResponse.data.carts);
                                    if (redirect) {
                                        navigate(`${URL_CART}`);
                                    }
                                } else {
                                    console.error('Invalid cart response:', cartResponse);
                                }
                            })
                            .catch(cartError => {
                                console.error('Erreur lors de la récupération du panier :', cartError);
                            });
                        // Mettre à jour la quantité du produit
                        setProductQuantity(productQuantity - 1);
                    } else {
                        console.error('Invalid server response:', response);
                    }
                })
                .catch(error => {
                    ToastCenteredWarning(error.response.data.error);
                    console.error('Erreur lors de l\'ajout au panier :', error);
                });
        }
    };

    const vote = (testId, isPositive) => {
        if (!decodedUserToken) {
            setShowLoginAndRegisterForm(true);
            return;
        }
        if (decodedUserToken) {
            const headers = { 'Authorization': `Bearer ${decodedUserToken.username}` };
            const data = { isPositive };
            axios.post(`${URL}${URL_VOTE_TEST}${testId}`, data, { headers })
                .then(response => {
                    const updatedTest = response.data;
                    setProduct(prevProduct => {
                        const updatedTests = prevProduct.tests.map(test => {
                            if (test.id === testId) {
                                return {
                                    ...test,
                                    upVotes: updatedTest.upVotes,
                                    downVotes: updatedTest.downVotes,
                                    hasVotedPositive: updatedTest.hasVotedPositive,
                                    hasVotedNegative: updatedTest.hasVotedNegative
                                };
                            }
                            return test;
                        });
                        return { ...prevProduct, tests: updatedTests };
                    });
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération du produit :', error);
                });
        }
    };

    const writeTest = () => {
        if (decodedUserToken) {
            setShowTestForm(true);
        } else {
            setShowLoginAndRegisterForm(true);
        }
    };

    const closeTestForm = () => {
        setShowTestForm(false);
    };

    const updateTests = useCallback(() => {
        const headers = decodedUserToken
            ? { 'Authorization': `Bearer ${decodedUserToken.username}` }
            : {};

        axios.get(`${URL}${URL_SINGLE_PRODUCT}/${id}`, { headers })
            .then(response => {
                const productData = response.data;
                const updatedTests = productData.tests.map(test => ({
                    ...test,
                    upVotes: test.upVotes || 0,
                    downVotes: test.downVotes || 0,
                    hasVotedPositive: test.hasVotedPositive || false,
                    hasVotedNegative: test.hasVotedNegative || false
                }));
                setProduct({ ...productData, tests: updatedTests });

                // Check if testExist is true for any test
                const testExistValue = updatedTests.some(test => test.testExist);
                setTestExist(testExistValue);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération du produit :', error);
            });
    }, [id, decodedUserToken, URL, URL_SINGLE_PRODUCT]);

    useEffect(() => {
        updateTests();
    }, [updateTests]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Vérifiez si le clic est en dehors du toast container et non sur le bouton
            if (!event.target.closest('.Toastify__toast-container') && !event.target.closest('.submit-button')) {
                dismissToast();
            }
        };
        // Ajoutez un écouteur d'événements pour les clics sur le document
        document.addEventListener('click', handleClickOutside);
        // Nettoyez l'écouteur d'événements lorsque le composant est démonté
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    if (product === null) {
        return <div>Chargement en cours...</div>;
    }

    return (
        <div className='single-product-container'>

            {showTestForm && decodedUserToken && <TestForm onClose={closeTestForm} productId={id} testExist={testExist} onSubmit={updateTests} />}

            {showLoginAndRegisterForm && (
                <LoginAndRegisterForm onCloseForm={() => setShowLoginAndRegisterForm(false)} />
            )}

            <div className="background-header-container">
                <div className="background-header" style={{ backgroundImage: `url(${URL}${URL_MAIN_IMG}/${product.img})` }}></div>
            </div>

            <div className="dual-cards-container">

                <div className="single-product-img-container">
                    <img src={`${URL}${URL_MAIN_IMG}/${product.img}`} alt={product.name} />
                </div>

                {/* EN STOCK */}
                {product.stock > 0 && (
                    <div className="buy-info-container">
                        <IconContext.Provider value={{ size: "2em" }}>
                            <button type="submit" onClick={() => addToWishlist(id, decodedUserToken)}>
                                {isProductInWishlist(wishlist, id) ? (
                                    <FaHeart className='heart' />
                                ) : (
                                    <FaRegHeart className='heart' />
                                )}
                            </button>
                        </IconContext.Provider>
                        <div className="title">
                            <h1>{product.name}</h1>
                        </div>
                        <div className="stock-container">
                            <div className="in-stock">
                                <div className="logo-stock-container">
                                    <img src={logo} alt="logo" className='orange-logo' />
                                    <h4>Pisha Gaming</h4>
                                    <div className="spacer"></div>
                                </div>
                                <IconContext.Provider value={{ size: "1.5em", color: "green" }}>
                                    <AiOutlineCheck />
                                </IconContext.Provider>
                                <h4>En stock</h4>
                                <div className="spacer"></div>
                                <h4>Restants : {productQuantity}</h4>
                            </div>
                        </div>

                        <div className="platforms">
                            <select className="platforms-dropdown" value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)}>
                                {product.plateformes.map(plateforme => (
                                    <option key={plateforme.id} value={plateforme.name} className='dropdown-options'>
                                        {plateforme.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="amount">
                            <div className="first-price">
                                <IconContext.Provider value={{ size: "1em", color: "grey" }}>
                                    <ImPriceTag />
                                </IconContext.Provider>
                                <h3>{convertToEuros(product.old_price)} €</h3>
                            </div>
                            <div className="discount">
                                <h3>-{calculateDiscountPercentage(product.old_price, product.price)}</h3>
                            </div>
                            <div className="price">
                                <h1>{convertToEuros(product.price)} €</h1>
                            </div>
                        </div>

                        <div className="cart-and-buy">
                            <div className="cart-btn">
                                <IconContext.Provider value={{ size: "2em" }}>
                                    <button type="submit" className='submit-button' onClick={() => addToCart(false)}> <TiShoppingCart /></button>
                                </IconContext.Provider>
                            </div>
                            <div className="buy-btn">
                                <button type="submit" className='submit-button' onClick={() => addToCart(true)}>Acheter maintenant</button>
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
                                <div className="logo-container-sold-out">
                                    <img src={logo} alt="logo" className='orange-logo' />
                                    <h4>Pisha Gaming</h4>
                                    <div className="spacer"></div>
                                </div>
                                <IconContext.Provider value={{ size: "1.5em", color: "red" }}>
                                    <AiOutlineClose />
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
                    <p>{parseHTML(product.description, 200)}</p>
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
                            <h5>{formatDate(product.release.date)}</h5>
                            <h5 className='genres-list'>
                                {product.genres.map((genre, index) => (
                                    <span key={genre.id}>
                                        {genre.name}
                                        {index !== product.genres.length - 1 && <span className="comma">, </span>}
                                    </span>
                                ))}
                            </h5>
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
                        <div className={showAllTags ? "show-less" : "show-more"} onClick={(e) => { e.preventDefault(); setShowAllTags(!showAllTags); }}>
                            <a href='/'>
                                {showAllTags ? "..." : "..."}
                            </a>
                        </div>
                    )}
                </div>

                {product.alternative_editions.length > 0 && (
                    <div className='editions-card-container'>
                        <h1>Editions</h1>
                        <div className='edition-card'>
                            {product.alternative_editions.map((edition) => (
                                <div key={edition.id} className='edition-card-info'>
                                    <Link to={`${URL_SINGLE_PRODUCT}/${edition.id}`}>
                                        <img src={edition.img} alt="" />
                                        <h3>Edition: {edition.edition_name}</h3>
                                        <p>{parseHTML(edition.description, 500)}</p>
                                        <div className="edition-amount">
                                            <div className="first-price">
                                                <IconContext.Provider value={{ size: "1em", color: "grey" }}>
                                                    <ImPriceTag />
                                                </IconContext.Provider>
                                                <h3>{convertToEuros(edition.old_price)} €</h3>
                                            </div>
                                            <div className="discount">
                                                <h3>{calculateDiscountPercentage(edition.old_price, edition.price)}</h3>
                                            </div>
                                            <div className="price">
                                                <h1>{convertToEuros(edition.price)} €</h1>
                                            </div>
                                        </div>
                                        <div className="card-btn-container">
                                            {edition.stock <= 0 && (
                                                <button type="submit" className='submit-button'>Hors stock</button>
                                            )}
                                            {edition.stock >= 0 && (
                                                <button type="submit" className='submit-button'>Acheter maintenant</button>
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="visuals-container">
                    <h1>Visuels</h1>
                    <div className="video-container">
                        <video width="100%" height="700px" controls>
                            <source src={`${URL}${URL_TRAILER}/${product.trailer}`} type="video/mp4" />
                            <source src={`${URL}${URL_TRAILER}/${product.trailer}`} type="video/webm" />
                            <source src={`${URL}${URL_TRAILER}/${product.trailer}`} type="video/x-matroska" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div className="screenshots-container">
                        <div className="main-img">
                            <img src={`${URL}${URL_MAIN_IMG}/${product.img}`} alt={product.name} />
                        </div>
                        <div className="gallery">
                            <div className="gallery-line">
                                <img src={`${URL}${URL_MAIN_IMG}/${product.img}`} alt={product.name} />
                                <img src={`${URL}${URL_MAIN_IMG}/${product.img}`} alt={product.name} />
                            </div>
                            <div className="gallery-line">
                                <img src={`${URL}${URL_MAIN_IMG}/${product.img}`} alt={product.name} />
                                <img src={`${URL}${URL_MAIN_IMG}/${product.img}`} alt={product.name} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={descriptionClassName}>
                    <h1>Description</h1>
                    <div className='big-desc-container'>
                        {parse(product.description, showFullDescription)}
                    </div>
                </div>
                <button className='show' onClick={toggleDescription}>
                    <IconContext.Provider value={{ size: '4em', color: 'grey' }}>
                        {showFullDescription ? <AiOutlineMinusCircle /> : <IoIosAddCircleOutline />}
                    </IconContext.Provider>
                </button>
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
                        <button className='submit-button' onClick={writeTest}>
                            {testExist ? 'Editer votre test pour ce jeu' : 'Rédiger votre test sur ce jeu'}
                            <IconContext.Provider value={{ size: "1em" }}>
                                <PiPencilSimpleLineFill />
                            </IconContext.Provider>
                        </button>
                    </div>
                    {/* Afficher les tests */}
                    <div className="tests-container">
                        <div className="test-most-rated-container">
                            <h2>Les plus votés</h2>
                            {product.tests.sort((a, b) => {
                                // Calculer le nombre total de votes pour chaque test
                                const totalVotesA = a.upVotes + a.downVotes;
                                const totalVotesB = b.upVotes + b.downVotes;
                                // Comparer d'abord par le nombre total de votes
                                if (totalVotesA !== totalVotesB) {
                                    return totalVotesB - totalVotesA;
                                }
                                // En cas d'égalité, comparer par le nombre de votes positifs
                                return b.upVotes - a.upVotes;
                            }).map(test => (
                                <div key={test.id} className="test-item" onClick={() => toggleComment(test.id, 'most-rated')}>
                                    <div className="test-item-head">
                                        <div className="publisher">
                                            {test.avatar ? (
                                                <img src={`${URL}${URL_USER_AVATAR}${test.avatar}`} alt="User Image" className="user-img-circled" />
                                            ) : (
                                                <IconContext.Provider value={{ size: '2em' }}>
                                                    <PiUserBold className='user-icon-circled' />
                                                </IconContext.Provider>
                                            )}
                                            <h3>{test.publisher}</h3>
                                        </div>
                                        <RatingCircle singleRating={test.rate} />
                                    </div>
                                    <h5>{expandedComments[`most-rated-${test.id}`] ? parse(test.commentaires) : parseHTML(test.commentaires, 500)}</h5>
                                    <div className="points-container">
                                        {test.points.filter(point => point.isPositive).length > 0 && (
                                            <>
                                                <div>
                                                    {test.points.filter(point => point.isPositive).map((point, index) => (
                                                        <div key={index} className='single-point-container'>
                                                            <IconContext.Provider value={{ size: '1.2em', color: 'green' }}>
                                                                <FaCheck />
                                                            </IconContext.Provider>
                                                            <h5>{point.description}</h5>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                        {test.points.filter(point => !point.isPositive).length > 0 && (
                                            <>
                                                {test.points.filter(point => !point.isPositive).map((point, index) => (
                                                    <div key={index} className='single-point-container'>
                                                        <IconContext.Provider value={{ size: '1.2em', color: 'red' }}>
                                                            <ImCross />
                                                        </IconContext.Provider>
                                                        <h5>{point.description}</h5>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                    <div className="cutline"></div>
                                    <div className="test-item-foot">
                                        <h5>{formatDate(test.date.date)}</h5>
                                        <div className="vote">
                                            <h5>Utile ?</h5>
                                            <button className={`${test.hasVotedPositive ? 'voted' : 'thumb-up'}`} onClick={() => vote(test.id, true)}>
                                                <IconContext.Provider value={{ size: '1.5em' }}>
                                                    <LuThumbsUp />
                                                    <span>{test.upVotes}</span>
                                                </IconContext.Provider>
                                            </button>
                                            <button className={`${test.hasVotedNegative ? 'voted' : 'thumb-down'}`} onClick={() => vote(test.id, false)}>
                                                <IconContext.Provider value={{ size: '1.5em' }}>
                                                    <LuThumbsDown />
                                                    <span>{test.downVotes}</span>
                                                </IconContext.Provider>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="test-most-recent-container">
                            <h2>Les plus récents</h2>
                            {product.tests
                                .sort((a, b) => new Date(b.date.date) - new Date(a.date.date)) // Trier les tests par date, du plus récent au plus ancien
                                .map(test => (
                                    <div key={test.id} className="test-item" onClick={() => toggleComment(test.id, 'most-recent')}>
                                        <div className="test-item-head">
                                            <div className="publisher">
                                                {test.avatar ? (
                                                    <img src={`${URL}${URL_IMG}/${test.avatar}`} alt="User Image" className="user-img-circled" />
                                                ) : (
                                                    <IconContext.Provider value={{ size: '2em' }}>
                                                        <PiUserBold className='user-icon-circled' />
                                                    </IconContext.Provider>
                                                )}
                                                <h3>{test.publisher}</h3>
                                            </div>
                                            <RatingCircle singleRating={test.rate} />
                                        </div>
                                        <h5>{expandedComments[`most-recent-${test.id}`] ? parse(test.commentaires) : parseHTML(test.commentaires, 500)}</h5>
                                        <div className="points-container">
                                            {test.points.filter(point => point.isPositive).length > 0 && (
                                                <>
                                                    <div>
                                                        {test.points
                                                            .filter(point => point.isPositive)
                                                            .map((point, index) => (
                                                                <div key={index} className='single-point-container'>
                                                                    <IconContext.Provider value={{ size: '1.2em', color: 'green' }}>
                                                                        <FaCheck />
                                                                    </IconContext.Provider>
                                                                    <h5>{point.description}</h5>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </>
                                            )}
                                            {test.points.filter(point => !point.isPositive).length > 0 && (
                                                <>
                                                    {test.points
                                                        .filter(point => !point.isPositive)
                                                        .map((point, index) => (
                                                            <div key={index} className='single-point-container'>
                                                                <IconContext.Provider value={{ size: '1.2em', color: 'red' }}>
                                                                    <ImCross />
                                                                </IconContext.Provider>
                                                                <h5>{point.description}</h5>
                                                            </div>
                                                        ))}
                                                </>
                                            )}
                                        </div>
                                        <div className="cutline"></div>
                                        <div className="test-item-foot">
                                            <h5>{formatDate(test.date.date)}</h5>
                                            <div className="vote">
                                                <h5>Utile ?</h5>
                                                <button className={`${test.hasVotedPositive ? 'voted' : 'thumb-up'}`} onClick={() => vote(test.id, true)}>
                                                    <IconContext.Provider value={{ size: '1.5em' }}>
                                                        <LuThumbsUp />
                                                        <span>{test.upVotes}</span>
                                                    </IconContext.Provider>
                                                </button>
                                                <button className={`${test.hasVotedNegative ? 'voted' : 'thumb-down'}`} onClick={() => vote(test.id, false)}>
                                                    <IconContext.Provider value={{ size: '1.5em' }}>
                                                        <LuThumbsDown />
                                                        <span>{test.downVotes}</span>
                                                    </IconContext.Provider>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
