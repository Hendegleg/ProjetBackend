const nodemailer = require('nodemailer');
require('dotenv').config();
const Candidat = require('../models/candidat');
const Audition = require('../models/audition');
const User = require('../models/utilisateurs');
const bcrypt = require('bcrypt');


const path = require('path');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "hendlegleg1@gmail.com",
        pass: process.env.EMAIL_PASSWORD
    }
});

exports.envoyerEmailAcceptation = async (req, res) => {
    try {
        const auditions = await Audition.find({ decisioneventuelle: true });
        const candidatsRetenusIds = auditions.map(audition => audition.candidat);

        for (const id of candidatsRetenusIds) {
            try {
                const candidat = await Candidat.findById(id);

                const mailOptions = {
                    from: 'hendlegleg1@gmail.com',
                    to: candidat.email,
                    subject: 'Votre acceptation dans le chœur',
                    text: `Cher ${candidat.nom}, Félicitations! Vous avez été retenu pour rejoindre le chœur. Veuillez confirmer votre présence. Cordialement.`,
                    attachments: [
                        {
                            filename: 'charte_du_choeur.pdf',
                            path: path.join(__dirname, '../charte_du_choeur.pdf')
                        }
                    ]
                };

                await transporter.sendMail(mailOptions);
                console.log(`Email envoyé à ${candidat.email}`);

                await Candidat.findByIdAndUpdate(id, { estretenu: true, dateEnvoiEmail: Date.now() });
            } catch (error) {
                console.error('Erreur lors de l\'envoi de l\'email ou de la mise à jour du statut du candidat :', error);
            }
        }

        return res.status(200).json({ message: 'Candidats retenus enregistrés avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement des candidats retenus :', error);
        return res.status(500).json({ message: 'Erreur lors de l\'enregistrement des candidats retenus.' });
    }
};

exports.confirmerEngagement = async (req, res) => {
    try {
        const candidat = await Candidat.findById(req.params.id);

        if (!candidat) {
            return res.status(404).json({ message: 'Candidat non trouvé' });
        }

        const confirmation = req.body.confirmation;

        if (confirmation === 'false') {
            candidat.estConfirme = false; // Si la confirmation est 'false', estConfime faux
        } else if (confirmation === 'true') {
            candidat.estConfirme = true; // Si la confirmation est 'true', estConfime vrai
        } else {
            return res.status(400).json({ message: 'Confirmation invalide' });
        }

        await candidat.save();

        return res.status(200).json({ message: 'Réponse enregistrée avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la réponse :', error);
        return res.status(500).json({ error: 'Erreur lors de l\'enregistrement de la réponse' });
    }
};

exports.envoyerEmailConfirmation = async (req, res) => {
    try {
        const candidatId = req.params.id;
        const candidat = await Candidat.findById(candidatId);

        if (!candidat) {
            throw new Error('Candidat non trouvé');
        }

        const generatedPassword = await genererMotDePasse(candidatId);
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);
        const confirmationLink = `http://localhost:5000/api/candidats/confirmation/${candidatId}?confirmation=true`;

        candidat.motDePasse = hashedPassword;
        await candidat.save();

        const mailOptions = {
            from: 'hendlegleg1@gmail.com',
            to: candidat.email,
            subject: 'Confirmation d\'inscription',
            text: `Bonjour ${candidat.nom}, cliquez sur ce lien pour confirmer votre inscription : ${confirmationLink}. Voici votre login : ${candidat.email} et voici votre mot de passe pour accéder à la plateforme : ${generatedPassword}. Vous devez aussi signer la charte du choeur!`,
        };

        if (candidat.estConfirme === true) {
            await transporter.sendMail(mailOptions);
            console.log(`Email de confirmation envoyé à ${candidat.email}`);
          /*  await exports.ajouterChoriste(candidat);*/
        }

        if (candidat.signature === true) {
            candidat.estEngage = true;
            await candidat.save(); // Sauvegarder l'état de candidat après engagement
        }

        res.status(200).json({ message: 'Email de confirmation envoyé avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de confirmation :', error);
        res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email de confirmation' });
    }
};

async function genererMotDePasse(candidatId) {
    try {
        const candidat = await Candidat.findById(candidatId);

        if (!candidat) {
            throw new Error('Candidat non trouvé');
        }

        const phoneNumber = candidat.telephone;
        const initialName = candidat.nom.charAt(0);

        const generatedPassword = `${phoneNumber}${initialName}`;
        return generatedPassword;
    } catch (error) {
        console.error('Erreur lors de la génération du mot de passe :', error);
        throw new Error('Erreur lors de la génération du mot de passe');
    }
}


exports.ajouterChoriste = async (candidat, tessiture) => {
    try {
        if (candidat.estConfirme === true) {
            const nouveauChoriste = new User({
                nom: candidat.nom,
                prenom: candidat.prenom,
                email: candidat.email,
                password: candidat.motDePasse,
                role: 'choriste',
                tessiture: tessiture, // Utilisation de la tessiture fournie
                taille_en_m: candidat.taille_en_m,
            });

            await nouveauChoriste.save();
            console.log('Nouveau choriste ajouté avec succès.');
        } else {
            console.log('Le candidat n\'est pas confirmé. Le choriste ne sera pas ajouté.');
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du choriste :', error);
        throw new Error('Erreur lors de l\'ajout du choriste');
    }
};


exports.sauvegarderEngagementFinal = async (req, res) => {
  try {
    const candidatId = req.params.id;
    const candidat = await Candidat.findById(candidatId);

    if (!candidat) {
      return res.status(404).json({ message: 'Candidat non trouvé' });
    }
    candidat.estEngage = true;
    await candidat.save();
    return res.status(200).json({ message: 'Engagement final sauvegardé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'engagement final :', error);
    return res.status(500).json({ error: 'Erreur lors de la sauvegarde de l\'engagement final' });
  }
};
exports.getListeCandidats = async (req, res) => {
    try {
        const listeCandidats = await Candidat.find({});
        res.status(200).json(listeCandidats);
        console.log("liste:", listeCandidats)
    } catch (error) {
        console.error('Erreur lors de la récupération de la liste des candidats :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la liste des candidats' });
    }
};
