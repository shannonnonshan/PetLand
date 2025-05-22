import PetProcess from './petProcess.js';
import Pet from '../../models/Pet.js';
import notifier from '../../observer/notificationObserver.js';
import moment from 'moment';
import { STATUS } from '../../constants/petStatus.js';

class AdoptProcess extends PetProcess {
  async process() {
    const { id, petid } = this.req.body;
    const ymd_dor = moment(this.req.body.raw_dor).toDate();

    if (!id || !petid) {
      throw new Error('Missing user or pet id');
    }

    const pet = await Pet.findByIdAndUpdate(petid, {
      adopter: id,
      createdAt: new Date(),
      status: STATUS.REQUEST_ADOPTION,
      adoptDate: ymd_dor,
    }, { new: true });

    if (!pet) {
      throw new Error('Pet not found');
    }

    return pet;
  }

  async notify(pet) {
    await notifier.notify({
      entity: pet,
      newStatus: STATUS.REQUEST_ADOPTION,
      triggeredBy: this.req.user?._id || null,
      entityType: 'Pet',
    });
  }

  success(pet) {
    this.res.status(200).json({
      successMessage: 'Adoption request submitted successfully!',
      pet,
    });
  }
}

export default AdoptProcess;
