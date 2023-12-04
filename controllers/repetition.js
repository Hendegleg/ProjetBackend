const Repetition = require("../models/repetition");

const fetchRepetitions = (req, res) => {
  Repetition.find()
    .then((repetitions) => {
      res.status(200).json({
        repetitions: repetitions,
        message: "Succès - Répétitions récupérées",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message,
        message: "Échec de récupération des répétitions",
      });
    });
};

const addRepetition = (req, res) => {
  const newRepetition = new Repetition(req.body);
  newRepetition
    .save()
    .then(() => {
      res.status(200).json({
        repetition: newRepetition,
        message: "Répétition ajoutée avec succès",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message,
        message: "Échec d'ajout de la répétition",
      });
    });
};

const getRepetitionById = (req, res) => {
  Repetition.findById(req.params.id)
    .then((repetition) => {
      if (!repetition) {
        res.status(404).json({
          message: 'Répétition non trouvée',
        });
      } else {
        res.status(200).json({
          repetition: repetition,
          message: 'Répétition récupérée avec succès',
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message,
        message: "Échec de récupération de la répétition par ID",
      });
    });
};

const updateRepetition = (req, res) => {
  Repetition.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((repetition) => {
      if (!repetition) {
        res.status(404).json({
          message: 'Répétition non trouvée',
        });
      } else {
        res.status(200).json({
          repetition: repetition,
          message: 'Répétition mise à jour avec succès',
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message,
        message: "Échec de la mise à jour de la répétition",
      });
    });
};

const deleteRepetition = (req, res) => {
    const repetitionId = req.params.id;

    Repetition.findOneAndDelete({ _id: repetitionId })
        .then(deletedRepetition => {
            if (!deletedRepetition) {
                return res.status(404).json({ message: 'Répétition non trouvée' });
            } else {
                return res.status(200).json({ message: 'Répétition supprimée avec succès' });
            }
        })
        .catch(error => {
            return res.status(500).json({ error: error.message });
        });
};


module.exports = {
  fetchRepetitions: fetchRepetitions,
  addRepetition: addRepetition,
  getRepetitionById: getRepetitionById,
  updateRepetition: updateRepetition,
  deleteRepetition: deleteRepetition,
};
