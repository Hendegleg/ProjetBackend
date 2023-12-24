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
    password:  { type: String, required: true },
    statusHistory: {type: mongoose.Schema.Types.ObjectId, ref: 'status' },
    demandeConge: {type: Boolean, default : false},
    estEnConge: { type: Boolean, default: false }, 
    conge : {type: String, enum : ['enattente','enconge']},
    dateDebutConge: { type: Date }, 
    dateFinConge: { type: Date }, 
    statusChanged: { type: Boolean , default: false },
    active: { type: Boolean, default: true }, 
    dateEntreeChoeur: { type: Date }, 
    dateSortieChoeur: { type: Date },
    role: { type: String,
        enum: ['choriste','manager de choeur','manager de choeur','chef de pupitre', 'admin'],
        default: 'choriste' },
        tessiture: {type : String },
        taille_en_m  : {type: String}, 
    
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
