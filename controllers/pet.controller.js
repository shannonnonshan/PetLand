import Pet from '../models/Pet.js';


export const approvePet = async (req, res) => {
  const petId = req.body.id;
  const pet = await Pet.findById(petId);
  const context = new PetContext(pet);
  pet.setState(context._state); // 

  pet.approve(); 
  await pet.save();

  res.redirect('/owner/managePet/');
};


export const adoptPet = async (req, res) => {
  const petId = req.body.id;
  const pet = await Pet.findById(petId);

  const context = new PetContext(pet);
  pet.setState(context._state);

  pet.adopt(); // now works through state
  await pet.save();

  res.redirect('/owner/managePet/approved');
};


export const completeAdoption = async (req, res) => {
  const petId = req.body.id;
  const pet = await Pet.findById(petId);
  
  pet.completeAdoption();
  await pet.save();

  res.redirect('/pet/adopted');
};
export async function rejectPet(req, res) {
  const pet = await petService.findPetById(req.body.petId);
  const context = new PetContext(pet);
  pet.setState(context._state);
  context.reject(); // gọi reject() nếu có

  await pet.save();
  res.redirect('/owner/managePet/rejected');
}
