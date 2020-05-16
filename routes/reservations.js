const express = require("express");
const passport = require("passport");

const router = express.Router();

const Post = require("../models/post");
const Profile = require("../models/Profile");
const Reservation = require("../models/reservation");
const validateReservationInput = require("../validation/reservations");

// post resevations: private

router.post(
  "/add/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors } = validateReservationInput(req.body);

    role = req.user.role;

    {
      if (role === "Client") {
        Profile.findOne({ user: req.user.id }).then((profile) => {
          if (!profile) {
            errors.noprofile = "Profile not found";
            res.status(404).json(errors.noprofile);
          } else {
            clientAdress = profile.adress;
            clientState = profile.state;
            clientCountry = profile.country;
            clientCountryCode = profile.countryCode;
            clientPhoneNumber = profile.phoneNumber;

            Post.findById(req.params.post_id).then((post) => {
              if (!post) {
                errors.nopost = "Post not found";

                res.status(404).json(errors.nopost);
              } else {
                agency = post.user;
                agencyName = post.name;
                agencyAdress = post.adress;
                agencyState = post.state;
                agencyCountry = post.country;
                agencyCountryCode = post.countryCode;
                agencyPhoneNumber = post.phoneNumber;
                agencyEmail = post.email;
                car = post.id;
                brand = post.brand;
                model = post.model;
                fuel = post.fuel;
                transmission = post.transmission;
                pricePerDay = post.pricePerDay;

                const newReservation = new Reservation({
                  startDate: req.body.startDate,
                  returnDate: req.body.returnDate,
                  totalDays: req.body.totalDays,
                  totalPrice: req.body.totalPrice,
                  startTime: req.body.startTime,
                  returnTime: req.body.returnDate,
                  status: "Waiting for confirmation",
                  client: req.user.id,
                  clientEmail: req.user.email,
                  clientName: req.user.name,
                  clientAdress,
                  clientState,
                  clientCountry,
                  clientCountryCode,
                  clientPhoneNumber,
                  agency,
                  agencyName,
                  agencyAdress,
                  agencyState,
                  agencyCountry,
                  agencyCountryCode,
                  agencyPhoneNumber,
                  agencyEmail,
                  car,
                  brand,
                  model,
                  fuel,
                  transmission,
                  pricePerDay,
                });
                newReservation
                  .save()
                  .then((reservation) => res.json(reservation))
                  .catch((err) => res.status(404).json(errors));
              }
            });
          }
        });
      } else {
        errors.reservation = "Only client can rent a car";
        return res.status(400).json(errors.reservation);
      }
    }
  }
);

//Get reservation by ID : private

router.get(
  "/reservation/:reservation_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Reservation.find({ client: req.user.id }).then((reservation) => {
      if (!reservation) {
        errors.reservation = "No reservation found for you!!!";
        res.status(400).json(errors.reservation);
      } else {
        Reservation.findById(req.params.reservation_id)
          .then((reservation) => {
            if (!reservation) {
              res.status(400).json(errors.reservation);
            } else {
              res.json(reservation);
            }
          })
          .catch((err) => res.json(err));
      }
    });
  }
);

// Edit reservation:private

router.put(
  "/edit/:reservation_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors } = validateReservationInput(req.body);
    errors.reservationedit = "Error edit";
    status = req.reservation.status;

    if (status === ("Canceled" || "Confirmed")) {
      Reservation.find({ id: req.params.reservation_id })
        .updateMany({
          $set: {
            startDate: req.body.startDate,
            returnDate: req.body.returnDate,
            totalDays: req.body.totalDays,
            totalPrice: req.body.totalPrice,
            startTime: req.body.startTime,
            returnTime: req.body.returnDate,
            status: "Changed and waiting for confirmation",
          },
        })
        .then((reservation) => res.json(reservation))
        .catch((err) => res.json(err));
    }
  }
);

// Get all reservation:

router.get("/all", (req, res) => {
  Reservation.find()
    .then((reservation) => res.json(reservation))
    .catch((err) => res.json(err));
});

//Get client reservation:private

router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    role = req.user.role;

    {
      if (role === "Client") {
        Reservation.find({ client: req.user.id })
          .then((reservation) => res.json(reservation))
          .catch((err) => res.json(err));
      } else {
        Reservation.find({ agency: req.user.id })
          .then((reservation) => res.json(reservation))
          .catch((err) => res.json(err));
      }
    }
  }
);

//Get confirmed reservation: private
router.get(
  "/user/confirmed",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    role = req.user.role;

    {
      if (role === "Client") {
        Reservation.find({
          client: req.user.id,
          status: "Confirmed",
        })
          .then((reservation) => res.json(reservation))
          .catch((err) => res.json(err));
      } else {
        Reservation.find({
          agency: req.user.id,
          status: "Confirmed",
        })
          .then((reservation) => res.json(reservation))
          .catch((err) => res.json(err));
      }
    }
  }
);

// Get conceled reservation: private

router.get(
  "/user/canceled",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    role = req.user.role;

    {
      if (role === "Client") {
        Reservation.find({ client: req.user.id, status: "Canceled" })
          .then((reservation) => res.json(reservation))
          .catch((err) => res.json(err));
      } else {
        Reservation.find({ agency: req.user.id, status: "Canceled" })
          .then((reservation) => res.json(reservation))
          .catch((err) => res.json(err));
      }
    }
  }
);

// Get conceled reservation: private

router.get(
  "/user/waiting",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    role = req.user.role;

    {
      if (role === "Client") {
        Reservation.find({
          client: req.user.id,
          status:
            "Changed and waiting for confirmation" ||
            "Waiting for confirmation",
        })
          .then((reservation) => res.json(reservation))
          .catch((err) => res.json(err));
      } else {
        Reservation.find({
          agency: req.user.id,
          status:
            "Changed and waiting for confirmation" ||
            "Waiting for confirmation",
        })
          .then((reservation) => res.json(reservation))
          .catch((err) => res.json(err));
      }
    }
  }
);

//Confirmed reservation

router.put(
  "/:reservation_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Reservation.findOne({});
  }
);

module.exports = router;
