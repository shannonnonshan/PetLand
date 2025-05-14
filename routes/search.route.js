import express from 'express';
import searchService from '../services/search.service.js'; // Đổi lại đường dẫn nếu cần

const router = express.Router();

// Hiển thị trang tìm kiếm
router.get('/', (req, res) => {
  res.render('search');
});

// Trả về gợi ý tìm kiếm
router.get('/suggest', async (req, res) => {
  const query = req.query.q;
  try {
    const suggestions = await searchService.getSuggestions(query);
    res.json(suggestions);
  } catch (error) {
    console.error('Error in search suggestion:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;