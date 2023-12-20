const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pupitreSchema = new Schema({
    num_pupitre : { type : Number , required : true},
    besoin: { type: Number, required: true },
    candidats: [{ type: Schema.Types.ObjectId, ref: 'candidat' }],
    leaders : [{type:Schema.Types.ObjectId,ref:'utilisateurs'}]
});

const Pupitre = mongoose.model('Pupitre', pupitreSchema);
module.exports = Pupitre;