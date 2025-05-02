import Pet from '../models/Pet.js';

export default {
    findAll() {
        return Pet.find()  
    },
};