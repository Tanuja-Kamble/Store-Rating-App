import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {

  const [editUserId, setEditUserId] = useState(null);
const [editUserData, setEditUserData] = useState({});

const [editStoreId, setEditStoreId] = useState(null);
const [editStoreData, setEditStoreData] = useState({});

  const { auth } = useAuth();
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [storeOwners, setStoreOwners] = useState([]);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', address: '', role: 'Normal User'
  });

  const [newStore, setNewStore] = useState({
    name: '', email: '', address: '', owner_id: ''
  });

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchStores();
    fetchStoreOwners();
  }, []);

  const fetchStats = async () => {
    const res = await API.get('/admin/stats');
    setStats(res.data);
  };

  const fetchUsers = async () => {
    const res = await API.get('/admin/users');
    setUsers(res.data);
  };

  const fetchStores = async () => {
    const res = await API.get('/admin/stores');
    setStores(res.data);
  };

  const fetchStoreOwners = async () => {
    const res = await API.get('/admin/store-owners');
    setStoreOwners(res.data);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', formData);
      alert('User created!');
      fetchUsers();
    } catch (err) {
      alert('Failed to add user');
    }
  };

  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/add-store', newStore);
      toast.success('Store added!');
      fetchStores();
    } catch (err) {
      alert('Failed to add store');
    }
  };


  const handleDeleteUser = async (id) => {
  if (!window.confirm('Are you sure you want to delete this user?')) return;
  try {
    await API.delete(`/admin/delete-user/${id}`);
    toast.success('User deleted!');
    fetchUsers(); // refresh list
  } catch (err) {
    toast.error('Failed to delete user');
  }
};


const handleUpdateUser = async (e, id) => {
  e.preventDefault();
  try {
    await API.put(`/admin/edit-user/${id}`, editUserData);
    toast.success('User updated!');
    setEditUserId(null);
    fetchUsers();
  } catch (err) {
    toast.error('Failed to update user');
  }
};




const handleDeleteStore = async (id) => {
  if (!window.confirm('Are you sure you want to delete this store?')) return;
  try {
    await API.delete(`/admin/delete-store/${id}`);
    toast.success('Store deleted!');
    fetchStores(); // refresh list
  } catch (err) {
    toast.error('Failed to delete store');
  }
};


const handleUpdateStore = async (e, id) => {
  e.preventDefault();
  try {
    await API.put(`/admin/edit-store/${id}`, editStoreData);
    toast.success('Store updated!');
    setEditStoreId(null);
    fetchStores();
  } catch (err) {
    toast.error('Failed to update store');
  }
};


  return (
    <div>
      <h2>Admin Dashboard</h2>

      <section>
        <h3>📊 Platform Stats</h3>
        <p>Users: {stats.total_users}</p>
        <p>Stores: {stats.total_stores}</p>
        <p>Ratings: {stats.total_ratings}</p>
      </section>

      <section>
        <h3>➕ Add New User</h3>
        <form onSubmit={handleUserSubmit}>
          <input type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
          <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
          <input type="text" placeholder="Address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required />
          <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
            <option>Normal User</option>
            <option>Store Owner</option>
            <option>System Administrator</option>
          </select>
          <button type="submit">Add User</button>
        </form>
      </section>

      <section>
        <h3>🏬 Add Store</h3>
        <form onSubmit={handleStoreSubmit}>
          <input type="text" placeholder="Name" value={newStore.name} onChange={e => setNewStore({ ...newStore, name: e.target.value })} required />
          <input type="email" placeholder="Email" value={newStore.email} onChange={e => setNewStore({ ...newStore, email: e.target.value })} required />
          <input type="text" placeholder="Address" value={newStore.address} onChange={e => setNewStore({ ...newStore, address: e.target.value })} required />
          <input type="number" placeholder="Owner ID (optional)" value={newStore.owner_id} onChange={e => setNewStore({ ...newStore, owner_id: e.target.value })} />
          <button type="submit">Add Store</button>
        </form>
      </section>

      <section>
        <h3>📋 All Users</h3>
        <ul>
          {users.map((u) => (
  <li key={u.id} className="mb-2">
    {editUserId === u.id ? (
      <form onSubmit={(e) => handleUpdateUser(e, u.id)} className="d-flex gap-2">
        <input value={editUserData.name} onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })} />
        <input value={editUserData.email} onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })} />
        <input value={editUserData.address} onChange={(e) => setEditUserData({ ...editUserData, address: e.target.value })} />
        <select value={editUserData.role} onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })}>
          <option>Normal User</option>
          <option>Store Owner</option>
          <option>System Administrator</option>
        </select>
        <button type="submit" className="btn btn-success btn-sm">Save</button>
        <button type="button" onClick={() => setEditUserId(null)} className="btn btn-secondary btn-sm">Cancel</button>
      </form>
    ) : (
      <div className="d-flex justify-content-between align-items-center">
        <span>{u.name} ({u.role}) - {u.email}</span>
        <div>
          <button onClick={() => { setEditUserId(u.id); setEditUserData(u); }} className="btn btn-primary btn-sm me-2">Edit</button>
          <button onClick={() => handleDeleteUser(u.id)} className="btn btn-danger btn-sm">Delete</button>
        </div>
      </div>
    )}
  </li>
))}

        </ul>

      </section>

      <section>
        <h3>🏪 All Stores</h3>
        <ul>
          {stores.map((s) => (
  <li key={s.id} className="mb-2">
    {editStoreId === s.id ? (
      <form onSubmit={(e) => handleUpdateStore(e, s.id)} className="d-flex gap-2">
        <input value={editStoreData.name} onChange={(e) => setEditStoreData({ ...editStoreData, name: e.target.value })} />
        <input value={editStoreData.email} onChange={(e) => setEditStoreData({ ...editStoreData, email: e.target.value })} />
        <input value={editStoreData.address} onChange={(e) => setEditStoreData({ ...editStoreData, address: e.target.value })} />
        <button type="submit" className="btn btn-success btn-sm">Save</button>
        <button type="button" onClick={() => setEditStoreId(null)} className="btn btn-secondary btn-sm">Cancel</button>
      </form>
    ) : (
      <div className="d-flex justify-content-between align-items-center">
        <span>{s.name} - {s.address}</span>
        <div>
          <button onClick={() => { setEditStoreId(s.id); setEditStoreData(s); }} className="btn btn-primary btn-sm me-2">Edit</button>
          <button onClick={() => handleDeleteStore(s.id)} className="btn btn-danger btn-sm">Delete</button>
        </div>
      </div>
    )}
  </li>
))}

            </ul>

      </section>

      <section>
        <h3>👤 Store Owners + Rating Stats</h3>
        <ul>
          {storeOwners.map((o) => (
            <li key={o.id}>
              {o.name} ({o.email}) - Avg Rating: {o.average_rating || 0} ⭐ from {o.rating_count} users
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;
