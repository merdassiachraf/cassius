const express = require("express");
const router = express.Router();
const passport = require("passport");

const Profile = require("../models/Profile");
const User = require("../models/User");
const Post = require("../models/Posts");

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

router.get("/agencies", (req, res) => {
  const errors = {};

  Profile.find()
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

    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle.toLowerCase();
    if (role === "Client") {
      if (req.body.dateOfBirth)
        profileFields.dateOfBirth = req.body.dateOfBirth;
    } else if (role === "Agency") {
      delete profileFields.dateOfBirth;
    }

    profileFields.contactInformation = {};

    if (req.body.adress)
      profileFields.contactInformation.adress = req.body.adress;
    if (req.body.state) profileFields.contactInformation.state = req.body.state;
    if (req.body.country)
      profileFields.contactInformation.country = req.body.country;
    if (req.body.countryCode)
      profileFields.contactInformation.countryCode = req.body.countryCode;
    if (req.body.phoneNumber)
      profileFields.contactInformation.phoneNumber = req.body.phoneNumber;

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
  "/contact/delete/:contact_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        const removeIndex = profile.contactInformation
          .map((item) => item.id)
          .indexOf(req.params.contact_id);

        profile.contactInformation.splice(removeIndex, 1);

        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json(err));
  }
);

//profile delete : private

router.delete(
  "/delete/user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() => {
        Post.findOneAndRemove({ profile: req.profile.id }).then(() =>
          res.json({ success: true })
        );
      });
    });
  }
);

module.exports = router;
