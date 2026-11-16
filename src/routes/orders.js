const router = require('express').Router();
const pool = require('../db');
const { requireUser } = require('../middleware/auth');

router.use(requireUser);

// Exemplo didatico: identificacao simplificada pelo header X-User-Id.
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'ID inválido' });
    const isAdmin = req.user.role === 'admin';
    const result = await pool.query(
      `SELECT id, user_id, product_id, quantity, status FROM orders WHERE id = $1${isAdmin ? '' : ' AND user_id = $2'}`,
      isAdmin ? [id] : [id, req.user.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Pedido nao encontrado' });
    return res.json(result.rows[0]);
  } catch (err) { next(err); }
});
module.exports = router;
