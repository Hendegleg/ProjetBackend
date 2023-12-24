const User = require('../models/utilisateurs');
const AbsenceRequest = require('../models/absence');

const createAbsenceRequest = async (req, res) => {
  try {
    const { userId, reason, dates, type } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' }); 
    }

    const absenceRequest = new AbsenceRequest({ user: userId, reason, dates, type });
    //sauvegarde f base
    await absenceRequest.save();
    await User.findByIdAndUpdate(userId, { $push: { absence: savedAbsence._id }});

    res.status(201).json({ message: 'Demande d\'absence créée avec succès', absenceRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAbsenceRequestsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const absenceRequests = await AbsenceRequest.find({ User: userId }).populate('user');
    res.status(200).json(absenceRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports={
  createAbsenceRequest,
  getAbsenceRequestsByUser
}