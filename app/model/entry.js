var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EntrySchema = new Schema({
  date: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  data: {
    stressLevel: { type: Number, min: 0, max: 10 },
    feeling: { type: Number, min: 0, max: 10 },
    mood: { type: String },
    source: { type: String },
    symptoms: [{ type: String }],
    behaviors: [{ type: String }]
  }
});

module.exports = mongoose.model('Entry', EntrySchema);
