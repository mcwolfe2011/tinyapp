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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
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








//Cookies in express
//I have to ask mentor on this yet
//Add an endpoint to handle a POST to/login
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const user = req.body.username;
  console.log(user);
  res.cookie('username', `${user}`);
  res.redirect("/urls");
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