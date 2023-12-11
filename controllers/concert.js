const Concert = require('../models/concert'); 
const exceljs = require('exceljs');

const concertController = {
  // Create: Créer un nouveau concert
  createConcert: async (req, res) => {
    try {
      const newConcert = await Concert.create(req.body); // Créer un nouveau concert en utilisant les données reçues dans le corps de la requête
      res.status(201).json({ success: true, data: newConcert });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Read: Récupérer tous les concerts
  getAllConcerts: async (req, res) => {
    try {
      const concerts = await Concert.find();
      res.status(200).json({ success: true, data: concerts });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Update: Mettre à jour un concert existant
  updateConcert: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedConcert = await Concert.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json({ success: true, data: updatedConcert });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Delete: Supprimer un concert
  deleteConcert: async (req, res) => {
    try {
      const { id } = req.params;
      await Concert.findByIdAndDelete(id);
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  
};

const importerConcertsDepuisExcel = async (filePath) => {
    try {
      const workbook = new Excel.Workbook();
      await workbook.xlsx.readFile(filePath);
  
      const worksheet = workbook.getWorksheet(1); // Supposons qu'il s'agit de la première feuille
  
      worksheet.eachRow(async (row, rowNumber) => {
        // Récupère les données de chaque ligne du fichier Excel
        const date = row.getCell(1).value;
        const lieu = row.getCell(2).value;
        const affiche = row.getCell(3).value;
        // ... autres champs du concert
  
        // Crée un nouveau concert avec les données récupérées
        const nouveauConcert = new Concert({
          date: date,
          lieu: lieu,
          affiche: affiche,
          // ... autres champs du concert
        });
  
        // Enregistre le concert dans la base de données
        await nouveauConcert.save();
      });
  
      console.log('Importation des concerts depuis Excel terminée.');
    } catch (error) {
      console.error('Erreur lors de l\'importation des concerts depuis Excel :', error);
    }
  };
  
  // Exemple d'utilisation
  const cheminFichierExcel = 'chemin/vers/ton/fichier.xlsx';
  importerConcertsDepuisExcel(cheminFichierExcel);






module.exports = concertController;