import Pet from '../models/Pet.js';

export default {
    findAll(){
        return Pet.find();
    },
    findApproved(status) {
        return Pet.find({status: status})  
    },
    findPetById(id) {
        return Pet.findById(id);
    },
    add(entity){
        const pet = new Pet(entity);
        return pet.save();
    },
    findBySpecie(specie, excludeId, limit) {
        return Pet.find({ 
            specie: specie,
            _id: { $ne: excludeId }
        }).limit(limit);
    },
    findAllBy(com){
        return Pet.find({status: com});
    },
    

};