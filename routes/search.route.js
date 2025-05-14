import express from 'express';
import searchService from '../services/search.service.js'; // Đổi lại đường dẫn nếu cần

const route= express.Router();

// Hiển thị trang tìm kiếm
route.get('/', async function(req, res){
  res.render('search')
});

// Trả về gợi ý tìm kiếm
route.get('/suggest', async (req, res) => {
  const query = req.query.q;
  try {
    const suggestions = await searchService.getSuggestions(query);
    res.json(suggestions);
  } catch (error) {
    console.error('Error in search suggestion:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default route;