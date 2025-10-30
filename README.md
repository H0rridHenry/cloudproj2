## Secure Cloud - Full Stack App

React + Tailwind (frontend) and Node.js + Express + MongoDB (backend).

### Features
- Authentication with JWT (signup/login)
- File Encryption/Decryption (AES-256-CBC)
- Secure File Transfer with passkey
- Compression: lossless (gzip) and lossy image (JPEG via sharp)
- Digital Signing: RSA SHA-256 with public cert download (signed ZIP)

### Tech
- Frontend: React, Vite, TailwindCSS, React Router, Axios
- Backend: Express, Mongoose, Multer, crypto, zlib, sharp, archiver

### Project Structure
```
backend/
  src/
    config/db.js
    middleware/auth.js
    models/{User.js, Transfer.js}
    routes/{auth.js, encryption.js, transfer.js, compression.js, signing.js}
    services/{cryptoService.js, compressionService.js, signingService.js}
    server.js
frontend/
  src/
    components/NavBar.jsx
    lib/api.js
    pages/{Login.jsx, Signup.jsx, Dashboard.jsx}
    {App.jsx, main.jsx, index.css}
```

### Prerequisites
- Node.js 18+
- MongoDB running locally (or provide a connection string)

### Backend Setup
1. Create a `.env` file inside `backend/` with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/secure_cloud
JWT_SECRET=replace_this_with_a_long_random_string
UPLOAD_DIR=uploads
TRANSFER_EXPIRY_MINUTES=60
```
2. Install and run:
```
cd backend
npm install
npm run dev
```

### Frontend Setup
1. Create a `.env` file inside `frontend/` (optional):
```
VITE_API_URL=http://localhost:5000/api
VITE_API_FILE_BASE=http://localhost:5000
```
2. Install and run:
```
cd frontend
npm install
npm run dev
```

Open the frontend dev server URL (usually `http://localhost:5173`).

### Usage
1. Sign up, then login. JWT is stored in `localStorage`.
2. Dashboard provides four cards:
   - Encryption: upload a file; get encrypted file plus base64 key and IV.
   - Secure Transfer: upload with passkey; share transfer ID + passkey to fetch.
   - Compression: gzip (lossless) or JPEG (lossy) for images.
   - Signing: upload a binary; download a zip containing original file, `.sig`, and `public.pem`.

### Notes
- Files are stored in `uploads/`. Static download path is `/static/<filename>` on the backend.
- Transfer records auto-expire via TTL index at `expiresAt`.
- The signing service generates a keypair on first use under `keys/`.


