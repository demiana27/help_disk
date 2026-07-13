const Ticket = require('../models/Ticket');
const User = require('../models/User');

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Private (Employee only)
const createTicket = async (req, res) => {
  try {
    const { subject, description, category, priority } = req.body;

    if (!subject || !description || !category || !priority) {
      return res.status(400).json({ message: 'Please provide all required fields: subject, description, category, priority' });
    }

    const ticketData = {
      subject,
      description,
      category,
      priority,
      employee: req.user.id
    };

    if (req.file) {
      // Normalize path to use forward slashes for consistency across platforms
      ticketData.attachmentPath = req.file.path.replace(/\\/g, '/');
      ticketData.attachmentName = req.file.originalname;
    }

    const ticket = await Ticket.create(ticketData);

    const populatedTicket = await Ticket.findById(ticket._id).populate('employee', 'name email');

    return res.status(201).json(populatedTicket);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tickets with filtering and search
// @route   GET /api/tickets
// @access  Private
const getTickets = async (req, res) => {
  try {
    const query = {};

    // Role-based access: Employees only see their own tickets
    if (req.user.role === 'Employee') {
      query.employee = req.user.id;
    }

    // Apply Filters
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.priority) {
      query.priority = req.query.priority;
    }
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Owner filter (assigned / unassigned / specific user ID)
    if (req.query.owner) {
      if (req.query.owner === 'unassigned') {
        query.owner = { $exists: false };
      } else {
        query.owner = req.query.owner;
      }
    }

    // Search query (matches requestId, subject, or description)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { requestId: searchRegex },
        { subject: searchRegex },
        { description: searchRegex }
      ];
    }

    const tickets = await Ticket.find(query)
      .populate('employee', 'name email role')
      .populate('owner', 'name email role')
      .sort({ createdAt: -1 });

    return res.json(tickets);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get single ticket details
// @route   GET /api/tickets/:id
// @access  Private
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('employee', 'name email role')
      .populate('owner', 'name email role');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Role-based check: Employees can only view their own tickets
    if (req.user.role === 'Employee' && ticket.employee._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this ticket' });
    }

    return res.json(ticket);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Assign ticket to support staff
// @route   PATCH /api/tickets/:id/assign
// @access  Private (Support & Manager only)
const assignTicket = async (req, res) => {
  try {
    const { ownerId } = req.body;
    
    let ownerUser = null;
    if (ownerId) {
      ownerUser = await User.findById(ownerId);
      if (!ownerUser) {
        return res.status(404).json({ message: 'Support user not found' });
      }
      if (ownerUser.role === 'Employee') {
        return res.status(400).json({ message: 'Cannot assign a ticket to an Employee' });
      }
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.owner = ownerId || null;
    
    // Automatically advance a New ticket to In Progress when assigned
    if (ownerId && ticket.status === 'New') {
      ticket.status = 'In Progress';
    }

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('employee', 'name email role')
      .populate('owner', 'name email role');

    return res.json(updatedTicket);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update ticket status
// @route   PATCH /api/tickets/:id/status
// @access  Private (Support & Manager only)
const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Please provide a status' });
    }

    const validStatuses = ['New', 'In Progress', 'In Review', 'Closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid ticket status' });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.status = status;
    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('employee', 'name email role')
      .populate('owner', 'name email role');

    return res.json(updatedTicket);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/tickets/stats
// @access  Private (Manager only)
const getTicketStats = async (req, res) => {
  try {
    // Aggregation for status counts
    const stats = await Ticket.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusCounts = {
      New: 0,
      'In Progress': 0,
      'In Review': 0,
      Closed: 0,
      Total: 0
    };

    stats.forEach(item => {
      if (statusCounts.hasOwnProperty(item._id)) {
        statusCounts[item._id] = item.count;
      }
    });

    statusCounts.Total = await Ticket.countDocuments();
    const unassignedCount = await Ticket.countDocuments({ owner: { $exists: false } });

    // Workload analytics for all support staff
    const staffMembers = await User.find({ role: { $in: ['Support', 'Manager'] } }).select('name email role');

    const workload = [];
    for (const staff of staffMembers) {
      const activeTicketsCount = await Ticket.countDocuments({
        owner: staff._id,
        status: { $ne: 'Closed' }
      });
      const closedTicketsCount = await Ticket.countDocuments({
        owner: staff._id,
        status: 'Closed'
      });
      workload.push({
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        activeTickets: activeTicketsCount,
        closedTickets: closedTicketsCount
      });
    }

    return res.json({
      statusCounts,
      unassignedCount,
      workload
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  assignTicket,
  updateTicketStatus,
  getTicketStats
};
