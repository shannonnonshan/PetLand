// DonateProcess.js
import PetProcess from './petProcess.js';
import petService from '../../services/pet.service.js';
import notifier from '../../observer/notificationObserver.js';
import PetBuilder from '../../builder/petBuilder.js'; // import builder
import { STATUS } from '../../constants/petStatus.js';

class DonateProcess extends PetProcess {
  async process() {
    const {
      petname, specie, petbreed, age, weight,
      gender, vaccine, description, id, raw_dod
    } = this.req.body;

    const builder = new PetBuilder();
    const newPet = builder
      .setName(petname)
      .setSpecie(specie)
      .setBreed(petbreed)
      .setAge(age)
      .setWeight(weight)
      .setDonator(id)
      .setGender(gender)
      .setVaccine(vaccine)
      .setDescription(description)
      .setDod(raw_dod)
      .setImages(this.req.files)
      .build();

    return await petService.add(newPet);
  }

  async notify(pet) {
    await notifier.notify({
      entity: pet,
      newStatus: STATUS.REQUEST_DONATION,
      triggeredBy: this.req.user?._id || null,
      entityType: 'Pet',
    });
  }

  success(pet) {
    this.res.redirect('/pet/viewAdopted');
  }
}

export default DonateProcess;
