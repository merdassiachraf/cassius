const express = require("express");
const passport = require("passport");

const router = express.Router();

const Reservation = require("../models/Reservations");
const Post = require("../models/Post");
const Profile = require("../models/Profile");

// post resevations: private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const reservationFields = {};
    role = req.user.role;
    if (role === "Agency") reservationFields.agency = req.user.id;
    if (role === "Client") reservationFields.client = req.user.id;
    if (req.body.brand) reservationFields.brand = req.post.brand;
    if (req.body.model) reservationFields.model = req.post.model;
    if (req.body.fuel) reservationFields.fuel = req.post.fuel;
    if (req.body.transmission)
      reservationFields.transmission = req.post.transmission;
    if (req.body.picture)
      reservationFields.picture = req.post.picture.carPicture1;
    if (req.body.pricePerDay)
      reservationFields.pricePerDay = req.post.pricePerDay;
    if (req.body.totalDays) reservationFields.totalDays = req.post.totalDays;
    if (req.body.totalPrice)
      reservationFields.totalPrice = req.post.pricePerDay * req.body.totalDays;
    if (req.body.firstDate) reservationFields.firstDate = req.post.firstDate;
    if (req.body.endDate) reservationFields.endDate = req.post.endDate;
    if (req.body.firstTime) reservationFields.firstTime = req.post.firstTime;
    if (req.body.endTime) reservationFields.endTime = req.post.endTime;

    //agency fields
    if (role === "Agency") {
      if (req.body.countryCode)
        reservationFields.agency.countryCode = req.body.countryCode;
      if (req.body.reservationFieldsoneNumber)
        reservationFields.agency.phoneNumber = req.body.phoneNumber;
      if (req.body.name) reservationFields.agency.name = req.body.name;
      if (req.body.email) reservationFields.agency.email = req.body.email;
      if (req.body.country) reservationFields.agency.country = req.body.country;
      if (req.body.state) reservationFields.agency.state = req.body.state;
      if (req.body.adress) reservationFields.agency.adress = req.body.adress;
    }

    //client fields
    if (role === "Client") {
      reservationFields.client = {};

      if (req.body.countryCode)
        reservationFields.client.countryCode = req.body.countryCode;
      if (req.body.phoneNumber)
        reservationFields.client.phoneNumber = req.body.phoneNumber;
      if (req.body.name) reservationFields.client.name = req.body.name;
      if (req.body.email) reservationFields.client.email = req.body.email;
      if (req.body.country) reservationFields.client.country = req.body.country;
      if (req.body.state) reservationFields.client.state = req.body.state;
      if (req.body.adress) reservationFields.client.adress = req.body.adress;
    }
  }
);
