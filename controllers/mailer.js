const Candidat = require('../models/candidat');
const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
    
});
exports.envoyerEmailAcceptation = async (req, res) => {
    try {
        const candidat = await Candidat.findById(req.params.id);

        if (!candidat) {
            return res.status(404).json({ message: 'Candidat non trouvé' });
        }

    
        if (!candidat.estRetenu) {
            return res.status(400).json({ message: 'Le candidat n\'est pas retenu' });
        }

        const mailOptions = {
            from: 'hendlegleg1@gmail.com',
            to: candidat.email,
            subject: 'Acceptation au choeur',
            text: `Cher ${candidat.nom}, Félicitations! Vous avez été retenu pour rejoindre le chœur.`,
            attachments: [
                {
                    filename: 'charte_du_choeur.pdf',
                    path: path.join(__dirname, '../charte_du_choeur.pdf')
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'Email envoyé avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email :', error);
        return res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email' });
    }
};
