const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');

//Create new user
router.post('/register', async (req, res) => {
  const { name, lastName, email, username, password } = req.body;
  //check for existing email or username
  const emailExists = await User.findOne({ email });
  if (emailExists) return res.status(400).send('User with this email already exists!');
  const usernameExists = await User.findOne({ username });
  if (usernameExists) return res.status(400).send('User with this username already exists!');

  //Encrypt password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //Create and save new user
  const user = new User({
    name,
    lastName,
    email,
    username,
    password: hashedPassword
  })
  try {
    const savedUser = await user.save();
    res.status(200).send(`New user created with the username ${savedUser.username}!`)
  } catch (err) {
    res.status(400).send(err)
  }
})
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  //check for user
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).send({ errMessage: 'Login failed, no such user/password combination!' })
  }
  //is password correct?
  const correctPassword = await bcrypt.compare(password, user.password);
  if (!correctPassword) return res.status(400).send('Login failed, no such user/password combination!');

  //Create and assign a jwt token
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  try {
    res.header('auth-token', token).send(token)
  } catch (error) {
    res.status(400).send(error)
  }
})

//get username
router.get('/username', verify, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) return res.status(404).send('no user found')
  res.status(200).send(user.username)
})
//delete a user
router.delete('/deleteuser', verify, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    return res.status(400).send({ errMessage: 'user not found' })
  } else {
    User.deleteOne({ _id: user._id }, (err, user) => {
      if (err) {
        return res.status(400).send({ errMessage: 'someting went wrong' })
      } else {
        res.status(200).send('user deleted');
      }
    })
  }

})

module.exports = router; 