import { Route, Routes as RoutesContainer } from "react-router-dom";
import Homeview from "../views/Homeview";
import * as URL from "../constants/urls/URLFront"
import AdminView from "../views/AdminView";

function Routes() {
  return (
    <RoutesContainer>
        <Route path={URL.URL_HOME} element={<Homeview />} />
        <Route path={URL.URL_ADMIN} element={<AdminView />} />
    </RoutesContainer>
  )
}

export default Routes