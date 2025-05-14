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

  // Xử lý điều kiện tìm kiếm service
  const serviceConditions = [{ serviceName: new RegExp(query, 'i') }];
  const q = query.toLowerCase();
  if (q === 'dog') serviceConditions.push({ petType: { $in: [1, 3] } });
  else if (q === 'cat') serviceConditions.push({ petType: { $in: [2, 3] } });
  else if (q === 'both') serviceConditions.push({ petType: 3 });

  const [petList, serviceList] = await Promise.all([
    Pet.find({
      $or: [
        { name: new RegExp(query, 'i') },
        { specie: new RegExp(query, 'i') }
      ],
      status: 'approved'
    }).limit(5),
    Service.find({ $or: serviceConditions }).limit(5)
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