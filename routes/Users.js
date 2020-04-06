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

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        errors.email='Email already exist...'
        return res.status(404).json(errors);
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
  const { errors, isValid } = validatorLoginInput(req.body);

  //Check validation

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //find User by email

  User.findOne({ email }).then((user) => {
    // check user
    if (!user) {
      errors.email="User not found";
      return res.status(404).json(errors);
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
          state: user.state,
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
        errors.password='password incorect'
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
