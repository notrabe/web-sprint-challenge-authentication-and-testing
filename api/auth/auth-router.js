const router = require('express').Router();
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {jwtSecret} = require('./secret')
const Users = require('../users/users-model')
const {isValid} = require('../users/users-service')


router.post('/register', (req, res) => {
  res.end('implement register, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */

  const credentials = req.body;
  if(isValid(credentials)){
    const rounds = process.env.BCRYPT_ROUNDS || 8

    const hash = bcryptjs.hashSync(credentials.password, rounds)

    credentials.password = hash

    Users.add(credentials)
      .then(user => {
        res.status(201).json({data: user})
      })
      .catch(err => {
        res.status(500).json({message: err.message})
      })
  } else {
    res.status(400).json({
      message: 'please provide valid username and password'
    })
  }
});

router.post('/login', async (req, res, next) => {
  res.end('implement login, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */

  try {
    const {username,password} = req.body
    const user = await Users.getBy({username})

    if (user.length === 0) {
      return res.status(401).json({ message: 'Inavid.'})
    }

    const passwordValid = bcryptjs.compareSync(password, user[0].password)

    if(!passwordValid) {
      return res.status(401).json({message: 'invalid password.'})
    }

    const token = jwt.sign(
      {
        userID: user.id,
      },
      process.env.JWT_SECRET
    )

    res.cookie('token', token)
    res.json({ token, message: `Hello ${user[0].username}`})
  }

  catch (err) {
    next(err)
  }
});

module.exports = router;