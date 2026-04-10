const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Validate required environment variables at startup
if (!process.env.JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET is not set in environment variables. Server cannot start.');
}
if (!process.env.MONGODB_URI) {
  throw new Error('FATAL: MONGODB_URI is not set in environment variables. Server cannot start.');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const creatorRoutes = require('./routes/creatorRoutes');
const brandRoutes = require('./routes/brandRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const dealRoutes = require('./routes/dealRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/creators', creatorRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.send('XYZ Marketplace API is running...');
});

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
  });
