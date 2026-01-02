# 🏠 PG Life - Property Management Platform

A modern, full-stack web application for discovering and managing PG (Paying Guest) accommodations across major Indian cities. Built with the MERN stack, PG Life offers an intuitive interface for users to find their perfect home and administrators to manage properties efficiently.

![PG Life](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Node](https://img.shields.io/badge/Node-v14+-green.svg)
![React](https://img.shields.io/badge/React-18.0+-blue.svg)

## ✨ Features

### 🎯 User Features
- **Property Discovery**: Search and filter PG accommodations by city, gender, and rent
- **User Authentication**: Secure JWT-based login and registration system
- **Personalized Dashboard**: Track interested properties and manage bookings
- **Property Details**: View comprehensive information including amenities, ratings, and testimonials
- **Interactive Ratings**: Rate properties on cleanliness, food quality, and safety
- **Interest Tracking**: Save favorite properties for later viewing
- **Booking System**: Complete booking flow with date selection and cost calculation
- **Responsive Design**: Seamless experience across all devices

### 🛠️ Admin Features
- **Property Management**: Add, edit, and delete property listings with image uploads
- **Amenities Configuration**: Manage property amenities by type (Building, Bedroom, Common Area, Washroom)
- **User Management**: View and manage user accounts with role-based access
- **Testimonial Moderation**: Approve, reject, or edit user testimonials
- **Booking Oversight**: Monitor and manage all property bookings
- **Statistics Dashboard**: Track total properties, users, bookings, and testimonials

## 🚀 Tech Stack

### Frontend
- **React.js** - UI library for building interactive interfaces
- **React Router** - Client-side routing
- **React Context API** - State management
- **Bootstrap 5** - Responsive UI framework
- **React Icons** - Icon library
- **Axios** - HTTP client
- **React Toastify** - Notification system

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
pglife/
├── frontend/
│   ├── public/
│   │   └── img/
│   │       ├── logo.png
│   │       ├── bg.png
│   │       ├── amenities/
│   │       └── cities/
│   └── src/
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── Footer.jsx
│       │   ├── LoginModal.jsx
│       │   └── SignupModal.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── PropertyList.jsx
│       │   ├── PropertyDetail.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Booking.jsx
│       │   ├── AdminDashboard.jsx
│       │   └── admin/
│       │       ├── AdminProperties.jsx
│       │       ├── AdminAmenities.jsx
│       │       ├── AdminUsers.jsx
│       │       ├── AdminTestimonials.jsx
│       │       └── AdminBookings.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── AppContext.jsx
│       ├── App.jsx
│       └── index.js
└── backend/
    ├── models/
    │   ├── User.js
    │   ├── Property.js
    │   ├── City.js
    │   ├── Amenity.js
    │   ├── Testimonial.js
    │   └── Booking.js
    ├── routes/
    │   ├── auth.js
    │   ├── properties.js
    │   ├── users.js
    │   ├── admin.js
    │   └── bookings.js
    ├── middleware/
    │   ├── auth.js
    │   └── admin.js
    ├── uploads/
    └── server.js
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/pglife.git
cd pglife
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Create `.env` file in backend directory**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pglife
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. **Start MongoDB** (if using local MongoDB)
```bash
mongod
```

5. **Run the backend server**
```bash
npm start
# or for development with auto-reload
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Install frontend dependencies**
```bash
cd frontend
npm install
```

2. **Create `.env` file in frontend directory (optional)**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

3. **Start the frontend development server**
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 📊 Database Schema

### User Model
```javascript
{
  full_name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  college_name: String,
  gender: String,
  avatar_url: String,
  isAdmin: Boolean,
  interested_properties: [ObjectId]
}
```

### Property Model
```javascript
{
  name: String,
  address: String,
  city: ObjectId (ref: City),
  rent: Number,
  gender: String (male/female/unisex),
  rating_clean: Number,
  rating_food: Number,
  rating_safety: Number,
  images: [String],
  amenities: [ObjectId] (ref: Amenity),
  testimonials: [ObjectId] (ref: Testimonial)
}
```

### Amenity Model
```javascript
{
  name: String,
  type: String (Building/Common Area/Bedroom/Washroom),
  icon: String,
  property: ObjectId (ref: Property)
}
```

### Testimonial Model
```javascript
{
  user: ObjectId (ref: User),
  user_name: String,
  property: ObjectId (ref: Property),
  content: String,
  status: String (pending/approved/rejected)
}
```

### Booking Model
```javascript
{
  user: ObjectId (ref: User),
  property: ObjectId (ref: Property),
  moveInDate: Date,
  duration: Number,
  numberOfPeople: Number,
  totalAmount: Number,
  specialRequests: String,
  status: String (pending/confirmed/cancelled)
}
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/pg_login` - Alternative login endpoint

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get property details
- `GET /api/properties/city/:city` - Get properties by city
- `POST /api/properties/:id/interested` - Mark property as interested
- `DELETE /api/properties/:id/interested` - Remove interest
- `POST /api/properties/:id/rate` - Submit property rating

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/interested` - Get user's interested properties
- `PUT /api/users/:id/avatar` - Update user avatar

### Admin (Protected)
- `GET /api/admin/properties` - Get all properties (admin)
- `POST /api/admin/properties` - Add new property
- `PUT /api/admin/properties/:id` - Update property
- `DELETE /api/admin/properties/:id` - Delete property
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/amenities` - Get all amenities
- `POST /api/admin/properties/:id/amenities` - Add amenity
- `PUT /api/admin/amenities/:id` - Update amenity
- `DELETE /api/admin/amenities/:id` - Delete amenity
- `GET /api/admin/testimonials` - Get all testimonials
- `PUT /api/admin/testimonials/:id` - Update testimonial status
- `DELETE /api/admin/testimonials/:id` - Delete testimonial

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/user/:userId` - Get user's bookings
- `GET /api/admin/bookings` - Get all bookings (admin)

## 🎨 UI/UX Features

- **Modern Design System**: Consistent purple gradient theme (#667eea → #764ba2)
- **Smooth Animations**: CSS transitions and transforms for interactive elements
- **Hover Effects**: Engaging micro-interactions throughout the application
- **Responsive Layout**: Mobile-first design approach
- **Loading States**: Spinners and skeleton screens for better UX
- **Toast Notifications**: Real-time feedback for user actions
- **Form Validation**: Client-side and server-side validation
- **Error Handling**: Graceful error messages and fallbacks

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **Protected Routes**: Middleware for route protection
- **Role-Based Access**: Admin vs User permissions
- **Input Sanitization**: Prevention of XSS and injection attacks
- **CORS Configuration**: Controlled cross-origin requests

## 📱 Responsive Design

- **Desktop**: Full-featured experience with multi-column layouts
- **Tablet**: Optimized layouts for medium screens
- **Mobile**: Touch-friendly interface with stacked layouts

## 🚦 Getting Started

1. **Create Admin Account**: Register a user and manually set `isAdmin: true` in MongoDB
2. **Add Cities**: Use admin panel to add cities (Delhi, Mumbai, Bengaluru, Hyderabad)
3. **Add Properties**: Create property listings with images and details
4. **Add Amenities**: Configure amenities for each property
5. **Add Testimonials**: Create sample testimonials or let users submit

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Property search and filtering
- [ ] Interest marking/unmarking
- [ ] Property rating submission
- [ ] User profile update
- [ ] Admin property CRUD operations
- [ ] Admin amenity management
- [ ] Admin testimonial moderation
- [ ] Booking flow completion

## 🐛 Known Issues & Future Enhancements

### Known Issues
- File upload size limit needs configuration
- Image optimization pending for faster loading

### Planned Features
- [ ] Email notifications for bookings
- [ ] Payment gateway integration
- [ ] Advanced search filters (price range, amenities)
- [ ] Property comparison feature
- [ ] User reviews and ratings system
- [ ] Property owner dashboard
- [ ] Calendar availability management
- [ ] Chat/messaging system
- [ ] Google Maps integration
- [ ] Social media login (Google, Facebook)

## 📄 Environment Variables

### Backend `.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pglife
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Frontend `.env` (optional)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React.js community for excellent documentation
- Bootstrap team for the UI framework
- MongoDB for the database solution
- All open-source contributors

## 📞 Support

For support, email support@pglife.com or create an issue in the GitHub repository.

---

**Made with ❤️ for finding the perfect PG accommodation**