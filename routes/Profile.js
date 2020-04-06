const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");

const Profile = require("../models/profile");


router.get("/test", (req, res) => res.json({ msg: "agency profil works" }));

// current user Profile : private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch((err) => res.status(404).json(err));
  }
);

module.exports = router;
