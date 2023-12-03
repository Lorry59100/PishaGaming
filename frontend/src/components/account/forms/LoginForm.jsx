import axios from "axios";
import { Formik, Form, Field } from 'formik';
import { FaFacebookF, FaApple, FaDiscord } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router-dom';
import { IconContext } from "react-icons";
import { URL, URL_LOGIN} from "../../../constants/urls/URLBack";
import { useAuth } from '../../account/services/tokenService';
import PropTypes from "prop-types";

export function LoginForm(props) {
  const { login } = useAuth();
  const initialValues= {
    email: '',
    password: '',
    };
  const onSubmit=(values) => {
    console.log(values);
    const getCart = localStorage.getItem('cart');
    let cartItems = [];
    if (getCart) {
    cartItems = JSON.parse(getCart);
    }

    axios.post(`${URL}${URL_LOGIN}`, {
      email: values.email,
      password: values.password,
      cart: cartItems,
    })
    .then((response) => {
      console.log('Response data', response.data);
      if (response.status === 200) {
        console.log(response.data)
        login(response.data.token);
        /* window.location.reload(true); */
    }
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération des données :', error);
    });
  };

  return (
    <div className="little-form-container">
            <h2>Se connecter</h2>
            <div className="logo-container">
              <div className="single-logo fb-logo">
                <IconContext.Provider value={{ size: "1.5em" }}>
                  <FaFacebookF />
                </IconContext.Provider>
              </div>
              <div className="single-logo google-logo">
                <IconContext.Provider value={{ size: "1.5em" }}>
                  <FcGoogle />
                </IconContext.Provider>
              </div>
              <div className="single-logo apple-logo">
                <IconContext.Provider value={{ size: "1.5em" }}>
                  <FaApple />
                </IconContext.Provider>
              </div>
              <div className="single-logo discord-logo">
                <IconContext.Provider value={{ size: "1.5em" }}>
                  <FaDiscord />
                </IconContext.Provider>
              </div>
            </div>
            <div className="cutline-form first-cutline">
              <span className="cutline-text">OU</span>
            </div>
            <Formik initialValues={initialValues} onSubmit={onSubmit}>
              <Form>
                <div className="fields-container">
                  <Field type="email" name="email" placeholder="Email"/>
                  <Field type="password" name="password" placeholder="*********"/>
                </div>
                <div className="btn-container">
                  <button className="submit-button middle-column" type="submit">
                  Se connecter
                  </button>
                </div>
              </Form> 
            </Formik>
            <div className="switch">
              <button onClick={() => props.toggleForm()}>Pas encore de compte ?</button>
              <Link>Mot de passe oublié ?</Link>
            </div>
          </div>
  )
}

LoginForm.propTypes = {
  toggleForm: PropTypes.func.isRequired,
};
