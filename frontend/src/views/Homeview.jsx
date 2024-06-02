import { Midbar } from "../components/bars/Midbar"
import { Noticebar } from "../components/bars/Noticebar"
import Genres from "../components/products/Genres"
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
       <Genres/>
    </div>
  )
}

export default Homeview