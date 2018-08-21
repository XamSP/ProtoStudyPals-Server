const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
mongoose.plugin(schema => { schema.options.usePushEach = true });

const messageSchema = new Schema({
  subject: String,
  users: [
    { 
      type: Schema.Types.ObjectId, 
      ref: "User",
    }
  ],
  texts: [
    {
      msg:String, 
      user: { 
        type: Schema.Types.ObjectId, 
        ref: "User",
      },
      date: Date,
    }
  ],
}, 
{
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;