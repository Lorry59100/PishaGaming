import "../../assets/styles/components/parameters.css";
import { PiUserBold } from "react-icons/pi";
import { IconContext } from "react-icons";
import { MdOutlineSettings } from "react-icons/md";
import { Link, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Parameters } from "./forms/Parameters";
import  OrderHistoric  from "./OrderHistoric";
import { URL_ACCOUNT, URL_ORDER_HISTORIC, URL_PARAMETERS } from "../../constants/urls/URLFront";

function Account() {
  const location = useLocation();
  return (
    <div className="account-container">
    <div className="parameters-container">
      <IconContext.Provider value={{ size: "4em" }}>
        <PiUserBold className="user-icon-circled user-icon-circled-big" />
      </IconContext.Provider>
      <h1>Kikoo</h1>
      <h4>Membre depuis : nov. 28, 2017</h4>
      <div className="links-selector">
        <div className="main-links">
          <Link to={`${URL_ACCOUNT}${URL_ORDER_HISTORIC}`} className={location.pathname === `${URL_ACCOUNT}${URL_ORDER_HISTORIC}` ? "active" : ""}>
              <span>Mes achats</span>
              <div className="active-link-line"></div>
          </Link>
          <Link to="/account/wishlist" className={location.pathname === "/account/wishlist" ? "active" : ""}>
              <span>Wishlist</span>
              <div className="active-link-line"></div>
          </Link>
          <Link to="/account/tests" className={location.pathname === "/account/tests" ? "active" : ""}>
              <span>Tests</span>
              <div className="active-link-line"></div>
          </Link>
        </div>
        <div className="parameters-link">
          <Link to={`${URL_ACCOUNT}${URL_PARAMETERS}`} className={location.pathname === `${URL_ACCOUNT}${URL_PARAMETERS}` ? "active" : ""}>
            <IconContext.Provider value={{ size: "1.5em" }}>
              <MdOutlineSettings />
            </IconContext.Provider>
              <span>Paramètres</span>
              <div className="active-parameters-line"></div>
          </Link>
        </div>
      </div>
      <div className="cutline-form cutline-form-big cutline-form-margin"></div>
      <Outlet />
    </div>
    </div>
  );
}

/* function MyPurchases() {
  return <div>My Purchases content</div>;
} */

function Wishlist() {
  return <div>Wishlist content</div>;
}

function Tests() {
  return <div>Tests content</div>;
}

export default function AccountPage() {
  return (
    <Routes>
      <Route path={URL_ACCOUNT} element={<Account />}>
        {/* <Route index element={<MyPurchases />} /> */}
        <Route path={`${URL_ACCOUNT}${URL_ORDER_HISTORIC}`} element={<OrderHistoric />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="tests" element={<Tests />} />
        <Route path={`${URL_ACCOUNT}${URL_PARAMETERS}`} element={<Parameters />} />
      </Route>
    </Routes>
  );
}
