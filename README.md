# Traffic Analysis Backend - Government of Pune

A comprehensive backend system for traffic analysis and management developed for the Government of Pune. This project provides APIs for traffic prediction, complaint management, event tracking, and infrastructure monitoring.

## 🔍 Overview

This backend system consists of two main services:
1. **Node.js Express API Server** - Main backend service for data management and API endpoints
2. **Flask ML Service** - Machine learning service for pothole detection using TensorFlow

The system manages traffic data, complaints, events, construction projects, and provides intelligent traffic prediction capabilities for the city of Pune.

## ✨ Features

### Core Functionality
- **User Authentication & Authorization** - JWT-based auth with role management
- **Traffic Prediction** - ML-powered traffic forecasting based on historical data
- **Complaint Management** - Citizen complaint system with image upload
- **Pothole Detection** - AI-powered pothole identification from images
- **Event Management** - Track events affecting traffic flow
- **Infrastructure Monitoring** - Monitor construction, diversions, and facilities

### Data Management
- **Geographic Data** - Location-based services for various city facilities
- **Time-based Analytics** - Historical traffic patterns and predictions
- **Real-time Status** - Current traffic conditions and updates
- **Calendar Integration** - Date-based traffic analysis

### Facilities Tracking
- Schools, Hospitals, Hotels, Malls
- Banquet Halls, Gardens, Parking Buildings
- Construction Projects, Traffic Diversions
- Traffic Hotspots and Status Updates

## 🏗️ Architecture

```
Traffic Analysis Backend
├── Node.js Express Server (Port: 3001)
│   ├── REST APIs
│   ├── MongoDB Database
│   ├── JWT Authentication
│   ├── File Upload (Multer + Cloudinary)
│   └── CORS Configuration
└── Flask ML Service (Port: 3003)
    ├── TensorFlow Model
    ├── Image Processing
    └── Pothole Detection
```

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (local or cloud instance)
- **Cloudinary Account** (for image storage)
- **Google Maps API Key** (for location services)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd traffic-analysis-backend
```

### 2. Install Node.js Dependencies
```bash
npm install
```

### 3. Install Python Dependencies
```bash
cd pothole-model
pip install flask tensorflow pillow numpy
cd ..
```

## ⚙️ Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3001

# Database
MONGODB_URI=mongodb://localhost:27017
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net

# Authentication
JWT_SECRET_KEY=your_super_secret_jwt_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Database Setup
The application uses MongoDB with the database name `trafficanalysis`. Ensure your MongoDB instance is running and accessible.

## 🏃‍♂️ Running the Services

### Method 1: Run Both Services Separately

#### Terminal 1 - Start the Flask ML Service
```bash
cd pothole-model
python app.py
```
The Flask service will start on `http://127.0.0.1:3003`

#### Terminal 2 - Start the Node.js API Server
```bash
# From the root directory
node App.js
# OR using nodemon for development
npx nodemon App.js
```
The API server will start on `http://localhost:3001`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Traffic Analysis
- `GET /api/path-info/predictTraffic` - Predict traffic for given route and time
- `POST /api/path-info` - Add traffic path information
- `GET /api/path-info/getCalendarData` - Get calendar-based traffic data
- `GET /api/path-info/getFestivalData` - Get festival-related traffic data
- `GET /api/path-info/getLastFourWeek` - Get historical weekday data

### Complaints & Reports
- `POST /api/complaint` - Submit complaint with optional image
- `GET /api/complaint/getComplaintData` - Get all complaints
- `POST /api/model` - Upload image for pothole detection
- `GET /api/model/getPotholeData` - Get pothole detection results

### Events & Infrastructure
- `POST /api/event` - Create new event
- `GET /api/event/getEventData` - Get all events
- `POST /api/construction` - Add construction project
- `GET /api/construction/getAllConstructionProjects` - Get all construction projects
- `POST /api/diversion` - Add traffic diversion
- `GET /api/diversion/getAllDiversions` - Get all diversions

