const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuditionSchema = new Schema({
    DateAudition: { type : Date , required : true},
    nombre_séance: { type : Number , required : true},
    dureeAudition: { type : String , required : true},
    evenementAudition: { type: mongoose.Schema.Types.ObjectId, ref: 'evenementAudition' },

    candidat: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidat' },
    extraitChante : { type: String, required: true },
    tessiture: {
        type: String,
        enum: ['Soprano', 'Alto', 'Ténor','Basse','Autre'],
        required: true
    },
    evaluation : { 
        type : String,
        enum: ["A","B","C"] , 
        required: true },
    decisioneventuelle :{ type: String,
        enum:["retenu","en attente","refuse"]
    ,required: true },
    remarque : { type: String, required: true },
});
const Audition= mongoose.model('Audition', AuditionSchema);

module.exports = Audition;