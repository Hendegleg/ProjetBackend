const Concert = require('../models/concert');
const QRCode = require('qrcode');
const Absence = require('../models/absence');
const Excel = require('exceljs');
//const Utilisateur = require('../models/utilisateurs');
const Utilisateur = require('../models/utilisateurs'); 
const nodemailer = require('nodemailer');


const sendEmailToPupitre = async (subject, content) => {
  try {
    // Récupérer l'adresse e-mail du chef de pupitre depuis la base de données
    const chefDePupitreEmail = await Utilisateur.getChefDePupitreEmail();

    if (!chefDePupitreEmail) {
      console.error('Impossible de récupérer l\'adresse e-mail du chef de pupitre.');
      return;
    }
    // Récupérer l'adresse e-mail du choriste depuis la base de données
  const choristeEmail = await Utilisateur.getChoristeEmail();

  if (!choristeEmail) {
    console.error('Impossible de récupérer l\'adresse e-mail du choriste.');
    return;
  }

    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'namouchicyrine@gmail.com',
        pass: 'tqdmvzynhcwsjsvy',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: choristeEmail,
      to: chefDePupitreEmail,  
      subject: subject,
      text: content,
    };

    await transporter.sendMail(mailOptions);
    console.log('E-mail envoyé avec succès.');

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail:', error.message);
    throw error;
  }
}
const concertController = {


  createConcert: async (req, res) => {

    await QRCode.toFile(`C:\\Users\\tinne\\OneDrive\\Desktop\\ProjetBackend\\image QR\\qrcode-${newConcert._id}.png`, `http://localhost:5000/api/concerts/concerts/${newConcert._id}/confirmerpresence`, {
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    }); 

    try {
      const { presence, date, lieu, heure, programme, planning, nom_concert} = req.body;

      const existingConcert = await Concert.findOne({ date: date }); 

      if (existingConcert) {
        return res.status(400).json({ message: 'Un concert existe déjà à cette date.' });
      }
      if (!nom_concert ) {
        return res.status(400).json({ success: false, error: "Certains champs sont manquants." });
      }
      
      const newConcert = await Concert.create(req.body); 
      res.status(201).json({  model: newConcert });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
 
  getAllConcerts: async (req, res) => {
    try {
      const concerts = await Concert.find();
      res.status(200).json({ model: concerts });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateConcert: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedConcert = await Concert.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json({ model: updatedConcert });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteConcert: async (req, res) => {
    try {
      const { id } = req.params;
      await Concert.findByIdAndDelete(id);
      res.status(200).json({ model: {} });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  confirmerpresenceConcert: async (req, res) => {
    try {
      const { id } = req.params;
      const concert = await Concert.findById(id);

      if (!concert) {
        return res.status(404).json({ message: "concert non trouve!" });
      } else {
        const { userid } = req.body;
        const absence = await Absence.create({
          user: userid,
          status: "present",
          concert: id
        });

        if (!absence) {
          return res.status(404).json({ message: "Présence échouée" });
        } else {
          return res.status(200).json({ message: "Présence enregistrée" });
        }
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  
 
   
  indiquerpresenceConcert: async (req, res) => {
      try {
        const { id } = req.params;
        const { userid } = req.body;
  
        const concert = await Concert.findById(id);
  
        if (!concert) {
          return res.status(404).json({ message: "Concert non trouvé!" });
        }
        const existingConfirmation = concert.confirmations.find(conf => conf.choriste.toString() === userid);
  
        if (existingConfirmation) {
          console.log("Vous avez déjà confirmé votre présence à ce concert." );
        }
        
        const utilisateur = await Utilisateur.findById(userid);
  
        if (!utilisateur) {
          return res.status(404).json({ message: "Utilisateur non trouvé!" });
        }
        concert.confirmations.push({ choriste: utilisateur._id, confirmation: true });
        await concert.save();

        const emailSubject = `Confirmation de présence au concert ${concert.nom_concert}`;
        const emailContent = `Le choriste ${utilisateur.prenom} ${utilisateur.nom} a confirmé sa présence au concert ${concert.nom_concert}.`;
  
        await sendEmailToPupitre(emailSubject, emailContent);
  
        res.status(200).json({ message: "Présence confirmée avec succès. Un e-mail a été envoyé au chef de pupitre." });
      } catch (error) {
        res.status(500).json({ success: false, error: error });
        console.log(error );
      }
    },



  getConfirmedChoristesForConcert: async (req, res) => {
      try {
        const { id } = req.params;
    
        // Assurez-vous de trouver le concert par son identifiant
        const concert = await Concert.findById(id).populate("confirmations.choriste"," _id nom prenom").exec();
    
        if (!concert) {
          return res.status(404).json({ message: "Concert non trouvé!" });
        }
        console.log("Confirmations:", concert.confirmations);
        // Récupérez la liste des choristes confirmés pour ce concert
        const confirmedChoristes = concert.confirmations
          .filter(conf => conf.confirmation)
          .map(conf => conf.choriste);
    
        return res.status(200).json( {"Confirmed Choristes" : confirmedChoristes});
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
},
    
  ajouterPresenceManuelle: async (req, res)=> {
  try {
    const { id } = req.params;
    const { choristeId, raison } = req.body;
    const concert = await Concert.findById(id);

    if (!concert) {
      return res.status(404).json({ message: "Concert non trouvé!" });
    }
    // Vérifiez si le choriste existe dans les confirmations
    const existingConfirmation = concert.confirmations.find(conf => conf.choriste.toString() === choristeId);

    if (existingConfirmation) {
      return res.status(400).json({ message: "Ce choriste a déjà confirmé sa présence à ce concert." });
    }

    // Ajoutez manuellement la confirmation de présence du choriste avec la raison fournie
    concert.confirmations.push({ choriste: choristeId, confirmation: true, raison: raison });
    await concert.save();

    res.status(200).json({ message: "Présence ajoutée manuellement avec succès." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}


  };
module.exports = concertController;
