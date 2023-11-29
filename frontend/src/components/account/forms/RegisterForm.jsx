import { useState  } from "react";
import axios from "axios";
import { Formik, Form, Field } from 'formik';
import { URL, URL_REGISTER } from "../../../constants/urls/URLBack";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
registerLocale("fr", fr);
import PropTypes from "prop-types";

export function RegisterForm(props) {
  const [birthDate, setBirthDate] = useState(null);
    // Logique de controle du formulaire
    const initialValues= {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
      };

    const onSubmit=(values) => {
      console.log(values);
      axios.post(`${URL}${URL_REGISTER}`, {
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        password: values.password,
        birthDate: birthDate.toISOString(),
      })
      .then((response) => {
        console.log('Response data', response.data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données :', error);
      });
    };

  return (
    <div className="little-form-container">
            <Formik initialValues={initialValues} onSubmit={onSubmit}>
              {({ setFieldValue }) => (
              <Form>
                <div className="register-fields-container">
                  <Field type="text" name="firstname" placeholder="Prénom"/>
                  <Field type="text" name="lastname" placeholder="Nom"/>
                  <Field type="password" name="password" placeholder="Votre mot de passe"/>
                  <Field type="password" name="confirmPassword" placeholder="Confirmez votre mot de passe"/>
                  <Field type="email" name="email" placeholder="Email"/>
                  <div className="datepicker-container">
                  <DatePicker dateFormat="dd/MM/yyyy" placeholderText="Date de naissance" locale={fr} selected={birthDate} onChange={(date) => {
                    setFieldValue('birthDate', date); // Met à jour la valeur du champ
                    setBirthDate(date); // Met à jour l'état local
                  }}/>
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
  )
}

RegisterForm.propTypes = {
  toggleForm: PropTypes.func.isRequired,
};
