const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");

const Post = require("../models/Posts");
const Profile = require("../models/Profile");

const validatePostInput = require("../validation/post");

// Get posts:public

router.get("/", (req, res) => {
  const { errors } = validatePostInput(req.body);
  errors.noposts = "There is no posts";

  Post.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json(errors.noposts));
});

// Get post:id :public

router.get("/:id", (req, res) => {
  const { errors } = validatePostInput(req.body);
  errors.noposts = "There is no posts";
  
  Post.findById(req.params.id)
    .then((post) => res.json(post))
    .catch((err) => res.status(404).json(errors.noposts));
});

// create post : private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    errors.role = "Only agencies can post !!!";
    errors.post = "Only agencies can post !!!";

    role = req.user.role;

    if (role === "Client") {
      return res.status(400).json(errors);
    } else {
      if (!isValid) {
        return res.status(400).json(errors.role);
      }

      const newPost = new Post({
        name: req.user.name,
        user: req.user.id,
        role,
        brand: req.body.brand,
        model: req.body.model,
        fuel: req.body.fuel,
        transmission: req.body.transmission,
        pricePerDay: req.body.pricePerDay + " dt/day",
        state: req.body.state,
        country: req.body.country,
      });
      newPost
        .save()
        .then((post) => res.json(post))
        .catch((err) => res.json(errors.post));
    }
  }
);

//Edit Post :id /private

router.put(
  "/edit_post/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    errors.notAuthorize = "User not authorized";
    errors.nopost = "Post not found";
    errors.postnotfound = "Update Failed";

    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id).then((post) => {
        if (!post) {
          res.status(404).json(errors.nopost);
        } else {
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json(errors.notAuthorize);
          } else {
            if (req.body.brand) post.brand = req.body.brand;
            if (req.body.model) post.model = req.body.model;
            if (req.body.fuel) post.fuel = req.body.fuel;
            if (req.body.transmission)
              post.transmission = req.body.transmission;
            if (req.body.pricePerDay)
              post.pricePerDay = req.body.pricePerDay + " dt/day";
            if (req.body.state) post.state = req.body.state;
            if (req.body.country) post.country = req.body.country;

            post
              .save()
              .then((post) =>
                res.json({
                  post,
                  sucess: "succes update",
                })
              )
              .catch((err) => res.status(500).json(errors.postnotfound));
          }
        }
      });
    });
  }
);

//Delete post : id /private

router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors } = validatePostInput(req.body);
    errors.nopost = "Post not found";
    errors.notAuthorize = "User not authorized";
    errorspostnotfound = "No post found";

    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id).then((post) => {
        if (!post) {
          res.status(404).json(errors.nopost);
        } else {
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json(errors.notAuthorize);
          } else {
            post
              .remove()
              .then((post) => {
                res.json({ sucess: true });
              })
              .catch((err) => res.status(404).json(errors.postnotfound));
          }
        }
      });
    });
  }
);

module.exports = router;
