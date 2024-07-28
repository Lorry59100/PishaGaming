import { useState, useEffect, useRef, useCallback } from "react";
import { HiMiniComputerDesktop, HiMiniMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { SlArrowDown } from "react-icons/sl";
import { BsPlaystation, BsXbox, BsNintendoSwitch } from "react-icons/bs";
import { IconContext } from "react-icons";
import "../../../assets/styles/components/searchbar.css";
import { useNavigate } from "react-router-dom";

function Searchbar() {
  const [areConsolesVisible, setConsolesVisible] = useState(true);
  const [isSearchClicked, setSearchClicked] = useState(false);
  const [isSearchExpanded, setSearchExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const searchbarRef = useRef(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    navigate(`/search?q=${event.target.value}`);
  };

  const handleSearchClick = () => {
    setSearchClicked(!isSearchClicked);
    setConsolesVisible(!areConsolesVisible);
    if (isSearchClicked) {
      setSearchQuery("");
      // Vérifiez si la query est vide avant de naviguer
      if (searchQuery === "") {
        setConsolesVisible(true);
      } else {
        navigate("/search");
      }
    }
  };

  const handleClickOutside = useCallback((event) => {
    if (searchbarRef.current && !searchbarRef.current.contains(event.target) && searchQuery === "") {
      setSearchClicked(false);
      setConsolesVisible(true);
    }
  }, [searchQuery]);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (isSearchClicked && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchClicked]);

  useEffect(() => {
    const handleScroll = () => {
      const isTop = window.scrollY < 10;
      if (isTop !== isSearchExpanded) {
        setSearchExpanded(isTop);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isSearchExpanded]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className={`searchbar ${isSearchExpanded ? "expanded" : ""}`} ref={searchbarRef}>
      <div className="searchbar-layout-container">
        <div className="consoles">
          {areConsolesVisible && (
            <div className="console first-console">
              <a href="/">
                <IconContext.Provider value={{ size: "1.5em", color: "white" }}>
                  <HiMiniComputerDesktop />
                </IconContext.Provider>
                <h5>PC</h5>
                <IconContext.Provider value={{ size: "0.8em", color: "white" }}>
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
                <IconContext.Provider value={{ size: "0.8em", color: "white" }}>
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
                <IconContext.Provider value={{ size: "0.8em", color: "white" }}>
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
                <IconContext.Provider value={{ size: "0.8em", color: "white" }}>
                  <SlArrowDown />
                </IconContext.Provider>
              </a>
            </div>
          )}
        </div>
        <div className={`searchbar-container ${isSearchExpanded ? "expanded" : ""}`}>
          {isSearchClicked && (
            <form className="search-input" onSubmit={handleSubmit}>
              <input
                type="text"
                className="searchbar-input"
                placeholder="Minecraft, RPG, multijoueur..."
                value={searchQuery}
                onChange={handleSearchChange}
                ref={searchInputRef}
              />
              <p>
                <a href="/search">Recherche avancée</a>
              </p>
            </form>
          )}
          <div className={`search-icon ${isSearchExpanded ? "expanded" : ""}`} onClick={handleSearchClick}>
            <IconContext.Provider value={{ size: "1.2em" }}>
              {isSearchClicked ? <HiMiniXMark /> : <HiMiniMagnifyingGlass />}
            </IconContext.Provider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Searchbar;
