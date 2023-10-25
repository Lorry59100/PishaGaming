import {useState, useEffect} from 'react'
import { HiMiniComputerDesktop, HiMiniMagnifyingGlass } from 'react-icons/hi2';
import { SlArrowDown } from 'react-icons/sl';
import { BsPlaystation, BsXbox, BsNintendoSwitch } from 'react-icons/bs';
import { IconContext } from "react-icons";
import "../../../assets/styles/components/searchbar.css"

function Searchbar() {
    const [areConsolesVisible, setConsolesVisible] = useState(true);
    const [isSearchClicked, setSearchClicked] = useState(false);
    const [isSearchExpanded, setSearchExpanded] = useState(true);


    const handleSearchClick = () => {
        setSearchClicked(!isSearchClicked);
        setConsolesVisible(!areConsolesVisible)
    };

    useEffect(() => {
        const handleScroll = () => {
          const isTop = window.scrollY < 10;
          if (isTop !== isSearchExpanded) {
            setSearchExpanded(isTop);
          }
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, [isSearchExpanded]);
    
  return (
    <div className={`searchbar ${isSearchExpanded ? 'expanded' : ''}`}>
<div className="searchbar-layout-container">
        <div className="consoles">
            {areConsolesVisible && (
            <div className="console">
                <a href="/">
                    <IconContext.Provider value={{ size: "1.5em", color: "white" }}>
                        <HiMiniComputerDesktop />
                    </IconContext.Provider>
                <h5>PC</h5>
                    <IconContext.Provider value={{ size: "1em", color: "white" }}>
                        <SlArrowDown />
                    </IconContext.Provider>
                </a>
            </div>
            )}

            {areConsolesVisible && (
            <div className="console">
                <a href="/">
                    <IconContext.Provider value={{ size: "1.5em", color: "white" }}>
                        <BsPlaystation />
                    </IconContext.Provider>
                <h5>Playstation</h5>
                    <IconContext.Provider value={{ size: "1em", color: "white" }}>
                        <SlArrowDown />
                    </IconContext.Provider>
                </a>
            </div>
            )}

            {areConsolesVisible && (
            <div className="console">
                <a href="/">
                    <IconContext.Provider value={{ size: "1.5em", color: "white" }}>
                        <BsXbox />
                    </IconContext.Provider>
                <h5>Xbox</h5>
                    <IconContext.Provider value={{ size: "1em", color: "white" }}>
                        <SlArrowDown />
                    </IconContext.Provider>
                </a>
            </div>
            )}

            {areConsolesVisible && (
            <div className="console last-console">
                <a href="/">
                    <IconContext.Provider value={{ size: "1.5em", color: "white" }}>
                        <BsNintendoSwitch />
                    </IconContext.Provider>
                <h5>Nintendo</h5>
                    <IconContext.Provider value={{ size: "1em", color: "white" }}>
                        <SlArrowDown />
                    </IconContext.Provider>
                </a>
            </div>
            )}
        </div>
                <div className={`searchbar-container ${isSearchExpanded ? 'expanded' : ''}`}>
                {isSearchClicked && (
                    <div className="search-input">
                        <input type="text" placeholder='Minecraft, RPG, multijoueur...' />
                        <p><a href="/">Recherche avancée</a></p>
                    </div>
                )}
                    <div className={`search-icon ${isSearchExpanded ? 'expanded' : ''}`} onClick={handleSearchClick}>
                    <IconContext.Provider value={{ size: "1.2em" }}>
                        <HiMiniMagnifyingGlass />
                    </IconContext.Provider>
                    </div>
                </div>
    </div>
    </div>
  )
}

export default Searchbar