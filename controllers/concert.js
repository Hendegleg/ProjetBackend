const Concert = require('../models/concert'); 


const concertController = {
  
  createConcert: async (req, res) => {
    try {
      const { presence, date, lieu, heure, programme, planning, nom_concert, placement } = req.body;

      
      if (!presence || !date || !lieu || !heure ||  !planning || !nom_concert ) {
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

module.exports = concertController;