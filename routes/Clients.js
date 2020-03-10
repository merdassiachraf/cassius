const Client = require("../models/clientsModel");
const express = require("express");
const router = express.Router();

//add
router.post("/", (req, res) => {
  const newclient = new Client({
    clientPicture: req.body.clientPicture,
    clientAdress: req.body.clientAdress,
    clientState: req.body.clientState,
    clientCountry: req.body.clientCountry,
    clientCountryCode: req.body.clientCountryCode,
    clientPhoneNumber: req.body.clientPhoneNumber,
    clientName: req.body.clientName,
    clientEmail: req.body.clientEmail,
    clientPassword: req.body.clientPassword
  });
  newclient
    .save()
    .then((clients) => res.send(clients))
    .catch((err) => console.log(err));
});

//Update
router.put("/:id", (req, res) => {
  const { id } = req.params;
  Client.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        clientPicture: req.body.clientPicture,
        clientAdress: req.body.clientAdress,
        clientState: req.body.clientState,
        clientCountry: req.body.clientCountry,
        clientCountryCode: req.body.clientCountryCode,
        clientPhoneNumber: req.body.clientPhoneNumber,
        clientName: req.body.clientName,
        clientEmail: req.body.clientEmail,
        clientPassword: req.body.clientPassword
      }
    }
  )
    .then((clients) => res.send(clients))
    .catch((err) => console.log(err));
});

//Delete
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Client.findByIdAndDelete({ _id: id })
    .then((clients) => res.send(clients))
    .catch((err) => console.log(err));
});

//get all
router.get("/", (req, res) => {
  Client.find()
    .then((clients) => res.send(clients))
    .catch((err) => console.timeLog(err));
});

//Get one
router.get("/:id", (req, res) => {
  const { id } = req.params;
  Client.find({ _id: id })
    .then((clients) => res.send(clients))
    .catch((err) => console.log(err));
});

module.exports = router;
