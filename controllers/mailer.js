const nodemailer = require('nodemailer');
require('dotenv').config();
const Candidat = require('../models/candidat');
const Audition = require('../models/audition')
const path = require('path');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hendlegleg1@gmail.com',
        pass: "gefsfwgpmbjvzmpu"
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
                    text: `Cher ${candidat.nom} , Félicitations! Vous avez été retenu pour rejoindre le chœur, veuillez confirmer votre présence. Cordialement.`,
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

        res.status(200).json({ message: 'Candidats retenus enregistrés avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement des candidats retenus :', error);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement des candidats retenus.' });
    }
};

exports.confirmation = async (req, res) => {
    try {
        const candidat = await Candidat.findById(req.params.id);

        if (!candidat) {
            return res.status(404).json({ message: 'Candidat non trouvé' });
        }

    

        candidat.estConfirme = req.body.estConfirme;
        await candidat.save();

        return res.status(200).json({ message: 'Réponse enregistrée avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la réponse :', error);
        return res.status(500).json({ error: 'Erreur lors de l\'enregistrement de la réponse' });
    }
};
