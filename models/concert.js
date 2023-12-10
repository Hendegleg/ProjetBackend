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
            oeuvre: { type: Schema.Types.ObjectId, ref: 'oeuvres' },
            requiresChoir: { type: Boolean, default: true }
        }
    ],
    planning : { type:  Schema.Types.ObjectId, ref: 'Planning', required: true },
    nom_concert : { type : String, require : true }
});


const Concert= mongoose.model('Concert', concertSchema);

module.exports = Concert;