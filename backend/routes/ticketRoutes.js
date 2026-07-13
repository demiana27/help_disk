const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  createTicket,
  getTickets,
  getTicketById,
  assignTicket,
  updateTicketStatus,
  getTicketStats
} = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Ensure uploads folder exists in root
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to restrict uploads to specific document/image types
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, Word Documents, TXT, and Images (PNG/JPG) are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB limit
  }
});

// All ticket routes require authentication
router.use(protect);

router.route('/')
  .post(authorize('Employee'), upload.single('attachment'), createTicket)
  .get(getTickets);

router.get('/stats', authorize('Manager'), getTicketStats);

router.route('/:id')
  .get(getTicketById);

router.patch('/:id/assign', authorize('Support', 'Manager'), assignTicket);
router.patch('/:id/status', authorize('Support', 'Manager'), updateTicketStatus);

module.exports = router;
