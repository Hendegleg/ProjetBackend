const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const Candidat = require('../models/candidat')
const Audition = require('../models/audition');
const User = require('../models/utilisateurs');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const Pupitre = require ('../models/pupitre');
function generateUniqueToken() {
    return uuid.v4(); 
}


const path = require('path');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "hendlegleg1@gmail.com",
        pass: process.env.EMAIL_PASSWORD
    }
});

exports.getListeCandidatsParPupitre = async (req, res) => {
    try {
        const besoinPupitres = req.body|| {}

        const candidatsParPupitre = {
            Soprano: { retenu: [], 'en attente': [], refuse: [] },
            Alto: { retenu: [], 'en attente': [], refuse: [] },
            Ténor: { retenu: [], 'en attente': [], refuse: [] },
            Basse: { retenu: [], 'en attente': [], refuse: [] }
        };
        if (Object.keys(besoinPupitres).length === 0) {
            return res.status(400).json({ error: 'Besoin des pupitres non spécifié dans la requête' });
        }

        const auditionsRetenues = await Audition.find({ decisioneventuelle: { $in: ['retenu', 'en attente', 'refusé'] } }).populate('candidat');

        for (const audition of auditionsRetenues) {
            const candidat = audition.candidat;
            const tessiture = audition.tessiture;
            const decision = audition.decisioneventuelle;

            const candidatData = {
                id: candidat._id,
                nom: candidat.nom,
                prenom: candidat.prenom,
                email: candidat.email,
            };

            if (candidatsParPupitre[tessiture]['retenu'].length < besoinPupitres[tessiture]) {
                if (decision === 'retenu' && candidatsParPupitre[tessiture]['retenu'].length < besoinPupitres[tessiture]) {
                    candidatsParPupitre[tessiture]['retenu'].push(candidatData);
                } else if (decision === 'en attente' && candidatsParPupitre[tessiture]['en attente'].length < besoinPupitres[tessiture]) {
                    candidatsParPupitre[tessiture]['en attente'].push(candidatData);
                } else {
                    candidatsParPupitre[tessiture]['refuse'].push(candidatData);
                }
            }
        }

        return res.status(200).json(candidatsParPupitre);
    } catch (error) {
        console.error('Erreur lors de la récupération des candidats retenus par pupitre :', error);
        return res.status(500).json({ error: 'Erreur lors de la récupération des candidats retenus par pupitre' });
    }
};


exports.confirmerPresence = (req, res) => {
    const { token } = req.query;

    Candidat.findOne({ token })
        .then(async (candidat) => {
        
            if (!candidat) {
                return res.status(404).send('Token invalide ou expiré.');
            }

            candidat.estConfirme = true;
            await candidat.save();

            res.send('Confirmation réussie !');
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Erreur lors de la confirmation.');
        });
};


exports.envoyerEmailAcceptation = async (req, res) => {
    try {
        const auditions = await Audition.find({ decisioneventuelle: "retenu" });       
        const candidatsRetenusIds = auditions.map(audition => audition.candidat);
        let countEmailsSent = 0;

        for (const id of candidatsRetenusIds) {
            try {
                const candidat = await Candidat.findById(id);

                if (!candidat.token) {
                    const token = generateUniqueToken();
                    candidat.token = token;
                    const confirmationLink = `http://votre-domaine.com/confirmation-presence?token=${token}&decision=confirm`;

                    const mailOptions = {
                        from: 'hendlegleg1@gmail.com',
                        to: candidat.email,
                        subject: 'Votre acceptation dans le chœur',
                        text: `Cher ${candidat.nom}, Félicitations! Vous avez été retenu pour rejoindre le chœur. Veuillez confirmer votre présence en cliquant sur ce lien : ${confirmationLink}. Cordialement.`,
                        attachments: [
                            {
                                filename: 'charte_du_choeur.pdf',
                                path: path.join(__dirname, '../charte_du_choeur.pdf')
                            }
                        ]
                    };

                    await transporter.sendMail(mailOptions);
                    console.log(`Email envoyé à ${candidat.email}`);
                    await candidat.save();
                    countEmailsSent++;
                } else {
                    console.log(`Le candidat ${candidat.nom} a déjà un token. Aucun email envoyé.`);
                }
            } catch (error) {
                console.error('Erreur lors du traitement pour le candidat :', error);
            }
        }

        let message = '';
        if (countEmailsSent > 0) {
            message = `Les e-mails et tokens ont été envoyés à ${countEmailsSent} candidat(s) sans token existant.`;
        } else {
            message = 'Aucun e-mail envoyé car tous les candidats ont déjà un token.';
        }

        res.status(200).json({ message });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement des candidats retenus :', error);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement des candidats retenus.' });
    }
};

