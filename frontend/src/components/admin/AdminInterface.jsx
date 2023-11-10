import { useState } from "react";
import "../../assets/styles/components/admininterface.css";
import "../../assets/styles/components/button.css"
import "../../assets/styles/components/table.css"
import { BiGame } from 'react-icons/bi';
import { IconContext } from "react-icons";
import { GamesAdmin } from "./GamesAdmin";
import {AiFillFileAdd} from "react-icons/ai"
import AddProductForm from "./crud_forms/AddProductForm";

function AdminInterface() {
  const [activeButton, setActiveButton] = useState("Btn-games");
  const [isFormVisible, setIsFormVisible] = useState(false);

  function handleButtonClick(buttonText) {
    setActiveButton(buttonText);
  }

  const closeForm = () => {
    setIsFormVisible(false);
  };

  return (
    <div className="admin-interface-container">
      <div className="title-container">
        <h1>Interface Admin</h1>
        <div className="add-product-container" onClick={() => setIsFormVisible(true)}>
          <IconContext.Provider value={{ size: "2em" }}>
            <h3>Ajout</h3> <AiFillFileAdd/>
          </IconContext.Provider>
        </div>
      </div>
      <div className="panel-container">
        <div className="entity-panel">
          <button className={`submit-button ${activeButton === "Btn-games" ? "active" : ""}`} onClick={() => handleButtonClick("Btn-games")}>
          <IconContext.Provider value={{ size: "1.5em" }}>
            <BiGame/>Jeux
            </IconContext.Provider>
          </button>
          <button
            className={`submit-button ${activeButton === "Bouton 2" ? "active" : ""}`}
            onClick={() => handleButtonClick("Bouton 2")}
          >
            Bouton 2
          </button>
          <button
            className={`submit-button ${activeButton === "Bouton 3" ? "active" : ""}`}
            onClick={() => handleButtonClick("Bouton 3")}
          >
            Bouton 3
          </button>
        </div>
        <div className="table-entity">
          {activeButton === "Btn-games" && (
              <GamesAdmin/>
          )}
          {activeButton === "Bouton 2" && (
            <div className="contenu2">
              <h1>Contenu 2</h1>
            </div>
          )}
        </div>
      </div>
      {isFormVisible && <AddProductForm onClose={closeForm}/>}
    </div>
  );
}

export default AdminInterface;
