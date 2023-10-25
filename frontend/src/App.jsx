import './assets/styles/App.css'
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes/Routes"
import Navbar from './components/layouts/Navbar/Navbar';

function App() {

  return (
    <BrowserRouter>
      <div>
        <Navbar/>
        <main>
          <Routes />
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
