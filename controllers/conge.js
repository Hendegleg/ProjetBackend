const User = require('../models/utilisateurs');
const Notification = require('../models/notifications');
const CronJob = require('cron').CronJob;

exports.declareLeave = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.body; //je vais mettre les infos en req.bode 
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
const job = new CronJob('0 0 * * *', async () => {
  try {
    const users = await User.find({ estEnConge: true });
    
    users.forEach(async (user) => {
      const currentDate = new Date();
      const endDate = user.dateFinConge;

      if (currentDate > endDate) {
        user.estEnConge = false;
        await user.save();

        //notif fin congé
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
job.start(); 
