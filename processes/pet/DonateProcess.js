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
      name: petname,
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

  async notify(newPet) {
    await notifier.notify({
      entity: newPet,
      newStatus: STATUS.REQUEST_DONATION,
      triggeredBy: this.req.user?._id || null,
      entityType: 'Pet',
    });
  }

  success(newPet) {
    this.res.redirect('/pet/viewAdopted');
  }
}

export default DonateProcess;
