import API from './api';

const ticketService = {
  // Fetch tickets with optional query params (search, status, category, priority, owner)
  getTickets: async (params = {}) => {
    const res = await API.get('/tickets', { params });
    return res.data;
  },

  // Fetch details of a specific ticket
  getTicketById: async (id) => {
    const res = await API.get(`/tickets/${id}`);
    return res.data;
  },

  // Create a new support ticket (handles attachment upload with FormData)
  createTicket: async (formData) => {
    const res = await API.post('/tickets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },

  // Assign ticket ownership to a support staff member
  assignTicket: async (id, ownerId) => {
    const res = await API.patch(`/tickets/${id}/assign`, { ownerId });
    return res.data;
  },

  // Update a ticket's status
  updateTicketStatus: async (id, status) => {
    const res = await API.patch(`/tickets/${id}/status`, { status });
    return res.data;
  },

  // Fetch manager dashboard statistics
  getTicketStats: async () => {
    const res = await API.get('/tickets/stats');
    return res.data;
  },

  // Fetch list of available support/manager users for assignment dropdowns
  getStaffMembers: async () => {
    const res = await API.get('/auth/staff');
    return res.data;
  }
};

export default ticketService;
