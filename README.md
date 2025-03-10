# Kalpas - BookKeeping Backend

## 📌 Project Overview
Kalpas is a bookkeeping service with three core models:
- **Books**: Each book is written by an author and is owned by a library.
- **Users**: Users can be either **Authors** or **Borrowers**.
- **Libraries**: Books are stored in libraries, and users can borrow them.

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/haikerwalabhishek/Kalpas.git
cd Kalpas
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Configure Environment Variables
Create a **.env** file in the root directory and add the following:
```env
MONGO_URI=mongodb://localhost:27017/BookKeeping
JWT_SECRET=BookKeeping@Kalpas2025
JWT_RE_SECRET=BookKeeping@Kalpas2025RE
JWT_EXP=1d
JWT_RE_EXP=10d
JWT_EXP_COOKIE=1d
JWT_RE_EXP_COOKIE=10d
COOKIE_SECRET=BookKeeping@Kalpas2025
PORT=3021
DB_NAME=BookKeepeer
FIREBASE_SERVICE_ACCOUNT_PATH=./src/services/serviceAccountKey.json
```
> Note: **Uploading files will not work** as the Firebase key.json file has been removed.

### 4️⃣ Run the Backend Server
```sh
npm start
```
> The server should be running on `http://127.0.0.1:3021`

---

## 📡 API Endpoints

### 📚 Books
| Method | Endpoint | Description |
|--------|-------------|----------------------|
| GET    | `/api/books/` | Get all books |
| GET    | `/api/books/:id/` | Get a specific book |
| POST   | `/api/books/` | Add a new book |
| PUT    | `/api/books/:id/` | Update a specific book |
| DELETE | `/api/books/:id/` | Delete a specific book |

### 👤 Users
| Method | Endpoint | Description |
|--------|-------------|----------------------|
| POST   | `/api/users/register/` | Register a user |
| POST   | `/api/users/login/` | User login |

### 📖 Borrowing
| Method | Endpoint | Description |
|--------|-------------|----------------------|
| POST   | `/api/borrow/` | Borrow a book |
| POST   | `/api/return/:id/` | Return a book |

### 🏛️ Libraries
| Method | Endpoint | Description |
|--------|-------------|----------------------|
| GET    | `/api/libraries/` | Get all libraries |
| GET    | `/api/libraries/:id/` | Get library details |
| POST   | `/api/libraries/` | Create a new library |
| PUT    | `/api/libraries/:id/` | Update a library |
| DELETE | `/api/libraries/:id/` | Delete a library |

### 📦 Library Inventory
| Method | Endpoint | Description |
|--------|-------------|----------------------|
| GET    | `/api/libraries/:id/inventory/` | Get library inventory |
| POST   | `/api/libraries/:id/inventory/:bookId/` | Add a book to library inventory |
| DELETE | `/api/libraries/:id/inventory/:bookId/` | Remove a book from library inventory |

---

