import ResetPasswordForm from "../components/account/forms/ResetPasswordForm"

function ResetPasswordview() {
    //Récupérer le token
    //Vérifier si le token est expiré
  return (
    <div className="reset-password-view-container">
      <ResetPasswordForm/>
    </div>
  )
}

export default ResetPasswordview