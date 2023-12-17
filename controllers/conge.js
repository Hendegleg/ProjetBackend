const User = require('../models/utilisateurs');
const Notification = require('../models/notifications');
const cron = require('node-cron');
const { CronJob } = require('cron');

exports.declareLeave = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' }); 
    }

    user.estEnConge = true;
    user.dateDebutConge = startDate;
    user.dateFinConge = endDate;
    
    await user.save();

    res.status(200).json({ message: 'Congé déclaré avec succès pour l\'utilisateur.', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
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


const terminateLeaveJob = new CronJob('0 0 * * *', async () => {
  try {
    const users = await User.find({ estEnConge: true });
    
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
    const usersWithLeaveChanged = await User.find({ estEnConge: true, statusChanged: true });

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