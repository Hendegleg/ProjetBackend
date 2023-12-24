const User = require('../models/utilisateurs');
const Notification = require('../models/notifications');
const cron = require('node-cron');
const { CronJob } = require('cron');
const socketIo = require('socket.io');

exports.declareLeave = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.body;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' }); 
    }
    user.demandeConge = true;
    user.conge = "enattente"
    user.dateDebutConge = startDate;
    user.dateFinConge = endDate;
    
    await user.save();

  
    await sendNotificationForLeaveRequest(userId);

    res.status(200).json({ message: 'Demande de congé enregistrée avec succès pour l\'utilisateur.', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.sendNotificationForLeaveRequest = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    if (user.demandeConge === true) {
      const notification = new Notification({
        userId: user._id,
        message: 'Notification pour la demande de congé.'
      });

      await notification.save();
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification pour la demande de congé :', error);
    throw new Error('Erreur lors de l\'envoi de la notification pour la demande de congé');
  }
};
exports.sendNotification = async (req, res) => {
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


const terminateLeaveJob = new CronJob('52 20 * * *', async () => {
  try {
    const users = await User.find({ estEnConge: "enconge" });
    
    users.forEach(async (user) => {
      const currentDate = new Date();
      const endDate = user.dateFinConge;

      if (currentDate > endDate) {
        user.estEnConge = false;
        await user.save();

        const notification = new Notification({
          userId: user._id,
          message: 'Votre congé est terminé.'
        });
        await notification.save();
      }
    });
  } catch (error) {
    console.error('Erreur dans le job cron :', error.message);
  }
});
terminateLeaveJob.start();

const changeLeaveStatusJob = new CronJob('0 0 * * *', async () => {
  try {
    const usersWithLeaveChanged = await User.find({ demandeConge: true, statusChanged: true });

    usersWithLeaveChanged.forEach(async (user) => {
      const notification = new Notification({
        userId: user._id,
        message: `Votre statut de congé a été modifié.`,
      });
      
      await notification.save();
      
      user.statusChanged = false;
      await user.save();
    });
  } catch (error) {
    console.error('Erreur lors de la vérification des modifications du statut de congé :', error);
  }
});
changeLeaveStatusJob.start();

exports.sendNotificationForLeaveRequest = async (req, res) => {
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
exports.getLeaveNotifications = async (req, res) => {
  try {
    // Récupérer les utilisateurs en congé
    const usersEnConge = await User.find({ estEnConge: "enconge" });

    const leaveNotifications = [];
    // Parcourir les utilisateurs en congé pour créer les notifications
    for (const user of usersEnConge) {
      const notification = new Notification({
        userId: user._id,
        message: 'Vous êtes en congé.'
      });

      await notification.save();
      leaveNotifications.push(notification);
    }

    res.status(200).json({ message: 'Liste des congés sous forme de notifications', leaveNotifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


