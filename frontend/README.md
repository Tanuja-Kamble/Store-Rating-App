
# ⭐ Store Rating App

A full-stack web application that allows users to rate registered stores based on their experiences. Built with React.js, Express.js, and MySQL, it supports role-based access control for System Administrators, Normal Users, and Store Owners.

---

## 📌 Features

### 🔐 Authentication
- JWT-based login system
- Role-based routing and access

### 👥 User Roles & Functionalities

#### ✅ System Administrator
- Add users and stores
- View user/store lists with filters
- Dashboard with total users, stores, and ratings

#### ✅ Normal User
- Register, login
- View/search store listings
- Submit/update ratings (1 to 5)

#### ✅ Store Owner
- Login
- View list of users who rated their store
- View average store rating

---

## 🛠 Technologies Used

| Layer      | Tech Stack                        |
|------------|-----------------------------------|
| Frontend   | React.js, React Router, Bootstrap |
| Backend    | Express.js, Node.js, JWT, bcrypt  |
| Database   | MySQL (local or PlanetScale)      |
| Tools      | Axios, Dotenv, CORS, Nodemon      |

---

## 🧑‍💻 Local Setup Instructions

### 🔧 Prerequisites

- Node.js (v16+)
- MySQL Server
- npm

---

### 📁 Folder Structure

store-rating-app/
├── backend/
├── frontend/
└── README.md

---

### 🗃️ Step 1: Setup MySQL Database

```sql
CREATE DATABASE store_rating_db;

USE store_rating_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  address VARCHAR(400),
  role ENUM('admin', 'user', 'store_owner')
);

CREATE TABLE stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  address VARCHAR(400),
  owner_id INT,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  store_id INT,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (store_id) REFERENCES stores(id)
);
```

---

### 🔌 Step 2: Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in `/backend`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=store_rating_db
JWT_SECRET=your_jwt_secret
```

Start the backend server:
```bash
npm start
```

> Runs at: `http://localhost:5000`

---

### 🌐 Step 3: Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

> Runs at: `http://localhost:3000`

---

## 📡 API Documentation (Simplified)

### 🔐 Auth
| Method | Route          | Description           |
|--------|----------------|-----------------------|
| POST   | `/api/login`   | User login            |
| POST   | `/api/register`| User registration     |

### 👤 Admin
| Method | Route                  | Description                        |
|--------|------------------------|------------------------------------|
| GET    | `/api/admin/users`     | View users                         |
| GET    | `/api/admin/stores`    | View stores                        |
| POST   | `/api/admin/add-user`  | Add user/admin                     |
| POST   | `/api/admin/add-store` | Add new store                      |

### ⭐ Ratings
| Method | Route                      | Description                      |
|--------|----------------------------|----------------------------------|
| GET    | `/api/user/stores`         | List/search stores               |
| POST   | `/api/user/rate/:storeId`  | Submit/update rating             |

---

## 🚀 Deployment Instructions

### 🌍 Frontend (Netlify or Vercel)
1. Push `frontend/` to GitHub
2. Deploy using Netlify/Vercel
3. Set `REACT_APP_API_URL` if needed

### 🔧 Backend (Render)
1. Push `backend/` to GitHub
2. Deploy using Render (Node service)
3. Add `.env` in Render dashboard

### 🗃️ Database (PlanetScale / Railway)
1. Create DB and copy credentials
2. Update `.env` in backend with:
   ```env
   DB_HOST=...
   DB_USER=...
   DB_PASSWORD=...
   DB_NAME=store_rating_db
   ```

---

## 🧪 Test Credentials (Optional)

| Role         | Email               | Password   |
|--------------|---------------------|------------|
| Admin        | admin@example.com   | Admin@123  |
| User         | user@example.com    | User@123   |
| Store Owner  | owner@example.com   | Owner@123  |

---

## 📌 License

This project is for academic and learning use only.
