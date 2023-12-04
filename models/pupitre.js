const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pupitreSchema = new Schema({
    num_pupitre : { type : Number , required : true}
});

const Pupitre = mongoose.model('Pupitre', pupitreSchema);
module.exports = Pupitre;