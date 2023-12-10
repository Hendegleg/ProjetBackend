const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OeuvresSchema = new Schema({
    titre: { type: String, required: true },
    compositeurs :  { type: String, required: true },
    arrangeurs :  { type: String, required: true },
    annee:  { type: String, required: true },
    genre : { type: String, required: true },
    paroles : { type: String, required: true },
    partition: { type: String, required: true },
    presenceChoeur: { type: String, required: true },
});


const Oeuvres = mongoose.model('oeuvres', OeuvresSchema);
module.exports = Oeuvres;