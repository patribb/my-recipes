import { useState, useEffect } from "react";
import { db } from "./firebase.config";
import { collection, onSnapshot, doc, addDoc, deleteDoc } from "firebase/firestore";

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState({
    title: "",
    desc: "",
    ingredients: [],
    steps: [],
  });
  const [popupActive, setPopupActive] = useState(false);

  const recipesCollectionRef = collection(db, "recipes");

  useEffect(() => {
    onSnapshot(recipesCollectionRef, (snapshot) => {
      setRecipes(
        snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            viewing: false,
            ...doc.data(),
          };
        })
      );
    });
  }, []);

  const handleView = (id) => {
    const recipesClone = [...recipes];
    recipesClone.forEach((recipe) => {
      if (recipe.id === id) {
        recipe.viewing = !recipe.viewing;
      } else {
        recipe.viewing = false;
      }
    });
    setRecipes(recipesClone)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.desc || !form.ingredients || !form.steps) {
      alert('Por favor, rellena todos los campos')
      return
    }
    addDoc(recipesCollectionRef, form)
    setForm({
      title: "",
      desc: "",
      ingredients: [],
      steps: [],
    });
    setPopupActive(false)
  }

  const handleIngredient = (e, i) => {
    const ingredientsClone = [...form.ingredients]
    ingredientsClone[i] = e.target.value
    setForm({
      ...form,
      ingredients: ingredientsClone
    })
  }

  const handleStep = (e, i) => {
    const stepsClone = [...form.steps]
    stepsClone[i] = e.target.value
    setForm({
      ...form,
      steps: stepsClone
    })
  }

  const handleIngredientCount = () => {
    setForm({
      ...form,
      ingredients: [...form.ingredients, ""]
    })
  }

  const handleStepCount = () => {
    setForm({
      ...form,
      steps: [...form.steps, ""]
    })
  }

  const removeRecipe = id => {
    deleteDoc(doc(db, 'recipes', id))
  }

  return (
    <div className="App">
      <h1>🍲- GARCIA'S RECETAS -🍲</h1>
      <button onClick={() => setPopupActive(!popupActive)}>Añadir receta</button>
      <div className="recipes">
        {recipes.map((recipe, i) => (
          <div className="recipe" key={recipe.id}>
            <h3> {recipe.title}</h3>
            <p dangerouslySetInnerHTML={{ __html: recipe.desc }}></p>
            <hr />
            {recipe.viewing && (
              <div>
                <h4>Ingredientes</h4>
                <ul>
                  {recipe.ingredients.map((ingredient, i) => (
                    <li className="" key={i}>
                      {ingredient}
                    </li>
                  ))}
                </ul>
                <hr />
                <h4>Preparación</h4>
                <ol>
                  {recipe.steps.map((step, i) => (
                    <>
                    <li key={i}>{step}</li> 
                    <hr />
                    </>
                  ))}
                </ol>
              </div>
            )}
            <div className="buttons">
              <button onClick={() => handleView(recipe.id)}>
                Ver {recipe.viewing ? "menos" : "más"}
              </button>
              <button className="remove" onClick={() => removeRecipe(recipe.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
      {popupActive && <div className="popup">
        <div className="popup-inner">
          <h2>Crear nueva receta</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Título</label>
              <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea type="text" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Ingredientes</label>
              {form.ingredients.map((ingredient, i) => (
                <input type="text" key={i} value={ingredient} onChange={e => handleIngredient(e, i)} />
              ))}
              <button type='button' onClick={handleIngredientCount}>Añadir ingrediente</button>
            </div>
            <div className="form-group">
              <label>Pasos</label>
              {form.steps.map((step, i) => (
                <textarea type="text" key={i} value={step} onChange={e => handleStep(e, i)} />
              ))}
              <button type='button' onClick={handleStepCount}>Añadir paso</button>
            </div>
            <div className="buttons">
              <button type='submit'>Enviar</button>
              <button type='button' className='remove' onClick={() => setPopupActive(false)}>Cerrar</button>
            </div>
          </form>
        </div>
      </div>}
    </div>
  );
};

export default App;
