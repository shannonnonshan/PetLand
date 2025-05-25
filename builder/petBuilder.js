// PetBuilder.js
import moment from "moment";
class PetBuilder {
  constructor() {
    this.pet = {};
  }

  setName(name) {
    this.pet.name = name;
    return this;
  }

  setSpecie(specie) {
    this.pet.specie = specie;
    return this;
  }

  setBreed(breed) {
    this.pet.breed = breed;
    return this;
  }

  setAge(age) {
    this.pet.age = parseInt(age);
    return this;
  }

  setWeight(weight) {
    this.pet.weight = parseFloat(weight);
    return this;
  }

  setDonator(id) {
    this.pet.donator = id;
    return this;
  }

  setGender(gender) {
    this.pet.gender = gender;
    return this;
  }

  setVaccine(vaccine) {
    this.pet.vaccine = vaccine;
    return this;
  }

  setDescription(description) {
    this.pet.description = description;
    return this;
  }

  setDod(rawDod) {
    this.pet.dod = moment(rawDod).toDate();
    return this;
  }

  setImages(files) {
    this.pet.images = files.map(file => '/uploads/' + file.filename);
    return this;
  }

  build() {
    return this.pet;
  }
}

export default PetBuilder;