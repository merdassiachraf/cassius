const Post = require("../models/postsModel");
const express = require("express");
const router = express.Router();


// add
router.post("/", (req, res) => {
  const newpost = new Post({
    brand:req.body.brand,
    model:req.body.model,
    fuel:req.body.fuel,
    transmission:req.body.transmission,
    carPicture1:req.body.carPicture1,
    carPicture2:req.body.carPicture2,
    carPicture3:req.body.carPicture3,
    carPicture4:req.body.carPicture4,
    carPicture5:req.body.carPicture5,
    carPicture6:req.body.carPicture6,
    carPicture7:req.body.carPicture7,
    carPicture8:req.body.carPicture8,
    carPicture9:req.body.carPicture9,
    carPicture10:req.body.carPicture10,
    state: req.body.state,
    country: req.body.country,
    pricePerDay:req.body.pricePerDay,
    agencyName:req.body.agencyName,
  });
  newpost
    .save()
    .then(posts => res.send(posts))
    .catch(err => console.log(err));
});

// update
router.put("/:id", (req, res) => {

const {id}=req.params
  Post.findOneAndUpdate({_id:id},{$set:{ brand:req.body.brand,
    model:req.body.model,
    fuel:req.body.fuel,
    transmission:req.body.transmission,
    carPicture1:req.body.carPicture1,
    carPicture2:req.body.carPicture2,
    carPicture3:req.body.carPicture3,
    carPicture4:req.body.carPicture4,
    carPicture5:req.body.carPicture5,
    carPicture6:req.body.carPicture6,
    carPicture7:req.body.carPicture7,
    carPicture8:req.body.carPicture8,
    carPicture9:req.body.carPicture9,
    carPicture10:req.body.carPicture10,
    state: req.body.state,
    country: req.body.country,
    pricePerDay:req.body.pricePerDay,
    agencyName:req.body.agencyName}})
    .then(posts=>res.send(posts))
    .catch(err=>console.log(err))
});

//Delete
router.delete('/:id',(req,res)=>{
  const {id}=req.params
  Post.findOneAndDelete({_id:id})
  .then(posts=>res.send(posts))
  .catch(err=>console.log(err))

})

//get
router.get("/",(req,res)=>{
  Post.find()
  .then(posts=>res.send(posts))
  .catch(err=>console.log(err))
})

//Get one
router.get("/:id",(req,res)=>{

  const {id}=req.params
  Posts.find({_id:id})
  .then(posts=>res.send(posts))
  .catch(err=>console.log(err))
})

module.exports = router;
