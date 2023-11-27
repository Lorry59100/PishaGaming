import { ImCross } from "react-icons/im";
import { IconContext } from "react-icons";
import logo from "../../../assets/img/Logo.png";
import "../../../assets/styles/components/form.css";
import "react-datepicker/dist/react-datepicker.css";

import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function LoginAndRegisterForm() {
  return (
      <div className="add-product-panel">
        <div className="form-container">
          <div className="logo-form">
            <a href="/">
            <img src={logo} alt="logo" className="orange-logo" />
            <h3>Pisha Gaming</h3>
            </a>
          </div>
          <LoginForm/>
          {/* <RegisterForm/> */}
        </div>
        <div className="wallpaper-container">
        <IconContext.Provider value={{ size: "1.5em" }}>
        <ImCross onClick={""}/>
        </IconContext.Provider>
        </div>
      </div>
);
}
