const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { verifyToken, allowRoles } = require('../middleware/authMiddleware');

// Get all stores or search by name/address
router.get('/stores', verifyToken, allowRoles('Normal User'), (req, res) => {
  const search = req.query.search;
  let sql = 'SELECT * FROM stores';
  let params = [];

  if (search) {
    sql += ' WHERE name LIKE ? OR address LIKE ?';
    const pattern = `%${search}%`;
    params = [pattern, pattern];
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch stores' });
    res.json(results);
  });
});

// Submit a new rating
router.post('/rate', verifyToken, allowRoles('Normal User'), (req, res) => {
  const { store_id, rating } = req.body;
  const user_id = req.user.id;

  if (!store_id || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Invalid rating data' });
  }

  const sql = 'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)';
  db.query(sql, [user_id, store_id, rating], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error submitting rating' });
    res.status(201).json({ message: 'Rating submitted successfully' });
  });
});

// Update a user's rating for a specific store
router.put('/rate/:store_id', verifyToken, allowRoles('Normal User'), (req, res) => {
  const user_id = req.user.id;
  const store_id = req.params.store_id;
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Invalid rating value' });
  }

  const sql = 'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?';
  db.query(sql, [rating, user_id, store_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating rating' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Rating not found for this store' });
    }

    res.json({ message: 'Rating updated successfully' });
  });
});

// Get all ratings submitted by the logged-in user
router.get('/my-ratings', verifyToken, allowRoles('Normal User'), (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT r.id, s.name AS store_name, r.rating 
    FROM ratings r
    JOIN stores s ON r.store_id = s.id
    WHERE r.user_id = ?
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching user ratings' });
    res.json(results);
  });
});


// DELETE rating by store_id
router.delete('/rate/:store_id', verifyToken, allowRoles('Normal User'), (req, res) => {
  const user_id = req.user.id;
  const store_id = req.params.store_id;

  const sql = 'DELETE FROM ratings WHERE user_id = ? AND store_id = ?';
  db.query(sql, [user_id, store_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting rating' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.json({ message: 'Rating deleted successfully' });
  });
});



module.exports = router;
