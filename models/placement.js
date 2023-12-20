const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placementSchema = new Schema({
  concertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Concert', required: true },
  placementDetails: { type: Schema.Types.Mixed }, 
});

const Placement = mongoose.model('Placement', placementSchema);
module.exports = Placement;
