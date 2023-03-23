const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');


//config
app.set("view engine", "ejs");

//middleware
//app.use(morgan('dev')); //(req, res, next) => {}
app.use(cookieParser()); //populate req.cookies
app.use(express.urlencoded({extended: false})); // populates req.body


//Functions and Methods
const generateRandomString = function() {
  let randomString = '';
  const characterList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let x = 0; x < 6; x += 1) {
    randomString += characterList.charAt(Math.floor(Math.random() * characterList.length));
  }
  return randomString;
};

//Create a users Object:
const users = {
  userRandomID: {
    id: "abc",
    email: "user@abc.com",
    password: "123",
  },
  user2RandomID: {
    id: "def",
    email: "user2@def.com",
    password: "123",
  },
};


const getUserByEmail = function(email) {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
};



app.use(express.urlencoded({ extended: true }));

//Error Registration Handling
let emailDuplicateChecker = function(emailCheck) {
  let emailExists = false;
  for (let x in users) {
    if (users[x]['email'] === emailCheck.trim()) {
      emailExists = true;
      break;
    }
  }
  return emailExists;
};
console.log(emailDuplicateChecker);

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',

  '9sm5xK': 'http://www.google.com',
};


app.get("/", (req, res) => {
  res.send("Hello! This is hard hey!");
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.get("/urls", (req, res) => {
  const userName = req.cookies["username"];
  console.log("username is: ", userName);
  const templateVars = {
    urls: urlDatabase,
    userName
  };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    userName: req.cookies["username"],
  };
  res.render("urls_new", templateVars);
});


app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    userName: req.cookies["username"],
  };
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  const uniqueID = generateRandomString();
  urlDatabase[uniqueID] = req.body.longURL;
  res.redirect(`/urls/${uniqueID}`);
});


app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});


app.get('/login', (req, res) => {
  res.render('/login');
});



app.post('/login', (req, res) => {
  const userName = req.body.username;
  console.log(userName);
  res.cookie('username', userName);
  res.redirect("/urls");
});


app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls");
});



app.post('/register', (req, res) => {
  // extract the info from the form
  const email = req.body.email;
  const password = req.body.password;

  const user = getUserByEmail(email);

  // add user to the db if not yet there:
  if (user) {
    return res.status(404).send('Sorry, the user is already registered');
  }
  const userId = generateRandomString();
  //Create new user object:
  const newUser = {
    id: userId,
    email,
    password,
  };
  users[userId] = newUser;
  res.cookie('username', email);
  res.redirect('/urls');
});



app.get('/register', (req, res) => {
  const templateVars = {
    userName: 'Banana'
  };
  res.render('register', templateVars);
});


app.post("/urls/:id/delete", (req, res) => {
  const shortID = req.params.id;
  console.log("shortId is: ", shortID);
  delete urlDatabase[shortID];
  res.redirect("/urls");
});


app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.url;
  res.redirect("/urls");
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
