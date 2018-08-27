const express    = require('express');
const passport   = require('passport');

const User       = require('../models/user');
const Session    = require('../models/session');


const sessionRoute = express.Router();

sessionRoute.get('/', (req, res, next) => {
    Session.find({}, (err, sessions) => {
      if (err) { return res.json(err).status(500); }
  
      return res.json(sessions);
    }).populate('host subjects usersAttending requestsFromUsers', 'username title');
});

sessionRoute.get('/:id', (req, res, next) => {
    Session.findById(req.params.id)
    //make sure to populate everythin(host, usersAttending, feedbacks[i].user, subjects)  
    .populate('host')
      .exec((err, session) => {
        if (err)         { return res.status(500).json(err); }
        if (!session)      { return res.status(404).json(new Error("404")) }
  
        return res.json(session);
      });
});

sessionRoute.post('/create', (req, res, next) => {
    //console.log(req.body);
    const userId = req.body.user._id;

    const {
        title,
        description,
        tags,
        dateOfSession,
        level,
        location
    } = req.body.session;

    let subjects = [];
    subjects.push(req.body.session.subject)
    console.log(`this subject is equal to = ${req.body.session.subject}`)
    
    let usersAttending = [];
    usersAttending.push(userId);
    
    const newSession = new Session({
        title,
        subjects,
        usersAttending,
        host: userId,
        description,
        tags,
        dateOfSession,
        level,
        location
    });
  
    console.log(newSession)
  
    newSession.save( (err) => {
      if (err) { return res.status(500).json(err); }
  
      return res.status(200).json(newSession);
    });
});

module.exports = sessionRoute;