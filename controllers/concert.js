const Concert = require('../models/concert'); 


const concertController = {
  
  createConcert: async (req, res) => {
    try {
      const newConcert = await Concert.create(req.body); // Créer un nouveau concert en utilisant les données reçues dans le corps de la requête
      res.status(201).json({  data: newConcert });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
 
  getAllConcerts: async (req, res) => {
    try {
      const concerts = await Concert.find();
      res.status(200).json({  data: concerts });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  
  updateConcert: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedConcert = await Concert.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json({  data: updatedConcert });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
 
  deleteConcert: async (req, res) => {
    try {
      const { id } = req.params;
      await Concert.findByIdAndDelete(id);
      res.status(200).json({data: {} });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },


  
  

};

module.exports = concertController;