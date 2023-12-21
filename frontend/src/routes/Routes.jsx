import { Route, Routes as RoutesContainer } from "react-router-dom";
import Homeview from "../views/Homeview";
import * as URL from "../constants/urls/URLFront"
import { SingleProductview } from "../views/SingleProductview";
import { Cartview } from "../views/Cartview";
import { Paymentview } from "../views/Paymentview";
import { Activationview } from "../views/Activationview";
import { Parameterview } from "../views/Parameterview";
import { VerifyEmailview } from "../views/VerifyEmailview";
import { ResendActivationTokenview } from "../views/ResendActivationTokenview";
import { ChangeMailview } from "../views/ChangeMailview";

function Routes() {
  return (
    <RoutesContainer>
        <Route path={URL.URL_HOME} element={<Homeview />} />
        <Route path={URL.URL_SINGLE_PRODUCT} element={<SingleProductview />} />
        <Route path={URL.URL_CART} element={<Cartview />} />
        <Route path={URL.URL_PAYMENT} element={<Paymentview />} />
        <Route path={URL.URL_ACTIVATION} element={<Activationview />} />
        <Route path={URL.URL_PARAMETERS} element={<Parameterview />} />
        <Route path={URL.URL_VERIFY_EMAIL} element={<VerifyEmailview />} />
        <Route path={URL.URL_CHANGE_EMAIL} element={<ChangeMailview />} />
        <Route path={URL.URL_RESEND_ACTIVATION_TOKEN} element={<ResendActivationTokenview />} />
    </RoutesContainer>
  )
}

export default Routes