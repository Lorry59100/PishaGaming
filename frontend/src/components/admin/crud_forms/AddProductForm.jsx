import { useState, useEffect } from "react";
import axios from "axios";
import { URL, URL_SUB_LISTS, URL_ADD_PRODUCT } from "../../../constants/urls/URLBack";
import { ImCross } from "react-icons/im";
import { IconContext } from "react-icons";
import logo from "../../../assets/img/Logo.png";
import "../../../assets/styles/components/form.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import {fr} from "date-fns/locale"
import { IoIosAddCircle, IoIosRemoveCircle } from "react-icons/io";

function AddProductForm({onClose}) {
  const [editions, setEditions] = useState([]);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState([]);
  const [selectedPlatformIds, setSelectedPlatformIds] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [editionsData, setEditionsData] = useState([]);
  const [editionsFormData, setEditionsFormData] = useState([]);

  const handleTagChange = (tagId) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter(id => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  const handleGenreChange = (genreId) => {
    if (selectedGenreIds.includes(genreId)) {
      setSelectedGenreIds(selectedGenreIds.filter(id => id !== genreId));
    } else {
      setSelectedGenreIds([...selectedGenreIds, genreId]);
    }
  };

  const handlePlatformChange = (platformId) => {
    if (selectedPlatformIds.includes(platformId)) {
      setSelectedPlatformIds(selectedPlatformIds.filter(id => id !== platformId));
    } else {
      setSelectedPlatformIds([...selectedPlatformIds, platformId]);
    }
  };

  useEffect(() => {
    axios
      .get(`${URL}${URL_SUB_LISTS}`)
      .then((response) => {
        console.log(response.data);
        setGenres(response.data.genres);
        setEditions(response.data.editionCategories);
        setPlatforms(response.data.platforms);
        setCategories(response.data.categories);
        setTags(response.data.tags);

        // Ajoutez une édition par défaut
      setEditionsFormData([{ edition: '', old_price: '', price: '', img: '' }]);
        
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des sous listes :", error);
      });
  }, []);

  const handleAddEdition = () => {
    setEditionsFormData((prevEditions) => [
      ...prevEditions,
      { edition: '', old_price: '', price: '', img: '' },
    ]);
  };
  
  const handleRemoveEdition = (index) => {
    // Ne supprimez pas le premier élément
    if (index !== 0) {
      const updatedEditions = [...editionsFormData];
      updatedEditions.splice(index, 1);
      setEditionsFormData(updatedEditions);
    }
  };

  const onEditionChange = (index, field, value) => {
    const updatedEditions = [...editionsFormData];
    updatedEditions[index][field] = value;
    setEditionsFormData(updatedEditions);
  };

  const onSubmit = (values) => {
    const formattedValues = {
      ...values,
      tags: selectedTagIds, // Ajoutez le tableau des tags sélectionnés à l'objet values
      release: startDate ? startDate.toISOString() : null,
      editions: editionsFormData,
    };
    axios.post(`${URL}${URL_ADD_PRODUCT}`, {...formattedValues})
    .then((res) => {
      console.log(res)
      console.log(formattedValues)
      console.log(res.data)
    })
    .catch((error) => {
      console.log(error.response.data)
    });
  };


  return (

      <div className="add-product-panel">
        <div className="form-container">
          <div className="logo-form">
            <a href="/">
              <img src={logo} alt="logo" className="orange-logo" />
            </a>
            <h3>Pisha Gaming</h3>
          </div>
          <div className="little-form-container">
            <h3>Ajout de produit</h3>
            <div className="cutline-form first-cutline"></div>
            <Formik initialValues={{name: '', dev: '', editor: '', trailer: '', img: ''}} onSubmit={onSubmit}>
            {(formik) => (
            <Form>
              <div className="fields-container">
                <Field type="text" name="name" placeholder="Name" className="hoverize" />

                <div className="">

                <DatePicker 
                className="datepicker"
                placeholderText="Date de sortie"
                selected={startDate} 
                onChange={(date) => setStartDate(date)}
                locale={fr}
                />
                </div>

                <Field type="text" name="dev" placeholder="Développeur" />
                <Field type="text" name="editor" placeholder="Editeur" />
                <Field type="text" name="trailer" placeholder="Trailer-url" />
                
                <Field component= "select" name="category" required >
                  <option value="">Categorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Field>

                <div className="cutline-form three-span"></div>
      <h4 className="middle-column tag-title">Genres</h4>
                <div className="tag-selector three-span genre-selector">
      {genres.map((genre) => (
        <div key={genre.id} className="tag-checkbox">
          <Field
            type="checkbox"
            id={`genre-${genre.id}`}
            name={`genre-${genre.id}`}
            value={genre.id}
            checked={selectedGenreIds.includes(genre.id)}
            onChange={() => handleGenreChange(genre.id)}
          />
          <label htmlFor={`genre-${genre.id}`}>{genre.name}</label>
        </div>
      ))}
      </div>

      <div className="cutline-form three-span"></div>
      <h4 className="middle-column tag-title">Plateformes</h4>

<div className="tag-selector three-span platform-selector">
                {platforms.map((platform) => (
        <div key={platform.id} className="tag-checkbox">
          <Field
            type="checkbox"
            id={`platform-${platform.id}`}
            name={`platform-${platform.id}`}
            value={platform.id}
            checked={selectedPlatformIds.includes(platform.id)}
            onChange={() => handlePlatformChange(platform.id)}
          />
          <label htmlFor={`platform-${platform.id}`}>{platform.name}</label>
        </div>
      ))}
      </div>

                
                <Field as="textarea" name="description" placeholder="Description" className="three-span"/>
                <Field type="number" name="stock" placeholder="Stock" />
          

                <div className="tag-selector two-span">
    <div className="tag-checkboxes">
      {tags.map((tag) => (
        <div key={tag.id} className="tag-checkbox">
          <Field
            type="checkbox"
            id={`tag-${tag.id}`}
            name={`tag-${tag.id}`}
            value={tag.id}
            checked={selectedTagIds.includes(tag.id)}
            onChange={() => handleTagChange(tag.id)}
          />
          <label htmlFor={`tag-${tag.id}`}>{tag.name}</label>
        </div>
      ))}
    </div>
  </div>

  {editionsFormData.map((edition, index) => (
  <div key={index} className="edition-container">
    <Field
      component="select"
      name={`editions[${index}].edition`}
      placeholder="Edition"
      value={edition.edition}
      onChange={(e) => onEditionChange(index, 'edition', e.target.value)}
    >
      <option value="">Sélectionnez une édition</option>
      {editions.map((edition) => (
        <option key={edition.id} value={edition.id}>
          {edition.name}
        </option>
      ))}
    </Field>
    <Field
      type="number"
      name={`editions[${index}].old_price`}
      placeholder="Raw price (in cents)"
      value={edition.old_price}
      onChange={(e) => onEditionChange(index, 'old_price', e.target.value)}
    />
    <Field
      type="number"
      name={`editions[${index}].price`}
      placeholder="Price (in cents)"
      value={edition.price}
      onChange={(e) => onEditionChange(index, 'price', e.target.value)}
    />
    <Field
      type="text"
      name={`editions[${index}].img`}
      placeholder="Img-url"
      value={edition.img}
      onChange={(e) => onEditionChange(index, 'img', e.target.value)}
      className="three-span"
    />
  </div>
))}

        <div className="edition-buttons-container three-span">
          <h5 className="btn-edit-text">Ajout / Suppression</h5>
            <button type="button" onClick={handleAddEdition}>
              <IconContext.Provider value={{ size: "3em" }}>
                <IoIosAddCircle />
              </IconContext.Provider>
              </button>
          <button type="button" onClick={() => handleRemoveEdition(editionsFormData.length - 1)}>
            <IconContext.Provider value={{ size: "3em" }}>
              <IoIosRemoveCircle />
            </IconContext.Provider>
          </button>
        </div>

        </div>
  <div className="cutline-form"></div>
  <div className="btn-container">
        <button className="submit-button middle-column" type="submit">
        Ajouter
        </button>
  </div>
            </Form> 
            )}
            </Formik>
          </div>
        </div>
        
        <div className="wallpaper-container">
          <IconContext.Provider value={{ size: "1.5em" }}>
            <ImCross onClick={onClose}/>
          </IconContext.Provider>
        </div>
      </div>

  );
}

AddProductForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AddProductForm;
