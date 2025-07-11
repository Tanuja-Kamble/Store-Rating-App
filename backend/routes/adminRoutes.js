const express = require('express');
const router = express.Router();

const db = require('../models/db');


const { verifyToken, allowRoles } = require('../middleware/authMiddleware');

router.get('/users', verifyToken, allowRoles('System Administrator'), (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
    if (err) return res.status(500).json({ message: 'Error' });
    res.json(result);
  });
});


module.exports = router;
