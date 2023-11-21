import  { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

function EditProductForm({ productId, onClose, /* autres props */ }) {
  const [productDetails, setProductDetails] = useState({
    // Initialiser les champs du formulaire avec des valeurs par défaut
    name: "",
    // ...
  });

  useEffect(() => {
    // Effectuer une requête pour obtenir les détails du produit avec l'id
    axios
      .get(`URL_DE_VOTRE_API/products/${productId}`)
      .then((response) => {
        // Mettre à jour l'état local avec les détails du produit
        setProductDetails({
          name: response.data.name,
          // Mettez à jour les autres champs en conséquence
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des détails du produit :", error);
      });
  }, [productId]);

  // Gérer les changements de champ du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique pour soumettre le formulaire, par exemple, une requête API pour mettre à jour le produit
    // ...
    // Fermer le formulaire après la soumission
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Champ du formulaire pour le nom */}
      <label>Nom:</label>
      <input
        type="text"
        name="name"
        value={productDetails.name}
        onChange={handleInputChange}
      />
      {/* Ajoutez d'autres champs du formulaire en conséquence */}
      {/* ... */}

      {/* Bouton de soumission */}
      <button type="submit">Enregistrer</button>
    </form>
  );
}

EditProductForm.propTypes = {
  productId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  // Autres déclarations de PropTypes pour les autres props
};

export default EditProductForm;
