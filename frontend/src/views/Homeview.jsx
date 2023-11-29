import { Midbar } from "../components/bars/Midbar"
import { Noticebar } from "../components/bars/Noticebar"
import GameBanner from "../components/products/GameBanner"
import { GameStaffSelection } from "../components/products/GameStaffSelection"
import { RetroGamingSelection } from "../components/products/RetroGamingSelection"

function Homeview() {
  return (
    <div>
       <GameBanner/>
       <GameStaffSelection/>
       <Midbar/>
       <RetroGamingSelection/>
       <Noticebar/>
    </div>
  )
}

export default Homeview