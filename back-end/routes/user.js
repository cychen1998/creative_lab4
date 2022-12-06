const express = require('express')
const router = express.Router()
const User = require('../database/models/user')
const Recipe = require('../database/models/recipes')
const passport = require('../passport')

router.post('/signup', (req, res) => {
    console.log('user signup');

    const { username, password } = req.body
    // ADD VALIDATION
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            console.log('User.js post error: ', err)
        } else if (user) {
            res.json({
                error: `Sorry, already a user with the username: ${username}`
            })
        }
        else {
            const newUser = new User({
                username: username,
                password: password
            })
            newUser.save((err, savedUser) => {
                if (err) return res.json(err)
                res.json(savedUser)
            })
        }
    })
})

router.post('/login', function (req, res, next) {
        console.log('routes/user.js, login, req.body: ');
        console.log(req.body)
        next()
    },
    passport.authenticate('local'),
    (req, res) => {
        console.log('logged in', req.user);
        var userInfo = {
            username: req.user.username
        };
        res.send(userInfo);
    }
)

router.get('/', (req, res, next) => {
    console.log('Get /!!======')
    console.log(req.user)
    if (req.user) {
        res.json({ user: req.user })
    } else {
        res.json({ user: null })
    }
})

router.post('/logout', (req, res) => {
    console.log("Post logout");
    console.log(req.data)
    if (req.user) {
        console.log("calling logout")
        req.logout(function(err) {
            console.log(err);
        })
        res.send({ msg: 'logging out' })
    } else {
        res.send({ msg: 'no user to log out' })
    }
})

router.get('/recipes', async (req, res) => {
  try {
    let recipes = await Recipe.find();
    res.send({recipes: recipes});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post('/recipes', async (req, res) => {
    const recipe = new Recipe({
    name: req.body.name,
    author: req.body.author,
    quantity: parseInt(req.body.quantity),
    ingredient: req.body.ingredient,
    instruction: req.body.instruction
  });
  try {
    await recipe.save();
    res.send({recipe:recipe});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.delete('/recipes/:id', async (req, res) => {
  try {
    await Recipe.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.put('/recipes/:id', async (req, res) => {
    let quantity = req.body.temp
    try {
        let recipe = await Recipe.updateOne( { 
            _id: req.params.id
        }, {$set: {quantity}});
        res.send({recipe:recipe});
    } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router