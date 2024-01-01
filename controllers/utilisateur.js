const User = require('../models/utilisateurs');
const StatusHistory=require('../models/StatusHistory');
const saison=require('../models/saison');
const {getChoristesNominés,getChoristesÉliminés}=require('../controllers/absenceElemination')

const getListeChoristes = async () => {
  try {
    
    const choristes = await User.find({ role: 'choriste' });

    
    return choristes;
  } catch (error) {
    
    console.error(error);
    throw new Error('Erreur lors de la récupération de la liste des choristes.');
  }
};
const voirProfilChoriste = async (idUser) => {
  try {
    const choriste = await User.findById(idUser);
    if (!choriste) {
      throw new Error('Choriste non trouvé.');
    }

    // Récupérer les informations du choriste
    // ...

    // Récupérer la liste des nominés et éliminés pour affichage dans le profil
    const choristesNominés = await getChoristesNominés();
    const choristesÉliminés = await getChoristesÉliminés();

    return {
      infosChoriste: choriste,
      choristesNominés,
      choristesÉliminés,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Erreur lors de la récupération du profil du choriste.');
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    }

    const statusHistory = await StatusHistory.find({ utilisateur: userId }).sort({ date: 'desc' }).exec();

    let currentStatus = 'Inactif';

    if (!statusHistory || statusHistory.length === 0) {
      currentStatus = 'Choriste Junior';
    } else {
      const latestStatus = statusHistory[0]; // Obtenez le statut le plus récent

      // Utilisez le nouveau statut le plus récent de statusHistory comme currentStatus
      currentStatus = latestStatus.nouveauStatus;
    }

    res.status(200).json({ success: true, data: { profile: user.toPublic(), statusHistory, currentStatus } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getProfile,
  getListeChoristes,
  voirProfilChoriste
};