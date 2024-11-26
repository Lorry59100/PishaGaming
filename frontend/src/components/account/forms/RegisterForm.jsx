import { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field } from 'formik';
import PropTypes from "prop-types";
import { ToastImportantSuccess, ToastError } from "../../../services/ToastService";

export function RegisterForm(props) {
  const [birthDate, setBirthDate] = useState(null);
  const URL = import.meta.env.VITE_BACKEND;
  const URL_REGISTER = import.meta.env.VITE_REGISTER;

  const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
  };

  const onSubmit = (values) => {
    const cartItems = JSON.parse(localStorage.getItem('cart'));
    axios.post(`${URL}${URL_REGISTER}`, {
      email: values.email,
      password: values.password,
      birthDate: birthDate ? birthDate.toISOString() : null,
      cart: cartItems,
    })
    .then((response) => {
      if (response.status === 200) {
        props.onFormSuccess();
        localStorage.removeItem('cart');
        ToastImportantSuccess(response.data.message);
      }
    })
    .catch((error) => {
      ToastError(error.response.data.error);
      console.error('Erreur lors de la récupération des données :', error);
    });
  };

  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const formatDate = (value) => {
    // Supprime tous les caractères non numériques
    value = value.replace(/\D/g, '');

    // Ajoute les '/' après chaque groupe de chiffres
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length > 5) {
      value = value.slice(0, 5) + '/' + value.slice(5);
    }

    return value;
  };

  const handleBirthDateChange = (e, setFieldValue) => {
    const value = e.target.value;
    const formattedValue = formatDate(value);
    setFieldValue('birthDate', formattedValue);

    if (formattedValue.length === 10) {
      const [day, month, year] = formattedValue.split('/');
      const date = new Date(`${year}-${month}-${day}`);
      setBirthDate(date);
    }
  };

  return (
    <div className="little-form-container">
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ setFieldValue, values }) => (
          <Form>
            <div className="register-fields-container">
              <Field type="password" name="password" placeholder="Votre mot de passe" />
              <Field type="password" name="confirmPassword" placeholder="Confirmez votre mot de passe" />
              <Field type="email" name="email" placeholder="Email" />
              <div className="datepicker-container">
                <Field
                  type="text"
                  name="birthDate"
                  className="birthdate"
                  placeholder="Date de naissance"
                  value={values.birthDate}
                  onChange={(e) => handleBirthDateChange(e, setFieldValue)}
                  maxLength={10}
                />
              </div>
            </div>
            <div className="consent">
              <input type="checkbox" name="consent" id="" />
              <p className="preserve-space">
                J'accepte <a href="">les conditions de ventes</a> et <a href="">la politique de confidentialité</a>
              </p>
            </div>
            <div className="btn-container">
              <button className="submit-button middle-column" type="submit">
                Créer un compte
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <div className="back">
        <button onClick={() => props.toggleForm()}>&lt;&lt; Retour</button>
      </div>
    </div>
  );
}

RegisterForm.propTypes = {
  toggleForm: PropTypes.func.isRequired,
  onFormSuccess: PropTypes.func.isRequired,
};
