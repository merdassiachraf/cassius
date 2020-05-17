const express = require("express");
const passport = require("passport");
const mongoose= require ("mongoose")

const router = express.Router();

const Profile = require("../models/Profile");
const User = require("../models/User");
const Post = require("../models/post");

//validation
const validateProfileInput = require("../validation/profile");
const validateAdressInput = require("../validation/adress");

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

//all profile

router.get("/profiles", (req, res) => {
  const errors = {};

  Profile.find()
    .then((profiles) => {
      if (!profiles) {
        errors.noprofile = "There is no profile for this user";

        return res.status(404).json(errors.noprofile);
      }
      res.json(profiles);
    })
    .catch((err) => res.status(404).json(errors));
});

//all agencies

router.get("/agencies", (req, res) => {
  const errors = {};

  Profile.find({ role: "Agency" })
    .then((profiles) => {
      if (!profiles) {
        errors.noprofile = "There is no profile for this user";

        return res.status(404).json(errors.noprofile);
      }
      res.json(profiles);
    })
    .catch((err) => res.status(404).json(errors));
});

// profile/handle/:handle  : public

router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for user";
        res.status(404).json(errors.noprofile);
      }

      res.json(profile);
    })
    .catch((err) => res.status(404).json(err));
});

// profile/handle/user/:user_id  : public

router.get("/user/:user_id", (req, res) => {
  const errors = {};
  errors.profile = "There is no profile for user";

  Profile.findOne({ user: req.params.user_id })
    .then((profile) => {
      if (!profile) {
        res.status(404).json(errors.profile);
      }

      res.json(profile);
    })
    .catch((err) => res.status(404).json(errors.profile));
});

// post profil
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),

  (req, res) => {
    let { isValid } = validateProfileInput(req.body);
    const { errors } = validateProfileInput(req.body);
    role = req.user.role;

    if (role === "Agency") {
      if (
        !errors.handle &&
        !errors.phoneNumber &&
        !errors.countryCode &&
        !errors.adress &&
        !errors.state &&
        !errors.country
      ) {
        delete errors.dateOfBirth;
        isValid = true;
      }
    }
    //Check Validation
    if (!isValid) {
      //return any erros with 400 status
      return res.status(400).json(errors);
    }

    //get field

    const profileFields = {};

    profileFields.role = req.user.role;
    profileFields.user = req.user.id;
    profileFields.name = req.user.name;

    if (req.body.handle) profileFields.handle = req.body.handle.toLowerCase();
    if (role === "Client") {
      if (req.body.dateOfBirth)
        profileFields.dateOfBirth = req.body.dateOfBirth;
    } else if (role === "Agency") {
      delete profileFields.dateOfBirth;
    }

    if (req.body.adress) profileFields.adress = req.body.adress;
    if (req.body.state) profileFields.state = req.body.state;
    if (req.body.country) profileFields.country = req.body.country;
    if (req.body.countryCode) profileFields.countryCode = req.body.countryCode;
    if (req.body.phoneNumber) profileFields.phoneNumber = req.body.phoneNumber;

    //social

    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then((profile) => res.json(profile));
      } else {
        // Check if Handle exist

        Profile.findOne({ handle: profileFields.handle }).then((profile) => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors.handle);
          }

          //Save profile

          new Profile(profileFields)
            .save()
            .then((profile) => res.json(profile));
        });
      }
    });
  }
);

/// add adress agency and update adress client profile:private

router.post(
  "/contact/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAdressInput(req.body);
    role = req.user.role;

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "role"])
      .then((profile) => {
        const newContactInformation = {
          country: req.body.country,
          countryCode: req.body.countryCode,
          phoneNumber: req.body.phoneNumber,
          adress: req.body.adress,
          state: req.body.state,
        };

        /// Add to adress array
        if (role === "Agency") {
          profile.contactInformation.push(newContactInformation);
          profile
            .save()
            .then((profile) => res.json(profile))
            .catch((err) => res.json(err));
        } else {
          errors.wrongRole = "choose a wrong role";
          res.status(400).json(errors);
        }
      });
  }
);

// delete adress : private

router.delete(
  "/contact/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        const removeIndex = profile.contactInformation
          .map((item) => item.id)
          .indexOf(req.params.id);

        profile.contactInformation.splice(removeIndex, 1);

        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json(err));
  }
);

//profile delete : private

router.delete(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      Post.find({ user: req.user.id })
        .remove()
        .then(() => {
          User.findOneAndRemove({ _id: req.user.id }).then(() => {
            res.json({ success: "Profile deleted with succes " });
          });
        });
    });
  }
);

module.exports = router;
