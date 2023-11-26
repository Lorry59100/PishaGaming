import { Formik, Form, Field } from 'formik';
import { FaFacebookF } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { IconContext } from "react-icons";
export function LoginForm() {
  return (
    <div className="little-form-container">
            <h2>Se connecter</h2>
            <div className="logo-container">
              <div className="single-logo fb-logo">
                <IconContext.Provider value={{ size: "1.5em" }}>
                  <FaFacebookF />
                </IconContext.Provider>
              </div>
              <div className="single-logo fb-logo">
                <IconContext.Provider value={{ size: "1.5em" }}>
                  <FaFacebookF />
                </IconContext.Provider>
              </div>
              <div className="single-logo fb-logo">
                <IconContext.Provider value={{ size: "1.5em" }}>
                  <FaFacebookF />
                </IconContext.Provider>
              </div>
              <div className="single-logo fb-logo">
                <IconContext.Provider value={{ size: "1.5em" }}>
                  <FaFacebookF />
                </IconContext.Provider>
              </div>
            </div>
            <div className="cutline-form first-cutline">
              <span className="cutline-text">OU</span>
            </div>
            <Formik initialValues={{}} onSubmit={""}>
              <Form>
                <div className="fields-container">
                  <Field type="email" name="email" placeholder="Email"/>
                  <Field type="password" name="password" placeholder="*********"/>
                </div>
                <div className="btn-container">
                  <button className="submit-button middle-column" type="submit">
                  Se connecter
                  </button>
                </div>
              </Form> 
            </Formik>
            <div className="switch">
              <button>Pas encore de compte ?</button>
              <Link>Mot de passe oublié ?</Link>
            </div>
          </div>
  )
}
