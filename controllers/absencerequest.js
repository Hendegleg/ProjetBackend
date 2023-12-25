const AbsenceRequest = require('../models/absence');
const Repetition = require('../models/repetition');
const Concert = require('../models/concert');
const User = require('../models/utilisateurs');

exports.informerAbsence = (req, res) => {
  const { eventType, eventDate, reason } = req.body;
  const userId = req.params.id;

  let userObj;
  let eventObj;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      userObj = user;

      let eventModel;

      if (eventType === 'repetition') {
        eventModel = Repetition;
      } else if (eventType === 'concert') {
        eventModel = Concert;
      } else {
        throw new Error('Type d\'événement invalide');
      }

      return eventModel.findOne({ date: eventDate });
    })
    .then((event) => {
      if (!event) {
        throw new Error(`Aucun événement prévu pour la date spécifiée`);
      }

      eventObj = event;

      const absenceRequest = new AbsenceRequest({
        user: userObj._id, // Utilisation de l'ID de l'utilisateur
        nom: userObj.nom, // Utilisation du champ 'nom' de l'utilisateur
        status: 'absent',
        reason: reason,
        repetition: eventType === 'repetition' ? event._id : null,
        concert: eventType === 'concert' ? event._id : null,
        approved: false,
      });

      return absenceRequest.save();
    })
    .then((savedRequest) => {
      return res.status(201).json({ success: true, message: 'Demande d\'absence créée avec succès', savedRequest });
    })
    .catch((error) => {
      return res.status(500).json({ success: false, message: error.message });
    });
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
