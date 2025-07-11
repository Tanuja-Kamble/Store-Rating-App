const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { verifyToken, allowRoles } = require('../middleware/authMiddleware');

// Get all users who rated the store owned by current owner
router.get('/ratings', verifyToken, allowRoles('Store Owner'), (req, res) => {
  const ownerEmail = req.user.email;

  // Step 1: Find the store owned by this user (match by email)
  const findStoreSql = 'SELECT id, name FROM stores WHERE email = ?';

  db.query(findStoreSql, [ownerEmail], (err, storeResults) => {
    if (err || storeResults.length === 0) {
      return res.status(404).json({ message: 'Store not found for this owner' });
    }

    const storeId = storeResults[0].id;
    const storeName = storeResults[0].name;

    // Step 2: Fetch all ratings for that store
    const ratingsSql = `
      SELECT u.id AS user_id, u.name AS user_name, u.email, r.rating
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
    `;

    db.query(ratingsSql, [storeId], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching ratings' });
      }

      res.json({
        store_id: storeId,
        store_name: storeName,
        total_ratings: results.length,
        ratings: results,
      });
    });
  });
});

// Get average rating for store owned by current user
router.get('/average-rating', verifyToken, allowRoles('Store Owner'), (req, res) => {
  const ownerEmail = req.user.email;

  const storeSql = 'SELECT id FROM stores WHERE email = ?';
  db.query(storeSql, [ownerEmail], (err, storeResults) => {
    if (err || storeResults.length === 0) {
      return res.status(404).json({ message: 'Store not found for this owner' });
    }

    const storeId = storeResults[0].id;

    const avgSql = 'SELECT ROUND(AVG(rating), 2) AS average_rating FROM ratings WHERE store_id = ?';
    db.query(avgSql, [storeId], (err, avgResult) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching average rating' });
      }

      res.json({
        store_id: storeId,
        average_rating: avgResult[0].average_rating || 0,
      });
    });
  });
});


// Store Owner Ratings Route - Using owner_id
router.get('/ratings', verifyToken, allowRoles('Store Owner'), (req, res) => {
  const ownerId = req.user.id;

  const findStoreSql = 'SELECT id, name FROM stores WHERE owner_id = ?';

  db.query(findStoreSql, [ownerId], (err, storeResults) => {
    if (err || storeResults.length === 0) {
      return res.status(404).json({ message: 'No store linked to this owner' });
    }

    const store = storeResults[0];

    const ratingsSql = `
      SELECT u.id AS user_id, u.name AS user_name, u.email, r.rating
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
    `;

    db.query(ratingsSql, [store.id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching ratings' });
      }

      res.json({
        store_id: store.id,
        store_name: store.name,
        total_ratings: results.length,
        ratings: results,
      });
    });
  });
});

// Average Rating
router.get('/average-rating', verifyToken, allowRoles('Store Owner'), (req, res) => {
  const ownerId = req.user.id;

  const storeSql = 'SELECT id FROM stores WHERE owner_id = ?';
  db.query(storeSql, [ownerId], (err, storeResults) => {
    if (err || storeResults.length === 0) {
      return res.status(404).json({ message: 'Store not found for this owner' });
    }

    const storeId = storeResults[0].id;

    const avgSql = 'SELECT ROUND(AVG(rating), 2) AS average_rating FROM ratings WHERE store_id = ?';
    db.query(avgSql, [storeId], (err, avgResult) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching average rating' });
      }

      res.json({
        store_id: storeId,
        average_rating: avgResult[0].average_rating || 0,
      });
    });
  });
});




module.exports = router;
