// Create a new router
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
//redirect login lab3
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect("./login"); // redirect to the login page
  } else {
    next(); // move to the next middleware function
  }
};

router.get("/register", function (req, res, next) {
  res.render("register.ejs");
  const plainPassword = req.body.password;
  bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
    // Store hashed password in your database.
  });
});

router.post("/registered", function (req, res, next) {
  const plainPassword = req.body.password;
  bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
    // Store hashed password in your database.

    // saving data in database
    let sqlquery =
      "INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?,?,?,?,?)";
    //execute sql query
    let newrecord = [
      req.body.username,
      req.body.first,
      req.body.last,
      req.body.email,
      hashedPassword,
    ];
    db.query(sqlquery, newrecord, (err, result) => {
      if (err) {
        next(err);
      } else
        result =
          "Hello " +
          req.body.first +
          " " +
          req.body.last +
          " you are now registered!  We will send an email to you at " +
          req.body.email;
      result +=
        "Your password is: " +
        req.body.password +
        " and your hashed password is: " +
        hashedPassword;
      res.send(result);
    });
  });
});

// Get route to list users
//redirectLogin lab3

router.get("/list", redirectLogin, function (req, res, next) {
  let sqlquery = "SELECT username, first, last, email FROM users"; // query database to get all the users
  // execute sql query
  db.query(sqlquery, (err, result) => {
    if (err) {
      next(err);
    }
    res.render("listusers.ejs", { users: result });
  });
});

// Export the router object so index.js can access it
module.exports = router;

//logout people can't acces this PAGES lab3
router.get("/list", redirectLogin, (req, res) => {
  res.render("listusers.ejs", { user: req.session.userId });
});

router.get("/addbook", redirectLogin, (req, res) => {
  res.render("addbook.ejs", { user: req.session.userId });
});

router.get("/search", redirectLogin, (req, res) => {
  res.render("search.ejs", { user: req.session.userId });
});

//for the login page
// Route to display login page
router.get("/login", function (req, res, next) {
  res.render("login.ejs");
  // const plainPassword = req.body.password;
  // bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
  //   // Store hashed password in your database.
  // });
});

// Route to handle login form submission
router.post("/loggedin", function (req, res, next) {
  const username = req.body.username;
  const plainPassword = req.body.password;

  // Save user session here, when login is successful
  req.session.userId = req.body.username;

  // Fetch hashed password from database for the specified username
  let sqlquery = "SELECT hashedPassword FROM users WHERE username = ?";

  db.query(sqlquery, [username], (err, results) => {
    if (err) return next(err); // Handle database errors

    // If no user is found, send a failure message
    if (results.length === 0) {
      return res.send("Login failed: User not found.");
    }

    const hashedPassword = results[0].hashedPassword;

    bcrypt.compare(req.body.password, hashedPassword, function (err, result) {
      if (err) {
        // TODO: Handle error
        return next(err);
      } else if (result == true) {
        // TODO: Send message
        res.send(`Welcome back, ${username}! You are successfully logged in.`);
      } else {
        // TODO: Send message
        res.send("Login failed: Incorrect password.");
      }
    });
  });
});

//logout page lab3

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("./"); // If there is an error, redirect to the home page
    }
    res.send("You are now logged out"); // Confirmation message
  });
});
router.get("/logout", redirectLogin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("./"); // If there is an error, redirect to the home page
    }
    res.send('You are now logged out. <a href="./">Home</a>'); // Confirmation message with a link back to home
  });
});
