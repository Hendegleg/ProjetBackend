const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatusSchema = new Schema({
    status: { type: String,
         enum: [ 'Choriste Junior', 'Choriste Senior', 'Veteran'],
         required:true,
         },
    saison: { type: Number }, 
    

    
});

const status = mongoose.model("status", StatusSchema);

module.exports= status;