const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.promise = Promise

const recipeSchema = new Schema({
  name: String,
  author: String,
  quantity: Number,
  ingredient: String,
  instruction: String,
});

recipeSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
});
  
recipeSchema.set('toJSON', {
  virtuals: true
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe
