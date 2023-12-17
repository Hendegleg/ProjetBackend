const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const Candidat = require('../models/candidat');
const Verifmail = require("../models/verifmail");



// gat_all
exports.getAllCandidats = async (req, res) => {
    try {
        const candidats = await Candidat.find();
        res.status(200).json(candidats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get_by_id
exports.getCandidatById = async (req, res) => {
    try {
        const candidat = await Candidat.findById(req.params.id);
        if (!candidat) {
            return res.status(404).json({ message: 'Candidat non trouvé' });
        }
        res.status(200).json(candidat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// update
exports.updateCandidatById = async (req, res) => {
    try {
        const candidat = await Candidat.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!candidat) {
            return res.status(404).json({ message: 'Candidat non trouvé' });
        }
        res.status(200).json(candidat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// dalete
exports.deleteCandidatById = async (req, res) => {
    try {
        const candidat = await Candidat.findByIdAndRemove(req.params.id);
        if (!candidat) {
            return res.status(404).json({ message: 'Candidat non trouvé' });
        }
        res.status(200).json({ message: 'Candidat supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// create
// exports.createCandidat = async (req, res) => {
//     try {
//         const candidat = new Candidat(req.body);
//         const savedCandidat = await candidat.save();
//         res.status(201).json(savedCandidat);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// }
exports.sendEmail = async (email, subject, text, attachments = []) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", // Remplacez par votre propre valeur
            port: 465, // Remplacez par votre propre valeur
            secure: true, // Remplacez par votre propre valeur
            auth: {
                user: "wechcrialotfi@gmail.com", // Remplacez par votre propre valeur
                pass: "vqbs baba usst djrw", // Remplacez par votre propre valeur
            },
        });

        const mailOptions = {
            from: "wechcrialotfi@gmail.com", // Remplacez par votre propre valeur
            to: email,
            subject: subject,
            html: text,
        };

        if (attachments && attachments.length > 0) {
            mailOptions.attachments = attachments;
        }

        await transporter.sendMail(mailOptions);
        console.log("E-mail sent successfully");
        return true;
    } catch (error) {
        console.error("Error sending e-mail:", error.message);
        return false;
    }
};

exports.addEmailCandidat = async (req, res) => {
    try {
        // Vérifiez si le candidat existe déjà
        const existingCandidat = await Verifmail.findOne({ email: req.body.email });

        if (existingCandidat) {
            // Le candidat existe déjà, vous pouvez choisir de mettre à jour les informations
            // ou simplement renvoyer un message indiquant que le candidat existe déjà
            return res.status(409).send({ message: "Candidate with given email already exists!" });
        }

        // Le candidat n'existe pas, créez un nouveau candidat
        const candidat = await new Verifmail({ ...req.body }).save();

        const token = jwt.sign(
            { candidatId: candidat._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        

        const url = `${process.env.BASE_URL}/api/candidats/${candidat.id}/verify/${token}`;

        // Utilisez la fonction sendEmail définie ci-dessus
        const emailSent = await exports.sendEmail(candidat.email, "Verify Email", url);

        if (emailSent) {
            return res.status(201).send({ message: "An Email has been sent to your account, please verify" });
        } else {
            // Si une erreur survient lors de l'envoi de l'e-mail, vous pouvez choisir de supprimer le candidat créé
            await Verifmail.findByIdAndRemove(candidat._id);
            throw new Error("Error sending verification email");
        }
    } catch (error) {
        console.error('Error in addEmailCandidat:', error);
        return res.status(500).send({ error: "Error creating candidate and sending verification email" });
    }
    
};




// // // code aleatoire
// // const generateRandomCode = () => {
// //     return Math.floor(100000 + Math.random() * 900000).toString();
// // };

// // exports.sendCodeByEmail = async (req, res) => {
// //     const code = generateRandomCode();

// //     const candidateEmail = req.body.email;

// //     if (!candidateEmail) {
// //         return res.status(400).json({ error: 'Adresse e-mail non fournie dans la requête' });
// //     }

// //     const transporter = nodemailer.createTransport({
// //         service: 'gmail',
// //         auth: {
// //             user: 'wechcrialotfi@gmail.com', 
// //             pass: 'vqbs baba usst djrw'   
// //         },
// //         port: 465,
// //         secure: true
// //     });

// //     // Options de l'e-mail
// //     const mailOptions = {
// //         from: 'wechcrialotfi@gmail.com',     
// //         to: candidateEmail,                
// //         subject: 'Code de vérification',
// //         text: `Votre code de vérification est : ${code}`
// //     };

// //     try {
// //         await transporter.sendMail(mailOptions);
// //         console.log('E-mail envoyé avec succès');
// //         res.status(201).json({ message: 'E-mail envoyé avec succès' });
// //     } catch (error) {
// //         console.error('Erreur lors de l\'envoi de l\'e-mail :', error.message);
// //         res.status(500).json({ error: 'Erreur lors de l\'envoi du code de vérification par e-mail' });
// //     }
    
// // };
// module.exports = {
//   sendEmail: sendEmail,
// //     addEmailCandidat,
//  };