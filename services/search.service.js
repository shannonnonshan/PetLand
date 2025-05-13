const PetModel = require("../models/Pet.js");

exports.searchPets = async (keyword) => {
  const regex = new RegExp(keyword, "i");
  return await PetModel.find({
    $or: [
      { name: regex },
      { specie: regex },
      { gender: regex },
      { description: regex }
    ]
  });
};
