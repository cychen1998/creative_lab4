import React, { Component } from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

function Home() {

     // setup state
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [quantity, setQuantity] = useState();
  const [ingredient, setIngredient] = useState("");
  const [instruction, setInstruction] = useState("");

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
      await axios.post("/user/recipes", {name: name, author: author, quantity: quantity, ingredient: ingredient, instruction: instruction});
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
    setAuthor("");
    setQuantity();
    setIngredient("");
    setInstruction("");
  }

  const deleteRecipe = async(recipe) => {
    await deleteOneRecipe(recipe);
    fetchRecipes();
  }
  
  const decrease = async(item) => {
    try {
      let temp = parseInt(item.quantity - 1);
      await axios.put("/user/recipes/" + item.id, {temp});
    } catch(error) {
      setError("error decreasing quantity" + error);
    }
  }
  
  const increase = async(item) => {
    try {
      let temp = parseInt(item.quantity + 1);
      await axios.put("/user/recipes/" + item.id, {temp});
    } catch(error) {
      setError("error increasing quantity" + error);
    }
  }
  
  const decreaseQuantity = async(item) => {
    await decrease(item);
    fetchRecipes();
    setQuantity(item.quantity);
  }
  
  const increaseQuantity = async(item) => {
    await increase(item);
    fetchRecipes();
    setQuantity(item.quantity);
  }

  //const loggedIn = this.props.loggedIn;
  // render results
  return (
    <div className="App">
      {error}
            <h1>Create a Recipe</h1>
      <div>
            <form onSubmit={addRecipe} className="form">
              <div className="Name">
                <label for="name" className="name">Reciple Name:</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="By">
                <label className="by">By:</label>
                <input type="text" value={author} onChange={e => setAuthor(e.target.value)} />
              </div>
              <div className ="Quantity">
                <label className="quantity">Serving size: </label>
                <input type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value))} />
              </div>
              <div className="Ingredients">
                <label className="ingredient">Ingredients:</label>
                <textarea  rows='5' cols='30' value={ingredient} onChange={e => setIngredient(e.target.value)}></textarea>
              </div>
              <div className="Instructions">
                <label className="instruction">Instructions:</label>
                <textarea rows="5" cols='30' value={instruction} onChange={e => setInstruction(e.target.value)}></textarea>
              </div>
              <input type="submit" value="Submit" />
            </form>
      <div>
            
            
            
            <h1>Recipes</h1>
            {recipes.map( recipe => (
              <div key={recipe.id} className="recipe">
                <div className="instruction">
                  <h4>{recipe.name}</h4>
                  <p> By: {recipe.author}</p>
                  <div class="lol">
                  <h5> Ingredients </h5>
                  <p> for {recipe.quantity} servings </p>
                  <button onClick={e => decreaseQuantity(recipe)}>-</button>
                  <button onClick={e => increaseQuantity(recipe)}>+</button>
                  <p className = "description" >{recipe.ingredient}</p>
                  
                  <h5> Instructions </h5>
                  <p className = "description" >{recipe.instruction}</p>
                  </div>
                </div>
                <button onClick={e => deleteRecipe(recipe)}>Delete</button>
              </div>
            ))}
            </div>
          </div>
        </div>
  );
}

export default Home
