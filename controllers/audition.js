const Audition = require('../models/audition');
const EvenementAudition = require('../models/evenementaudition');
const Candidat = require('../models/candidat');
const nodemailer = require('nodemailer')

exports.createAudition = async (req, res) => {
    try {
      const {
        DateAudition,
        nombre_séance,
        dureeAudition,
        candidat,
        extraitChante,
        tessiture,
        evaluation,
        decisioneventuelle,
        remarque
      } = req.body;
      if (!DateAudition || !nombre_séance || !dureeAudition || !candidat) {
        return res.status(400).json({ message: "Certains champs sont manquants pour créer une audition." });
      }
      const nouvelleAudition = new Audition({
        DateAudition,
        nombre_séance,
        dureeAudition,
        candidat,
        extraitChante,
        tessiture,
        evaluation,
        decisioneventuelle,
        remarque
      });
      const auditionEnregistree = await nouvelleAudition.save();
      res.status(201).json(auditionEnregistree);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  exports.getAudition = async (req, res) => {
    try {
      const audition = await Audition.find(req.params).populate('candidat');
      res.json(audition);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  // Lire les informations d'une audition spécifique par son ID
  exports.getAuditionById = async (req, res) => {
    try {
      const audition = await Audition.findById(req.params.id).populate('candidat');
      
      if (!audition) {
        return res.status(404).json({ message: "Audition non trouvée." });
      }
  
      res.json(audition);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  // update

  exports.updateAudition = async (req, res) => {
    try {
      const { id } = req.params;
      const audition = await Audition.findById(id);
      
      if (!audition) {
        return res.status(404).json({ message: "Audition non trouvée." });
      }
  
      const updatedAudition = await Audition.findByIdAndUpdate(id, req.body, { new: true });
      res.json(updatedAudition);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  
  exports.deleteAudition = async (req, res) => {
    try {
      const { id } = req.params;
      const audition = await Audition.findById(id);
  
      if (!audition) {
        return res.status(404).json({ message: "Audition non trouvée." });
      }
  
      await Audition.findByIdAndDelete(id);
      res.json({ message: 'Audition supprimée' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  //evenemnt de l'audition et envoi des emails
  
  exports.lancerEvenementAudition = async (req, res) => {
    try {
      
      const { date, lienFormulaire } = req.body;
  
      
      const nouvelEvenement = await EvenementAudition.create({
        date,
        lienFormulaire,
      });
      const tousLesCandidats = await Candidat.find();
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'wechcrialotfi@gmail.com', 
            pass: 'vqbs baba usst djrw'  
        }
    });
  
      
      const contenuEmail = `
      Cher candidat,

      Nous sommes ravis de vous informer de notre prochaine audition.

      Date : ${date}
      Lien vers le formulaire de candidature : ${lienFormulaire}

      Merci et à bientôt !
      Nous vous souhaitons une bonne chance !
    

      `;
  
      for (const candidat of tousLesCandidats) {
        await transporter.sendMail({
          from: 'wechcrialotfi@gmail.com',
          to: candidat.email,
          subject: 'Invitation à l\'audition',
          text: contenuEmail,
        });
      }
  
      res.status(200).json({ message: 'Événement d\'audition lancé avec succès et e-mails envoyés aux candidats.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
