const msgRouter          = express.Router();
const User               = require("../models/user");
const Message            = require('../models/message');
const bcrypt             = require("bcrypt");
const bcryptSalt         = 10;
const ensureLogin        = require("connect-ensure-login");
const passport           = require("passport");
const uploadCloud = require('../config/cloudinary.js');

msgRouter.get('/',(req, res, next) => {
    const theUser = req.user
    User.findById(req.user._id).populate('inbox')
    .then(user=> {
      const msgs = user.inbox 
      //console.log(msgs[0].subject);
      res.render('MsgBoard/index', {theUser, user, msgs});
    });  
  });
  