const express = require("express");
const router = express.Router();
const passport = require("passport");

const Post = require("../models/post");
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

router.get("/post/:id", (req, res) => {
  const { errors } = validatePostInput(req.body);
  errors.nopost = "There is no posts";

  Post.findById(req.params.id)
    .then((post) => res.json(post))
    .catch((err) => res.status(404).json(errors.nopost));
});

//Get current agency posts :public

router.get("/agencies_posts/:user_id", (req, res) => {
  Post.find({ user: req.params.user_id })
    .then((post) => {
      res.json(post);
    })
    .catch((err) => res.status(404).json(err));
});

//Get current agency posts :Private

router.get(
  "/my_posts",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.find({ user: req.user.id })
      .then((post) => {
        if (!post) {
          errors.noposts = "There is no post for this user";
          return res.status(404).json(errors.noposts);
        }
        res.json(post);
      })
      .catch((err) => res.status(404).json(err));
  }
);

// create post : private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    errors.role = "Only agencies can post !!!";
    errors.post = "Only agencies can post !!!";

    role = req.user.role;

    if (role === "Agency") {
      if (!isValid) {
        return res.status(400).json(errors.role);
      } else {
        const newPost = new Post({
          name: req.user.name,
          user: req.user.id,
          brand: req.body.brand,
          model: req.body.model,
          fuel: req.body.fuel,
          transmission: req.body.transmission,
          pricePerDay: req.body.pricePerDay + " dt/day",
          adress:req.body.adress,
          state: req.body.state,
          country: req.body.country,
          countryCode: req.body.countryCode,
          phoneNumber: req.body.phoneNumber,
          email: req.user.email,
        });
        newPost
          .save()
          .then((post) => res.json(post))
          .catch((err) => res.status(404).json(errors.post));
      }
    } else {
      return res.status(400).json(errors);
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
