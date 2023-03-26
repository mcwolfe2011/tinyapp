// -- GET USER EMAIL FUNCTION ---------------------------------
const getUserByEmail = function(email, users) {
  for (const id in users) {
    const user = users[id];
    if (user.email === email) {
      return user;
    }
  }

  return null;
};

// -- GET URL FOR USER ---------------------------------------
const urlsForUser = (userID, urlDatabase) => {
  let userDatabase = {};

  for (const key in urlDatabase) {
    if (userID === urlDatabase[key].userID) {
      userDatabase[key] = urlDatabase[key].longURL;
    }
  }
  return userDatabase;
};

// -- GENERATE ID FUNCTION ------------------------------------
const generateRandomString = function(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

module.exports = { getUserByEmail, urlsForUser, generateRandomString };