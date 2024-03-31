const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  return res.render('login');
};

const signupPage = (req, res) => {
  return res.render('signup');
};



const login = async (req, res) => {
  const username = req.body.username;
  const pass = req.body.pass;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const account = await Account.authenticate(username, pass);
    req.session.account = Account.toAPI(account);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.message === 'User not found' || err.message === 'Password is incorrect') {
      return res.status(401).json({ error: 'Wrong username or password' });
    } else {
      return res.status(401).json({ error: 'An error occurred' });
    }
  }
};



const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });

    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);

    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }

    return res.status(500).json({ error: 'An error occurred' });
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

module.exports = {
  loginPage,
  signupPage,
  logout,
  login,
  signup,
};
