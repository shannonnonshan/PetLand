//pet.controller.js
import Pet from '../models/Pet.js';
import User from '../models/User.js';
import PetContext from '../state/petState/petContext.js';
import petService from '../services/pet.service.js';
import { sendEmail } from '../utils/mailer.js';
import moment from 'moment';
import notifier from '../observer/notificationObserver.js';
import { STATUS } from '../constants/petStatus.js';
function buildEmailTemplate(type, pet, date = '') {
  switch (type) {
    case 'approveDonation':
      return {
        subject: "YOUR PET'S REHOME REQUEST HAS BEEN APPROVED!",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 24px; border-radius: 8px;">
            <h2 style="color: #2c3e50;">Rehome Request Approved</h2>
            <p>Your request to rehome your pet <strong style="color: #2e86de;">${pet.name}</strong> has been approved.</p>
            <p>The scheduled date to hand over your pet is: <strong style="color: #27ae60;">${moment(pet.dod).format('DD/MM/YYYY')}</strong></p>
            <p>Thank you for supporting the <strong>Rescue Pet</strong> program at <strong>Petland</strong>.</p>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #ccc;">
            <p style="font-size: 13px; color: #888;">This is an automated email. Please do not reply directly to this message.</p>
          </div>
        `
      };
    case 'approveAdoption':
      return {
        subject: 'ADOPTION REQUEST HAS BEEN APPROVED!',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 24px; border-radius: 8px;">
            <h2 style="color: #2c3e50;">Adopt Request Approved</h2>
            <p>Your request to adopt pet <strong style="color: #2e86de;">${pet.name}</strong> has been approved.</p>
            <p>The scheduled date to receive your pet is: <strong style="color: #27ae60;">${moment(pet.adoptDate).format('DD/MM/YYYY')}</strong></p>
            <p>Thank you for supporting the <strong>Rescue Pet</strong> program at <strong>Petland</strong>.</p>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #ccc;">
            <p style="font-size: 13px; color: #888;">This is an automated email. Please do not reply directly to this message.</p>
          </div>
        `
      };
    case 'rejectAdoption':
      return {
        subject: 'ADOPTION REQUEST HAS BEEN REJECTED!',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 24px; border-radius: 8px;">
            <h2 style="color: #c0392b;">Adopt Request Rejected</h2>
            <p>Your request to adopt <strong style="color: #2e86de;">${pet.name}</strong> has been rejected.</p>
            <p>Thank you for supporting the <strong>Rescue Pet</strong> program at <strong>Petland</strong>. Please check other pets still available for adoption.</p>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #ccc;">
            <p style="font-size: 13px; color: #888;">This is an automated email. Please do not reply directly to this message.</p>
          </div>
        `
      };
    case 'rejectDonation':
      return {
        subject: 'DONATION REQUEST HAS BEEN REJECTED!',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 24px; border-radius: 8px;">
            <h2 style="color: #c0392b;">Donation Request Rejected</h2>
            <p>We're sorry to inform you that your request to donate <strong style="color: #2e86de;">${pet.name}</strong> has been rejected.</p>
            <p>Thank you for considering our <strong>Rescue Pet</strong> program at <strong>Petland</strong>.</p>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #ccc;">
            <p style="font-size: 13px; color: #888;">This is an automated email. Please do not reply directly to this message.</p>
          </div>
        `
      };
    default:
      return { subject: '', html: '' };
  }
}

function notifyLater(userId, type, pet, date = '') {
  setTimeout(async () => {
    try {
      const user = await User.findById(userId).lean();
      if (!user?.email) return;

      const { subject, html } = buildEmailTemplate(type, pet, date);
      await sendEmail(user.email, subject, html);
    } catch (err) {
      console.error('Error sending delayed email:', err);
    }
  }, 0); // gửi ngay sau khi event loop rảnh
}

async function handlePetTransition({ pet, contextMethod }) {
  const context = new PetContext(pet);
  pet.setState(context._state);
  context[contextMethod]();
  await pet.save();
}



export const approvePet = async (req, res) => {
  try {
    const { petid } = req.body;
    const pet = await Pet.findById(petid);
    if (!pet) return res.status(404).json({ error: 'Pet not found.' });
    if (pet.status === 2) return res.status(400).json({ error: 'The pet has been approved.' });

    await handlePetTransition({ pet, contextMethod: 'approve' });
    res.status(200).json({ message: 'Successful' });
    await notifier.notify({
          entity: pet,
          newStatus: STATUS.APPROVAL_DONATION,
          triggeredBy: req.user?._id || null,
          entityType: 'Pet',
        });
    notifyLater(pet.donator, 'approveDonation', pet, pet.dod);
  } catch (error) {
    console.error('ApprovePet Error:', error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
};

export const adoptPet = async (req, res) => {
  try {
    const { petid } = req.body;
    const pet = await Pet.findById(petid);
    if (!pet) return res.status(404).json({ error: 'Pet not found.' });

    await handlePetTransition({ pet, contextMethod: 'adopt' });
    res.status(200).json({ message: 'Successful' });
    await notifier.notify({
          entity: pet,
          newStatus: STATUS.APPROVAL_ADOPTION,
          triggeredBy: req.user?._id || null,
          entityType: 'Pet',
        });
    notifyLater(pet.adopter, 'approveAdoption', pet, pet.adoptDate);
  } catch (error) {
    console.error('AdoptPet Error:', error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
};

export const completeAdoption = async (req, res) => {
  try {
    const { petid } = req.body;
    const pet = await Pet.findById(petid);
    if (!pet) return res.status(404).send('Pet not found.');
    const context = new PetContext(pet);
    context.completeAdoption();
    await pet.save();
    res.status(200).json({ message: 'Successful' });
  } catch (error) {
    console.error('CompleteAdoption Error:', error);
    res.status(500).send('Something went wrong!');
  }
};

export const rejectPetAdoption = async (req, res) => {
  try {
    const pet = await petService.findPetById(req.body.petid);
    if (!pet) return res.status(404).send('Pet not found.');

    await handlePetTransition({ pet, contextMethod: 'rejectAdoption' });
    res.status(200).json({ message: 'Successful' });
    await notifier.notify({
          entity: pet,
          newStatus: STATUS.REJECTED,
          triggeredBy: req.user?._id || null,
          entityType: 'Pet',
        });
    notifyLater(pet.adopter, 'rejectAdoption', pet);
  } catch (error) {
    console.error('RejectPetAdoption Error:', error);
    res.status(500).send('Something went wrong!');
  }
};

export const rejectPetDonation = async (req, res) => {
  try {
    const pet = await petService.findPetById(req.body.petid);
    if (!pet) return res.status(404).send('Pet not found.');

    await handlePetTransition({ pet, contextMethod: 'rejectDonation' });
    res.status(200).json({ message: 'Successful' });
    await notifier.notify({
          entity: pet,
          newStatus: STATUS.REJECTED,
          triggeredBy: req.user?._id || null,
          entityType: 'Pet',
        });
    notifyLater(pet.donator, 'reject', pet);
    
  } catch (error) {
    console.error('RejectPetDonation Error:', error);
    res.status(500).send('Something went wrong!');
  }
};
