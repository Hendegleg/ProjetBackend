const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatusSchema = new Schema({
    status: { type: String,
         enum: ['Choriste', 'Choriste Junior', 'Choriste Senior', 'Veteran'],
         required:true,
         },
    saison: { type: Number }, 
    
});

const Statut = mongoose.model('StatusSchema', StatusSchema);

module.exports = Statut;