const express = require("express");
const router = express.Router();

//assign home route
router.get("/", async (req, res) => {
  res.render("index");
});

router.get("/logout", async (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      res.negotiate(err);
    }
    req.logout();
    res.redirect("/");
  });
});

module.exports = router;
