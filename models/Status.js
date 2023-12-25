const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatusSchema = new Schema({
    status: { type: String,
         enum: [ 'inactif','Choriste Junior', 'Choriste Senior', 'Veteran'],
         default:'Choriste Junior',
         },
    saison: { type: Number}, 
    

    
});

const status = mongoose.model("status", StatusSchema);

module.exports= status;