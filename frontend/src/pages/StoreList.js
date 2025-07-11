import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const StoreList = () => {
  const { auth } = useAuth();
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [rating, setRating] = useState({});
  const [myRatings, setMyRatings] = useState([]);

  useEffect(() => {
    fetchStores();
    fetchMyRatings();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await API.get(`/user/stores${search ? `?search=${search}` : ''}`);
      setStores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyRatings = async () => {
    try {
      const res = await API.get('/user/my-ratings');
      setMyRatings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getMyRating = (storeId) => {
    const found = myRatings.find((r) => r.store_name && r.store_id === storeId);
    return found ? found.rating : '';
  };

  const handleRate = async (storeId) => {
    const existing = myRatings.find((r) => r.store_id === storeId);
    try {
      if (existing) {
        await API.put(`/user/rate/${storeId}`, { rating: rating[storeId] });
      } else {
        await API.post('/user/rate', { store_id: storeId, rating: rating[storeId] });
      }
      alert('Rating saved!');
      fetchMyRatings();
    } catch (err) {
      console.error(err);
      alert('Failed to rate');
    }
  };

  const handleDelete = async (storeId) => {
    try {
      await API.delete(`/user/rate/${storeId}`);
      alert('Rating deleted!');
      fetchMyRatings();
    } catch (err) {
      console.error(err);
      alert('Failed to delete rating');
    }
  };

  return (
    <div>
      <h2>All Stores</h2>
      <input
        type="text"
        placeholder="Search by name or address"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && fetchStores()}
      />
      <ul>
        {stores.map((store) => (
          <li key={store.id} style={{ marginBottom: '1rem' }}>
            <h4>{store.name}</h4>
            <p>{store.address}</p>
            <input
              type="number"
              min="1"
              max="5"
              placeholder="Rating 1-5"
              value={rating[store.id] || getMyRating(store.id) || ''}
              onChange={(e) =>
                setRating((prev) => ({ ...prev, [store.id]: e.target.value }))
              }
            />
            <button onClick={() => handleRate(store.id)}>Submit</button>
            <button onClick={() => handleDelete(store.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoreList;
