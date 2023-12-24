const Audition = require('../models/audition');
const EvenementAudition = require('../models/evenementaudition');
const Candidat = require('../models/candidat');
const nodemailer = require('nodemailer')
const moment = require('moment');

const createAuditionsForCandidats = async (req, res) => {
  try {
      const auditionPlanning = await planningAudition.find();
console.log(auditionPlanning[0].debutAud)
      if (!auditionPlanning) {
          return res.status(404).json({ message: 'Audition planning not found1' });
      }

      const candidats = await Candidat.find();

      let currentAuditionTime = auditionPlanning[0].debutAud;
      if (isNaN(currentAuditionTime.getTime())) {
          return res.status(400).json({ error: 'Invalid date for audition time1' });
      }
      console.log(currentAuditionTime.getTime())


      for (const candidat of candidats) {
          console.log(currentAuditionTime.getTime())

          if (currentAuditionTime.getHours() >= 16) {
              currentAuditionTime.setDate(currentAuditionTime.getDate() + 1);
              currentAuditionTime.setHours(8, 0, 0, 0);
          }

          if (isNaN(currentAuditionTime.getTime())) {
              return res.status(400).json({ error: 'Invalid date for audition time' });
          }

          const audition = new Audition({
              extraitChanter: "Sample singing excerpt",
              tessiture: "Sample tessiture",
              evaluation: "Sample evaluation",
              decision: "Sample decision",
              date_heure: currentAuditionTime,
              candidat: candidat._id, 
          });

          await audition.save();

          currentAuditionTime = new Date(currentAuditionTime.getTime() + auditionPlanning[0].dureeCoriste * 60 * 60 * 1000);
      }

      res.status(201).json({ message: 'Auditions cree pour tous les candidats ' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const createAudition = async (req, res) => {
  try {
    const {
      DateAudition,
      nombre_séance,
      dureeAudition,
      candidat,
      extraitChante,
      tessiture,
      evaluation,
      decisioneventuelle,
      remarque
    } = req.body;
    const nouvelleAudition = new Audition({
      DateAudition,
      nombre_séance,
      dureeAudition,
      candidat,
      extraitChante,
      tessiture,
      evaluation,
      decisioneventuelle,
      remarque
    });
    const auditionEnregistree = await nouvelleAudition.save();
    res.status(201).json(auditionEnregistree);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

  // Lire les informations d'une audition spécifique par son ID
  const getAuditionById = async (req, res) => {
    try {
      const audition = await Audition.findById(req.params.id).populate('candidat');
      res.json(audition);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  // Mettre à jour les détails d'une audition spécifique par son ID
  const updateAudition = async (req, res) => {
    try {
      const audition = await Audition.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(audition);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  // Supprimer une audition spécifique par son ID
  const deleteAudition = async (req, res) => {
    try {
      await Audition.findByIdAndDelete(req.params.id);
      res.json({ message: 'Audition supprimée' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  const lancerEvenementAudition = async (req, res) => {
    try {
      
      const { date, lienFormulaire } = req.body;
  
      
      const nouvelEvenement = await EvenementAudition.create({
        date,
        lienFormulaire,
      });
      const tousLesCandidats = await Candidat.find();
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'wechcrialotfi@gmail.com', 
            pass: 'vqbs baba usst djrw'  
        }
    });
  
      
      const contenuEmail = `
      Cher candidat,

      Nous sommes ravis de vous informer de notre prochaine audition.

      Date : ${date}
      Lien vers le formulaire de candidature : ${lienFormulaire}

      Merci et à bientôt !
      Nous vous souhaitons une bonne chance !
    

      `;
  
      for (const candidat of tousLesCandidats) {
        await transporter.sendMail({
          from: 'wechcrialotfi@gmail.com',
          to: candidat.email,
          subject: 'Invitation à l\'audition',
          text: contenuEmail,
        });
      }
  
      res.status(200).json({ message: 'Événement d\'audition lancé avec succès et e-mails envoyés aux candidats.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // tache b 
  
  async function genererPlanification(req, res) {
    try {
      const { evenementAuditionId } = req.body;
      const auditionPlanning = await EvenementAudition.findOne({ _id: evenementAuditionId });
      const candidats = await Candidat.find();
  
      // Filtrer les candidats qui ne se sont pas encore présentés
      const candidatsNonPresentes = candidats.filter(candidat => !candidat.estPresent);
  
      const nombreSeancesParJour = auditionPlanning.nombre_séance;
      const dureeAuditionMinutes = auditionPlanning.dureeAudition;
  
      const nombreTotalSeances = Math.ceil(
        candidatsNonPresentes.length / nombreSeancesParJour
      );
  
      const planning = [];
  
      let dateDebutAudition = moment(auditionPlanning.Date_debut_Audition)
        .hours(8)
        .minutes(0)
        .milliseconds(0);
  
      for (let seance = 0; seance < nombreTotalSeances; seance++) {
        for (let seanceJour = 0; seanceJour < nombreSeancesParJour; seanceJour++) {
          const auditionIndex = seance * nombreSeancesParJour + seanceJour;
  
          if (auditionIndex < candidatsNonPresentes.length) {
            const candidat = candidatsNonPresentes[auditionIndex];
  
            const dateFinAudition = dateDebutAudition
              .clone()
              .add(dureeAuditionMinutes, "minutes");
  
            if (dateFinAudition.isAfter(auditionPlanning.Date_fin_Audition)) {
              console.warn(
                "La date de fin de l'audition dépasse la date spécifiée."
              );
              res.status(400).json({
                success: false,
                error: "La date de fin de l'audition dépasse la date spécifiée.",
              });
              return;
            }
  
            const audition = new Audition({
              heure_debut: dateDebutAudition.toDate(),
              heure_fin: dateFinAudition.toDate(),
              candidat: candidat._id,
              evenementAudition: evenementAuditionId,
              date_audition: dateDebutAudition.toDate(),
            });
  
            await audition.save();
  
            // Envoyer un e-mail différent en fonction de la présence du candidat
            const sestPresente = false; 
            await sendAuditionEmails(candidat, audition, sestPresente);
  
            planning.push({
              nom: candidat.nom,
              prenom: candidat.prenom,
              email: candidat.email, // Ajouter l'e-mail du candidat
              date_audition: dateDebutAudition.format("DD/MM/YYYY"),
              heure_debut_audition: dateDebutAudition.format("HH:mm"),
              heure_fin_audition: dateFinAudition.format("HH:mm"),
            });
  
            // Mettre à jour la propriété estEngage du candidat
            candidat.estEngage = true;
            await candidat.save();
  
            dateDebutAudition.add(dureeAuditionMinutes, "minutes");
          }
        }
  
        dateDebutAudition = moment(auditionPlanning.Date_debut_Audition)
          .add(seance + 1, "days")
          .hours(8)
          .minutes(0)
          .seconds(0)
          .milliseconds(0);
      }
  
      console.log("Planification des candidats générée avec succès");
      res.status(200).json({ success: true, data: planning });
  
    } catch (error) {
      console.error(
        "Erreur lors de la génération de la planification des candidats:",
        error.message
      );
      res.status(500).json({ success: false, error: error.message });
    }
  }
  
  
 
  const sendAuditionEmails = async (candidat, audition, sestPresente) => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'namouchicyrine@gmail.com',
          pass: 'tqdmvzynhcwsjsvy',  
        },
        tls: {
          // Allow self-signed certificates
          rejectUnauthorized: false,
        },
      });
  
      let contenuEmail;
  
      if (sestPresente) {
        contenuEmail = `
          Cher(e) ${candidat.nom} ${candidat.prenom},
          Nous souhaitons vous informer de votre prochaine audition.
          Date: ${audition.date_audition.toDateString()}
          Heure: ${audition.heure_debut.toTimeString()}
          Cordialement,
          Votre organisation
        `;
      } else {
        contenuEmail = `
          Cher(e) ${candidat.nom} ${candidat.prenom},
          Vous n'avez pas assisté à votre audition prévue.
          Veuillez contacter l'organisation pour plus d'informations.
          Cordialement,
          Votre organisation
        `;
  
        // Mettre à jour la propriété estPresent du candidat (comme il n'est pas présent)
        candidat.estPresent = false;
        await candidat.save();
      }
  
      await transporter.sendMail({
        from: 'namouchicyrine@gmail.com',
        to: candidat.email,
        subject: 'Information Audition',
        text: contenuEmail,
      });
  
      console.log(`E-mail envoyé avec succès à ${candidat.email}.`);
  
    } catch (error) {
      console.error(`Erreur lors de l'envoi de l'e-mail à ${candidat.email}:`, error.message);
    }
  };
  
  
 
  module.exports = {
    createAudition ,
    getAuditionById,
    updateAudition,
    deleteAudition,
    genererPlanification,
    lancerEvenementAudition ,
    createAuditionsForCandidats,
  
  };