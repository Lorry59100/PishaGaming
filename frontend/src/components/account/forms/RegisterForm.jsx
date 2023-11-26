import { useState  } from "react";
import { Formik, Form, Field } from 'formik';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {fr} from "date-fns/locale";
export function RegisterForm() {
    const [startDate, setStartDate] = useState(null);
  return (
    <div className="little-form-container">
            <Formik initialValues={{}} onSubmit={""}>
              <Form>
                <div className="register-fields-container">
                  <Field type="text" name="firstname" placeholder="Prénom"/>
                  <Field type="text" name="lastname" placeholder="Nom"/>
                  <Field type="password" name="password" placeholder="Votre mot de passe"/>
                  <Field type="password" name="password" placeholder="Confirmez votre mot de passe"/>
                  <Field type="email" name="email" placeholder="Email"/>
                  <div className="datepicker-container">
              <DatePicker 
              className="datepicker"
              placeholderText="Date de naissance"
              selected={startDate} 
              onChange={(date) => setStartDate(date)}
              locale={fr}
              />
            </div>
                </div>
                <div className="legal">
                <input type="checkbox" name="legal" id="" />
                J'accepte les conditions de ventes et la politique de confidentialité
                </div>
                <div className="btn-container">
                  <button className="submit-button middle-column" type="submit">
                    Créer un compte
                  </button>
                </div>
              </Form> 
            </Formik>
            <div className="back">
              <button>&lt;&lt; Retour</button>
            </div>
          </div>
  )
}
