import { Route, Routes as RoutesContainer } from "react-router-dom";
import Homeview from "../views/Homeview";
import * as URL from "../constants/urls/URLFront"

function Routes() {
  return (
    <RoutesContainer>
        <Route path={URL.URL_HOME} element={<Homeview />} />
    </RoutesContainer>
  )
}

export default Routes