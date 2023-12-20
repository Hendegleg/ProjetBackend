const Excel = require('exceljs');
const Programme = require('../models/programme');
const OeuvreModel = require('../models/oeuvres');



const addProgram=async(req,res)=>{
  try {
    // Vérifier si un programme avec le même nom existe déjà
    const existingProgram = await Programme.findOne({ nom_programme: req.body.nom_programme });

    if (existingProgram) {
      return res.status(400).json({
        message: 'Un programme avec ce nom existe déjà',
        model: existingProgram,
      });
    }
  
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
    const programsToAdd = [];

    worksheet.eachRow(async (row, rowNumber) => {
      if (rowNumber > 1) {
        const nomProgramme = row.getCell(1).value;
        const oeuvresIds = row.getCell(2).value.split(',');

        const existingProgram = await Programme.findOne({ nom_programme: nomProgramme });

        if (existingProgram) {
          console.log(`Un programme avec le nom '${nomProgramme}' existe déjà.`);
          return; 
        }

        const nouveauProgramme = new Programme({
          nom_programme: nomProgramme,
          oeuvres: []
        });

        for (const oeuvreId of oeuvresIds) {
          try {
            const detailsOeuvre = await OeuvreModel.findById(oeuvreId);
            if (detailsOeuvre) {
              nouveauProgramme.oeuvres.push(detailsOeuvre);
            } else {
              console.error(`Œuvre non trouvée avec l'ID ${oeuvreId}`);
            }
          } catch (error) {
            console.error(`Erreur lors de la recherche de l'œuvre ${oeuvreId}:`, error);
          }
        }

        programsToAdd.push(nouveauProgramme); 
      }
    });

    
    const savedPrograms = await Programme.insertMany(programsToAdd);

    const detailedPrograms = await Programme.find({ _id: { $in: savedPrograms.map(program => program._id) } })
      .populate('oeuvres');

    res.status(200).json({ success: true, message: 'Programmes ajoutés depuis le fichier Excel', savedPrograms: detailedPrograms });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



module.exports = 
{addProgramFromExcel,
  addProgram

};