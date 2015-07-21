var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = new Schema({
  kind: {
    type: String
  },
  url: {
    type: String
  }
});

module.exports = ImageSchema;
