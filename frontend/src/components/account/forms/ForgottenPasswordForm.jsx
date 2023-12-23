import { Field, Form, Formik } from "formik";

export function ForgottenPasswordForm() {
    return (
        <div className="forgotten-password-form-container">
            <h1>Vous avez oublié votre mot de passe ?</h1>
            <Formik>
                <Form>
                    <Field className="security-form-field" type="email" name="email" placeholder="Votre Email :"/>
                    <div className="submit-button-container"><button className="submit-button forgotten-button" type="submit">Valider</button></div>
                </Form>
            </Formik>
        </div>
    )
}
