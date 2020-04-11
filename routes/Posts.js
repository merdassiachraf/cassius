const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");

const Post = require("../models/Posts");
const Profile = require("../models/Profile");

const validatePostInput = require("../validation/post");

// Get posts:public

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json({ noposts: "Nopost found" }));
});

// Get post:id :public

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((post) => res.json(post))
    .catch((err) => res.status(404).json({ nopost: "Nopost found" }));
});

// create post : private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      name: req.body.name,
      avatar: req.body.avatar,
      brand: req.body.brand,
      model: req.body.model,
      fuel: req.body.fuel,
      transmission: req.body.transmission,
      pricePerDay: req.body.pricePerDay,
      user: req.user.id,
    });
    newPost
      .save()
      .then((post) => res.json(post))
      .catch((err) => res.json(err));
  }
);

//Delete post : id /private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      this.post.findById(req.params.id).then((post) => {
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notAuthorize: "User not authorized" });
        }

        post
          .remove()
          .then(() => res.json({ sucess: true }))
          .ctatch((err) =>
            res.status(404).json({ postnotfound: "No post found" })
          );
      });
    });
  }
);

//Get All posts

module.exports = router;
