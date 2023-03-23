// REQUIREMENTS

const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

const app = express();

app.set('view engine', 'ejs');

app.use(cookieSession({
  name: 'session',
  secret: 'Routine-AlanWalker',
  maxAge: 24 * 60 * 60 * 1000
}));
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 8080;


// FUNCTIONS AND OBJECTS

let generateRandomString = function() {
  let randomString = '';
  const characterList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let x = 0; x < 6; x += 1) {
    randomString += characterList.charAt(Math.floor(Math.random() * characterList.length));
  }
  return randomString;
};

let emailDupeChecker = function(emailCheck) {
  let emailExists = false;
  for (let x in users) {
    if (users[x]['email'] === emailCheck.trim()) {
      emailExists = true;
      break;
    }
  }
  return emailExists;
};

const urlDatabase = {
  'b2xVn2': {
    shortURL: 'b2xVn2',
    longURL: 'http://www.lighthouselabs.ca',
    userID: 'routine'
  },
  '9sm5xK': {
    shortURL: '9sm5xK',
    longURL: 'http://www.google.com',
    userID: 'spectre'
  },
};

const users = {
  'spectre': {
    id: 'spectre',
    email: 'abc.com',
    password: '1234'
  },
  'routine': {
    id: 'routine',
    email: 'def.com',
    password: '1234'
  }
};


// METHODS

app.get('/', (req, res) => {

  if (req.session.userId) {
    res.redirect('/urls/');
  } else {
    res.redirect('/login');
  }

});


app.get('/register', (req, res) => {

  let templateVars = {
    vars: {
      userId: req.session.userId,
      users: users
    }
  };
  if (req.session.userId) {
    res.redirect('/urls/');
  } else {
    res.render('register', templateVars);
  }

});


app.get('/login', (req, res) => {

  let templateVars = {
    vars: {
      userId: req.session.userId,
      users: users
    }
  };
  if (req.session.userId) {
    res.redirect('/urls/');
  } else {
    res.render('login', templateVars);
  }

});


app.post('/register', (req, res) => {

  const emailDuplicate = emailDupeChecker(req.body.email);
  if (emailDuplicate) {
    res.sendStatus(400);
  } else {
    if (req.body.email && req.body.password) {
      let userID = generateRandomString();
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      users[userID] = {
        id: userID,
        email: req.body.email,
        password: hashedPassword
      };
      req.session.userId = userID;
      res.redirect('/urls');
    }
    else {
      res.sendStatus(400);
    }
  }

});


app.get('/u/:shortURL', (req, res) => {

  fullURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(fullURL);

});


app.get('/urls/new', (req, res) => {

  let templateVars = {
    vars: {
      userId: req.session.userId,
      users: users
    }
  };
  if (req.session.userId) {
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/login');
  }

});


app.post('/urls/:id/delete', (req, res) => {

  if (urlDatabase[req.params.id].userID === req.session.userId) {
    delete urlDatabase[req.params.id];
    res.redirect('/urls');
  } else {
    res.redirect('/urls');
  }

});


app.post('/urls', (req, res) => {

  const randomShort = generateRandomString();
  urlDatabase[randomShort] = {
    shortURL: randomShort,
    longURL: req.body.longURL,
    userID: req.session.userId
  };
  res.redirect('http://localhost:8080/urls/' + String(randomShort));

});


app.post('/login', (req, res) => {

  let userEmail = '';
  let userPass = '';

  for (let x in users) {
    if (users[x]['email'] === req.body.email && bcrypt.compareSync(req.body.password, users[x]['password'])) {
      userEmail = req.body.email;
      userPass = req.body.password;
      req.session.userId = users[x]['id'];
    }
  }

  if (userEmail.length > 0 && userPass.length > 0) {
    res.redirect('/urls');
  } else {
    res.sendStatus(403);
  }

});


app.post('/logout', (req, res) => {

  req.session = null;
  res.redirect('/urls');

});


app.get('/urls', (req, res) => {

  let templateVars = {
    vars: {
      urls: urlDatabase,
      userId: req.session.userId,
      users: users
    }
  };
  if (req.session.userId) {
    res.render('urls_index', templateVars);
  } else {
    res.redirect('/login');
  }

});

app.get('/urls/:id', (req, res) => {
  let templateVars = {
    vars: {
      shortURL: req.params.id,
      fullURL: urlDatabase[req.params.id].longURL,
      userId: req.session.userId,
      users: users
    }
  };
  if (urlDatabase[req.params.id].userID === req.session.userId && urlDatabase[req.params.id]) {
    res.render('urls_show', templateVars);
  }
  else {
    res.sendStatus(400);
  }

});

app.post('/urls/:id/', (req, res) => {

  let templateVars = {
    urls: {
      shortURL: req.params.id,
      fullURL: urlDatabase[req.params.id].longURL,
      users: users,
      userId: req.session.userId
    }
  };
  if (req.body.newURL.length > 0 && req.session.userId) {
    urlDatabase[req.params.id].longURL = req.body.newURL;
    res.redirect('/urls');
  } else {
    res.sendStatus(400);
  }

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});