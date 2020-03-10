const router = require("express").Router();
const client =require("../models/clientsModel")

router.get("/", (req, res) => {
  res.render('home', { title: "passport-local" });
});

router.get('/register',(req,res)=>{
  res.render('register',{title:"register"})
})

router.get('/login',(req,res)=>{
  res.render('login',{title:"login"})
})

//process register
router.post('/register',(req,res)=>{
  const
})

module.exports = router;
