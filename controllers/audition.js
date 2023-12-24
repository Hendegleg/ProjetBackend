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
        const { Date_debut_Audition, nombre_séance, dureeAudition, Date_fin_Audition, lienFormulaire } = req.body;

        // Validate required fields
        if (!Date_debut_Audition || !nombre_séance || !dureeAudition || !Date_fin_Audition) {
            return res.status(400).json({ error: 'Please provide all required fields.' });
        }

        // Create a new EvenementAudition
        const newEvenementAudition = new EvenementAudition({
            Date_debut_Audition,
            nombre_séance,
            dureeAudition,
            Date_fin_Audition,
            lienFormulaire,
        });

        // Save the new EvenementAudition to the database
        await newEvenementAudition.save();

        // Add the email sending logic
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

            Nous sommes ravis de vous informer que la nouvelle saison de notre programme passionnant a officiellement commencé !
            Nous vous encourageons vivement à participer et à montrer au monde votre talent unique durant les auditions.

            Date_de_debut des auditions : ${Date_debut_Audition}

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

        res.status(201).json({ message: 'EvenementAudition created successfully and emails sent to candidates.' });
    } catch (error) {
        console.error('Error creating EvenementAudition:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


 
  // tache b 
  
  async function genererPlanification(req, res) {
    try {
    //   const auditionId = req.body.auditionId;
    //   const auditionPlanning = await Audition.findOne({ _id: auditionId });
    const { evenementAuditionId } = req.body;
    const auditionPlanning = await EvenementAudition.findOne({ _id: evenementAuditionId });
    const candidats = await Candidat.find();

      const nombreSeancesParJour = auditionPlanning.nombre_séance;
      const dureeAuditionMinutes = auditionPlanning.dureeAudition;
     
      const nombreTotalSeances = Math.ceil(
        candidats.length / nombreSeancesParJour
      );
  
      const planning = [];
  
      let dateDebutAudition = moment(auditionPlanning.Date_debut_Audition)
        .hours(8)
        .minutes(0)
        .milliseconds(0);
  
      for (let seance = 0; seance < nombreTotalSeances; seance++) {
        for (
          let seanceJour = 0;
          seanceJour < nombreSeancesParJour;
          seanceJour++
        ) {
          const auditionIndex = seance * nombreSeancesParJour + seanceJour;
  
          if (auditionIndex < candidats.length) {
            const candidat = candidats[auditionIndex];
  
           
  
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
                evenementAudition : evenementAuditionId,  
                date_audition: dateDebutAudition, 
              });
              
            await audition.save();
            
              await sendAuditionEmails(candidat,audition);
              console.log("Les e-mails d'audition ont été envoyés avec succès.");
  
            planning.push({
              nom: candidat.nom,
              prenom: candidat.prenom,
              date_audition: dateDebutAudition.format("DD/MM/YYYY"),
              heure_debut_audition: dateDebutAudition.format("HH:mm"),
              heure_fin_audition: dateFinAudition.format("HH:mm"),
            });
  
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
  
 
  const sendAuditionEmails = async (candidat, audition) => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'namouchicyrine@gmail.com',
          pass: 'tqdmvzynhcwsjsvy',  
        }
      });
      
        const contenuEmail = `
          Cher(e) ${candidat.nom} ${candidat.prenom},
          Nous souhaitons vous informer de votre prochaine audition.
          Date: ${audition.date_audition.toDateString()}
          Heure: ${audition.heure_debut.toTimeString()}
          Cordialement,
          Votre organisation
        `;
      
        try {
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
      
      
    } catch (error) {
      console.error('Error sending audition emails:', error.message);
    }
  };
  
  
  const generateAndSendAuditionPlan = async (req, res) => {
    try {
      // ... existing code to generate audition planning
  
      // Send emails and generate links for follow-up
      await sendAuditionEmails(candidats);
  
      res.status(200).json({ success: true, data: planning });
    } catch (error) {
      console.error('Error generating audition plan:', error.message);
      res.status(500).json({ success: false, error: error.message });
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
    generateAndSendAuditionPlan,
  };