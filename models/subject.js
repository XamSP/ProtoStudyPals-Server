const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
mongoose.plugin(schema => { schema.options.usePushEach = true });

const subjectSchema = new Schema({
    title: String,
    users: [
        { 
          type: Schema.Types.ObjectId, 
          ref: "User",
        }
      ],
    description: String,
    imgName: String,
    imgPath: String,
    availableSessions: [{
        type: Schema.Types.ObjectId, 
        ref: "StudySession",
    }],
    pastSessions: [{
        type: Schema.Types.ObjectId, 
        ref: "StudySession",
    }]
})

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;