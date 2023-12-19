const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const Candidat = require('../models/candidat')
const Audition = require('../models/audition');
const User = require('../models/utilisateurs');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
function generateUniqueToken() {
    return uuid.v4(); // Génère un identifiant UUID v4 aléatoire
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
        const besoinPupitres = req.body; 

        const candidatsParDecision = await Audition.find({ decisioneventuelle: { $in: ["retenu", "en attente", "refuse"] } })
            .populate('candidat');
        const candidatsParPupitre = {
            Soprano: [],
            Alto: [],
            Ténor: [],
            Basse: []
        };

        candidatsParDecision.forEach(audition => {
            if (audition.candidat) {
                const candidat = audition.candidat;
                switch (audition.tessiture) {
                    case 'Soprano':
                        if (besoinPupitres.Soprano > 0) {
                            candidatsParPupitre.Soprano.push({
                                nom: candidat.nom,
                                prenom: candidat.prenom,
                                decisioneventuelle: audition.decisioneventuelle
                            });
                            besoinPupitres.Soprano--;
                        }
                        break;
                    case 'Alto':
                        if (besoinPupitres.Alto > 0) {
                            candidatsParPupitre.Alto.push({
                                nom: candidat.nom,
                                prenom: candidat.prenom,
                                decisioneventuelle: audition.decisioneventuelle
                            });
                            besoinPupitres.Alto--;
                        }
                        break;
                    case 'Ténor':
                        if (besoinPupitres.Ténor > 0) {
                            candidatsParPupitre.Ténor.push({
                                nom: candidat.nom,
                                prenom: candidat.prenom,
                                decisioneventuelle: audition.decisioneventuelle
                            });
                            besoinPupitres.Ténor--;
                        }
                        break;
                    case 'Basse':
                        if (besoinPupitres.Basse > 0) {
                            candidatsParPupitre.Basse.push({
                                nom: candidat.nom,
                                prenom: candidat.prenom,
                                decisioneventuelle: audition.decisioneventuelle
                            });
                            besoinPupitres.Basse--;
                        }
                        break;
                    default:
                        break;
                }
            }
        });
        return res.status(200).json(candidatsParPupitre);
    } catch (error) {
        console.error('Erreur lors de la récupération des candidats par pupitre :', error);
        return res.status(500).json({ error: 'Erreur lors de la récupération des candidats par pupitre' });
    }
};



exports.confirmerPresence = async (req, res) => {
    const { token } = req.query;

    try {
        
        const candidat = await Candidat.findOne({ token });

        if (!candidat) {
            return res.status(404).send('Token invalide ou expiré.');
        }

        
        candidat.estConfirme = true;
        await candidat.save();

        res.send('Confirmation réussie !');
    } catch (error) {
        res.status(500).send('Erreur lors de la confirmation.');
    }
};

exports.envoyerEmailAcceptation = async (req, res) => {
    try {
        const auditions = await Audition.find({ decisioneventuelle: "retenu" });
        const candidatsRetenusIds = auditions.map(audition => audition.candidat);

        for (const id of candidatsRetenusIds) {
            try {
                const candidat = await Candidat.findById(id);

                console.log("Candidat trouvé : ", candidat);

                if (!candidat.token) {
                    const token = generateUniqueToken();
                    candidat.token = token;
                    await candidat.save();

                    console.log("Token enregistré pour le candidat : ", candidat);

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

                    // Mise à jour des informations du candidat
                    await Candidat.findByIdAndUpdate(id, { estretenu: true, dateEnvoiEmail: Date.now() });
                }
            } catch (error) {
                console.error('Erreur lors du traitement pour le candidat :', error);
            }
        }

        return res.status(200).json({ message: 'le mail et token sont envoyé au candidat ' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement des candidats retenus :', error);
        return res.status(500).json({ message: 'Erreur lors de l\'enregistrement des candidats retenus.' });
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

exports.envoyerEmailConfirmation = async (req, res) => {
    try {
        const candidatId = req.params.id;
        const candidat = await Candidat.findById(candidatId);
        const audition = await Audition.findOne({ candidat: candidatId });
        const tessitureAudition = audition ? audition.tessiture : null;
        const token = candidat ? candidat.token : null; 
        
        const confirmationLink = `http://votre-domaine.com/engagement?token=${token}&confirmation=true`; 
        
        if (!candidat) {
            throw new Error('Candidat non trouvé');
        }

        const generatedPassword = await genererMotDePasse(candidatId); // Génération du mot de passe
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);
        
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
            // Vérification et ajout du choriste seulement si le candidat est confirmé et tous les champs nécessaires sont correctement définis
            if (candidat.nom && candidat.prenom && candidat.email && candidat.motDePasse && tessitureAudition) {
                await ajouterChoriste(candidat, tessitureAudition);
            } else {
                console.error('Les informations nécessaires pour créer un choriste sont incomplètes.');
            }
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

exports.confirmerEngagement = async (req, res) => {
    const { token } = req.query;

    try {
        const candidat = await Candidat.findOne({ token });

        if (!candidat) {
            return res.status(404).send('Token invalide ou expiré.');
        }

        candidat.estEngage = true;
        await candidat.save();
        /*if (candidat.nom && candidat.prenom && candidat.email && candidat.motDePasse && tessitureAudition) {
            await ajouterChoriste(candidat, tessitureAudition);
        } else {
            console.error('Les informations nécessaires pour créer un choriste sont incomplètes.');
        }
*/
        res.send('Engagement confirmé avec succès !');
    } catch (error) {
        res.status(500).send('Erreur lors de la confirmation de l\'engagement.');
    }
};

/*

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
};*/
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
            switch (audition.tessiture) {
                case 'Soprano':
                    candidatsParPupitre.Soprano.push({
                        id: candidat._id,
                        nom: candidat.nom,
                        prenom: candidat.prenom,
                        email: candidat.email,
                        // Ajoutez d'autres champs nécessaires du candidat si besoin
                    });
                    break;
                case 'Alto':
                    candidatsParPupitre.Alto.push({
                        id: candidat._id,
                        nom: candidat.nom,
                        prenom: candidat.prenom,
                        email: candidat.email,
                        // Ajoutez d'autres champs nécessaires du candidat si besoin
                    });
                    break;
                case 'Ténor':
                    candidatsParPupitre.Ténor.push({
                        id: candidat._id,
                        nom: candidat.nom,
                        prenom: candidat.prenom,
                        email: candidat.email,
                        // Ajoutez d'autres champs nécessaires du candidat si besoin
                    });
                    break;
                case 'Basse':
                    candidatsParPupitre.Basse.push({
                        id: candidat._id,
                        nom: candidat.nom,
                        prenom: candidat.prenom,
                        email: candidat.email,
                        // Ajoutez d'autres champs nécessaires du candidat si besoin
                    });
                    break;
                default:
                    break;
            }
        }));

        return res.status(200).json(candidatsParPupitre);
    } catch (error) {
        console.error('Erreur lors de la récupération des candidats retenus par pupitre :', error);
        return res.status(500).json({ error: 'Erreur lors de la récupération des candidats retenus par pupitre' });
    }
};
