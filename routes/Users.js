const express = require("express");
const gravatar = require("gravatar");
const router = express.Router();
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const User = require("../models/User");

const keys = require("../config/default");

router.get("/test", (req, res) => res.json({ msg: "user  works" }));

//SingUp : public access

router.post("/signup", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.status(404).json({ msg: "Email allready Used" });
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: "200",
          r: "pg",
          d: "mm",
        });

        const newUser = new User({
          adress: req.body.adress,
          state: req.body.state,
          country: req.body.country,
          countryCode: req.body.countryCode,
          phoneNumber: req.body.phoneNumber,
          name: req.body.name,
          email: req.body.email,
          role: req.body.role,
          avatar,
          password: req.body.password,
          dateOfBirth: req.body.dateOfBirth,
        });
        bycrypt.genSalt(10, (err, salt) => {
          bycrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => res.json(user))
              .catch((err) => console.log(err));
          });
        });
      }
    })
    .catch((err) => console.log(err));
});

//SingIn : returning Token : public access

router.post("/signin", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //find User by email

  User.findOne({ email }).then((user) => {
    // check user
    if (!user) {
      return res.status(404).json({ msg: "Account not found" });
    }

    //check password

    bycrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        //user matched

        const payload = {
          id: user.id,
          adress: user.adress,
          avatar: user.avatar,
          name: user.name,
          state:user.state
        };

        //sign Token

        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              succes: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res.status(400).json({ passport: "password incorect" });
      }
    });
  });
});

///return current user :private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
