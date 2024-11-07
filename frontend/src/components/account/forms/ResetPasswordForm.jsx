import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastError, ToastImportantSuccess } from "../../services/toastService";
import '../../../assets/styles/components/resetpassword.css';

function ResetPasswordForm() {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    console.log(token)
    const URL = import.meta.env.VITE_BACKEND;
    const URL_CHECK_TOKEN = import.meta.env.VITE_CHECK_TOKEN;
    const URL_RESET_PASSWORD = import.meta.env.VITE_RESET_PASSWORD_BACK;

    useEffect(() => {
            axios.post(`${URL}${URL_CHECK_TOKEN}`, {token})
                .catch(error => {
                    ToastError(error.response.data.error)
                });

    }, [token, URL, URL_CHECK_TOKEN]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (newPassword === confirmNewPassword) {
            axios.post(`${URL}${URL_RESET_PASSWORD}`, { token, newPassword })
                .then(response => {
                    ToastImportantSuccess(response.data.message);
                })
                .catch(error => {
                    ToastError(error.response.data.error)
                });
        } else {
            ToastError('Les mots de passe ne correspondent pas.');
        }
    };

    return (
    <div className="reset-password-form-container">
        <form className='reset-password-form' onSubmit={handleSubmit}>
        <input
                    type="password"
                    className="new-password-input"
                    placeholder="Votre nouveau mot de passe"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                    type="password"
                    className="confirm-new-password-input"
                    placeholder="Confirmez votre nouveau mot de passe"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
                <button type="submit" className="submit-button">Réinitialiser le mot de passe</button>
        </form>
    </div>
    )
}

export default ResetPasswordForm