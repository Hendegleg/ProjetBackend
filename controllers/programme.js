const Excel = require('exceljs');
const Programme = require('../models/programme');
const OeuvreModel = require('../models/oeuvres');



const addProgram=async(req,res)=>{
  try {
    const nouveauProgramme = new Programme(req.body);
    await nouveauProgramme.save();
    const oeuvresDetails = await Promise.all(
      nouveauProgramme.oeuvres.map(async (oeuvreId) => {
        
        const details = await OeuvreModel.findById(oeuvreId);
        return details;
        
      })
    );

    
    nouveauProgramme.oeuvres = oeuvresDetails;
    res.status(201).json({
      model: nouveauProgramme,
      message: 'Programme créé avec succès',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: 'Erreur lors de la création du programme',
    });
  }
};


const addProgramFromExcel = async (req, res) => {
  try {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const worksheet = workbook.getWorksheet(1);
    worksheet.eachRow(async (row, rowNumber) => {
      if (rowNumber > 1) {
        const nomProgramme = row.getCell(1).value;
        const oeuvresIds = row.getCell(2).value.split(',');

        const nouveauProgramme = new Programme({
          nom_programme: nomProgramme,
          oeuvres: oeuvresIds
        });

        try {
          await nouveauProgramme.save();
        } catch (error) {
          console.error('Erreur lors de l\'ajout du programme depuis le fichier Excel :', error);
        }
      }
    });

    res.status(200).json({ success: true, message: 'Programmes ajoutés depuis le fichier Excel' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = 
{addProgramFromExcel,
  addProgram

};