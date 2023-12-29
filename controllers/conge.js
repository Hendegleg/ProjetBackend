const User = require('../models/utilisateurs');
const { CronJob } = require('cron');
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "hendlegleg1@gmail.com",
    pass: process.env.EMAIL_PASSWORD
  }
});

const envoyerNotificationCongeJob = new CronJob('00 37 10 * * *', async () => {
  try {
    console.log('Tâche cron en cours d\'exécution pour l\'envoi de notifications de congé...');

    const usersWithLeaveChanged = await User.find({ demandeConge: true, statusChanged: true });

    if (usersWithLeaveChanged.length > 0) {
      for (const user of usersWithLeaveChanged) {
        const contenuEmail = `
          Bonjour ${user.nom},

          Votre statut de congé a été modifié.

          Merci et à bientôt !
        `;

        await transporter.sendMail({
          from: 'hendlegleg1@gmail.com', 
          to: user.email,
          subject: 'Notification de modification du statut de congé',
          text: contenuEmail,
        });

        console.log(`Notification envoyée à ${user.email}`);
        user.statusChanged = false;
        await user.save();
      }
    } else {
      console.log('Aucun utilisateur avec un statut de congé modifié.');
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi des notifications de congé :', error.message);
  }
}, null, true, 'Europe/Paris'); 

envoyerNotificationCongeJob.start();

const sendNotificationForLeaveRequest = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (user.demandeConge === true) {
      const notification = new Notification({
        userId: user._id,
        message: 'Notification pour la demande de congé.'
      });
      

      await notification.save();
      user.demandeConge= false; 
      await user.save();

      res.status(200).json({ message: 'Notification envoyée pour la demande de congé.' });
    } else {
      res.status(200).json({ message: 'Aucune notification envoyée pour la demande de congé.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const declareLeave = async (req, res) => {
  try {
    const {startDate, endDate } = req.body;
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' }); 
    }
    user.demandeConge = true;
    user.conge = "enattente"
    user.dateDebutConge = startDate;
    user.dateFinConge = endDate;
    
    await user.save();
    /*await sendNotificationForLeaveRequest(userId);*/

    res.status(200).json({ message: 'Demande de congé enregistrée avec succès pour l\'utilisateur.', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendNotification = async (req, res) => {
  try {
    const { userId, message } = req.body; 

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    if (!user.estEnConge) {
      const notification = new Notification({ userId, message });
      await notification.save();

      res.status(200).json({ message: 'Notification envoyée avec succès à l\'utilisateur.', notification });
    } else {
      res.status(200).json({ message: 'L\'utilisateur est en congé. Aucune notification envoyée.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const terminateLeaveJob = new CronJob('0 56 20 * * *', async () => {
  try {
    const users = await User.find({ conge: 'enconge' });

    for (const user of users) {
      const currentDate = new Date();
      const endDate = new Date(user.dateFinConge);

      if (currentDate > endDate) {
        user.estEnConge = false;
        await user.save();

        const contenuEmail = `
          Bonjour ${user.nom},

          Votre congé est terminé.

          Merci et à bientôt !
        `;

        await transporter.sendMail({
          from: 'hendlegleg1@gmail.com',
          to: user.email,
          subject: 'Notification de fin de congé',
          text: contenuEmail
        });

        const notification = new Notification({
          userId: user._id,
          message: 'Votre congé est terminé.'
        });

        await notification.save();
      }
    }
  } catch (error) {
    console.error('Erreur dans le job cron :', error.message);
  }
});

terminateLeaveJob.start();


const notifiercongechoriste = async () => {
  try {
    const usersOnLeave = await User.find({ demandeConge: true, role: 'choriste' });
    const admin = await User.findOne({ role: 'admin' });

    if (admin) {
      const notifications = [];
      
      for (const user of usersOnLeave) {
        notifications.push({
          adminId: admin._id,
          message: `Le choriste ${user.nom} ${user.prenom} a demandé un congé.`,
          user: {
            id: user._id,
            nom: user.nom,
            prenom: user.prenom
          }
        });

        user.demandeConge = false;
        await user.save();
      }

      return notifications;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la notification des congés choristes :', error);
    return null;
  }
};
module.exports={
  sendNotificationForLeaveRequest,
  notifiercongechoriste,
  sendNotification,
  declareLeave,
}
