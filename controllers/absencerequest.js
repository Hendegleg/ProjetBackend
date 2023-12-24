const User = require('../models/utilisateurs');
const AbsenceRequest = require('../models/absence');

exports.createAbsenceRequest = async (req, res) => {
  try {
    const { userId, reason, dates, type } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' }); 
    }

    const absenceRequest = new AbsenceRequest({ user: userId, reason, dates, type });
    //sauvegarde f base
    await absenceRequest.save();

    res.status(201).json({ message: 'Demande d\'absence créée avec succès', absenceRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAbsenceRequestsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const absenceRequests = await AbsenceRequest.find({ user: userId }).populate('user');
    res.status(200).json(absenceRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
