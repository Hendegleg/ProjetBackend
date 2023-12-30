const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RepetitionSchema = new Schema({
    nom: { type: String, required: true },
    date: { type: Date, required: true },
    heureDebut: { type: String, required: true }, 
    heureFin: { type: String, required: true }, 
    lieu: { type: String, required: true },
    participant: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    nbr_repetition: { type: Number, required: true },
    pourcentagesPupitres: [
        { 
          pupitre: { type: Number }, 
          selectedChoristes: [
            {
              _id: { type: Schema.Types.ObjectId, ref: 'User' },
              nom: { type: String },
              prenom: { type: String },
            }
          ]
        }
      ],
    programme : {type: String}
});

const Repetition = mongoose.model('Repetition', RepetitionSchema);

module.exports = Repetition;
