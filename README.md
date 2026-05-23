# ✈️ TripPlanner AI

> Upload your travel documents. Get a complete AI-generated itinerary in seconds.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=flat-square&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

**Live App →** [travel-planner-ai-silk.vercel.app](https://travel-planner-ai-silk.vercel.app)  
**API →** [travelplannerai-vs8x.onrender.com](https://travelplannerai-vs8x.onrender.com/api/health)

---



> Register a free account on the live app, upload a flight ticket or hotel booking (PDF or image), and watch the itinerary generate automatically.

---

## 🚀 Features

- 🔐 **JWT Authentication** — Secure register/login with access + refresh token rotation
- 📄 **Document Upload** — Supports PDF, JPG, PNG, WEBP (drag-and-drop)
- 🤖 **AI Extraction** — Gemini API reads your booking documents and pulls out flights, hotels, dates, and destinations
- 🗺️ **Itinerary Generation** — Structured day-by-day travel plan generated automatically
- 📚 **Trip History** — All itineraries saved per user in MongoDB
- 🔗 **Shareable Links** — Share any itinerary via a public link — no login required for viewers
- 📱 **Responsive UI** — Works on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose (Atlas) |
| AI | Anthropic Claude API |
| Auth | JWT (access + refresh tokens) |
| File Upload | Multer + react-dropzone |
| Deployment | Vercel (frontend) · Render (backend) · MongoDB Atlas |

---

## 📁 Project Structure

```
TravelPlannerAI/
│
├── client/                        # React frontend (Vite)
│   └── src/
│       ├── components/
│       │   └── layout/            # Sidebar, Layout wrapper
│       ├── context/
│       │   └── AuthContext.jsx    # Global auth state
│       ├── pages/
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── DashboardPage.jsx  # Trip history
│       │   ├── UploadPage.jsx     # Drag-and-drop upload
│       │   ├── ItineraryPage.jsx  # Day-by-day view + share
│       │   └── SharePage.jsx      # Public share view
│       ├── services/
│       │   └── api.js             # Axios + JWT interceptors
│       └── App.jsx                # Routes + protected routes
│
└── server/                        # Express backend
    ├── config/
    │   └── db.js                  # MongoDB connection
    ├── controllers/
    │   ├── authController.js      # Register, login, refresh
    │   ├── uploadController.js    # File upload + AI extraction
    │   └── itineraryController.js # Generate, list, share
    ├── middleware/
    │   └── auth.js                # JWT verify middleware
    ├── models/
    │   ├── User.js                # User schema
    │   └── Itinerary.js          # Itinerary + share token schema
    ├── routes/
    │   ├── auth.js
    │   ├── uploads.js
    │   ├── itineraries.js
    │   └── share.js
    ├── utils/
    │   ├── aiService.js           # Claude API — extract + generate
    │   └── multer.js              # File upload config
    └── index.js                   # Entry point
```

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login |
| POST | `/api/auth/refresh` | ❌ | Refresh access token |
| GET | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/uploads` | ✅ | Upload travel documents |
| POST | `/api/itineraries/generate` | ✅ | Generate itinerary from extracted data |
| GET | `/api/itineraries` | ✅ | Get all user itineraries |
| GET | `/api/itineraries/:id` | ✅ | Get single itinerary |
| DELETE | `/api/itineraries/:id` | ✅ | Delete itinerary |
| POST | `/api/itineraries/:id/share` | ✅ | Generate public share link |
| GET | `/api/share/:token` | ❌ | View shared itinerary (public) |
| GET | `/api/health` | ❌ | Health check |

---

## 🗄️ Database Schema

### User
```json
{
  "name": "String (required)",
  "email": "String (unique, required)",
  "password": "String (bcrypt hashed)",
  "createdAt": "Date"
}
```

### Itinerary
```json
{
  "user": "ObjectId → User",
  "title": "String",
  "destination": "String",
  "startDate": "String",
  "endDate": "String",
  "summary": "String",
  "days": [
    {
      "day": "Number",
      "date": "String",
      "title": "String",
      "activities": [
        {
          "time": "String",
          "title": "String",
          "description": "String",
          "location": "String",
          "type": "flight | hotel | activity | transport | meal | other"
        }
      ]
    }
  ],
  "extractedData": "Mixed (raw AI extraction)",
  "originalFiles": "Array (file metadata)",
  "shareToken": "String (unique, sparse)",
  "isShared": "Boolean"
}
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB (local) or MongoDB Atlas account
- Anthropic API key → [console.anthropic.com](https://console.anthropic.com)

### 1. Clone the repo
```bash
git clone https://github.com/Manish10022001/TravelPlannerAI.git
cd TravelPlannerAI
```

### 2. Backend
```bash
cd server
npm install
cp .env.example .env
# Fill in your values (see below)
npm run dev
```

### 3. Frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

### Environment Variables

**`server/.env`**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/triplanner
JWT_SECRET=your_32char_secret_here
JWT_REFRESH_SECRET=your_different_32char_secret
ANTHROPIC_API_KEY=sk-ant-...
PORT=5000
CLIENT_URL=http://localhost:5173
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:8000/api
```

---

## 🔄 How It Works

```
User uploads PDF/image
        ↓
Multer saves file to server
        ↓
Claude API reads the document
→ extracts flights, hotels, dates, destinations
        ↓
Extracted data sent back to Claude
→ generates structured day-by-day itinerary
        ↓
Itinerary saved to MongoDB
        ↓
Displayed in UI with share link option
        ↓
Share link → public page, no login needed
```

---

## 🌐 Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | https://travel-planner-ai-silk.vercel.app |
| Backend | Render | https://travelplannerai-vs8x.onrender.com |
| Database | MongoDB Atlas | Cloud hosted |

> Note: Backend is on Render's free tier — first request after inactivity may take ~50 seconds to wake up.

---

## 📄 License

MIT
