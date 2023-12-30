const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const concertSchema = new Schema({
    presence: {
        type: Boolean,
        required: true,
    },
    date: { type: Date, required: true },
    lieu: { type: String, required: true },
    heure: { type: Date, required: true },
    programme: [
        {
            programme: { type: Schema.Types.ObjectId, ref: 'Programme' },
            requiresChoir: { type: Boolean, default: true }
        }
    ],
    planning : { type:  Schema.Types.ObjectId, ref: 'repetition', required: true },
    nom_concert : { type : String, require : true },
    placement : {type :Schema.Types.ObjectId, ref : 'Placement' },
    participant: [{ type: Schema.Types.ObjectId, ref: 'User' }] 


});


const Concert= mongoose.model('Concert', concertSchema);

module.exports = Concert;