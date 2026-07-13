const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const User = require('./models/User');
const Ticket = require('./models/Ticket');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB().then(() => {
  // Run seeding logic
  seedDatabase();
});

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan logger in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// Base route for sanity check
app.get('/', (req, res) => {
  res.json({ message: 'HelpDesk Lite API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding database with default users...');

      const employee = await User.create({
        name: 'John Doe (Employee)',
        email: 'employee@helpdesk.com',
        password: 'Password123',
        role: 'Employee'
      });

      const support = await User.create({
        name: 'Jane Smith (Support)',
        email: 'support@helpdesk.com',
        password: 'Password123',
        role: 'Support'
      });

      const manager = await User.create({
        name: 'Bob Johnson (Manager)',
        email: 'manager@helpdesk.com',
        password: 'Password123',
        role: 'Manager'
      });

      console.log('Default users created successfully:');
      console.log(' - Employee: employee@helpdesk.com / Password123');
      console.log(' - Support: support@helpdesk.com / Password123');
      console.log(' - Manager: manager@helpdesk.com / Password123');

      await Ticket.create([
        {
          subject: 'Cannot access internal VPN',
          description: 'Getting a connection timeout error when trying to connect to the corporate VPN from home.',
          category: 'Network',
          priority: 'High',
          status: 'New',
          employee: employee._id
        },
        {
          subject: 'Laptop screen keeps flickering',
          description: 'My secondary monitor works fine, but the built-in laptop screen starts flickering after 1 hour of use.',
          category: 'Hardware',
          priority: 'Medium',
          status: 'In Progress',
          employee: employee._id,
          owner: support._id
        },
        {
          subject: 'Request to install Photoshop license',
          description: 'Need Adobe Photoshop installed for marketing materials preparation. Approvals from manager already obtained.',
          category: 'Software',
          priority: 'Low',
          status: 'In Review',
          employee: employee._id,
          owner: support._id
        },
        {
          subject: 'Printer in Room 302 Jammed',
          description: 'The printer is showing error code 203. Paper is jammed and we cannot pull it out.',
          category: 'Hardware',
          priority: 'Medium',
          status: 'Closed',
          employee: employee._id,
          owner: support._id
        }
      ]);
      console.log('Sample tickets seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
