const router = require('express').Router();
const pool = require('../db');
const { requireUser } = require('../middleware/auth');
router.use(requireUser);
router.get('/', async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Apenas administradores podem consultar usuários.' });
    const result = await pool.query('SELECT id, name, email, role FROM users ORDER BY id');
    return res.json(result.rows);
  } catch (err) { next(err); }
});
module.exports = router;
