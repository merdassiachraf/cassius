const Agency = require("../models/agenciesModel");
const express = require("express");
const router = express.Router();

//Add
router.post("/", (req, res) => {
  const newagency = new Agency({
    agencyPicture: req.body.agencyPicture,
    agencyAdress: req.body.agencyAdress,
    agencyState: req.body.agencyState,
    agencyCountry: req.body.agencyCountry,
    agencyCountryCode: req.body.agencyCountryCode,
    agencyPhoneNumber: req.body.agencyPhoneNumber,
    agencyName: req.body.agencyName,
    agencyEmail: req.body.agencyEmail,
    agencyPassword: req.body.agencyPassword
  })
    .save()
    .then((agencies) => res.send(agencies))
    .then((err) => console.log(err));
});

//Update
router.put("/:id", (req, res) => {
  const { id } = req.params;
  Agency.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        agencyPicture: req.body.agencyPicture,
        agencyAdress: req.body.agencyAdress,
        agencyState: req.body.agencyState,
        agencyCountry: req.body.agencyCountry,
        agencyCountryCode: req.body.agencyCountryCode,
        agencyPhoneNumber: req.body.agencyPhoneNumber,
        agencyName: req.body.agencyName,
        agencyEmail: req.body.agencyEmail,
        agencyPassword: req.body.agencyPassword
      }
    }
  )
    .then((agencies) => res.send(agencies))
    .catch((err) => console.log(err));
});

//Get All
router.get("/", (req, res) => {
  Agency.find()
    .then((agencies) => res.send(agencies))
    .catch((err) => console.log(err));
});

//Get one

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Agency.find({ _id: id })
    .then((agencies) => res.send(agencies))
    .then((err) => console.log(err));
});

module.exports = router;
