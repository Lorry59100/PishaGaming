import { Field, Form, Formik } from "formik";
/* import { URL, URL_ACTIVATION_TOKEN_AGAIN } from "../../constants/urls/URLBack"; */
import axios from "axios";

export function ResendActivationToken() {
    const URL = import.meta.env.VITE_BACKEND;
    const URL_ACTIVATION_TOKEN_AGAIN = import.meta.env.VITE_ACTIVATION_TOKEN_AGAIN;

    const onSubmit=(values) => {
        console.log(values);
    
        axios.post(`${URL}${URL_ACTIVATION_TOKEN_AGAIN}`, {
          email: values.email,
        })
        .then((response) => {
          console.log('Response data', response.data);
          if (response.status === 200) {
            console.log(response.data)
        }
        })
        .catch((error) => {
            console.log(error)
        });
      };
    
    return (
        <div className="resend-activation-token-container">
            <h1>Obtenir un nouveau lien d'activation</h1>
            <Formik initialValues={{ email: '' }} onSubmit={onSubmit}>
                <Form className="token-again-form-container">
                    <Field type="email" name="email" placeholder="Entrez votre mail"></Field>
                    <button className="submit-button " type="submit">Valider</button>
                </Form>
            </Formik>
        </div>
    )
}
