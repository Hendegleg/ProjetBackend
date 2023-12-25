const nodemailer = require('nodemailer');
const User=require('../models/utilisateurs')
const Absence = require('../models/absence');

const getAllAbsences = async () => {
    try {
      const absence = await Absence.find({}); // Utilisation de find() sans critère pour récupérer toutes les absences
      
      return absence; // Retourner toutes les absences
    } catch (error) {
      console.error(error);
      throw new Error('Erreur lors de la récupération de toutes les absences.');
    }
  };

  const getChoristedepasseseuil = async (req, res) => {
    try {
      const seuil = req.params.seuil; 
  
      // Récupérer toutes les absences
      const allAbsences = await getAllAbsences();
  
      // Filtrer les choristes dépassant le seuil d'absences
      const choristesDepassantSeuil = allAbsences.filter((absenceRequest) => absenceRequest.absence.length > seuil);
  
      if (choristesDepassantSeuil.length === 0) {
        return res.status(404).json({ success: false, message: 'Aucun choriste ne dépasse le seuil d\'absences défini.' });
      }
  
      res.status(200).json({ success: true, choristesDepassantSeuil });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  const envoyermailnominé = async (email, subject, message) => {
          
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", 
      port: 465, 
      secure: true, 
      auth: {
          user: "wechcrialotfi@gmail.com", 
          pass: "vqbs baba usst djrw", 
      },
  });
  
    
    let mailOptions = {
      from: 'ttwejden@gmail.com', // Adresse e-mail de l'expéditeur
      to: email, 
      subject: subject, 
      text: message, 
      // html: '<p>vous êtes absents 2 fois veuillez expliquer</p>', //
    };
  
    try {
      // Envoi de l'e-mail
      await transporter.sendMail(mailOptions);
      console.log('E-mail envoyé avec succès au choriste nominé.');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
      throw new Error('Erreur lors de l\'envoi de l\'e-mail au choriste nominé.');
    }
  };

const seuil = 2;
const gestionAbsencesExcessives = async () => {
  try {
    
    const tousLesChoristes = await User.find({ role: 'choriste' }).populate('absence');
    for (const choriste of tousLesChoristes) {
      if (choriste.absence.length > seuil) {
        // Si le choriste dépasse le seuil d'absences, le marquer comme "nominé"
        choriste.elimination = 'nominé';
        await choriste.save();
        await envoyermailnominé(choriste.email, 'Notification de nomination', 'Vous êtes nominé en raison de vos absences excessives.'); 
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error('Erreur lors du traitement des absences.');
  }
};

const getChoristesNominés = async (req, res, next) => {
  try {
    const choristesNominés = await User.find({ elimination: 'nomine' });
    if (choristesNominés.length === 0) {
      return res.status(404).json({ success: false, message: 'Aucun choriste nominé trouvé.' });
    }
    res.status(200).json({ success: true, data: choristesNominés });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des choristes nominés.' });
  }
};

const getChoristesÉliminés = async (req, res, next) => {
  try {
    const choristesÉliminés = await User.find({ elimination: 'elimine' });
    if (choristesÉliminés.length === 0) {
      return res.status(404).json({ success: false, message: 'Aucun choriste éliminé trouvé.' });
    }
    res.status(200).json({ success: true, data: choristesÉliminés });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des choristes éliminés.' });
  }
};



  module.exports = {
    getChoristedepasseseuil,
    getAllAbsences ,
    gestionAbsencesExcessives,
    envoyermailnominé ,
    getChoristesNominés,
    getChoristesÉliminés

    
  };