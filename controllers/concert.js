const Concert = require('../models/concert'); 
const QRCode= require('qrcode');
const Absense = require('../models/absence');


const concertController = {
  
  createConcert: async (req, res) => {
    try {
      const newConcert = await Concert.create(req.body); // Créer un nouveau concert en utilisant les données reçues dans le corps de la requête
      await QRCode.toFile(`C:\\Users\\tinne\\OneDrive\\Desktop\\ProjetBackend\\image QR\\qrcode-${newConcert._id}.png`,`http://localhost:5000/api/concerts/concerts/${newConcert._id}/confirmerpresence`, {
        color: {
          dark: '#000000', 
          light: '#ffffff'  
        }
      });
      res.status(201).json({ success: true, data: newConcert });
      const { presence, date, lieu, heure, programme, planning, nom_concert, placement } = req.body;

      
      if (!presence || !date || !lieu || !heure || !programme || !planning || !nom_concert || !placement) {
        return res.status(400).json({ success: false, error: "Certains champs sont manquants." });
      }
      const newConcert = await Concert.create(req.body); 
      res.status(201).json({  model: newConcert });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
 
  getAllConcerts: async (req, res) => {
    try {
      const concerts = await Concert.find();
      res.status(200).json({  model: concerts });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  
  updateConcert: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedConcert = await Concert.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json({  model: updatedConcert });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
 
  deleteConcert: async (req, res) => {
    try {
      const { id } = req.params;
      await Concert.findByIdAndDelete(id);
      res.status(200).json({model: {} });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },


  
  

};
  },
  confirmerpresenceConcert:async (req, res) => {
    try {
      const { id } = req.params;
      const concert = await Concert.find({_id:id});
      if (!concert) { 
        res.status(404).json({message:"concert non trouve!"})

      }
      else{
        const { userid } = req.body;
        const absense = await Absense.create({
          user: userid,
          status: "present" ,
          concert:id

        })
        if (!absense) { 
          res.status(404).json({message:"Prensence echoue"})
      }else {
        res.status(200).json({ message:"Prensence enregistre"});
      }
      }
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