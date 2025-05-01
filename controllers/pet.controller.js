import Pet from '../models/Pet.js';// controllers/pet.controller.js


export const approvePet = async (req, res) => {
  const petId = req.body.id;
  const pet = await Pet.findById(petId);
  
  pet.approve();
  await pet.save();

  res.redirect('/pet/byCat');
};

export const adoptPet = async (req, res) => {
  const petId = req.body.id;
  const pet = await Pet.findById(petId);
  
  pet.adopt();
  await pet.save();

  res.redirect('/pet/adopted');
};

export const completeAdoption = async (req, res) => {
  const petId = req.body.id;
  const pet = await Pet.findById(petId);
  
  pet.completeAdoption();
  await pet.save();

  res.redirect('/pet/adopted');
};
