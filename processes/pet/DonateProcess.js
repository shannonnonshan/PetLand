// DonateProcess.js
import PetProcess from './petProcess.js';
import petService from '../../services/pet.service.js';
import notifier from '../../observer/notificationObserver.js';
import { STATUS } from '../../constants/petStatus.js';

class DonateProcess extends PetProcess {
  async process() {
    const {
      petname, specie, petbreed, age, weight,
      gender, vaccine, description, id, raw_dod
    } = this.req.body;

    const newPet = {
      petname: petname,
      specie: specie,
      petbreed: petbreed,
      age: age,
      weight: weight,
      id: id,
      gender: gender,
      vaccine: vaccine,
      description: description,
      raw_dod: raw_dod,
      files: this.req.files
    };
    await petService.createPet(newPet);
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
