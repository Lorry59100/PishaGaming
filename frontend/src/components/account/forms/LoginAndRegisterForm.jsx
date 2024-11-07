import { useState } from "react";
import { ImCross } from "react-icons/im";
import { IconContext } from "react-icons";
import logo from "../../../assets/img/Logo.png";
import "../../../assets/styles/components/form.css";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";

import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function LoginAndRegisterForm({ onCloseForm }) {
  const [showLoginAndRegisterForm, setShowLoginAndRegisterForm] = useState(true);

  const toggleForm = () => {
    setShowLoginAndRegisterForm(!showLoginAndRegisterForm);
  };

  const handleCloseForm = () => {
    setShowLoginAndRegisterForm(false);
    onCloseForm(); // Notify Navbar.jsx about form closure
  };

  const handleFormSuccess = () => {
    setShowLoginAndRegisterForm(false);
    onCloseForm(); // Ferme le composant après le succès de l'enregistrement
  };

  return (
    <div className="add-product-panel">
      <div className="form-container">
        <div className="logo-form">
          <a href="/">
            <img src={logo} alt="logo" className="orange-logo" />
            <h3>Pisha Gaming</h3>
          </a>
        </div>
        {showLoginAndRegisterForm ? (
          <LoginForm toggleForm={toggleForm} onFormSuccess={handleFormSuccess} onForgotPasswordClick={handleCloseForm} />
        ) : (
          <RegisterForm toggleForm={toggleForm} onFormSuccess={handleFormSuccess} />
        )}
      </div>
      <div className="wallpaper-container">
        <IconContext.Provider value={{ size: "1.5em" }}>
          <ImCross onClick={handleCloseForm} />
        </IconContext.Provider>
      </div>
    </div>
  );
}

LoginAndRegisterForm.propTypes = {
  onCloseForm: PropTypes.func.isRequired,
};
