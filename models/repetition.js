const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RepetitionSchema = new Schema({
    nom: { type: String, required: true },
    date: { type: Date, required: true },
    heureDebut: { type: String, required: true }, 
    heureFin: { type: String, required: true }, 
    lieu: { type: String, required: true },
    participant: { type: String, required: true },
    nbr_repetition: { type: Number, required: true },
    // pourcentagesPupitres: [{
    //     pupitre: { type: mongoose.Schema.Types.ObjectId, ref: 'Pupitre' },
    //     pourcentage: Number
    // }],
    programme : {type: String}
});

const Repetition = mongoose.model('Repetition', RepetitionSchema);

module.exports = Repetition;
