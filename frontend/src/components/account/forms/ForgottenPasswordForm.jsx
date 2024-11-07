import { Field, Form, Formik } from "formik";
import axios from "axios";

export function ForgottenPasswordForm() {
    const URL = import.meta.env.VITE_BACKEND;
    const URL_FORGOT_PASSWORD = import.meta.env.VITE_FORGOT_PASSWORD;
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await axios.post(`${URL}${URL_FORGOT_PASSWORD}`, values);
            console.log('Réponse du serveur:', response.data);
            // Vous pouvez ajouter ici des actions supplémentaires après la réussite de la requête
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
            // Vous pouvez ajouter ici des actions supplémentaires en cas d'erreur
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="forgot-password-form-container">
            <h1>Vous avez oublié votre mot de passe ?</h1>
            <Formik
                initialValues={{ email: '' }}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Field className="security-form-field" type="email" name="email" placeholder="Votre Email :"/>
                        <div className="submit-button-container">
                            <button className="submit-button forgotten-button" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Envoi en cours...' : 'Valider'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
