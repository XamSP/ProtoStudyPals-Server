var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/edit', (req, res, next) => {
  const userId = req.user._id;
  console.log(userId)
  const { password, firstName, lastName, age,
     email, subjects, tags, about} = req.body;
  const { country, state, city, address, zipcode } = req.body.location   
  console.log(about)
  //console.log(req.body)
  // const imgPath = req.file.url;
  // const imgName = req.file.originalname;
  
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  console.log(req.file)
  User.update({_id: userId}, { $set: { password: hashPass, firstName, lastName, age, email, subjects, tags, /*imgName, imgPath,*/ about }},{new: true})
  .then((user) => {
    res.json(user)
  })
  .catch((error) => {
    console.log(error)
  })
});

module.exports = router;