const ajouterChoriste = async (candidat, tessiture) => {
    try {
        if (candidat.estConfirme === true) {
            const nouveauChoriste = new User({
                nom: candidat.nom,
                prenom: candidat.prenom,
                email: candidat.email,
                password: candidat.motDePasse,
                role: 'choriste',
                tessiture: tessiture, 
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

exports.envoyerEmailConfirmation = async () => {
    try {
        const candidat = await Candidat.findOne({ estConfirme: true });

        if (!candidat) {
            throw new Error('Aucun candidat confirmé trouvé');
        }
        const audition = await Audition.findOne({ candidat: candidat._id });
        const tessitureAudition = audition ? audition.tessiture : null;
        const token = candidat ? candidat.token : null;

        const confirmationLink = `http://votre-domaine.com/engagement?token=${token}&confirmation=true`;

        if (candidat.estConfirme === true) {
            const generatedPassword = await genererMotDePasse(candidat._id);
            const hashedPassword = await bcrypt.hash(generatedPassword, 10);

            candidat.motDePasse = hashedPassword;
            await candidat.save();
            const mailOptions = {
                from: 'hendlegleg1@gmail.com',
                to: candidat.email,
                subject: 'Confirmation d\'inscription',
                text: `Bonjour ${candidat.nom}, cliquez sur ce lien pour confirmer votre inscription : ${confirmationLink}. Voici votre login : ${candidat.email} et voici votre mot de passe pour accéder à la plateforme : ${generatedPassword}. Vous devez aussi signer la charte du choeur!`,
            };

            await transporter.sendMail(mailOptions);
            console.log(`Email de confirmation envoyé à ${candidat.email}`);

            if (candidat.nom && candidat.prenom && candidat.email && candidat.motDePasse && tessitureAudition) {
                await ajouterChoriste(candidat, tessitureAudition);
            } else {
                console.error('Les informations nécessaires pour créer un choriste sont incomplètes.');
            }
        }

        return { message: 'Email de confirmation envoyé avec succès' };
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de confirmation :', error);
        return { error: 'Erreur lors de l\'envoi de l\'email de confirmation' };
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

exports.confirmerEngagement = async (req, res) => {
    const { token } = req.query;

    try {
        const candidat = await Candidat.findOne({ token });

        if (!candidat) {
            return res.status(404).send('Token invalide ou expiré.');
        }

        candidat.estEngage = true;
        await candidat.save();
        res.send('Engagement confirmé avec succès !');
    } catch (error) {
        res.status(500).send('Erreur lors de la confirmation de l\'engagement.');
    }
};


let listeCandidatsParSaison = {}; // objet je peux l'utiliser après

exports.getListeCandidats = async (req, res) => {
    try {
        const saison = req.body.saison; 
        
        if (!saison) {
            return res.status(400).json({ message: 'Numéro de saison manquant dans le corps de la requête' });
        }

        if (!listeCandidatsParSaison[saison]) {
            listeCandidatsParSaison[saison] = await Candidat.find({ saison }, 'nom prenom');
            console.log(listeCandidatsParSaison)
        }

        res.status(200).json(listeCandidatsParSaison[saison]);
        console.log(`Liste des candidats pour la saison ${saison}:`, listeCandidatsParSaison[saison]);
    } catch (error) {
        console.error('Erreur lors de la récupération de la liste des candidats :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la liste des candidats' });
    }
};

exports.getCandidatsRetenusParPupitre = async (req, res) => {
    try {
        const auditionsRetenues = await Audition.find({ decisioneventuelle: 'retenu' });

        const candidatsParPupitre = {
            Soprano: [],
            Alto: [],
            Ténor: [],
            Basse: []
        };

        await Promise.all(auditionsRetenues.map(async (audition) => {
            const candidat = await Candidat.findById(audition.candidat);
            let numPupitre = null;

            switch (audition.tessiture) {
                case 'Soprano':
                    numPupitre = 1;
                    break;
                case 'Alto':
                    numPupitre = 2;
                    break;
                case 'Ténor':
                    numPupitre = 3;
                    break;
                case 'Basse':
                    numPupitre = 4;
                    break;
                default:
                    break;
            }

            let existingPupitre = await Pupitre.findOne({ num_pupitre: numPupitre, tessiture: audition.tessiture });

            if (existingPupitre) {
                if (!existingPupitre.choristes.includes(candidat._id)) {
                    existingPupitre.choristes.push(candidat._id);
                    await existingPupitre.save();
                }
            } else {
                const newPupitreInstance = new Pupitre({
                    num_pupitre: numPupitre,
                    tessiture: audition.tessiture,
                    besoin: 1,
                    choristes: [candidat._id]
                });

                await newPupitreInstance.save();
            }

            candidatsParPupitre[audition.tessiture].push({
                id: candidat._id,
                nom: candidat.nom,
                prenom: candidat.prenom,
                email: candidat.email,
            });
        }));

        return res.status(200).json(candidatsParPupitre);
    } catch (error) {
        console.error('Erreur lors de la récupération des candidats retenus par pupitre :', error);
        return res.status(500).json({ error: 'Erreur lors de la récupération des candidats retenus par pupitre' });
    }
};

