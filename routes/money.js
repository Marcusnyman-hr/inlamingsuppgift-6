const router = require('express').Router();
const verify = require('./verifyToken');
const User = require('../model/User');

//Get all entries
router.get('/', verify, async (req, res) => {
  const user = await User.findOne({_id: req.user._id});
  const money = {
    income:[...user.income],
    expenses:[...user.expenses]
  }
  res.status(200).send(money)
})

//Get specific entry
router.get('/:account/:id', verify, async (req, res) => {
  const user = await User.findOne({_id: req.user._id})
  try {
    if(req.params.account === 'income' || req.params.account === 'expense') {
      let post;
      if (req.params.account === 'income') {
        post = user.income.find(entry => entry.id === req.params.id);
        }
        if (req.params.account === 'expense') {
        post = user.expenses.find(entry => entry.id === req.params.id);
        }
        if(!post) {
          throw 'no entry found'
        }
        res.status(200).send(post)
    } else {
      throw 'faulty account type'
    }
  }catch(err) {
    res.status(400).send(err)
  }
})

//update entry 
router.post('/update/:account/',verify, async (req,res) => {
  const user = await User.findOne({_id: req.user._id});
  try{
    const updatedPost = req.body;
    if (req.params.account === 'expense') {
      let expenses = user.expenses;
      const indexOfEntryToBeCanged = expenses.findIndex(entry => entry.id === updatedPost.id);
      expenses.splice(indexOfEntryToBeCanged, 1);
      expenses.push(updatedPost);
      user.expenses = expenses;
      user.save()
      res.status(200).send('post updated');
    }
    if (req.params.account === 'income') {
      let income = user.income;
      const indexOfEntryToBeCanged = income.findIndex(entry => entry.id === updatedPost.id);
      income.splice(indexOfEntryToBeCanged, 1);
      income.push(updatedPost);
      user.income = income;
      user.save();
      res.status(200).send('post updated');
    }
  } catch(err) {
    res.status(400).send(err)
  }
  
})


//Create a new entry
router.post('/add', verify, async (req, res) => {
  const {account, title, desc, amount, currency, type, id, date} = req.body;
  //Find user from jwt token
  const user = await User.findOne({_id: req.user._id})
  const newPost = {id, account, title, desc, amount, currency, type, date}
  if (account === 'income') {
    user.income = [...user.income, newPost]
  }
  if (account === 'expense') {
    user.expenses = [...user.expenses, newPost]
  }
  user.save();
  res.status(200).send(`New post added to user ${account}-account`)
})

//Delete specific entry
router.post('/delete', verify, async (req, res) => {
  const {id, account} = req.body;
  //Find user from jwt token
  const user = await User.findOne({_id: req.user._id})
  if (account === 'income') {
    const updatedArray = user.income.filter((entry) => {
      return entry.id !== id
    });
    user.income = updatedArray
  }
  if (account === 'expense') {
    const updatedArray = user.expenses.filter((entry) => {
      return entry.id !== id
    });
    user.expenses = updatedArray
  }
  user.save();
  res.status(200).send(`Post with ID ${id} deleted`)
})

module.exports = router;
