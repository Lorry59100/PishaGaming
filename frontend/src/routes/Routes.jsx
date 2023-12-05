import { Route, Routes as RoutesContainer } from "react-router-dom";
import Homeview from "../views/Homeview";
import * as URL from "../constants/urls/URLFront"
import { SingleProductview } from "../views/SingleProductview";
import { Cartview } from "../views/Cartview";
import { Paymentview } from "../views/Paymentview";

function Routes() {
  return (
    <RoutesContainer>
        <Route path={URL.URL_HOME} element={<Homeview />} />
        <Route path={URL.URL_SINGLE_PRODUCT} element={<SingleProductview />} />
        <Route path={URL.URL_CART} element={<Cartview />} />
        <Route path={URL.URL_PAYMENT} element={<Paymentview />} />
    </RoutesContainer>
  )
}

export default Routes