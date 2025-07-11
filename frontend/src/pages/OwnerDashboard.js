import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const OwnerDashboard = () => {
  const { auth } = useAuth();
  const [ratings, setRatings] = useState([]);
  const [storeInfo, setStoreInfo] = useState({});
  const [average, setAverage] = useState(0);

  useEffect(() => {
    fetchRatings();
    fetchAverage();
  }, []);

  const fetchRatings = async () => {
    try {
      const res = await API.get('/owner/ratings');
      setStoreInfo({
        id: res.data.store_id,
        name: res.data.store_name,
        totalRatings: res.data.total_ratings,
      });
      setRatings(res.data.ratings);
    } catch (err) {
      console.error(err);
      alert('Error fetching ratings');
    }
  };

  const fetchAverage = async () => {
    try {
      const res = await API.get('/owner/average-rating');
      setAverage(res.data.average_rating);
    } catch (err) {
      console.error(err);
      alert('Error fetching average rating');
    }
  };

  return (
    <div>
      <h2>Store Owner Dashboard</h2>

      <section>
        <h3>🏬 Store: {storeInfo.name || 'N/A'}</h3>
        <p>Store ID: {storeInfo.id}</p>
        <p>Total Ratings: {storeInfo.totalRatings}</p>
        <p>⭐ Average Rating: {average}</p>
      </section>

      <section>
        <h3>👥 Users Who Rated This Store</h3>
        <ul>
          {ratings.map((r) => (
            <li key={r.user_id}>
              {r.user_name} ({r.email}) - ⭐ {r.rating}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default OwnerDashboard;
