const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
mongoose.plugin(schema => { schema.options.usePushEach = true });

const studySessionSchema = new Schema ({
    title: String,
    subjects: [
        {
        type: Schema.Types.ObjectId,
        ref: "Subject",
        }
    ], 
    host: { 
        type: Schema.Types.ObjectId, 
        ref: "User",
    },
    usersAttending: [
        { 
            type: Schema.Types.ObjectId, 
            ref: "User",
        }
    ],
    requestsFromUsers: [{
        type: Schema.Types.ObjectId, 
        ref: "User",
    }],
    description: String,
    tags: [String],
    dateOfSession: String,
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default : 'Beginner'
    },
    feedbacks: [{
        feedback: String,
        user: { 
            type: Schema.Types.ObjectId, 
            ref: "User",
          },
        date: Date
    }],
    location: {
        country: String,
        state: String,
        city: String,
        address: String,
        zipcode: String,     
      },
      
})

const StudySession = mongoose.model("StudySession", studySessionSchema);

module.exports = StudySession;