const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuditionSchema = new Schema({
    DateAudition: { type : Date , required : true},
    nombre_séance: { type : Number , required : true},
    dureeAudition: { type : String , required : true},
});


const Audition= mongoose.model('Audition', AuditionSchema);

module.exports = Audition;