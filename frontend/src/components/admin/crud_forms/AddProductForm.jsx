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

function AddProductForm({onClose}) {
  const [editions, setEditions] = useState([]);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [startDate, setStartDate] = useState(null);

  const handleTagChange = (tagId) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter(id => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
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
        
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des sous listes :", error);
      });
  }, []);

  const onSubmit = (values) => {
    const formattedValues = {
      ...values,
      tags: selectedTagIds, // Ajoutez le tableau des tags sélectionnés à l'objet values
      release: startDate ? startDate.toISOString() : null,
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
            <div className="cutline-form"></div>
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
                <Field type="text" name="img" placeholder="Img-url" />

                <Field component= "select" name="category" required >
                  <option value="">Categorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Field>
                <Field component= "select" name="edition" required>
                  <option value="">Edition</option>
                  {editions.map((edition) => (
                    <option key={edition.id} value={edition.id}>
                      {edition.name}
                    </option>
                  ))}
                </Field>
                <Field component= "select" name="genre" required>
                  <option value="">Genre</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </Field>
                <Field component= "select" name="platform" required>
                  <option value="">Platforme</option>
                  {platforms.map((platform) => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </Field>

                <Field type="number" name="old_price" placeholder="Raw price (in cents)" />
                <Field type="number" name="price" placeholder="Price (in cents)" />
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
