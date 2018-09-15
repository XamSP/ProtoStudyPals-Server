const express    = require('express');
const passport   = require('passport');
const bcrypt     = require('bcrypt');

// Our user model
const User       = require('../models/user');

const authRoutes = express.Router();

authRoutes.get('/u', (req, res, next) => {
  res.send(req.user);
})

authRoutes.post('/edit', (req, res, next) => {
  const userId = req.user._id;
  console.log(userId)
  const { password, firstName, lastName, age,
     email, about} = req.body;
  const { country, state, city, address, zipcode } = req.body.location  
  
  const location = {
    country, state, city, address, zipcode
  }
  console.log(about)
  //console.log(req.body)
  // const imgPath = req.file.url;
  // const imgName = req.file.originalname;
  
  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(password, salt);

  console.log(req.file)
  User.update({_id: userId}, { $set: { password: hashPass, firstName, lastName, age, email, location, /*imgName, imgPath,*/ about }},{new: true})
  .then((user) => {
    res.json(user)
  })
  .catch((error) => {
    console.log(error)
  })
});

authRoutes.post('/signup', (req, res, next) => {
    const { 
      username, password, confirmPassword, firstName, lastName,
      gender, age, location, email
    } = req.body;
  
    location.country = 'United States';

    if (!username || !password) {
      res.status(400).json({ message: 'Provide username and password' });
      return;
    }

    if(confirmPassword !== password) {
      res.status(400).json({ message: "Both passwords didn't Match"  });
      return;
    }  
  
    User.findOne({ username }, '_id', (err, foundUser) => {
      if (foundUser) {
        res.status(400).json({ message: 'The username already exists' });
        return;
      }
  
      const salt     = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);
  
      const theUser = new User({
        username,
        password: hashPass,
        firstName,
        lastName,
        gender,
        age,
        location,/*:{
         country : location.country,
         state: location.state,
         city: location.city,
         address: location.address,
         zipcode: location.zipcode 
        }*/
        email,
        about
      });
  
      theUser.save((err) => {
        if (err) {
          res.status(400).json({ message: 'Something went wrong' });
          return;
        }
  
        req.login(theUser, (err) => {
          if (err) {
            res.status(500).json({ message: 'Something went wrong' });
            return;
            }
  
            res.status(200).json(req.user);
            });
        })
      });
    });
  

  authRoutes.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, theUser, failureDetails) => {
      if (err) {
        res.status(500).json({ message: 'Something went wrong' });
        return;
      }
  
      if (!theUser) {
        res.status(401).json(failureDetails);
        return;
      }
  
      req.login(theUser, (err) => {
        if (err) {
          res.status(500).json({ message: 'Something went wrong' });
          return;
        }
  
        // We are now logged in (notice req.user)
        res.status(200).json(req.user);
      });
    })(req, res, next);
  });

  authRoutes.post('/logout', (req, res, next) => {
    req.logout();
    res.status(200).json({ message: 'Success' });
  });

  authRoutes.get('/loggedin', (req, res, next) => {
    if (req.isAuthenticated()) {
      res.status(200).json(req.user);
      return;
    }
  
    res.status(403).json({ message: 'Unauthorized' });
  });

  authRoutes.get('/private', (req, res, next) => {
    if (req.isAuthenticated()) {
      res.json({ message: 'This is a private message' });
      return;
    }
  
    res.status(403).json({ message: 'Unauthorized' });
  });

  //working

  module.exports = authRoutes;