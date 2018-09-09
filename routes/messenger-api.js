const express            = require("express");
const msgRouter          = express.Router();
const User               = require("../models/user");
const Message            = require('../models/message');
const bcrypt             = require("bcrypt");
const bcryptSalt         = 10;
const ensureLogin        = require("connect-ensure-login");
const passport           = require("passport");
const uploadCloud        = require('../config/cloudinary.js');

//puting the id until I can req the user
msgRouter.get('/',(req, res, next) => {
    const myId = req.user._id
    console.log(myId)
    console.log(`The auth user is ${req.user.username}`)
    User.findById(myId).populate({
      path: 'inbox',
      model: "Message",
      populate: {
        path: "users",
        model: "User"
      }
    })
    .then(user=> {
      const msgs = user.inbox 
      console.log(msgs);
      return res.json({user, msgs});
    });  
  });
  
  msgRouter.get('/create',  (req, res,next) => {
    const theUser = req.user
    User.findById(req.user._id).populate('pals')
    .then(user => {
      return res.json({theUser, user});
    })
    .catch(err => {
      next();
    })
  });  

  msgRouter.post('/create', (req, res,next) => {

    //get the users after getting the getUser _id
    console.log(req.body)
    const {username, subject, childMsgContent, myId} = req.body;
    //console.log(`username: ${username} subject: ${subject} Content: ${childMsgContent} OGUser: ${req.user.username}`)
    
    if (username === "" || subject === "" || childMsgContent === "") {
      res.render("messenger/create", { message: "Missing Field(s)!" });
      return;
    }
  
    User.findOne({ username })
    .then(user => {
      if (!user) {
        return res.json({ message: "The username doesn't exists!" });
      }
      
      //console.log(`the user = ${user}`)
      const childMsg = {
        msg: childMsgContent,
        user: myId
      };
  
      const newMsg = new Message({
        subject,
        users: [user._id, myId],
        texts: [childMsg] 
      });
  
    console.log(`childMsg = ${childMsg} and newMsg = ${newMsg} and userId = ${myId}`)
  
      newMsg.save((err) => {
        if (err) {
          res.json({ message: "Something went wrong" });
        } else {
          user.inbox.push(newMsg._id)
          user.save(err => {
            if (err) {
              res.json({ message: "Something went wrong" });
            } else {
              User.findById(myId)
              .then(myUser => {
                myUser.inbox.push(newMsg._id)
                myUser.save(err => {
                  if (err) {
                    res.json({ message: "Something went wrong" });
                  } else {
                    res.json({ message: "Success!" });
                  }
                })
              })
              .catch(error => {
                next(error)
              })

              //res.redirect("/messenger");
            }
          })
        }
      });
    })
    .catch(error => {
      next(error)
    })
  });
  
  msgRouter.get('/:msgid', (req, res, next) => {
    const theUser = req.user
    let msgId = req.params.msgid;
    if (!msgId) { 
      return res.status(404).render('not-found'); 
    }
    Message.findById(msgId).populate('users').populate('texts.user')
      .then(theMsg => {
        if (!theMsg) {
            return res.status(404).render('not-found');
        }
        console.log(theMsg)
        //const user = theMsg.populate('users')
        res.json({theUser,theMsg})
      })
      .catch(next)
    });
  
  msgRouter.post('/:msgid', (req, res, next) => {
    //get the id of parent msg and input child id of msg
    const {childMsgContent} = req.body;
    Message.findById(req.params.msgid).populate('texts')
    .then(sendMsg => {
      console.log("Api Messenger myId post-msgid is "+req.session.passport.user)
      const childMsg = {
        msg: childMsgContent,
        //check this passport thingy
        user: req.session.passport.user
      };
      // Pushes childMsg(obj) to var parentMsg
      sendMsg.texts.push(childMsg);
  
      sendMsg.save()
        .then(event => {
          console.log('the save is' + event)
          res.send(event);
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
  });  
  
  // function checkRoles(role) {
  //   return function(req, res, next) {
  //     if (req.isAuthenticated() && req.user.role === role) {
  //       return next();
  //     } else {
  //       res.redirect('/')
  //     }
  //   }
  //}
  
  module.exports = msgRouter;  