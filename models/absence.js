const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AbsenceRequestSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  dates: [{ type: Date, required: true }],
  type: { type: String, enum: ['repetition', 'concert'], required: true },
  approved: {type: Boolean,default:false}
});

const AbsenceRequest = mongoose.model('AbsenceRequest', AbsenceRequestSchema);

module.exports = AbsenceRequest;
