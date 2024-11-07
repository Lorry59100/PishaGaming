import { Route, Routes as RoutesContainer } from "react-router-dom";
import { Homeview }from "../views/Homeview";
import { SingleProductview } from "../views/SingleProductview";
import { Cartview } from "../views/Cartview";
import { Paymentview } from "../views/Paymentview";
import { Activationview } from "../views/Activationview";
import { VerifyEmailview } from "../views/VerifyEmailview";
import { ResendActivationTokenview } from "../views/ResendActivationTokenview";
import { ChangeMailview } from "../views/ChangeMailview";
import { ForgottenPasswordview } from "../views/ForgottenPasswordview";
import { SingleOrderHistoricview } from "../views/SingleOrderHistoricview";
import { Searchview } from "../views/Searchview";
import ResetPasswordview from "../views/ResetPasswordview";

function Routes() {
  const URL_HOME = import.meta.env.VITE_HOME;
  const URL_SINGLE_PRODUCT = import.meta.env.VITE_SINGLE_PRODUCT_FRONT;
  const URL_CART = import.meta.env.VITE_CART;
  const URL_PAYMENT = import.meta.env.VITE_PAYMENT;
  const URL_ACTIVATION = import.meta.env.VITE_ACTIVATION;
  const URL_VERIFY_EMAIL = import.meta.env.VITE_VERIFY_EMAIL;
  const URL_CHANGE_EMAIL = import.meta.env.VITE_CHANGE_EMAIL;
  const URL_RESEND_ACTIVATION_TOKEN = import.meta.env.VITE_RESEND_ACTIVATION_TOKEN;
  const URL_FORGOTTEN_PASSWORD = import.meta.env.VITE_FORGOTTEN_PASSWORD;
  const URL_RESET_PASSWORD = import.meta.env.VITE_RESET_PASSWORD_FRONT;
  const URL_SEARCH = import.meta.env.VITE_SEARCH;
  const URL_SINGLE_ORDER_HISTORIC = import.meta.env.VITE_SINGLE_ORDER_HISTORIC;
  return (
    <RoutesContainer>
        <Route path={URL_HOME} element={<Homeview />} />
        <Route path={URL_SINGLE_PRODUCT} element={<SingleProductview />} />
        <Route path={URL_CART} element={<Cartview />} />
        <Route path={URL_PAYMENT} element={<Paymentview />} />
        <Route path={URL_ACTIVATION} element={<Activationview />} />
        <Route path={URL_VERIFY_EMAIL} element={<VerifyEmailview />} />
        <Route path={URL_CHANGE_EMAIL} element={<ChangeMailview />} />
        <Route path={URL_RESEND_ACTIVATION_TOKEN} element={<ResendActivationTokenview />} />
        <Route path={URL_FORGOTTEN_PASSWORD} element={<ForgottenPasswordview />} />
        <Route path={URL_RESET_PASSWORD + "/:token"} element={<ResetPasswordview />} />
        <Route path={URL_SEARCH} element={<Searchview/>} />
        <Route path={URL_SINGLE_ORDER_HISTORIC + "/:reference"} element={<SingleOrderHistoricview />} />
    </RoutesContainer>
  )
}

export default Routes