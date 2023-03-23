const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');


//configS
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

app.use(express.urlencoded({ extended: true }));


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






// Day 3 Added Codes - Have mentor check it
// Display the register form
app.get('/register', (req, res) => {
  const templateVars = { currentUser: null };
  res.render('register', templateVars);
});

//Create a Registration Handler:
// Get the info from the register form
app.post('/register', (req, res) => {
  // extract the info from the form
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  // check if the user is not already in the database

  const user = findUserByEmail(email);

  // add user to the db if not yet there:
  if (!user) {
    const userId = addNewUser(name, email, password);
    // setCookie with the user id
    res.cookie('user_id', userId);
    //testing if users object is properly appended:
    console.log(userId);
    // redirect to /urls
    res.redirect('/urls');
  } else {
    res.status(404).send('Sorry, the user is already registered');
  }
});



const users = {
  userRandomID: {
    id: "abc",
    email: "user@example.com",
    password: "123",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "123",
  },
};


const addNewUser = (name, email, password) => {
  //generate unique user id:
  const userId = Math.random().toString(36).substring(2, 8);
  //Create new user object:
  const newUser = {
    id: userId,
    name,
    email,
    password,
  };
  users[userId] = newUser;
  return userId;
};

const userId = req.cookies['user_id'];
//end of day 3 added codes






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