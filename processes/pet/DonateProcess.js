import PetProcess from './petProcess.js';
import petService from '../../services/pet.service.js';
import notifier from '../../observer/notificationObserver.js';
import moment from 'moment';
import { STATUS } from '../../constants/petStatus.js';

class DonateProcess extends PetProcess {
  async process() {
    const {
      petname, specie, petbreed, age, weight,
      gender, vaccine, description, id
    } = this.req.body;

    const imagePaths = this.req.files.map(file => '/uploads/' + file.filename);
    const ymd_dod = moment(this.req.body.raw_dod).toDate();

    const newPet = {
      name: petname,
      specie,
      breed: petbreed,
      age: parseInt(age),
      weight: parseFloat(weight),
      donator: id,
      gender,
      vaccine,
      dod: ymd_dod,
      description,
      images: imagePaths,
    };

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
