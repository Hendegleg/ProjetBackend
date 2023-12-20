const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Verifmail = require('./verifmail');

const candidatSchema = new Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    nom_jeune_fille: { type: String, required: true },
    sexe:{ type: String, required: true },
    nationalite : { type: String, },
    taille_en_m :  { type: String, required: true },
    email : {type: String, required:true},
    telephone : { type: Number, required: true, unique: true},
    cinpassport :{ type: String, required: true },
    situationProfessionnelle: { type: String, required: true },
    connaissances :  { type: String, required: true },
    parraine : { type: String, required: true },
    activite : { type: String, required: true },
    choeuramateur : { type: String, required: true },
    estretenu : {type: Boolean, default : false },
    estConfirme : {type: Boolean, default : false },
    signature : {type: Boolean, default : false },
    estEngage: {type: Boolean, default : false },
    token : {type: String}
   
});

const Candidat= mongoose.model('Candidat', candidatSchema);

module.exports = Candidat;