const Concert = require('../models/concert');
const QRCode = require('qrcode');
const Absence = require('../models/absence');
const Excel = require('exceljs');

const concertController = {

  createConcert: async (req, res) => {
    const newConcert = await Concert.create(req.body);

    //await QRCode.toFile(`C:\\Users\\tinne\\OneDrive\\Desktop\\ProjetBackend\\image QR\\qrcode-${newConcert._id}.png`, `http://localhost:5000/api/concerts/concerts/${newConcert._id}/confirmerpresence`, {
     // color: {
       // dark: '#000000',
       // light: '#ffffff'
     // }
   // }); 

    try {
      const { presence, date, lieu, heure, programme, planning, nom_concert} = req.body;

      const existingConcert = await Concert.findOne({ date: date }); 

      if (existingConcert) {
        return res.status(400).json({ message: 'Un concert existe déjà à cette date.' });
      }
      if (!nom_concert ) {
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
      res.status(200).json({ model: concerts });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateConcert: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedConcert = await Concert.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json({ model: updatedConcert });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteConcert: async (req, res) => {
    try {
      const { id } = req.params;
      await Concert.findByIdAndDelete(id);
      res.status(200).json({ model: {} });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  confirmerpresenceConcert: async (req, res) => {
    try {
      const { id } = req.params;
      const concert = await Concert.findById(id);

      if (!concert) {
        return res.status(404).json({ message: "concert non trouve!" });
      } else {
        const { userid } = req.body;
        const absence = await Absence.create({
          user: userid,
          status: "present",
          concert: id
        });

        if (!absence) {
          return res.status(404).json({ message: "Présence échouée" });
        } else {
          return res.status(200).json({ message: "Présence enregistrée" });
        }
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = concertController;
