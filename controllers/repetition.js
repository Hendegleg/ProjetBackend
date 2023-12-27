const cron = require('node-cron');
const { CronJob } = require('cron');
const nodemailer = require('nodemailer');
const Repetition = require("../models/repetition");

const fetchRepetitions = (req, res) => {
  try{
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
}
};

const addRepetition = async (req, res) => {
  try {
    const newRepetition = new Repetition(req.body);
    await newRepetition.save();

    // Génération du QR code
    await QRCode.toFile(`C:\\Users\\tinne\\OneDrive\\Desktop\\ProjetBackend\\image QR\\qrcode-${newRepetition._id}.png`, `http://localhost:5000/api/repetitions/${newRepetition._id}/confirmerpresence`, {
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    res.status(200).json({
      repetition: newRepetition,
      message: "Répétition ajoutée avec succès",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Échec d'ajout de la répétition",
    });
  }
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
const generatePupitreList = async (req, res) => {
  const { numPupitre } = req.body;
  let pourcentage;

  if (numPupitre === 1) {
    pourcentage = Math.floor(Math.random() * 76) + 25;
  } else {
    pourcentage = Math.floor(Math.random() * 100) + 1;
  }

  try {
    const repetitions = await Repetition.find();
    const pupitreList = [];

    repetitions.forEach((repetition) => {
      repetition.pourcentagesPupitres.forEach((pupitre) => {
        if (pupitre.num_pupitre === numPupitre && pupitre.pourcentage === pourcentage) {
          const repetitionInfo = {
            repetitionId: repetition._id,
            date: repetition.date,
            lieu: repetition.lieu,
            heureDebut: repetition.heureDebut,
            heureFin: repetition.heureFin,
            repetitionPercentage: pupitre.pourcentage,
          };
          pupitreList.push(repetitionInfo);
        }
      });
    });

    res.status(200).json(pupitreList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const confirmerpresenceRepetition = async (req, res) => {
  try {
    const { id } = req.params;
    const repetition = await Repetition.findById(id);

    if (!repetition) {
      return res.status(404).json({ message: "Répétition non trouvée!" });
    } else {
      const { userid } = req.body;
      const absence = await Absence.create({
        user: userid,
        status: "present",
        repetition: id
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









const envoyerNotificationChoristes = async () => {
  try {
      const choristes = await User.find({
          role: 'choriste',
          estEnConge: false,
      });

      if (choristes.length > 0) {
          const maintenant = new Date();
          console.log('Maintenant:', maintenant);

          const dateDans24h = new Date(maintenant.getTime() + 24 * 60 * 60 * 1000);
          console.log('Date dans 24 heures:', dateDans24h);

          const repetitionsDans24h = await Repetition.find({
              date: { $gte: maintenant, $lt: dateDans24h },
          });

          console.log('Répétitions dans les 24 heures suivantes:', repetitionsDans24h);

          if (repetitionsDans24h.length > 0) {
              // Envoyer  notifications  aux choristes
              const transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                      user: 'wechcrialotfi@gmail.com',
                      pass: 'vqbs baba usst djrw',
                  },
              });

              for (const choriste of choristes) {
                  const contenuEmail = `
                      Bonjour ${choriste.nom},

                      Vous avez une répétition dans les 24 heures suivantes. Voici les détails :

                      Date de la répétition : ${repetitionsDans24h[0].date}
                      Heure de début : ${repetitionsDans24h[0].heureDebut}
                      Heure de fin : ${repetitionsDans24h[0].heureFin}
                      Lieu : ${repetitionsDans24h[0].lieu}

                      Merci et à bientôt !
                  `;

                  await transporter.sendMail({
                      from: 'wechcrialotfi@gmail.com',
                      to: choriste.email,
                      subject: 'Notification importante - Répétition à venir',
                      text: contenuEmail,
                  });

                  console.log(`Notification envoyée à ${choriste.email}`);
              }
          } else {
              console.log('Aucune répétition dans les 24 heures suivantes.');
          }
      } else {
          console.log('Aucun choriste à notifier.');
      }
  } catch (error) {
      console.error('Erreur lors de l\'envoi des notifications aux choristes :', error.message);
  }
};
cron.schedule('0 12 * * *', async () => {
  await envoyerNotificationChoristes();

  console.log('Tâche cron exécutée.');
});





module.exports = {
  fetchRepetitions: fetchRepetitions,
  addRepetition: addRepetition,
  getRepetitionById: getRepetitionById,
  updateRepetition: updateRepetition,
  deleteRepetition: deleteRepetition,
  generatePupitreList: generatePupitreList,
  envoyerNotificationChoristes,
  confirmerpresenceRepetition: confirmerpresenceRepetition,
};
