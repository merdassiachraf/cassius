const express = require("express");
const passport = require("passport");

const router = express.Router();

const Reservation = require("../models/Reservations");
const Post = require("../models/Posts");
const Profile = require("../models/Profile");

const validateReservationInput = require("../validation/reservations");

// post resevations: private
role = req.user.role;

if (role === "Client") {
  router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { isValid, errors } = validateReservationInput(req.body);

      if (!isValid) {
        return res.status(400).json(errors);
      }
      const reservationFields = {};
      reservationFields.pricePerDay = req.post.pricePerDay;
      if (req.body.totalDays) reservationFields.totalDays = req.post.totalDays;
      if (req.body.totalPrice)
        reservationFields.totalPrice =
          req.post.pricePerDay * req.body.totalDays;
      if (req.body.firstDate) reservationFields.firstDate = req.post.firstDate;
      if (req.body.endDate) reservationFields.endDate = req.post.endDate;
      if (req.body.firstTime) reservationFields.firstTime = req.post.firstTime;
      if (req.body.endTime) reservationFields.endTime = req.post.endTime;
    }
  );
} else {
  res.status(400).json({ msg: "not Athorizate" });
}
