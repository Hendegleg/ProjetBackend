const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AbsenceRequestSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:  { type: String, enum: ['absent', 'present']},
  reason: { type: String, required: function() { return this.status === 'absent'; } },
 
  repetition: { type: mongoose.Schema.Types.ObjectId, ref: 'repetition' },
  concert: { type: mongoose.Schema.Types.ObjectId, ref: 'concert'},

  approved: {type: Boolean,default:false},
  absence: [{ type: Date }], 
});



const AbsenceRequest = mongoose.model('AbsenceRequest', AbsenceRequestSchema);

module.exports = AbsenceRequest;
