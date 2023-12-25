const User = require('../models/utilisateurs');
const AbsenceRequest = require('../models/absence');
const Pupitre = require('../models/pupitre');

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




exports.createAbsence = async (req, res) => {
  try {
    const { user, status, reason, repetition, concert, approved } = req.body;

    const newAbsenceRequest = new AbsenceRequest({
      user,
      status,
      reason,
      repetition,
      concert,
      approved,
    });

    const savedAbsenceRequest = await newAbsenceRequest.save();

    res.status(201).json(savedAbsenceRequest);
  } catch (error) {
    console.error('Erreur lors de la création de l\'absence request :', error.message);
    res.status(500).json({ error: 'Erreur lors de la création de l\'absence request' });
  }
};





exports.getChoristesByRepetitionAndPupitre = async (req, res) => {
  try {
    const repetitionId = req.params.repetitionId;
    const tessiture = req.params.tessiture;

    console.log('Recherche des choristes pour la répétition avec l\'ID :', repetitionId);

    const choristes = await AbsenceRequest.find({
      repetition: repetitionId,
      status: 'present',
    }).populate('user', '_id nom prenom email');

    console.log('Choristes trouvés :', choristes);

    const filteredChoristes = await Promise.all(
      choristes.map(async (absence) => {
        const pupitre = await Pupitre.findOne({ choristes: absence.user._id });

        if (pupitre && pupitre.tessiture === tessiture) {
          return {
            tessiture: tessiture,
            Participants: {
              _id: absence.user._id,
              nom: absence.user.nom,
              prenom: absence.user.prenom,
              email: absence.user.email,
            }
          };
        }
        return null; 
      })
    );

    const choristesAvecTessiture = filteredChoristes.filter(choriste => choriste !== null);

    const groupedChoristes = choristesAvecTessiture.reduce((acc, choriste) => {
      const { tessiture, Participants } = choriste;
      if (!acc[tessiture]) {
        acc[tessiture] = { tessiture, Participants: [] };
      }
      acc[tessiture].Participants.push(Participants);
      return acc;
    }, {});

    const result = Object.values(groupedChoristes);

    res.status(200).json(result);
  } catch (error) {
    console.error('Erreur lors de la récupération des choristes par répétition :', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des choristes par répétition' });
  }
};
