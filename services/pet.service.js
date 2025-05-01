import Pet from '../models/Pet.js';

export default {
    findAll() {
        return Pet.find()  
    },
    findPetById(id) {
        return Pet.findById(id);
    },
    add(entity){
        const pet = new Pet(entity);
        return pet.save();
    }
};