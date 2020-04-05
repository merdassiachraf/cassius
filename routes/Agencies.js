const express = require("express");
const gravatar = require("gravatar");
const router = express.Router();
const bycrypt = require("bcryptjs");

const Agency = require("../models/agenciesModel");

router.get("/test", (req, res) => res.json({ msg: "agency  works" }));

//public access

router.post("/signup", (req, res) => {
  Agency.findOne({ agencyEmail: req.body.agencyEmail })
    .then((agency) => {
      if (agency) {
        return res.status(404).json({ email: "Email allready Used" });
      } else {
        const avatar = gravatar.url(req.body.agencyEmail, {
          s: "200",
          r: "pg",
          d: "mm",
        });

        const newAgency = new Agency({
          agencyAdress: req.body.agencyAdress,
          agencyState: req.body.agencyState,
          agencyCountry: req.body.agencyCountry,
          agencyCountryCode: req.body.agencyCountryCode,
          agencyPhoneNumber: req.body.agencyPhoneNumber,
          agencyName: req.body.agencyName,
          agencyEmail: req.body.agencyEmail,
          avatar,
          agencyPassword: req.body.agencyPassword
        });
        bycrypt.genSalt(10, (err, salt) => {
          bycrypt.hash(newAgency.agencyPassword, salt, (err, hash) => {
            if (err) throw err;
            newAgency.agencyPassword = hash;
            newAgency
              .save()
              .then((agency) => res.json(agency))
              .catch((err) => console.log(err));
          });
        });
      }
    })
    .catch((err) => console.log(err));
});

module.exports = router;
