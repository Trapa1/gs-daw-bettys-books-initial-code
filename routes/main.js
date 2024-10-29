// Create a new router

const express = require("express");
const router = express.Router();

// Handle our routes
router.get("/", function (req, res, next) {
  res.render("index.ejs");
});

router.get("/about", function (req, res, next) {
  res.render("about.ejs");
});

//logout router Lab3
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("./");
    }
    res.send("you are now logged out. <a href=" + "./" + ">Home</a>");
  });
});

// Export the router object so index.js can access it
module.exports = router;
