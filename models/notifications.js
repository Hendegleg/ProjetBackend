const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
