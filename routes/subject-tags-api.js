const express    = require('express');
const passport   = require('passport');

const User       = require('../models/user');
const Session    = require('../models/session');
const Subject    = require('../models/subject');
//const Tags     = require('../models/subject');

const subtagsRoute = express.Router();

subtagsRoute.get('/subject', (req, res, next) => {
    Subject.find({}, (err, subjects) => {
      if (err) { return res.json(err).status(500); }
  
      return res.json(subjects);
    });
});

subtagsRoute.get('/:id', (req, res, next) => {
    Subject.findById(req.params.id)
    //make sure to populate everythin(host, usersAttending, feedbacks[i].user, subjects)  
    .populate('users')
      .exec((err, subject) => {
        if (err)         { return res.status(500).json(err); }
        if (!subject)      { return res.status(404).json(new Error("404")) }
  
        return res.json(subject);
      });
});

// subtagsRoute.post('/create', (req, res, next) => {
//     console.log(req.body);
//     const userId = req.body.user._id;

//     const {
//         title,
//         subjects,
//         host: userId,
//         description,
//         tags,
//         dateOfSession,
//         level,
//         location
//     } = req.body.session;
    
//     const newSession = new Session({
//         title,
//         subjects,
//         description,
//         tags,
//         dateOfSession,
//         level,
//         location
//     });
  
//     console.log(newSession)
  
//     newSession.save( (err) => {
//       if (err) { return res.status(500).json(err); }
  
//       return res.status(200).json(newSession);
//     });
// });

module.exports = subtagsRoute;