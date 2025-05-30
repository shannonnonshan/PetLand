import express from 'express';
import petService from '../services/pet.service.js';
import multer from 'multer';
import moment from 'moment';
import { approvePet, adoptPet, completeAdoption, rejectPetAdoption, rejectPetDonation} from '../controllers/pet.controller.js';
import Pet from '../models/Pet.js';
import DonateProcess from '../processes/pet/DonateProcess.js';
import AdoptProcess from '../processes/pet/AdoptProcess.js';
import { NotificationService } from '../services/notification.service.js';
import {auth} from '../middlewares/auth.mdw.js';
import userService from '../services/user.service.js';

const route = express.Router();

route.get('/byCat', async function(req, res){
    let list = await petService.findApproved(2).lean();

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
    let suggest = await petService.findBySpecie(pet.specie, pet._id, 3, 2).lean();
    res.render('vwPet/viewPetDetail', {
        pet: pet,
        suggest: suggest
    });
})

route.get('/api/detail/:id', async function(req, res) {
  try {
    const petId = req.params.id || null;
    const pet = await petService.findPetById(petId).lean();

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
    list = await petService.findAllByAdoptIdAndStatus(adopter._id, status).lean();
  } else {
    list = await petService.findAllByAdoptId(adopter._id).lean();
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
    const process = new DonateProcess(req, res);
    await process.handle();
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
route.post('/adopt', async function (req, res) {
  const process = new AdoptProcess(req, res);
  await process.handle();
});



route.post('/cancel-adopt', async function(req, res) {
  const { petid } = req.body;
  try {
    const pet = await Pet.findById(petid);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    await Pet.findByIdAndUpdate(petid, {
      status: 2,
      adopter: null,
      adoptDate: null
    });

    const owners = await userService.getOwners();

    if (owners.length > 0) {
      const message = `The adoption request for pet "${pet.name}" has been cancelled at ${moment().format('HH:mm DD/MM/YYYY')}`;
      await NotificationService.notify({
        toUsers: owners,
        content: message,
        relatedEntity: pet._id,
        entityType: 'Pet',
        triggeredBy: null
      });
    }
    return res.status(200).json({ message: 'You have successfully canceled the pet adoption.' });
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