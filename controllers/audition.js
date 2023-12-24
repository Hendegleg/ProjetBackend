const Audition = require('../models/audition');
const EvenementAudition = require('../models/evenementaudition');
const Candidat = require('../models/candidat');
const nodemailer = require('nodemailer')

exports.createAudition = async (req, res) => {
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

  // get
exports.getAuditionById = async (req, res) => {
    try {
      const audition = await Audition.findById(req.params.id).populate('candidat');
      
      if (!audition) {
        return res.status(404).json({ message: "Audition non trouvée." });
      }
  
      res.json(audition);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  // update
exports.updateAudition = async (req, res) => {
    try {
      const { id } = req.params;
      const audition = await Audition.findById(id);
      
      if (!audition) {
        return res.status(404).json({ message: "Audition non trouvée." });
      }
  
      const updatedAudition = await Audition.findByIdAndUpdate(id, req.body, { new: true });
      res.json(updatedAudition);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  
exports.deleteAudition = async (req, res) => {
    try {
      const { id } = req.params;
      const audition = await Audition.findById(id);
  
      if (!audition) {
        return res.status(404).json({ message: "Audition non trouvée." });
      }
  
      await Audition.findByIdAndDelete(id);
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