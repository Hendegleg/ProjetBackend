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
//H
const envoyerNotificationCongeJob = new CronJob('0 10 13 * * *', async () => {
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
/*
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
*/

const declareLeave = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const userId = req.params.id;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Veuillez fournir à la fois la date de début et la date de fin du congé.' });
    }

    const user = await User.findById(userId).select('nom prenom conge dateDebutConge dateFinConge');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    user.demandeConge = true;
    user.conge = 'enattente';
    user.dateDebutConge = startDate;
    user.dateFinConge = endDate;

    await user.save();
    /*await sendNotificationForLeaveRequest(userId);*/

    const { nom, prenom, conge, dateDebutConge, dateFinConge } = user;
    res.status(200).json({
      message: 'Demande de congé enregistrée avec succès pour l\'utilisateur.',
      user: { nom, prenom, conge, dateDebutConge, dateFinConge }
    });
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

//hend

const notifiercongechoriste = async () => {
  try {
    const usersOnLeave = await User.find({ demandeConge: true, role: 'choriste' });

    if (usersOnLeave.length > 0) {
      const listOfUsers = usersOnLeave.map(user => ({
        nom: user.nom,
        prenom: user.prenom
      }));

      
      for (const user of usersOnLeave) {
        user.demandeConge = false;
        await user.save();
      }

      return listOfUsers;
    } else {
      return null; 
    }
  } catch (error) {
    console.error('Erreur lors de la notification des congés choristes :', error);
    return null;
  }
};

const modifyLeaveStatus = async (req, res) => {
  try {
    const { userId, approved } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (approved) {
      
      user.demandeConge = false; 
      user.estEnConge = true; 

      // Save the modified status
      await user.save();

      res.status(200).json({ message: 'Statut de congé modifié avec succès.' });
    } else {
      res.status(200).json({ message: 'Demande de congé non approuvée.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const LeaveNotifications = async (req, res) => {
  try {
    // Récupérer les utilisateurs en congé avec demande de congé en attente
    const usersToNotify = await User.find({ conge: 'enattente', demandeConge: true });

    const leaveNotifications = [];
    // Parcourir les utilisateurs à notifier pour créer les notifications
    for (const user of usersToNotify) {
      const notification = new Notification({
        userId: user._id,
        message: 'Vous êtes en congé.'
      });

      await notification.save();
      leaveNotifications.push(notification);
    }

    res.status(200).json({ message: 'Liste des congés', leaveNotifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports={
  /*sendNotificationForLeaveRequest,*/
  notifiercongechoriste,
  sendNotification,
  declareLeave,
  LeaveNotifications,
  modifyLeaveStatus,
}
