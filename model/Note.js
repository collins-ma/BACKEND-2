const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to user
});

noteSchema.plugin(AutoIncrement, { inc_field: 'noteticket', start_seq: 500 });

module.exports = mongoose.model('Note', noteSchema);
