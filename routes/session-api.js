const express    = require('express');
const passport   = require('passport');

const User             = require('../models/user');
const Subject             = require('../models/subject');
const StudySession    = require('../models/studysession');


const sessionRoute = express.Router();

sessionRoute.get('/my-sessions', (req, res, next) => {
    console.log('lolll'+req.session.passport.user)
    User.findById(req.session.passport.user).populate({
        path: 'sessionsPending',
        model: "StudySession",
        populate: {
          path: "subjects",
          model: "Subject"
        }
      }).populate({
        path: 'sessionsPending',
        model: "StudySession",
        populate: {
          path: "host",
          model: "User"
        }
      }).populate({
        path: 'sessionsPending',
        model: "StudySession",
        populate: {
          path: "usersAttending",
          model: "User"
        }
      }).populate({
        path: 'sessionsPending',
        model: "StudySession",
        populate: {
          path: "requestsFromUsers",
          model: "User"
        }
      })
              .then(user => {
            const mySessions = user.sessionsPending
            console.log(mySessions)
            return res.json({mySessions})
    })      
    //     'sessionsPending').populate('sessionsPending.host')
    // populate('sessionsPending.subject').populate("sessionsPending.usersAttending").populate("sessionsPending.requestsFromUsers")
    //     .then(user => {
    //         const mySessions = user.sessionsPending
    //         console.log(mySessions)
    //         return res.json({mySessions})
})


sessionRoute.get('/', (req, res, next) => {
    StudySession.find({}, (err, sessions) => {
      if (err) { return res.json(err).status(500); }
  
      return res.json(sessions);
    }).populate('host subjects usersAttending requestsFromUsers', 'username title');
});

sessionRoute.get('/:id', (req, res, next) => {
    StudySession.findById(req.params.id)
    //make sure to populate everythin(host, usersAttending, feedbacks[i].user, subjects)  
    .populate('host')
      .exec((err, session) => {
        if (err)         { return res.status(500).json(err); }
        if (!session)      { return res.status(404).json(new Error("404")) }
  
        return res.json(session);
      });
});


//  .populate('host subjects usersAttending requestsFromUsers', 'username title');


sessionRoute.post('/join', (req, res, next) => {
    console.log(req.session.passport.user);
    
    const myId = req.session.passport.user

    const {sessionId} = req.body;

    User.findById(myId)
        .then(user => {
            user.sessionsPending.push(sessionId)

            user.save()
                .then( event => {
                    StudySession.findById(sessionId)
                        .then(session => {
                            session.usersAttending.push(myId)

                            session.save()
                                .then( event => {
                                    res.send(event)
                                })
                                .catch(error => {
                                    next(error)
                        })
                })
                .catch(err => {
                    console.log('no work saving the childMsg:', err);
                    next();
                })
        })
        .catch(err => {
            console.log("Error with axios", err)
            next();
        })
  })
})

sessionRoute.post('/create', (req, res, next) => {
    console.log(req.body);
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
    
    const newStudySession = new StudySession({
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
  
    console.log(newStudySession)
  
    newStudySession.save( (err) => {
      if (err) { return res.status(500).json(err); }
        User.findById(userId)
            .then(user => {
                user.sessionsPending.push(newStudySession._id);
                user.save( (err) => {
                    if (err) { return res.status(500).json(err); }
                    return res.status(200).json(newStudySession);
                })
            })
            .catch(err => {
                console.log("Error with axios", err)
                next();
            })
      
    });
});

module.exports = sessionRoute;