### Facilities Management
- `POST /api/school` - Add school information
- `GET /api/school/getAllSchools` - Get all schools
- `GET /api/school/getAllSchoolsByTime` - Get schools by time relevance
- `POST /api/hospital` - Add hospital
- `GET /api/hospital/getAllHospitals` - Get all hospitals
- `POST /api/hotel` - Add hotel
- `GET /api/hotel/get` - Get all hotels
- `POST /api/mall` - Add mall
- `GET /api/mall/get` - Get all malls
- `POST /api/banquethall` - Add banquet hall
- `GET /api/banquethall/getAllBanquetHalls` - Get all banquet halls
- `POST /api/garden` - Add garden
- `GET /api/garden/get` - Get all gardens
- `POST /api/parkingbuilding` - Add parking building
- `GET /api/parkingbuilding/getAllParkingBuildings` - Get all parking buildings

### Location Services
- `POST /api/nearby/schools` - Get nearby schools for route
- `POST /api/nearby/hotspots` - Get nearby traffic hotspots
- `GET /api/nearby/spots` - Get all traffic hotspots
- `POST /api/traffic-status` - Add traffic status update
- `GET /api/traffic-status/getTrafficStatus` - Get all traffic statuses

### User Management
- `GET /api/user` - Get user data (authenticated)
- `PUT /api/user/:id/make-admin` - Make user admin (authenticated)

## 🗄️ Database Models

### Primary Collections
- **Users** - User accounts with roles and citizen scores
- **Complaints** - Citizen complaints with location and images
- **Images** - Pothole detection results with geolocation
- **Events** - Traffic-affecting events with time ranges
- **PathInfo** - Historical traffic data for route analysis

### Infrastructure Collections
- **Construction** - Active construction projects
- **Diversion** - Traffic diversions
- **Schools** - Educational institutions with timing data
- **Hospitals** - Healthcare facilities
- **Hotels** - Hospitality venues
- **Malls** - Shopping centers
- **BanquetHalls** - Event venues
- **Gardens** - Public parks and gardens
- **ParkingBuildings** - Parking facilities
- **TrafficStatus** - Real-time traffic updates
- **HotspotLocation** - Known traffic congestion points

## 🔧 Configuration Details

### CORS Configuration
The server is configured to accept requests from:
- `https://form-data-collection.onrender.com`
- `https://road-traffic-frontend.onrender.com`
- `http://localhost:5173` (development)

### File Upload
- Uses Multer for file handling
- Images stored on Cloudinary
- UUID-based file naming for uniqueness

### Authentication
- JWT-based authentication with HTTP-only cookies
- Role-based access control (user/admin)
- Token expiration: 7 days

## 🤖 Machine Learning Service

The Flask service (`pothole-model/app.py`) provides:
- **Model**: MobileNet-based pothole detection
- **Input**: Image files via multipart/form-data
- **Output**: Classification (pothole/no-pothole)
- **Preprocessing**: Automatic image resizing and normalization

### Model Details
- **Architecture**: MobileNet Base
- **Input Size**: 224x224 RGB images
- **Output**: Binary classification (threshold: 0.5)
- **Model File**: `pothole_mobnet_base.h5`

## 🛠️ Development

### File Structure
```
├── App.js                      # Main application entry point
├── constants.js                # Application constants
├── controllers/                # Request handlers
├── models/                     # MongoDB schemas
├── routes/                     # API route definitions
├── middlewares/                # Custom middleware
├── mongoose/                   # Database connection
├── utils/                      # Utility functions
├── pothole-model/              # Flask ML service
│   ├── app.py                  # Flask application
│   └── pothole_mobnet_base.h5  # Trained model
└── uploads/                    # Temporary file storage
```

### Key Features Implementation
- **Traffic Prediction**: Uses historical data, construction info, events, and hotspots
- **Geospatial Queries**: Haversine formula for distance calculations
- **Time-based Analytics**: Handles various time ranges and date filtering
- **Image Processing**: Cloudinary integration for efficient image storage

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file
   - Verify network connectivity for cloud databases

2. **Flask Service Not Responding**
   - Ensure Python dependencies are installed
   - Check if port 3003 is available
   - Verify the model file `pothole_mobnet_base.h5` exists

3. **Image Upload Errors**
   - Verify Cloudinary credentials
   - Check upload directory permissions
   - Ensure file size limits are appropriate

4. **CORS Errors**
   - Verify frontend URL is in allowedOrigins array
   - Check that credentials are properly configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👥 Collaborators

- **Akash Bhandari**
- **Ajinkya Walunj**

## 📄 License

This project is developed for the Government of Pune traffic analysis initiative.

---

For additional support or questions, please contact the development team.