//petProcess.js
class PetProcess {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  async handle() {
    try {
      this.authenticate();
      const pet = await this.process(); // override
      await this.notify(pet); // optional override
      await this.postProcess(pet); // optional override
      this.success(pet);
    } catch (error) {
      console.error('Process error:', error);
      this.res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  authenticate() {
    if (!this.req.session.authUser) {
      throw new Error('Unauthorized');
    }
  }

  async process() {
    throw new Error('You must implement process()');
  }

  async notify(pet) {}
  async postProcess(pet) {}

  success(pet) {
    this.res.status(200).json({
      message: 'Success',
      pet
    });
  }
}

export default PetProcess;
