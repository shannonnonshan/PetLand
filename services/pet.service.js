import Pet from '../models/Pet.js';
import PetBuilder from '../../builder/petBuilder.js'; // import builder

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
    findBySpecie(specie, excludeId, limit, status) {
        return Pet.find({ 
            specie: specie,
            status: status,
            _id: { $ne: excludeId }
        }).limit(limit);
    },
    findAllBy(com){
        return Pet.find({status: com});
    },
    findAllByAdoptIdAndStatus(id, status) {
        return Pet.find({ adopter: id, status: status }).sort({ createdAt: -1 });
    },

    findAllByAdoptId(id){
        return Pet.find({adopter: id});
    },
    createPet(petData) {
        const builder = new PetBuilder()
            .setName(petData.petname)
            .setSpecie(petData.specie)
            .setBreed(petData.petbreed)
            .setAge(petData.age)
            .setWeight(petData.weight)
            .setDonator(petData.id)
            .setGender(petData.gender)
            .setVaccine(petData.vaccine)
            .setDescription(petData.description)
            .setDod(petData.raw_dod)
            .setImages(petData.files)
            .build();
        return this.add(builder);

    }

};