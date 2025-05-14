import express from 'express';
import Pet from '../models/Pet.js';
import { Service } from '../models/Service.js';

const router = express.Router();

// Route chính để hiển thị trang search
router.get('/', (req, res) => {
  res.render('search'); // views/search.hbs
});

// Route trả về gợi ý tìm kiếm (AJAX)
router.get('/suggest', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json([]);

  const [petList, serviceList] = await Promise.all([
    Pet.find({ 
      name: new RegExp(query, 'i'), 
      status: 'approved' // 👈 lọc chỉ approved pet
    }).limit(5),
    Service.find({ serviceName: new RegExp(query, 'i') }).limit(5)
  ]);

  const suggestions = [
    ...petList.map(pet => ({
      type: 'Pet',
      name: pet.name,
      specie: pet.specie,
      image: pet.images[0],
      link: `/pet/detail?id=${pet._id}`
    })),
    ...serviceList.map(service => ({
      type: 'Service',
      name: service.serviceName,
      image: service.imageUrl,
      link: `/service/detail?id=${service.id}`
    }))
  ];

  res.json(suggestions);
});

export default router;