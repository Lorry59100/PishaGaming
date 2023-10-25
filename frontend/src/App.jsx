import './assets/styles/App.css'
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes/Routes"
import Navbar from './components/layouts/Navbar/Navbar';
import Footer from './components/layouts/Footer';

function App() {

  return (
    <BrowserRouter>
      <div>
        <Navbar/>
        <main>
          <Routes />
        </main>
        <Footer/>
      </div>
    </BrowserRouter>
  )
}

export default App
