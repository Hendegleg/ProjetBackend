const User = require('../models/utilisateurs');
const StatusHistory=require('../models/StatusHistory');
const saison=require('../models/saison');

const getListeChoristes = async () => {
  try {
    
    const choristes = await User.find({ role: 'choriste' });

    // Retourner la liste des choristes
    return choristes;
  } catch (error) {
    // Gérer les erreurs
    console.error(error);
    throw new Error('Erreur lors de la récupération de la liste des choristes.');
  }
};


const getProfileAndStatusHistory = async (req, res) => {
  try {
    const {
      statusHistory,
      nbsaison,
      concertsValidated,
      repetitionsValidated,
    } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId).populate('StatusHistory').exec();

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    }

    let currentStatus = 'Inactif';

    if (!StatusHistory || StatusHistory.length === 0 || !StatusHistory[0].nbsaison) {
      currentStatus = 'Choriste Junior';
    } else {
      const firstSeasonYear = StatusHistory[0].nbsaison;

      const currentYear = new Date().getFullYear();

      const yearsOfMembership = currentYear - firstSeasonYear + 1;

      if (yearsOfMembership === 1) {
        currentStatus = 'Choriste';
      } else if (yearsOfMembership === 3 && (concertsValidated >= 10 || repetitionsValidated >= 20)) {
        currentStatus = 'Choriste Senior';
      } else if (firstSeasonYear === 2018) {
        currentStatus = 'Veteran';
      }
    }

    res.status(200).json({ success: true, data: { profile: user.toPublic(), StatusHistory, currentStatus } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getProfileAndStatusHistory,
  getListeChoristes
};