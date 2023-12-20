const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EvenementAuditionSchema = new Schema({
    date: { type: Date, required: true },
    lienFormulaire: { type: String},
  });
  
  const EvenementAudition = mongoose.model('EvenementAudition', EvenementAuditionSchema);
  module.exports = EvenementAudition;
