const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const candidatSchema = new Schema({
    Nom: { type: String, required: true },
    Nom_jeune_fille: { type: String, required: true },
    Sexe:{ type: String, required: true },
    Nationalite : { type: String, required: true },
    Taille_en_m :  { type: String, required: true },
    Telephone : { type: Number, required: true, unique: true},
    CINPassport :{ type: String, required: true },
    situationProfessionnelle: { type: String, required: true },
    connaissances :  { type: String, required: true },
    parraine : { type: String, required: true },
    activite : { type: String, required: true },
    choeuramateur : { type: String, required: true }
   
});


const Candidat = mongoose.model('Candidat', candidatSchema);

module.exports = Candidat;
