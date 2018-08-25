const mongoose    = require('mongoose');
const User        = require('../models/user');
const Message     = require('../models/message');
const Subject     = require('../models/subject');
const Session     = require('../models/session');

const dbtitle     = 'ProtoStudyPals';

mongoose.connect(`mongodb://localhost/${dbtitle}`);

//User.collection.drop();

const users = [
    {
        //id: ''
        username: "mad",
        password: "$2b$10$Rw10Tv6Y5uEnodBd.P3kUOe8YKrsR74IwYh.HyeuJwpYsbXvl.QJW",
        role: 'Boss',
        gender: 'Male',
        age: 100,
        location:{
            country: "United States",
            state: "California",
            city: "Silicon Valley",
            address: "984 Nw 15 St",
            zipcode: "78965",
        },
        email: "mad@boss.com",
        imgName: "",
        imgPath: "",
        rating: 4,
        subjects: [
            // "Mathematics",
            // "Computer Science",
            // "Literature",
            // "Bussiness"
        ],
        tags:[
            // "Node.js", "Angular", "C++",
            // "Calculus", "Mechanic-Engeneering", 
            // "Mechatronics", "Entrepreneurship",
        ],
        pals:[
            //add someone
        ],
        sessionsPending:[
            //sessions
        ],
        sessionsDone:[
            //sessions
        ],
        // feedbacks:[
        //     // {
        //     // feedback: "Great Person",
        //     // user:  "1"/*userId*/,
        //     // }
        // ],
        inbox:[

        ],
        about: "I'm the Boss!",
        // experiences: [
        //     "Boss", "Calculus Master", 
        //     "Salesperson",
        // ],
    },

]

const subjects = [
    {
        title: "JavaScript",
        users: [
            //userID
          ],
        description: "Basic language of the web, with asynchronus features.",
        imgName: "",
        imgPath: "",
        availableSessions: [
            //sessions
        ],
        pastSessions: [
            //sessions
        ]
    },
    {
        title: "HTML",
        users: [
            //userID
          ],
        description: "Basic language of the web, the fundamental.",
        //https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/1200px-HTML5_logo_and_wordmark.svg.png
        imgName: "",
        imgPath: "",
        availableSessions: [
            //sessions
        ],
        pastSessions: [
            //sessions
        ]
    }
]

const sessions = [
    {
    title: "Basic Functions",
    subjects: [
        //JavaScriptID
    ],
    usersAttending: [
        //UserID
    ],
    requestsFromUsers: [
        //UserID
    ],
    description: "Starting how to interact and make functions with JavaScripts basic tools",
    tags: [
        "JavaScript", "Arrays", "Types", "Methods"
    ],
    // dateOfSession: /*the Date*/2,
    level: "Beginner",
    // feedbacks: [{
    //     feedback: "Not a bad lesson",
    //     user: /*UserID*/1,
    //     date: /*Date*/1
    // }],
    location: {
        country: "United States",
        state: "California",
        city: "Silicon Valley",
        address: "777 nw 77 ave",
        zipcode: "77577",     
      },
    }
]

Subject.create(subjects,(err)=>{
    if (err) {throw err}
    console.log("Subjects Made it to MongoDB.ProtoStudyPals!!!")
});

Session.create(sessions,(err)=>{
    if (err) {throw err}
    console.log("Sessions Made it to MongoDB.ProtoStudyPals!!!")
});

User.create(users,(err)=>{
    if (err) {throw err}
    console.log("Usrs Made it to MongoDB.comvors!!!")
    mongoose.connection.close()
});