const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Hardware', 'Software', 'Network', 'Access/IAM', 'Other']
  },
  priority: {
    type: String,
    required: [true, 'Please select a priority'],
    enum: ['Low', 'Medium', 'High', 'Urgent']
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'In Review', 'Closed'],
    default: 'New'
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attachmentPath: {
    type: String
  },
  attachmentName: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Auto-increment logic for requestId (e.g., HD-1001, HD-1002...)
ticketSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      // Find the last created ticket to get the maximum requestId number
      const lastTicket = await this.constructor.findOne({}, { requestId: 1 }, { sort: { _id: -1 } });
      let nextNum = 1001;
      
      if (lastTicket && lastTicket.requestId) {
        const match = lastTicket.requestId.match(/HD-(\d+)/);
        if (match && match[1]) {
          nextNum = parseInt(match[1], 10) + 1;
        }
      }
      
      this.requestId = `HD-${nextNum}`;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);
