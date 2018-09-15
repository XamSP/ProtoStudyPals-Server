const express = require('express');
const userRouter = express.Router();
const User     = require("../models/user");
const StudySession    = require('../models/studysession');


/* GET users listing. */
userRouter.get('/:id', (req, res, next) => {
  const userId = req.params.id;
  if(!userId) { return res.status(404).render('user not-found');}

  User.findById(userId)
  .populate({
    path: "sessionsPending",
    model: "StudySession",
  }).populate({
    path: "sessionsDone",
    model: "StudySession"
  }).populate({
    path: "pals",
    model: "User"
  }).populate({
    path: "feedbacks",
    populate: {
      path: "user",
      model: "User"
    }
  }).then(user => {
    return res.json({user})
  }).catch(err => {
    console.log("Error with axios", err)
    next();
})


});

// router.post('/edit', (req, res, next) => {
//   const userId = req.user._id;
//   console.log(userId)
//   const { password, firstName, lastName, age,
//      email, about} = req.body;
//   const { country, state, city, address, zipcode } = req.body.location  
  
//   const location = {
//     country, state, city, address, zipcode
//   }
//   console.log(about)
//   //console.log(req.body)
//   // const imgPath = req.file.url;
//   // const imgName = req.file.originalname;
  
//   const salt = bcrypt.genSaltSync(bcryptSalt);
//   const hashPass = bcrypt.hashSync(password, salt);

//   console.log(req.file)
//   User.update({_id: userId}, { $set: { password: hashPass, firstName, lastName, age, email, subjects, location, /*imgName, imgPath,*/ about }},{new: true})
//   .then((user) => {
//     res.json(user)
//   })
//   .catch((error) => {
//     console.log(error)
//   })
// });

module.exports = userRouter;
