const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /\S+@\S+\.\S+/.test(v);
            },
            message: 'L\'adresse e-mail doit contenir le caractère "@".',
        },
    },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'choriste'],}
});

UserSchema.virtual('name').get(function () {
    return `${this.prenom} ${this.nom}`;
});

UserSchema.methods.toPublic = function () {
    const publicUserData = this.toObject();
    delete publicUserData.password;
    publicUserData.name = this.name;

    return publicUserData;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
