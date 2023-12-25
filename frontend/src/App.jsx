import './assets/styles/App.css'
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes/Routes"
import Navbar from './components/layouts/Navbar/Navbar';
import Footer from './components/layouts/Footer';
import { ToastContainer } from 'react-toastify';
import { NavbarVisibilityProvider } from './contexts/NavbarVisibilityContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

function App() {

  return (
    <CartProvider>
    <AuthProvider>
    <NavbarVisibilityProvider>
      <BrowserRouter>
        <div>
          <Navbar/>
          <main>
            <ToastContainer/>
            <Routes />
          </main>
          <Footer/>
        </div>
      </BrowserRouter>
    </NavbarVisibilityProvider>
    </AuthProvider>
    </CartProvider>
  )
}

export default App
