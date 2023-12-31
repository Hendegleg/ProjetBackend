const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatusHistorySchema = new Schema({
    status: {
        type: String,
        required: true
      },
      nbsaison: {
        type: Number,
        required: true
      },
    
    }, { timestamps: true });
    

    

    const StatusHistory = mongoose.model('StatusHistory', StatusHistorySchema);

    module.exports = StatusHistory;