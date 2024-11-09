const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDb = require('./utils/connectdb');
const authRouter = require('./routes/auth-rout');
const authMiddleware = require('./middlewares/authmiddleware');
const { dashboard } = require('./controllers/dashboard');

// Middleware setup
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/dashboard', authMiddleware, dashboard);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Database connection and server start
const startServer = async () => {
  try {
    await connectDb();
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
