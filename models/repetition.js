const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RepetitionSchema = new Schema({
    nom: { type: String, required: true },
    date: {type :Date,required:true},
    heureDebut : {type: Date,required:true},
    lieu: {type: String, required:true},
    participant:{type:String,required:true},
    nbr_repetition:{type: Number,required:true},
    heureFin: {type:Date,required:true}


})
const Repetition = mongoose.model('Repetition', RepetitionSchema);

module.exports = Repetition;