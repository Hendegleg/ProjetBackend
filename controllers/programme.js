const Excel = require('exceljs');
const Programme = require('../models/programme');

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

module.exports = addProgramFromExcel;