import { Route, Routes as RoutesContainer } from "react-router-dom";
import Homeview from "../views/Homeview";
import * as URL from "../constants/urls/URLFront"
import { SingleProductview } from "../views/SingleProductview";
import { Cartview } from "../views/Cartview";

function Routes() {
  return (
    <RoutesContainer>
        <Route path={URL.URL_HOME} element={<Homeview />} />
        <Route path={URL.URL_SINGLE_PRODUCT} element={<SingleProductview />} />
        <Route path={URL.URL_CART} element={<Cartview />} />
    </RoutesContainer>
  )
}

export default Routes