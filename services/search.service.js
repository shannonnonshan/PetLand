import PetModel from "../models/Pet.js";

export default {
  async searchPets(keyword) {
    const regex = new RegExp(keyword, "i");
    return PetModel.find({
      $or: [
        { name: regex },
        { specie: regex },
        { gender: regex },
        { description: regex }
      ]
    });
  }
};