const mongoose = require('mongoose');

const NotesSchema = new Schema({
    title:{
        type: String,
        required:true
    },
    discription:{
        type: String,
        required:true,
        
    },
    tag:{
        type: String,
        default:'general'
    },
    date:{
        type: Date,
        default:Date.now
    }
  });
module.exports = mongoose.model('notes', NotesSchema);