const Candidat = require('../models/candidat');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const Verifmail = require("../models/verifmail");


// create
exports.createCandidat = async (req, res) => {
    try {
        const candidat = new Candidat(req.body);
        const savedCandidat = await candidat.save();
        res.status(201).json(savedCandidat);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

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


//create
exports.create = async (req, res) => {
    try {
        const candidat = new Candidat(req.body);
        const savedCandidat = await candidat.save();
        res.status(201).json(savedCandidat);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.sendEmail = async (email, subject, text, attachments = []) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", 
            port: 465, 
            secure: true, 
            auth: {
                user: "wechcrialotfi@gmail.com", 
                pass: "vqbs baba usst djrw", 
            },
        });

        const mailOptions = {
            from: "wechcrialotfi@gmail.com", 
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
        const existingCandidat = await Verifmail.findOne({ email: req.body.email });

        if (existingCandidat) {
            return res.status(409).send({ message: "Candidate with given email already exists!" });
        }

        const candidat = await new Verifmail({ ...req.body }).save();

        const token = jwt.sign(
            { candidatId: candidat._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        

        const url = `http://localhost:5000/api/candidats/${candidat.id}/verify/${token}`;

        const emailSent = await exports.sendEmail(candidat.email, "Verify Email", url);

        if (emailSent) {
            return res.status(201).send({ message: "An Email has been sent to your account, please verify" });
        } else {
            await Verifmail.findByIdAndRemove(candidat._id);
            throw new Error("Error sending verification email");
        }
    } catch (error) {
        console.error('Error in addEmailCandidat:', error);
        return res.status(500).send({ error: "Error creating candidate and sending verification email" });
    }
    
};
exports.verifyEmailToken = async (req, res) => {
    try {
        const { id, token } = req.params;

        // Vérification du token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const candidat = await Verifmail.findById(id);

        if (!candidat) {
            console.log("Candidat not found");
            return res.status(400).send({ message: "Invalid link" });
        }

        // Mise à jour du statut de vérification de l'e-mail
        await Verifmail.findByIdAndUpdate(id, { verified: true });

        res.status(200).send({ message: "Email verified successfully" });
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(400).send({ message: "Token has expired" });
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(400).send({ message: "Invalid token" });
        } else if (error.name === 'MongoError' && error.code === 11000) {
            res.status(500).send({ message: "Duplicate key error" });
        } else {
            console.error('Error in verifyEmailToken:', error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
};
exports.createCandidat = async (req, res) => {
    try {
        const { id } = req.params;

        const candidatVerif = await Verifmail.findById(id);

        if (!candidatVerif) {
            return res.status(400).send({ message: "Candidate not found" });
        }

        if (!candidatVerif.verified) {
            return res.status(401).send({ message: "Email not verified yet" });
        }

        const {
            nom_jeune_fille,
            sexe,
            telephone,
            taille_en_m,
            nationalite,
            cinpassport,
            situationProfessionnelle,
            activite,
            parraine,
            choeuramateur,
            connaissances,
        } = req.body;
       if (!telephone) {
            return res.status(400).send({ message: "Phone number is required" });
        }
       


        const newCandidat = await new Candidat({
            nom: candidatVerif.nom,
            prenom: candidatVerif.prenom,
            email: candidatVerif.email,
            nom_jeune_fille,
            sexe,
            telephone,  
            taille_en_m,
            nationalite,
            cinpassport,
            situationProfessionnelle,
            activite,
            parraine,
            choeuramateur,
            connaissances,
        }).save();
        
        res.status(201).send({
            message: "Le candidat a été créé avec succès",
            data: newCandidat,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error.message });
    }
};









