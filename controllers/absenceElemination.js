const Absence = require('../models/absence');

const getAllAbsences = async () => {
    try {
      const absence = await Absence.find({}); // Utilisation de find() sans critère pour récupérer toutes les absences
      
      return absence; // Retourner toutes les absences
    } catch (error) {
      console.error(error);
      throw new Error('Erreur lors de la récupération de toutes les absences.');
    }
  };

  const getChoristedepasseseuil = async (req, res) => {
    try {
      const seuil = req.params.seuil; // Seuil d'absences défini
  
      // Récupérer toutes les absences
      const allAbsences = await getAllAbsences();
  
      // Filtrer les choristes dépassant le seuil d'absences
      const choristesDepassantSeuil = allAbsences.filter((absence) => Absence.absence.length > seuil);
  
      if (choristesDepassantSeuil.length === 0) {
        return res.status(404).json({ success: false, message: 'Aucun choriste ne dépasse le seuil d\'absences défini.' });
      }
  
      res.status(200).json({ success: true, choristesDepassantSeuil });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  module.exports = {getChoristedepasseseuil,getAllAbsences };