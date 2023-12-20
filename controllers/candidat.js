const nodemailer = require('nodemailer');
const Candidat = require('../models/candidat');

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
exports.sendCodeByEmail = async (req, res) => {
    const code = generateRandomCode();

    const candidateEmail = req.body.email;

    if (!candidateEmail) {
        return res.status(400).json({ error: 'Adresse e-mail non fournie dans la requête' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'wechcrialotfi@gmail.com', 
            pass: 'vqbs baba usst djrw'   
        },
        port: 465,
        secure: true
    });

    // Options de l'e-mail
    const mailOptions = {
        from: 'wechcrialotfi@gmail.com',     
        to: candidateEmail,                
        subject: 'Code de vérification',
        text: `Votre code de vérification est : ${code}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('E-mail envoyé avec succès');
        res.status(201).json({ message: 'E-mail envoyé avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail :', error.message);
        res.status(500).json({ error: 'Erreur lors de l\'envoi du code de vérification par e-mail' });
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
// code aleatoire
const generateRandomCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendCodeByEmail = async (req, res) => {
    const code = generateRandomCode();

    const candidateEmail = req.body.email;

    if (!candidateEmail) {
        return res.status(400).json({ error: 'Adresse e-mail non fournie dans la requête' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'wechcrialotfi@gmail.com', 
            pass: 'vqbs baba usst djrw'   
        },
        port: 465,
        secure: true
    });

    // Options de l'e-mail
    const mailOptions = {
        from: 'wechcrialotfi@gmail.com',     
        to: candidateEmail,                
        subject: 'Code de vérification',
        text: `Votre code de vérification est : ${code}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('E-mail envoyé avec succès');
        res.status(201).json({ message: 'E-mail envoyé avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail :', error.message);
        res.status(500).json({ error: 'Erreur lors de l\'envoi du code de vérification par e-mail' });
    }
    
};
