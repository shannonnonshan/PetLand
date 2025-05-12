import express from 'express';
import petService from '../services/pet.service.js';
import multer from 'multer';
import moment from 'moment';
import { approvePet, adoptPet, completeAdoption, rejectPetAdoption, rejectPetDonation} from '../controllers/pet.controller.js';
import Pet from '../models/Pet.js';
import auth from '../middlewares/auth.mdw.js';
const route = express.Router();

route.get('/byCat', async function(req, res){
    let list = await petService.findApproved("approved").lean();

    if (req.query.specie) {
        list = list.filter(pet => pet.specie === req.query.specie);
    } else if (req.query.gender) {
        list = list.filter(pet => pet.gender === req.query.gender);
    }
    res.render('vwPet/viewByCat', {
        list: list,
    });
})

route.get('/detail', async function(req, res){
    const id = (req.query.id).toString() || '0';
    const pet = await petService.findPetById(id).lean();
    let suggest = await petService.findBySpecie(pet.specie, pet._id, 3, 'approved').lean();
    res.render('vwPet/viewPetDetail', {
        layout: 'pet-layout',
        pet: pet,
        suggest: suggest
    });
})

route.get('/api/detail/:id', async function(req, res) {
  try {
    const petId = req.params.id || null;
    console.log(petId);
    const pet = await Pet.findById(petId).lean();

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Trả về dữ liệu pet
    res.json(pet);
  } catch (err) {
    console.error('Error fetching pet detail:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

route.get('/viewAdopted', auth, async function(req, res) {
  const adopter = req.session.authUser || null;
  const status = req.query.status;

  let list = [];
  if (status) {
    list = await petService.findAllByAdoptIdAndStatus(adopter.id, status).lean();
  } else {
    list = await petService.findAllByAdoptId(adopter.id).lean();
  }

  res.render('vwPet/viewAdoptList', {
    list: list
  });
});

route.get('/donate', auth, function(req, res){
    const user = req.session.authUser || null;
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
      gender, vaccine, description, id
    } = req.body;
  
    // Danh sách file ảnh đã upload
    const imagePaths = req.files.map(file => '/uploads/' + file.filename); // đường dẫn để client dùng
    const ymd_dod= moment(req.body.raw_dod).toDate();
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
  
    res.redirect('/pet/viewAdopted');
});

route.get('/adopt', auth, async function(req, res){
    const user = req.session.authUser || null;
    const id = (req.query.id).toString() || '0';
    const pet = await petService.findPetById(id).lean();
    res.render('vwPet/adoptPetForm', {
      layout: 'account-layout',
        pet: pet,
        user: user
    });
})

route.post('/adopt', async function(req, res) {
  const { id, petid } = req.body || {};
  const ymd_dor =  moment(req.body.raw_dor).toDate();

  if (!id || !petid) {
    return res.status(400).json({ message: 'Pet ID and User ID are required' });
  }

  try {
    const pet = await Pet.findByIdAndUpdate(petid, {
      adopter: id,
      status: 'adopt_requested',
      adoptDate: ymd_dor
    });

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    return res.status(200).json({
      successMessage: 'Adoption request submitted successfully!',
      pet
    });
  } catch (error) {
    console.error('Error during adoption request:', error);
    return res.status(500).json({ message: 'An error occurred while processing the adoption request' });
  }
});

route.post('/cancel-adopt', async function(req, res){
  const { petid } = req.body;
  try {
    await Pet.findByIdAndUpdate(petid, {
      status: 'approved', 
      adopter: null,
      adoptDate: null
    });
    return res.status(200).json({ message: 'You have successfully canceled the pet adoption.' }); // Custom message here
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi! Không thể hủy phê duyệt.' });
  }
});

route.post('/approved', approvePet);
route.post('/rejected-adopt', rejectPetAdoption);
route.post('/rejected-donate', rejectPetDonation);
route.post('/adopt-pet', adoptPet);
route.post('/complete-adoption', completeAdoption);

export default route;