const express = require("express");
const router = express.Router();
const passport = require("passport");

const Profile = require("../models/Profile");
const User = require("../models/User");

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
      .populate("user", ["name", "role"])
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

router.get("/agencies", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "role"])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofile = "There is no profile for this user";

        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch((err) => res.status(404).json(errors));
});

// profile/handle/:handle  : public

router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "role"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch((err) => res.status(404).json(err));
});

// profile/handle/user/:user_id  : public

router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "role"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch((err) =>
      res.status(404).json({ profile: "ther is no profile for this user" })
    );
});

// post profil
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    //Check Validation
    if (!isValid) {
      //return any erros with 400 status
      return res.status(400).json(errors);
    }

    //get field

    const profileFields = {};
    role = req.user.role;
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle.toLowerCase();
    if (role === "Client") {
      if (req.body.dateOfBirth)
        profileFields.dateOfBirth = req.body.dateOfBirth;
    } else if (role === "Agency") {
      delete profileFields.dateOfBirth;
    }

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
            res.status(400).json(errors);
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

/// add adress profile:private

router.post(
  "/contact",
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
        } else if (role === "Client") {
          profile.contactInformation.splice(0, 1, newContactInformation);
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
  "/contact/:contact_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        const removeContactInformation = profile.contactInformation
          .map((contact) => contact.id)
          .indexOf(req.params.contact_id);

        profile.contactInformation.splice(removeContactInformation, 1);

        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json(err));
  }
);

//profile delete : private

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (res, req) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
