import express from 'express';
import petService from '../services/pet.service.js';
import multer from 'multer';
import moment from 'moment';
import { approvePet, adoptPet, completeAdoption } from '../controllers/pet.controller.js';
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

route.get('/detail', async function(req, res){
    const id = (req.query.id).toString() || '0';
    const pet = await petService.findPetById(id).lean();
    res.render('vwPet/viewPetDetail', {
        layout: 'pet-layout',
        pet: pet
    });
})

route.get('/donate', function(req, res){
    const user = req.session.authUser || null;
    console.log(user);
    res.render('vwPet/donatePetForm', {
        layout: 'account-layout',
        user: user
    });
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads'); // thư mục bạn muốn lưu
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });
  
  route.post('/donate', upload.array('images', 3), async function (req, res) {
    const {
      petname, specie, petbreed, age, weight,
      gender, vaccine, dod, description, id
    } = req.body;
  
    // Danh sách file ảnh đã upload
    const imagePaths = req.files.map(file => '/uploads/' + file.filename); // đường dẫn để client dùng
    const ymd_dod= moment(req.body.raw_dod, 'DD-MM-YYYY').format('YYYY-MM-DD');
    const newPet = {
      name: petname,
      specie,
      breed: petbreed,
      age: parseInt(age),
      weight: parseFloat(weight),
      donator: id,
      gender,
      vaccine,
      dod: ymd_dod,
      description,
      images: imagePaths,
      status: 'pending'
    };
  
    await petService.add(newPet);
  
    res.redirect('/pet/byCat');
});


route.get('/adopt', async function(req, res){
    const id = (req.query.id).toString() || '0';
    const pet = await petService.findPetById(id).lean();
    const user = req.session.authUser || null;
    res.render('vwPet/adoptPetForm', {
      layout: 'account-layout',
        pet: pet,
        user: user
    });
})

route.post('/adopt', function(req, res){

})

route.post('/approve-donation', approvePet);
route.post('/adopt-pet', adoptPet);
route.post('/complete-adoption', completeAdoption);
export default route;