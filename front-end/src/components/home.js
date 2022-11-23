import React, { Component } from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

function Home() {

     // setup state
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState();
  const [ingredients, setIngredients] = useState("");

  const fetchRecipes = async() => {
    try {      
      const response = await axios.get("/user/recipes");
      setRecipes(response.data.recipes);
    } catch(error) {
      setError("error retrieving recipes: " + error);
    }
  }
  const createRecipe = async() => {
    try {
      await axios.post("/user/recipes", {name: name, quantity: quantity, ingredients: ingredients});
    } catch(error) {
      setError("error adding a recipe: " + error);
    }
  }
  const deleteOneRecipe = async(recipe) => {
    try {
      await axios.delete("/user/recipes/" + recipe.id);
    } catch(error) {
      setError("error deleting a recipe" + error);
    }
  }

  // fetch ticket data
  useEffect(() => {
    fetchRecipes();
  },[]);

  const addRecipe = async(e) => {
    e.preventDefault();
    await createRecipe();
    fetchRecipes();
    setName("");
    setQuantity();
    setIngredients("");
  }

  const deleteRecipe = async(recipe) => {
    await deleteOneRecipe(recipe);
    fetchRecipes();
  }

  //const loggedIn = this.props.loggedIn;

  // render results
  return (
    <div className="App">
      {error}
            <h1>Create a Recipe</h1>
            <form onSubmit={addRecipe}>
              <div>
                <label>
                  Name:
                  <input type="text" value={name} onChange={e => setName(e.target.value)} />
                </label>
              </div>
              <div>
                <label>
                  Quantity:
                  <input type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value))} />
                </label>
              </div>
              <div>
                <label>
                  Ingredients:
                  <textarea value={ingredients} onChange={e => setIngredients(e.target.value)}></textarea>
                </label>
              </div>
              <input type="submit" value="Submit" />
            </form>
            <h1>Recipes</h1>
            {recipes.map( recipe => (
              <div key={recipe.id} className="recipe">
                <div className="ingredient">
                  <p>{recipe.name}&emsp;{recipe.quantity}</p>
                  <p><i>{recipe.ingredients}</i></p>
                </div>
                <button onClick={e => deleteRecipe(recipe)}>Delete</button>
              </div>
            ))} 
    </div>
  );
}

export default Home
