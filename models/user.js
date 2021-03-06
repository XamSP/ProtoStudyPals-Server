const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
// mongoose.plugin(schema => { schema.options.usePushEach = true });


const userSchema = new Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  role: {
    type: String,
    enum: ['User', 'Admin', 'Boss',],
    default : 'User'
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Unknown'],
    default : 'Unknown'
  },
  age: Number,
  location: {
    country: String,
    state: String,
    city: String,
    address: String,
    zipcode: String,     
  },
  email: String, 
  imgName: String,
  imgPath: String,
  rating: {
    type: Number,
    default: 4,
  },
  subjects: [{
    type: Schema.Types.ObjectId,
    ref: "Subject",
  }],
  tags:[String],
  pals:[
    { 
      type: Schema.Types.ObjectId, 
      ref: "User",
    }
  ],
  sessionsPending:[{
    type: Schema.Types.ObjectId, 
    ref: "StudySession",
  }],
  sessionsDone:[{
    type: Schema.Types.ObjectId, 
    ref: "StudySession",
  }],
  feedbacks:[{
    feedback: String,
    user:  { 
        type: Schema.Types.ObjectId, 
        ref: "User",
        }
    }],
  inbox:[
    { 
      type: Schema.Types.ObjectId, 
      ref: "Message",
    }
  ],
  about: String,
  experiences: [
    {
      title: String,
      imgName: String,
      imgPath: String,
      links: [String],
      //later add if users collaborated
      description: String,

    }
  ],
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);
module.exports = User;