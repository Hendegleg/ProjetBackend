const Audition = require('../models/audition');
const EvenementAudition = require('../models/evenementaudition');
const Candidat = require('../models/candidat');
const nodemailer = require('nodemailer')

const createAudition = async (req, res) => {
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

  // Lire les informations d'une audition spécifique par son ID
  const getAuditionById = async (req, res) => {
    try {
      const audition = await Audition.findById(req.params.id).populate('candidat');
      res.json(audition);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  // Mettre à jour les détails d'une audition spécifique par son ID
exports.updateAudition = async (req, res) => {
    try {
      const audition = await Audition.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(audition);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  // Supprimer une audition spécifique par son ID
exports.deleteAudition = async (req, res) => {
    try {
      await Audition.findByIdAndDelete(req.params.id);
      res.json({ message: 'Audition supprimée' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
