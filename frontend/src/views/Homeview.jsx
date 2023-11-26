import { LoginAndRegisterForm } from "../components/account/forms/LoginAndRegisterForm"
import { Midbar } from "../components/bars/Midbar"
import { Noticebar } from "../components/bars/Noticebar"
import GameBanner from "../components/products/GameBanner"
import { GameStaffSelection } from "../components/products/GameStaffSelection"
import { RetroGamingSelection } from "../components/products/RetroGamingSelection"

function Homeview() {
  return (
    <div>
      <LoginAndRegisterForm/>
       <GameBanner/>
       <GameStaffSelection/>
       <Midbar/>
       <RetroGamingSelection/>
       <Noticebar/>
    </div>
  )
}

export default Homeview