import './assets/styles/App.css'
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes/Routes"

function App() {

  return (
    <BrowserRouter>
      <div>
        <main>
          <Routes />
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
