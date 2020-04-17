const express = require("express");
const gravatar = require("gravatar");
const router = express.Router();
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// Load Input Validator
const validatorRegisterInput = require("../validation/Register");
const validatorLoginInput = require("../validation/Login");

const User = require("../models/User");

const keys = require("../config/default");

router.get("/test", (req, res) => res.json({ msg: "user  works" }));

//SingUp : public access

router.post("/signup", (req, res) => {
  const { errors, isValid } = validatorRegisterInput(req.body);

  //Check validation

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email.toLowerCase() })
    .then((user) => {
      if (user) {
        errors.email = "Email already exist...";
        return res.status(404).json(errors);
      } else {
        const role = req.body.role;
       if (role==="Agency"||role==="Client"){
        const newUser = new User({
          name: req.body.name,
          email: req.body.email.toLowerCase(),
          role,
          password: req.body.password,
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
        });}
        else {
          errors.role='You must choose between Agency or client Role'
          res.status(400).json(errors)
        }
      }
    })
    .catch((err) => console.log(err));
});

//SingIn : returning Token : public access

router.post("/signin", (req, res) => {
  const { errors, isValid } = validatorLoginInput(req.body);

  //Check validation

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  //find User by email

  User.findOne({ email }).then((user) => {
    // check user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    //check password

    bycrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        //user matched

        const payload = {
          id: user.id,
          avatar: user.avatar,
          name: user.name,
          email: user.email,
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
        errors.password = "password incorect";
        return res.status(400).json(errors);
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