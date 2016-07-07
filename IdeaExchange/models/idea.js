
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


var ideaSchema = new mongoose.Schema({

  name    :   {type: String, required: true},
  creator :   {type: String, required: true},
  tagline : {type: String, required: true},
  description: {type: String, required: true},
  tags    : [String],
  createdOn : {type: Date, Default : Date.now},
  likers  :   [String],
  files   :   [String],
  //comments:   [commentSchema]
});

//var commentSchema = new Schema({ commenter: 'string', text: 'string'});
// create and export to our app
module.exports = mongoose.model('Idea', ideaSchema);
