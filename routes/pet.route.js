import express from 'express';
import petService from '../services/pet.service.js';

const route = express.Router();

route.get('/byCat', async function(req, res){
    const list = await petService.findAll().lean();
    list.forEach(pet => {
        pet.imageSrc = pet.images && pet.images.length > 0 ? pet.images[0] : 'default-image.jpg';
    });
    res.render('vwPet/viewByCat', {
        list: list,
        layout: 'pet-layout'
    });
})

route.get('/detail', function(req, res){
    res.render('vwPet/viewPetDetail', {
        layout: 'pet-layout'
    });
})

route.get('/donate', function(req, res){
    res.render('vwPet/donatePetForm', {
    });
})

route.get('/adopt', function(req, res){
    res.render('vwPet/adoptPetForm', {
    });
})
export default route;