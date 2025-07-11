const express = require('express');
const router = express.Router();
const { verifyToken, allowRoles } = require('../middleware/authMiddleware');

router.get('/admin-only', verifyToken, allowRoles('System Administrator'), (req, res) => {
  res.json({ message: `Hello Admin, your ID is ${req.user.id}` });
});

router.get('/user-or-store', verifyToken, allowRoles('Normal User', 'Store Owner'), (req, res) => {
  res.json({ message: `Welcome, your role is ${req.user.role}` });
});

module.exports = router;
