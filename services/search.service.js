import Pet from "../models/Pet.js";
import { Service } from "../models/Service.js";

export default {
  async getSuggestions(query) {
    if (!query) return [];

    const serviceConditions = [{ serviceName: new RegExp(query, 'i') }];
    const q = query.toLowerCase();

    if (q === 'dog') {
      serviceConditions.push({ petType: { $in: [1, 3] } });
    } else if (q === 'cat') {
      serviceConditions.push({ petType: { $in: [2, 3] } });
    } else if (q === 'both') {
      serviceConditions.push({ petType: 3 });
    }

    const [petList, serviceList] = await Promise.all([
      Pet.find({
        $or: [
          { name: new RegExp(query, 'i') },
          { specie: new RegExp(query, 'i') }
        ],
        status: 2
      }).limit(5).lean(),
      Service.find({ $or: serviceConditions }).limit(5).lean()
    ]);

    return [
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
  }
};